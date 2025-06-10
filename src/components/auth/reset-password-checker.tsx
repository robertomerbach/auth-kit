import AuthCard from '@/components/auth/auth-card'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

async function getTokenValidity(token: string): Promise<{ valid: boolean; error?: string }> {
    if (!token) {
        return { valid: false, error: "No reset token provided." };
    }

    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/auth/verify-reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Token validation error:", error);
        return { 
            valid: false, 
            error: "Failed to validate reset token. Please try again or request a new reset link." 
        };
    }
}

export default async function ResetPasswordChecker({ token }: { token: string }) {
    if (!token) {
        return (
            <AuthCard 
                title="Invalid Reset Link" 
                description="No reset token was provided in the URL."
            >
                <p className="text-sm text-muted-foreground">
                    Please make sure you clicked the complete link from your email or request a new password reset.
                </p>
            </AuthCard>
        );
    }

    const tokenValidation = await getTokenValidity(token);

    if (!tokenValidation.valid) {
        return (
            <AuthCard 
                title="Invalid or Expired Link" 
                description={tokenValidation.error || "This password reset link is invalid or has expired. Please request a new one."}
            >
                <p className="text-sm text-muted-foreground">
                    If you continue to have issues, please try requesting a new password reset link or contact support.
                </p>
            </AuthCard>
        );
    }

    return <ResetPasswordForm token={token} />;
} 