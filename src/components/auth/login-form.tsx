"use client"

import * as React from "react"
import {  GoogleButton } from "@/components/auth/login-button"
import { LoginFormEmail } from "@/components/auth/login-form-credentials"
import AuthCard from "./auth-card"

interface LoginFormProps {
  callback?: string;
  email?: string;
}

export function LoginForm({
  callback = "/",
  email = "",
}: LoginFormProps) {

  const content = (
    <div className="flex flex-col gap-4 pb-2">
      <LoginFormEmail callbackUrl={callback} email={email} />
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <GoogleButton title="Sign in with Google" />
    </div>
  )

  return (
    <AuthCard title="Login to your account" center={true}>
      {content}
    </AuthCard>
  )
}
