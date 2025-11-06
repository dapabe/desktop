import { createFileRoute } from '@tanstack/react-router'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { API } from '@renderer/services/trpc'
import { ReceiverSelectedDevices } from '@renderer/routes/-components/dashboard/receiver/Receiver.SelectedDevices'
import { ReceiverSearchDevices } from '@renderer/routes/-components/dashboard/receiver/Receiver.SearchDevices'

export const Route = createFileRoute('/dashboard/receiver/')({
  component: Component
})

function Component(): ReactNode {
  const { t } = useTranslation()

  const room = API.PROTECTED.getRoomsListeningTo.useQuery()
  const [cTab, setTab] = useState('tab2')

  if (room.isLoading) return <span>loading</span>

  if (room.error) return <span>error</span>

  if (room.data.length) setTab('tab1')

  // useEffect(() => {
  //   if (room.roomsListeningTo.length) setTab('tab1')
  // }, [room.roomsListeningTo.length])

  return (
    <section className="grow [*]:px-4 flex flex-col">
      <div role="tablist" className="tabs tabs-border w-full">
        <input
          type="radio"
          name="tab1"
          className="tab grow"
          aria-label={t('Dashboard.PageReceiver.SelectedDevicesTab.Title')}
          checked={cTab === 'tab1'}
          onChange={() => setTab('tab1')}
        />
        <input
          type="radio"
          name="tab2"
          className="tab grow"
          aria-label={t('Dashboard.PageReceiver.SearchDevicesTab.Title')}
          checked={cTab === 'tab2'}
          onChange={() => setTab('tab2')}
        />
      </div>
      {cTab === 'tab1' && <ReceiverSelectedDevices />}
      {cTab === 'tab2' && <ReceiverSearchDevices />}
    </section>
  )
}
