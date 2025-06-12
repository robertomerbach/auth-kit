
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json(null, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                language: true,
                createdAt: true,
                password: true,
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(null, { status: 404 })
        }

        const { password, ...userWithoutPassword } = user
        const userResponse = {
            ...userWithoutPassword,
            hasPassword: !!password
        }

        return NextResponse.json(userResponse)
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        )
    }
} 