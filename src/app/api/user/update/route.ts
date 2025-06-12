import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { updateAccountSchema } from "@/lib/validations"
import { getClientIP } from "@/lib/ip"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ZodError } from "zod"
import { logActivity } from "@/lib/activity"
import { ActivityTypes } from "@/lib/constants"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateAccountSchema.parse(body)

    const ipAddress = await getClientIP()

    // Check if email is being updated and if it's already in use
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: {
            id: session.user.id
          }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      }
    })

    await logActivity(session.user.id, ActivityTypes.UPDATE_PROFILE, ipAddress);

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 