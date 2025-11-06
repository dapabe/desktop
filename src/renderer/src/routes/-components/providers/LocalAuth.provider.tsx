import { API } from '@renderer/services/trpc'
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo
} from 'react'

export type ILocalAuthContext = {
  isAuthenticated: boolean
}

const LocalAuthContext = createContext<ILocalAuthContext | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useLocalAuth(): ILocalAuthContext {
  const ctx = useContext(LocalAuthContext)
  if (!ctx) throw new Error('cannot use outside LocalAuthContext')
  return ctx
}

export function LocalAuthProvider(props: PropsWithChildren): ReactNode {
  const ApiAuthenticated = API.PUBLIC.isAuthenticated.useQuery()

  const values = useMemo<ILocalAuthContext>(
    () => ({
      isAuthenticated: !!ApiAuthenticated.data
    }),
    [ApiAuthenticated]
  )

  if (ApiAuthenticated.isError || ApiAuthenticated.isLoading) {
    console.log(ApiAuthenticated.error)
    return <span>errorlocal auth</span>
  }
  console.log(ApiAuthenticated.data)

  return (
    <LocalAuthContext.Provider value={values}>
      {props.children}
    </LocalAuthContext.Provider>
  )
}
