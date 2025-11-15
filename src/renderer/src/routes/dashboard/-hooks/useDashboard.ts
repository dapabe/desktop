import { createContext, useContext } from 'react'

export type IDashboardState = {
  discoveryState: { counter: number; done: boolean }
}

export const DashboardContext = createContext<IDashboardState>(null!)

export function useDashboard(): IDashboardState {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('cannot use useDashboard outside DashboardProvider')
  return ctx
}
