import { API } from '@renderer/services/trpc'
import { PropsWithChildren, ReactNode, useMemo, useState } from 'react'
import { DashboardContext, IDashboardState } from '../-hooks/useDashboard'

export function DashboardProvider({ children }: PropsWithChildren): ReactNode {
  const [discovery, setDiscovery] = useState({ counter: 0, done: true })

  API.PROTECTED.sendDiscovery.useSubscription(undefined, {
    onData: (x) => setDiscovery(x)
  })

  const values = useMemo<IDashboardState>(
    () => ({
      discoveryState: discovery
    }),
    [discovery]
  )

  return (
    <DashboardContext.Provider value={values}>
      {children}
    </DashboardContext.Provider>
  )
}
