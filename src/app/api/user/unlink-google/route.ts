import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has a password set (to prevent locking themselves out)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: "Cannot unlink Google account without setting a password first" },
        { status: 400 }
      )
    }

    // Delete the Google account connection
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: "google"
      }
    })

    return NextResponse.json({ message: "Google account unlinked successfully" })
  } catch (error) {
    console.error("Unlink Google error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 