import {
  createRootRoute,
  ErrorComponentProps,
  Outlet
} from '@tanstack/react-router'
import { ReactNode } from 'react'
import { BaseProviders } from './-components/providers/BaseProviders'

export const Route = createRootRoute({
  errorComponent: ErrorComponent,
  component: Component
})

function Component(): ReactNode {
  return (
    <BaseProviders>
      <Outlet />
    </BaseProviders>
  )
}

function ErrorComponent(props: ErrorComponentProps): ReactNode {
  return (
    <div>
      Ha ocurrido un error
      {JSON.stringify(props.error.message)}
      Route {window.location.pathname}
    </div>
  )
}
