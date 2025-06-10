import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create an account",
  description: "Create an account to access you apllication",
}

export default async function RegisterPage() {
  return <RegisterForm />
}