import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
    try {
        // Get email from query parameter
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true,
            },
        });

        // Check if user exists and has a password (not a social-only account)
        const exists = !!user;
        const isPasswordAccount = exists && !!user.password;

        return NextResponse.json({
            exists,
            isPasswordAccount,
        });

    } catch (error) {
        console.error('Check email error:', error);
        return NextResponse.json(
            { error: 'An error occurred while checking the email.' },
            { status: 500 }
        );
    }
} 