import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        if (!token || typeof token !== 'string') {
            // Retornamos 200 OK com valid: false para não dar pistas sobre a existência de tokens se alguém tentar adivinhar.
            return NextResponse.json({ valid: false, error: "Token is required and must be a string." }, { status: 200 });
        }

        const user = await prisma.user.findUnique({
            where: { resetToken: token },
        });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            // Mesmo que o token seja inválido ou expirado, limpamos se encontrarmos um usuário para ele.
            if (user && user.id) {
                 await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        resetToken: null,
                        resetTokenExpires: null,
                    },
                }).catch(err => console.error("[Validate Token] Failed to clear expired/invalid token:", err)); // Log error, but don't fail request
            }
            return NextResponse.json({ valid: false, error: "Invalid or expired token." }, { status: 200 }); 
        }
        
        // Token é válido e não expirou
        return NextResponse.json({ valid: true }, { status: 200 });

    } catch (error) {
        console.error("[Validate Token API] Error:", error);
        // Em caso de erro inesperado no servidor, também retornamos como se o token fosse inválido por segurança.
        return NextResponse.json({ valid: false, error: "Server error during token validation." }, { status: 200 }); 
    }
} 