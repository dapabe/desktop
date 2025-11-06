import { zodResolver } from '@hookform/resolvers/zod'
import { IRegisterLocalSchema, RegisterLocalSchema } from '@denzere/assist-api'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@renderer/ui/Spinner'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { API } from '@renderer/services/trpc'

// const Form = createForm<IRegisterLocalSchema>()
export function UpdateNameForm(): ReactNode {
  const { t } = useTranslation()
  const LocalData = API.PROTECTED.getLocalData.useQuery()
  const UpdateName = API.PROTECTED.updateLocalName.useMutation()

  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: LocalData.data?.currentName ?? '' },
    resolver: zodResolver(RegisterLocalSchema)
  })

  if (LocalData.isLoading) return <Spinner />

  if (LocalData.error) return null

  return (
    <form onSubmit={form.handleSubmit((data) => UpdateName.mutateAsync(data))}>
      <div className="join flex">
        <label className="input join-item grow">
          <span className="label">
            {t('Dashboard.PageSettings.FormLocalName.Label')}
          </span>
          <input
            id="name"
            {...form.register('name')}
            disabled={UpdateName.isLoading}
            // placeholder={loadErrors?.name ? 'name error on load test' : ''}
          />
        </label>
        <button
          type="submit"
          disabled={UpdateName.isLoading}
          className="btn btn-secondary join-item"
        >
          {UpdateName.isLoading ? <Spinner /> : null}
          {!UpdateName.isLoading && t('CommonWords.Update')}
        </button>
      </div>
      <label htmlFor="name" className="label text-xs text-center">
        {t('Dashboard.PageSettings.FormLocalName.Hint')}
      </label>
    </form>
  )
}
