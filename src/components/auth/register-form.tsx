"use client"

import * as React from "react"

import { MailIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"

import { GoogleButton } from "@/components/auth/login-button"
import { RegisterFormEmail } from "./register-form-credentials"
import AuthCard from "./auth-card"

export function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const showEmailForm = searchParams.get("type") === "email"
  
    const handleShowEmailForm = () => {
      router.push("?type=email")
    }
  
    if (showEmailForm) {
      return <RegisterFormEmail />
    }
    
    return (
        <AuthCard title="Create your account" center={true}>
            <div className="flex flex-col gap-4 pb-2">
                <Button 
                    type="button"
                    size="lg" 
                    className="w-full h-12 rounded-full text-base px-5 gap-4 cursor-pointer disabled:cursor-not-allowed"
                    onClick={handleShowEmailForm}
                >
                    <MailIcon className="w-5 h-5" />
                    Sign up with Email
                </Button>   
                <GoogleButton title="Sign up with Google" />
            </div>
        </AuthCard>
    )
}