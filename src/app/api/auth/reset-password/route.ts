import { z } from "zod"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { resetPasswordSchema } from "@/lib/validations"
import { getClientIP } from "@/lib/ip"
import { ActivityTypes } from "@/lib/constants"
import { logActivity } from "@/lib/activity"

// Extend the schema to include the token
const resetPasswordBodySchema = resetPasswordSchema.innerType().extend({
    token: z.string().min(1, { message: "Token is required." }),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = resetPasswordBodySchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { error: "Invalid request data.", details: parseResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const ipAddress = await getClientIP()

        const { token, password, confirmPassword } = parseResult.data;

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match.", details: { confirmPassword: ["Passwords do not match."] } },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { resetToken: token },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token. Please try resetting your password again." }, { status: 400 });
        }

        if (!user.resetTokenExpires || new Date() > new Date(user.resetTokenExpires)) {
            // Clear the expired token
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: null,
                    resetTokenExpires: null,
                },
            });
            return NextResponse.json({ error: "Token has expired. Please request a new password reset." }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password, clear reset token fields, and delete all sessions
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
                emailVerified: user.emailVerified || new Date(), // Re-verify email if it was pending due to password reset or ensure it stays verified
                sessions: {
                    deleteMany: {} // Delete all sessions for security
                },
            },
    
        });

        await logActivity(user.id, ActivityTypes.PASSWORD_RESET, ipAddress);

        // Optionally, you could send a confirmation email here that the password was changed.

        return NextResponse.json({ 
            message: "Password has been reset successfully. You will need to sign in again on all devices." 
        }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        // Generic error for security
        return NextResponse.json(
            { error: "An error occurred while resetting your password." },
            { status: 500 }
        );
    }
} 