import { API } from '@renderer/services/trpc'
import { useRouter } from '@tanstack/react-router'

import { ReactNode } from 'react'

export function DevSettings(): ReactNode {
  const router = useRouter()
  const deleteAccount = API.UTILS.localLogout.useMutation()

  const handleDelete = async (): Promise<void> => {
    await deleteAccount.mutateAsync()
    // window.location.reload()
    router.invalidate()
  }

  return (
    <fieldset className="fieldset p-4 rounded-box border border-error mt-auto">
      <legend className="fieldset-legend">DEV Actions</legend>
      <button className="btn btn-error" onClick={handleDelete}>
        Delete Local Account
      </button>
    </fieldset>
  )
}
