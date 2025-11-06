import { createIPCHandler } from 'electron-trpc/main'
import { ProtectedRouter } from './routers/protected.router'
import { UtilsTrpcRouter } from './routers/utils.router'
import { createTRPCRouter } from './trpc'
import { PublicRouter } from './routers/public.router'
import { initializeDatabase } from '../initializeDatabase'
import { NodeMemoryState } from '../app-state'

export const RootRouter = createTRPCRouter({
  PUBLIC: PublicRouter,
  PROTECTED: ProtectedRouter,
  UTILS: UtilsTrpcRouter
})
export type IMainWindowRouter = typeof RootRouter

/**
 *  Electron tRPC backend must independent from the main window as it also runs from the System Tray as a bakground process
 */
export const IPCHandler = createIPCHandler({
  router: RootRouter,
  createContext: async () => {
    const db = await initializeDatabase()
    await NodeMemoryState.getState().__syncDatabase(db.Repo)
    return {
      AppState: NodeMemoryState
    }
  }
})
