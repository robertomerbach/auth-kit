import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { passwordSchema } from "@/lib/validations"
import { ZodError } from "zod"
import { hash } from "bcryptjs"
import { getClientIP } from "@/lib/ip"
import { logActivity } from "@/lib/activity"
import { ActivityTypes } from "@/lib/constants"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = passwordSchema.parse(body)
    const ipAddress = await getClientIP()

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 12)

    // Update the user's password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword
      }
    })

    await logActivity(session.user.id, ActivityTypes.CREATE_PASSWORD, ipAddress);

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 