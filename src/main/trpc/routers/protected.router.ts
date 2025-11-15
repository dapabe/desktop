import {
  ILocalDataDTO,
  IRoomListener,
  IWSRoom,
  IWSRoomListener,
  RegisterLocalSchema,
  UdpSocketClient,
  z18n
} from '@denzere/assist-api'
import { ErrorNotificationService } from '../../services/ErrorNotif.service'
import { getInternalIPv4 } from '../../utils/getInternalIPv4'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import {
  createTRPCRouter,
  NodeProcedure,
  NodeProcedureAuthenticated
} from '../trpc'
import { AppEventBus } from '../../services/EventBus'
import { NodeSocketAdapter } from '../../udp-node.adapter'
import { EventEmitter } from 'node:stream'
import { app } from 'electron/main'
import { getDeviceName } from '../../utils/getDeviceName'

let discoveryEE: EventEmitter
// HMR in dev mode
// eslint-disable-next-line prefer-const
discoveryEE ??= AppEventBus.register('DiscoveryEE')

let UDPClient: UdpSocketClient

app.on('will-quit', () => {
  UDPClient?.close()
})

export const ProtectedRouter = createTRPCRouter({
  // App actions
  getLocalData: NodeProcedure.query<ILocalDataDTO['Create']>(
    async ({ ctx }) => {
      const currentName = await ctx.AppState.getState().getCurrentName()
      const currentAppId = await ctx.AppState.getState().getAppId()
      return {
        currentAppId,
        currentName
      }
    }
  ),
  updateLocalName: NodeProcedure.input(RegisterLocalSchema).mutation(
    async ({ input, ctx }) => {
      try {
        await ctx.AppState.getState().getRepos().LocalData.patch({
          currentName: input.name
        })
        // ctx.AppState.getState().updateMemoryState('', input.name)
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.patchLocalName',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }
  ),

  // Room actions
  initialize: NodeProcedure.query<null>(async ({ ctx }) => {
    if (UDPClient) {
      ctx.AppState.getState().updateMemoryState(
        '__currentDevice',
        getDeviceName()
      )

      const netInfo = getInternalIPv4()
      if (!netInfo) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

      UDPClient = new UdpSocketClient({
        adapter: new NodeSocketAdapter(),
        store: ctx.AppState.getState(),
        address: netInfo.address
      })
      UDPClient.init()
    }

    return null
  }),
  startDiscovery: NodeProcedureAuthenticated.mutation(() => {
    discoveryEE.emit('start')
  }),
  sendDiscovery: NodeProcedureAuthenticated.subscription(({ ctx }) => {
    return observable<{ counter: number; done: boolean }>((emit) => {
      let stopped = false
      const onStart = async (): Promise<void> => {
        // In case is somehow triggered more than once, unsubscribe from the event to
        discoveryEE.off('start', onStart)
        try {
          console.log(stopped)
          for await (const res of ctx.AppState.getState().sendDiscovery()) {
            if (stopped) break
            emit.next(res)
          }
          // Don't call .complete() since the client might call it again
          if (!stopped) emit.next({ counter: 0, done: true })
        } catch (error) {
          emit.error(error)
        } finally {
          // On loop end, re-subscribe for the next cycle
          discoveryEE.on('start', onStart)
        }
      }
      // First subscription
      discoveryEE.on('start', onStart)
      return () => {
        stopped = true
        discoveryEE.off('start', onStart)
      }
    })
  }),
  getRoomsToDiscover: NodeProcedureAuthenticated.query<IWSRoom[]>(({ ctx }) =>
    ctx.AppState.getState().getRoomsToDiscover()
  ),
  /** Wil yield data when "onRemoteRespondToAdvertise" triggers */
  onRoomsToDiscover: NodeProcedureAuthenticated.subscription(({ ctx }) => {
    return observable<IWSRoom & { _evt: 'add' | 'del' | 'init' }>((emit) => {
      let prevRooms = ctx.AppState.getState().getRoomsToDiscover()

      if (prevRooms.length > 0) {
        emit.next({ ...prevRooms[prevRooms.length - 1], _evt: 'init' })
      }
      const unsub = ctx.AppState.subscribe(
        (store) => store.__roomsToDiscover,
        (currState, prevState) => {
          if (currState.length > prevState.length) {
            const addedRoom = currState.find(
              (room) => !prevState.some((r) => r.appId === room.appId)
            )
            if (addedRoom) emit.next({ ...addedRoom, _evt: 'add' })
          }

          if (currState.length < prevState.length) {
            const removedRoom = prevState.find(
              (room) => !currState.some((r) => r.appId === room.appId)
            )
            if (removedRoom) emit.next({ ...removedRoom, _evt: 'del' })
          }
          prevRooms = currState
        },
        {
          fireImmediately: true,
          equalityFn: (a, b) => a.length > b.length
        }
      )
      return unsub
    })
  }),
  getRoomsListeningTo: NodeProcedureAuthenticated.query<IWSRoomListener[]>(
    ({ ctx }) => ctx.AppState.getState().getRoomsListeningTo()
  ),
  getCurrentListeners: NodeProcedureAuthenticated.query<IRoomListener[]>(
    ({ ctx }) => ctx.AppState.getState().getCurrentListeners()
  ),
  getStoredListeners: NodeProcedureAuthenticated.query(({ ctx }) => {
    return ctx.AppState.getState().getStoredListeners()
  }),
  addToListeningTo: NodeProcedureAuthenticated.input(
    z18n.object({ appId: z18n.cuid2() })
  ).mutation(async ({ ctx, input }) => {
    try {
      await ctx.AppState.getState().addToListeningTo(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.addToListeningTo',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  deleteListeningTo: NodeProcedureAuthenticated.input(
    z18n.object({ appId: z18n.cuid2() })
  ).mutation(async ({ ctx, input }) => {
    try {
      await ctx.AppState.getState().deleteListeningTo(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.deleteListeningTo',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  requestHelp: NodeProcedureAuthenticated.mutation(async ({ ctx }) => {
    try {
      await ctx.AppState.getState().requestHelp()
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.requestHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  }),
  respondToHelp: NodeProcedureAuthenticated.input(
    z18n.object({ appId: z18n.cuid2() })
  ).mutation(async ({ ctx, input }) => {
    try {
      await ctx.AppState.getState().respondToHelp(input.appId)
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'socket.respondToHelp',
        ErrorNotificationService.getErrorMessage(error)
      )
    }
  })
})
