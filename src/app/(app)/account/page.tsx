import { AccountLayout } from "@/components/account/account-layout"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"

export const metadata = {
  title: "Account",
  description: "Account page",
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user data including accounts
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      language: true,
      createdAt: true,
      password: true,
      accounts: {
        select: {
          provider: true
        }
      }
    }
  })

  if (!userData) {
    redirect("/login")
  }

  // Ensure the user object matches the expected type
  const user = {
    id: userData.id,
    name: userData.name || "",
    email: userData.email || "",
    image: userData.image || "",
    language: userData.language || "en",
    createdAt: userData.createdAt,
    accounts: userData.accounts,
    hasPassword: !!userData.password
  }

  return <AccountLayout user={user} />
}