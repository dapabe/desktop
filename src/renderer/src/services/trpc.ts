import { createTRPCReact } from '@trpc/react-query'

//@ts-ignore Doesnt matter
import type { IMainWindowRouter } from '@backend-types'

export const API = createTRPCReact<IMainWindowRouter>()
