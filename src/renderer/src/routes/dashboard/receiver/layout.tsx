import {
  createFileRoute,
  Link,
  linkOptions,
  Outlet
} from '@tanstack/react-router'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { API } from '@renderer/services/trpc'

export const Route = createFileRoute('/dashboard/receiver')({
  component: Component
})

function Component(): ReactNode {
  const { t } = useTranslation()

  const room = API.PROTECTED.getRoomsListeningTo.useQuery()

  if (room.isLoading) return null

  if (room.error) return <span>error</span>

  const options = linkOptions([
    {
      to: '/dashboard/receiver',
      label: t('Dashboard.PageReceiver.SelectedDevicesTab.Title'),
      activeOptions: { exact: true }
    },
    {
      to: '/dashboard/receiver/searchDevices',
      label: t('Dashboard.PageReceiver.SearchDevicesTab.Title')
    }
  ])
  // if (room.data.length) setTab('tab1')

  // useEffect(() => {
  //   if (room.roomsListeningTo.length) setTab('tab1')
  // }, [room.roomsListeningTo.length])

  return (
    <section className="grow [*]:px-4 flex flex-col">
      <div role="tablist" className="tabs tabs-border w-full">
        {options.map((x) => (
          <Link {...x} key={x.to} role="tab" className="tab grow">
            {x.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </section>
  )
}
