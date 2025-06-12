import { AccountLayout } from "@/components/account/account-layout"
import { getCurrentUser } from "@/lib/server/user"

export const metadata = {
  title: "Account",
  description: "Account page",
}

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return <AccountLayout user={user} />
}