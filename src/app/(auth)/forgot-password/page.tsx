import { ForgotForm } from "@/components/auth/forgot-form"

export const metadata = {
  title: "Forgot your password?",
  description: "Make sure to reset your password to access your application",
}

interface ForgotPasswordPageProps {
  searchParams: {
    email?: string
  }
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  // Extract parameters from URL
  const params = await Promise.resolve(searchParams);

  // Extract parameters
  const email = params.email || "";

  return <ForgotForm email={email} />
}