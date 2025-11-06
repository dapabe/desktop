import { initTRPC, TRPCError } from '@trpc/server'

import { NodeMemoryState } from '../app-state'

type AppCtx = {
  AppState: typeof NodeMemoryState
}

const tInstance = initTRPC.context<AppCtx>().create({
  isServer: true
})

export const createTRPCRouter = tInstance.router

export const NodeProcedure = tInstance.procedure

export const NodeProcedureAuthenticated = tInstance.procedure.use(
  async (opts) => {
    const hasData = await opts.ctx.AppState.getState()
      .getRepos()
      .LocalData.entryExists()
    if (!hasData) throw new TRPCError({ code: 'PRECONDITION_FAILED' })

    return await opts.next({ ctx: opts.ctx })
  }
)
