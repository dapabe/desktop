import { DevSettings } from '@renderer/routes/-components/dashboard/settings/DevSettings'
import { LanguageSwitcher } from '@renderer/routes/-components/dashboard/settings/LanguageSwitcher'
import { UpdateNameForm } from '@renderer/routes/-components/dashboard/settings/UpdateName.form'
import { API } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  // const ApiLocalData = API.PROTECTED.getLocalData.useQuery()
  return (
    <section className="grow pt-4 [*]:px-4 flex flex-col overflow-y-auto gap-y-4">
      <LanguageSwitcher />
      <UpdateNameForm
      // values={{
      //   name: ApiLocalData.data?.currentName ?? ''
      // }}
      // isLoading={ApiLocalData.isLoading}
      // loadErrors={{ name: ApiLocalData.error?.message }}
      />
      {import.meta.env.DEV && <DevSettings />}
    </section>
  )
}
