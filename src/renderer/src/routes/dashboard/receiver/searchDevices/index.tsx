import { IWSRoom } from '@denzere/assist-api'
import { API } from '@renderer/services/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { UserPlusIcon } from 'lucide-react'
import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboard } from '../../-hooks/useDashboard'

export const Route = createFileRoute('/dashboard/receiver/searchDevices/')({
  component: Component
})

function Component(): ReactNode {
  const { t } = useTranslation()
  const [list, setList] = useState<IWSRoom[]>([])
  const addToListeningTo = API.PROTECTED.addToListeningTo.useMutation()
  const roomsToDiscover = API.PROTECTED.getRoomsToDiscover.useQuery()

  API.PROTECTED.onRoomsToDiscover.useSubscription(undefined, {
    onData({ _evt, ...wsroom }) {
      if (_evt === 'init' || _evt === 'add') setList((x) => [...x, wsroom])
      else setList((x) => x.filter((z) => z.appId !== wsroom.appId))
    },
    onError(err) {
      console.log(err)
    }
  })
  if (roomsToDiscover.isLoading) {
    return (
      <div className="grow flex flex-col">
        <div className="w-full flex">
          <DiscoveryButton disabled />
        </div>
        <ul className="list overflow-y-scroll h-[calc(100vh-10rem)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="list-row flex flex-col gap-y-1.5">
              <div className="skeleton w-2/5 h-4"></div>
              <div className="skeleton w-full h-4"></div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (roomsToDiscover.isError) return null

  if (!list.length) {
    return (
      <div className="grow flex flex-col">
        <div className="w-full flex">
          <DiscoveryButton />
        </div>
        <div className="grow flex items-center justify-center">
          <span className="label text-2xl">
            {t('Dashboard.PageReceiver.SearchDevicesTab.EmptyPlaceholder')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grow flex flex-col">
      <div className="w-full flex">
        <DiscoveryButton />
      </div>
      <ul className="list overflow-y-scroll h-[calc(100vh-10rem)]">
        {list.map((x) => (
          <li key={x.appId} className="list-row">
            <button
              // icon={UserPlus}
              className="btn btn-ghost col-span-2"
              onClick={() => addToListeningTo.mutate({ appId: x.appId })}
            >
              <UserPlusIcon className="text-neutral size-6 mr-2" />
              <div className="flex flex-col items-start">
                <span>{x.callerName}</span>
                <span>{x.device}</span>
              </div>
              <span className="ml-auto"></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DiscoveryButton({ disabled }: { disabled?: boolean }): ReactNode {
  const { t } = useTranslation()
  const { discoveryState } = useDashboard()

  const startDiscovery = API.PROTECTED.startDiscovery.useMutation()

  const onCooldown = useMemo(
    () => discoveryState.counter !== 0 && !discoveryState.done,
    [discoveryState]
  )

  return (
    <button
      disabled={disabled || onCooldown}
      className="btn btn-accent btn-outline grow mt-2"
      onClick={() => startDiscovery.mutateAsync()}
    >
      {onCooldown
        ? `${discoveryState.counter}s`
        : t('Dashboard.PageReceiver.SearchDevicesTab.DetectButton')}
    </button>
  )
}
