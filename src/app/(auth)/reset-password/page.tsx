import { Suspense } from 'react'
import AuthCard from '@/components/auth/auth-card'
import { Loader } from '@/components/loader'
import ResetPasswordChecker from '@/components/auth/reset-password-checker'

export const metadata = {
  title: "Reset Your Password",
  description: "Enter a new password to access your account.",
};

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // Extract parameters from URL
  const params = await Promise.resolve(searchParams);

  // Extract parameters
  const token = params.token || "";

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
