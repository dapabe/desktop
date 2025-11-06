import './main.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'

//  Needed for Electron since all the router is shipped with the app, doesnt really need lazy load
const history = createMemoryHistory()
const router = createRouter({
  history,
  routeTree
  // context: {
  //   localAuth: undefined!
  // }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootEL = document.getElementById('root') as HTMLElement
if (!rootEL) {
  throw new Error('Root element not found')
}
ReactDOM.createRoot(rootEL).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
