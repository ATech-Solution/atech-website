import { getLoggedInUser } from '@/lib/payload'
import AdminBarClient from './AdminBarClient'

export default async function AdminBar() {
  const user = await getLoggedInUser()

  if (!user || !user.showAdminMenu) return null

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email

  return (
    <AdminBarClient
      userId={user.id}
      email={user.email}
      displayName={displayName}
    />
  )
}
