import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login to your account",
  description: "Make sure to login to your account to access your application",
}

/**
 * Login page.
 * @param searchParams URL search parameters, possibly containing the user's email.
 * @returns JSX.Element with the login form.
 */
export default async function LoginPage({ 
  searchParams
}: {
  searchParams: Promise<{ email?: string, callbackUrl?: string }> 
}) {

  // Extract parameters
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/";
  const email = params?.email || "";
  
  return <LoginForm callback={callbackUrl} email={email} />
}