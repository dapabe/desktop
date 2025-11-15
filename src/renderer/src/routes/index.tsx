import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@denzere/assist-api'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Spinner } from '@renderer/ui/Spinner'
import { useTranslation } from 'react-i18next'
import { twJoin } from 'tailwind-merge'
import { API } from '@renderer/services/trpc'
import { LanguageSwitcher } from './-components/dashboard/settings/LanguageSwitcher'

export const Route = createFileRoute('/')({
  // beforeLoad: (opts) => {
  //   if (opts.context.localAuth.isAuthenticated) {
  //     throw redirect({ to: '/dashboard' })
  //   }
  // },
  component: Component
})

function Component(): ReactNode {
  const { t } = useTranslation()
  const nav = Route.useNavigate()
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: '' },
    resolver: zodResolver(RegisterLocalSchema)
  })
  const isAuthenticated = API.PUBLIC.isAuthenticated.useQuery()

  const register = API.PUBLIC.register.useMutation({
    onSuccess: async () => await nav({ to: '/dashboard' }),
    onError: (reason) => console.log(reason)
  })

  if (isAuthenticated.isLoading) return null
  if (isAuthenticated.data) return <Navigate to="/dashboard" />

  return (
    <div className="min-h-svh flex flex-col">
      <div className="self-end p-2">
        <LanguageSwitcher />
      </div>
      <form
        onSubmit={form.handleSubmit((data) => register.mutateAsync(data))}
        className="flex flex-col justify-center items-center grow"
      >
        <fieldset className="fieldset bg-base-200 p-4 rounded-box">
          <div>
            <label htmlFor="name" className="label text-lg">
              {t('FormLocalRegister.Label')}
            </label>
          </div>
          <input
            id="name"
            {...form.register('name')}
            disabled={form.formState.isLoading}
            className={twJoin(
              'input input-lg',
              form.formState.errors?.name ? 'input-error' : 'input-neutral'
            )}
            placeholder={t('FormLocalRegister.Placeholder')}
          />
          <label role="definition" htmlFor="name" className="label text-sm">
            {t('FormLocalRegister.Hint')}
          </label>
          <button
            type="submit"
            className="btn btn-lg btn-neutral"
            disabled={form.formState.isLoading}
          >
            {form.formState.isLoading ? <Spinner /> : undefined}
            {!form.formState.isLoading && t('CommonWords.Continue')}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
