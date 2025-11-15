import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Spinner } from '@renderer/ui/Spinner'
import { API } from '@renderer/services/trpc'
import { DashboardLayout } from '../-components/dashboard/Dashboard.layout'

export const Route = createFileRoute('/dashboard')({
  //   beforeLoad: (opts) => {
  //     if (!opts.context.localAuth.isAuthenticated) throw redirect({ to: '/' })
  //   },
  component: Componenet
})

function Componenet(): ReactNode {
  const ApiInit = API.PROTECTED.initialize.useQuery()

  if (ApiInit.isLoading) {
    return (
      // <DashboardLayout>
      <Spinner />
      // /* </DashboardLayout> */
    )
  }

  if (ApiInit.isError)
    return <p>Error {JSON.stringify(ApiInit.error, null, 2)}</p>

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
