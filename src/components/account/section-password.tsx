"use client"

import axios from "axios"
import { ActionSection } from "./action-section"
import { User } from "@/types/user"
import { useFormState } from "@/hooks/use-form-state"
import { useState } from "react"
import { PasswordDialog } from "./dialog-password"

export function SectionPassword({user}: {user: User}) {
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    
    // Send reset password email
    const handleResetEmail = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    startLoading('password-reset')

    try {
        await axios.post("/api/auth/send-reset-password", { email: user.email })
        setFormSuccess("Password reset email sent successfully!")
    } catch (error) {
        const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.error
            : "An unexpected error occurred."
        setFormError(errorMessage || "Failed to send password reset email")
        } finally {
            stopLoading('password-reset')
        }
    }

    return (
        <>
        <ActionSection
            title="Password"
            description={
                <div className="flex items-center justify-between gap-4">
                    <p>{user.hasPassword ? "Send a password reset email to change your password" : "No password set. Add one for security."}</p>
                </div>
            }
            actionText={user.hasPassword ? "Send Reset Email" : "Set Password"}
            onAction={user.hasPassword ? handleResetEmail : () => setIsPasswordDialogOpen(true)}
            isLoading={isLoading("password-reset")}
        />
        <PasswordDialog
            isOpen={isPasswordDialogOpen}
            onClose={() => setIsPasswordDialogOpen(false)}
        />
        </>
    )
}