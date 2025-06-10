import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login to your account",
  description: "Make sure to login to your account to access your application",
}

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string;
    email?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Check if user is already logged in
  // const session = await getServerSession(authOptions);

  // Extract parameters from URL
  const params = await Promise.resolve(searchParams);

  // Extract parameters
  const callbackUrl = params.callbackUrl || "/";
  const email = params.email || "";
  
  // // If user is already logged in, redirect to callbackUrl
  // if (session) {
  //   redirect(callbackUrl);
  // }
  
  return <LoginForm callback={callbackUrl} email={email} />
}