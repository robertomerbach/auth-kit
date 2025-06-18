import { Suspense } from 'react'
import AuthCard from '@/components/auth/auth-card'
import { Loader } from '@/components/loader'
import ResetPasswordChecker from '@/components/auth/reset-password-checker'

export const metadata = {
  title: "Reset Your Password",
  description: "Enter a new password to access your account.",
};

/**
 * Reset password page.
 * @param searchParams URL search parameters, possibly containing the token.
 * @returns JSX.Element with the reset password form.
 */
export default async function ResetPasswordPage({ 
    searchParams
}: { 
    searchParams: Promise<{ token?: string }> 
}) {
 
  // Extract parameters
  const params = await searchParams;
  const token = params?.token || "";

  if (!token) {
      return (
          <AuthCard 
              title="Invalid Link"
              description="The password reset link is incomplete or missing a token. Please request a new one."
          >
              <p className="text-sm text-muted-foreground">
                  If you believe this is an error, please try requesting a new password reset link.
              </p>
          </AuthCard>
      );
  }

    return (
        <Suspense 
            fallback={
                <AuthCard 
                    title="Verifying token"
                    center
                >
                    <div className="flex flex-col items-center justify-center"> 
                        <Loader size={32} />
                        <p className="mt-6 text-base text-muted-foreground">Verifying token, please wait...</p>
                    </div>
                </AuthCard>
            }
        >
            <ResetPasswordChecker token={token} />
        </Suspense>
    );
}
