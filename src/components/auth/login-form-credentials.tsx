"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from "@/hooks/use-form-state"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { 
  loginSchema,
  LoginSchema,
} from "@/lib/validations"

import { Form, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/loader"
import { InputPassword } from "../input-password"
import { InputDefault } from "../input-default"

interface LoginFormEmailProps {
  callbackUrl?: string;
  email?: string;
}

export function LoginFormEmail({
  callbackUrl = "/",
  email = "",
}: LoginFormEmailProps) {
  const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
    mode: "onSubmit",
  })

  async function onSubmit(values: LoginSchema) {
    startLoading("login")
    
    try {
      
      // Check if form is valid
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      
      // Handle error from signIn
      if (result?.error) {
        setFormError(result.error)
        return
      }
      
      // Login successful
      setFormSuccess("Login successful, redirecting...")

      // Redirect to the callback URL
      window.location.href = callbackUrl
      
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      stopLoading("login")
    }
  }

  const watchEmail = form.watch("email")

  // Generate forgot password link with email parameter
  const getForgotPasswordLink = () => {
    return `/forgot-password${watchEmail ? `?email=${encodeURIComponent(watchEmail)}` : ""}`
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <InputDefault
              id="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              autoComplete="email"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <InputPassword 
              id="password"
              forgotLink={getForgotPasswordLink()}
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...field}
            />
          )}
        />
      </div>
      <div className="space-y-3">
        <Button 
          type="submit"
          size="lg" 
          className="w-full h-12 rounded-full"
          disabled={isLoading("login") || !form.formState.isValid}
        >
          {isLoading("login") ? <Loader size={16} /> : "Login"}
        </Button>
      </div>
    </form>
    </Form>
  )
}
