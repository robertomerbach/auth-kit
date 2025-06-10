import { NextResponse } from "next/server"
import crypto from "crypto"
import prisma from "@/lib/db"
import { emailSchema } from "@/lib/validations"
import { resend } from "@/lib/email"
import { EmailTemplate } from "@/components/email/email-template"
import { ResetPasswordEmail } from "@/components/email/email-reset-password"

const MAX_ATTEMPTS = 3 // Maximum attempts per hour
const WINDOW_HOURS = 1 // Time window in hours

export async function POST(req: Request) {
  try {
    // Check for RESEND_API_KEY at runtime
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service configuration error. Please contact support." },
        { status: 500 }
      )
    }

    const body = await req.json()
    const parseResult = emailSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email } = parseResult.data

    // Check rate limiting
    const oneHourAgo = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000)
    const recentAttempts = await prisma.passwordResetAttempt.count({
      where: {
        email,
        createdAt: {
          gte: oneHourAgo
        }
      }
    })

    if (recentAttempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: `Too many password reset attempts. Please try again after ${WINDOW_HOURS} hour.` },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      }
    })

    // Always return the same response to avoid email enumeration
    const genericResponse = NextResponse.json(
      {
        message: `Email sent with instructions to reset your password for ${email}.`,
      },
      { status: 200 }
    )

    if (!user) {
      return genericResponse
    }

    // Record this attempt
    await prisma.passwordResetAttempt.create({
      data: {
        email
      }
    })

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('base64url')
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires: tokenExpiry,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM || "Auth Kit <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your Password",
        react: await EmailTemplate({
          title: "Reset Your Password",
          code: await ResetPasswordEmail({ resetLink }),
        })
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { error: "Failed to send password reset email. Please try again later." },
        { status: 500 }
      )
    }

    return genericResponse
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}