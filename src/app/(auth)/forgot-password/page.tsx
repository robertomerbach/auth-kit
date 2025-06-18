import { ForgotForm } from "@/components/auth/forgot-form"

export const metadata = {
  title: "Forgot your password?",
  description: "Make sure to reset your password to access your application",
}

/**
 * Forgot password page.
 * @param searchParams URL search parameters, possibly containing the user's email.
 * @returns JSX.Element with the forgot password form.
 */
export default async function ForgotPasswordPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ email?: string }> 
}) {
  // Extract parameters
  const params = await searchParams;
  const email = params.email || "";

  return <ForgotForm email={email} />
}