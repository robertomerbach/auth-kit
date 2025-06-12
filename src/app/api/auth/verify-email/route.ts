import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email format."),
  code: z.string().length(6, "Verification code must be 6 digits."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = verifyCodeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data.", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email, code } = validationResult.data;

    const verificationEntry = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verificationEntry) {
      return NextResponse.json(
        { error: "No verification attempt found for this email or it has expired. Please try again." },
        { status: 404 }
      );
    }

    if (verificationEntry.verified) {
        // Optional: If already verified, perhaps let them proceed or inform them.
        // For now, just confirm it's verified.
        return NextResponse.json({ message: "Email already verified.", emailVerified: true }, { status: 200 });
    }

    if (verificationEntry.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(verificationEntry.expiresAt)) {
      // Optional: Delete expired code entry here if desired, though successful verification will delete it anyway now.
      // await prisma.emailVerification.delete({ where: { email } }); 
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 410 } // Gone
      );
    }

    // Code is valid and not expired. Delete the entry.
    await prisma.emailVerification.delete({
      where: { email }, // Assumes email is unique and an entry was found
    });

    return NextResponse.json(
      { message: "Email verified successfully. You can now complete your registration.", emailVerified: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error verifying email code:", error);
    return NextResponse.json(
      { error: "Internal server error while verifying email code." },
      { status: 500 }
    );
  }
} 