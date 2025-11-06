import { PropsWithChildren, ReactNode, useState } from 'react'
import { ipcLink } from 'electron-trpc/renderer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { API } from '../../../services/trpc'

export function TRPCProvider({ children }: PropsWithChildren): ReactNode {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    API.createClient({
      links: [ipcLink()]
    })
  )
  return (
    <API.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </API.Provider>
  )
}
