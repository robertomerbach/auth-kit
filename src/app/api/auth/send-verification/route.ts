import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emailSchema } from "@/lib/validations";
import { resend } from "@/lib/resend";
import { EmailTemplate } from "@/components/email/email-template";
import { VerifyAccountEmail } from "@/components/email/email-verify-account";

// Function to generate a random 6-digit code
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    // Check for RESEND_API_KEY at runtime
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service configuration error." },
        { status: 500 }
      )
    }

    const body = await req.json();
    const validationResult = emailSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email provided.", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "This email is already registered and verified. Please login." },
        { status: 409 } // Conflict
      );
    }

    const code = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

    // Upsert the verification code
    await prisma.emailVerification.upsert({
      where: { email },
      update: {
        code,
        expiresAt,
        verified: false, // Reset verification status on new code
      },
      create: {
        email,
        code,
        expiresAt,
      },
    });

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM || "Auth Kit <onboarding@resend.dev>",
        to: [email],
        subject: `${code} - Confirmation code`,
        react: await EmailTemplate({
          title: "Verify Your Email",
          code: await VerifyAccountEmail({ code }),
        })
      });
    } catch (emailError) {
      return NextResponse.json(
        { message: emailError || "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent successfully." },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { message: error.message || "An error occurred while processing the email." },
        { status: 409 } 
      );
    }
    return NextResponse.json(
      { error: "Internal server error while sending verification code." },
      { status: 500 }
    );
  }
} 