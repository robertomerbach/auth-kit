import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update user's sessions token to invalidate all sessions
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        sessions: {
          deleteMany: {} // Delete all sessions
        }
      }
    })

    return NextResponse.json({ message: "All sessions invalidated successfully" })
  } catch (error) {
    console.error("Invalidate sessions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 