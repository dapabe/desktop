import React, { PropsWithChildren, ReactNode, Suspense } from 'react'
import { initI18nReact } from '@denzere/assist-api'
import { I18nextProvider } from 'react-i18next'
import { API } from '@renderer/services/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ipcLink } from 'electron-trpc/renderer'

// https://tanstack.com/router/v1/docs/framework/react/devtools
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools
      }))
    )
const i18n = initI18nReact()

const qc = new QueryClient()
const trpcClient = API.createClient({
  links: [ipcLink()]
})

export function BaseProviders({ children }: PropsWithChildren): ReactNode {
  return (
    /**@ts-ignore This error is nonsense */
    <I18nextProvider i18n={i18n}>
      <API.Provider client={trpcClient} queryClient={qc}>
        <QueryClientProvider client={qc}>
          {children}
          <Suspense>
            <TanStackRouterDevtools position="bottom-left" />
          </Suspense>
        </QueryClientProvider>
      </API.Provider>
    </I18nextProvider>
  )
}
