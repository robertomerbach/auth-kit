import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to last 20 activities
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("[ACTIVITIES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 