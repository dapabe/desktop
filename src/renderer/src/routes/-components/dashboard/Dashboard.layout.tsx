import { useTranslation } from 'react-i18next'
import { Link, linkOptions } from '@tanstack/react-router'
import { PropsWithChildren, ReactNode } from 'react'
import { CrossIcon, ListIcon, SettingsIcon } from 'lucide-react'
import { DashboardProvider } from '@renderer/routes/dashboard/-components/DashboardProvider'

export function DashboardLayout(props: PropsWithChildren): ReactNode {
  const { t } = useTranslation()

  const options = linkOptions([
    {
      to: '/dashboard',
      activeOptions: { exact: true },
      label: t('Dashboard.PageEmitter.Title'),
      children: <CrossIcon className="size-6" />
    },
    {
      to: '/dashboard/receiver',
      label: t('Dashboard.PageReceiver.Title'),
      children: <ListIcon className="size-6" />
    },
    {
      to: '/dashboard/settings',
      label: t('Dashboard.PageSettings.Title'),
      children: <SettingsIcon className="size-6" />
    }
  ])

  return (
    <DashboardProvider>
      <div className="flex flex-col min-h-svh">
        <div role="tablist" className="tabs tabs-box mx-2 mt-2 gap-x-2">
          {options.map((x) => (
            <Link {...x} key={x.to} role="tab" className="tab grow gap-x-2">
              {x.children}
              {x.label}
            </Link>
          ))}
        </div>
        {props.children}
      </div>
    </DashboardProvider>
  )
}
