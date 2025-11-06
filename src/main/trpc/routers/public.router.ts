import { RegisterLocalSchema } from '@denzere/assist-api'
import { ErrorNotificationService } from '../../services/ErrorNotif.service'
import { createTRPCRouter, NodeProcedure } from '../trpc'

export const PublicRouter = createTRPCRouter({
  isAuthenticated: NodeProcedure.query<boolean>(async ({ ctx }) => {
    try {
      const res = await ctx.AppState.getState()
        .getRepos()
        .LocalData.entryExists()
      console.log(res)
      return res
    } catch (error) {
      ErrorNotificationService.getInstance().showError(
        'db.localdata.entryExists',
        ErrorNotificationService.getErrorMessage(error)
      )
      return false
    }
  }),
  register: NodeProcedure.input(RegisterLocalSchema).mutation(
    async ({ ctx, input }) => {
      try {
        await ctx.AppState.getState()
          .getRepos()
          .LocalData.create({ name: input.name })
      } catch (error) {
        ErrorNotificationService.getInstance().showError(
          'db.localdata.create',
          ErrorNotificationService.getErrorMessage(error)
        )
      }
    }
  )
})
