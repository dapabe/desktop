import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { API } from '@renderer/services/trpc'

export const Route = createFileRoute('/dashboard/')({
  component: Component
})

function Component(): ReactNode {
  const { t } = useTranslation()

  const currentListeners = API.PROTECTED.getCurrentListeners.useQuery()
  const requestHelp = API.PROTECTED.requestHelp.useMutation()
  if (currentListeners.isLoading || currentListeners.isError) return null

  return (
    <section className="grow flex flex-col">
      <div className="grow flex items-center justify-center p-4">
        <button
          className="btn btn-primary btn-circle size-80 text-4xl"
          disabled={!currentListeners.data.length}
          onClick={() => requestHelp.mutate()}
        >
          {t('Dashboard.PageEmitter.MainButton')}
        </button>
      </div>
      <div className="divider m-0"></div>
      <div className="stats">
        <div className="stat">
          <div className="stat-title">
            {t('Dashboard.PageEmitter.ListenersLabel')}
          </div>
          <div className="stat-value font-mono">
            {currentListeners.data.length}
          </div>
        </div>
        <div className="stat">
          <label className="label text-sm hover:cursor-not-allowed">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="checkbox checkbox-sm rounded-sm"
            />
            {t('Dashboard.PageEmitter.EnableDetectionCheckbox')}
          </label>
        </div>
      </div>
    </section>
  )
}
