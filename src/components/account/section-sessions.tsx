"use client"

import axios from "axios"
import { signOut } from "next-auth/react"
import { ActionSection } from "./action-section"
import { useFormState } from "@/hooks/use-form-state"

export function SectionSessions() {
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()

    const handleInvalidateSessions = async () => {
        if (isLoading("sessions")) return

        startLoading("sessions")
        try {
            await axios.post("/api/user/invalidate-sessions")
            setFormSuccess("All sessions invalidated successfully! You will be signed out.")
            // Pequeno delay para mostrar a mensagem de sucesso antes de deslogar
            setTimeout(() => {
                signOut({ callbackUrl: "/login" })
            }, 1500)
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error
                : "An unexpected error occurred."
            setFormError(errorMessage || "Failed to invalidate sessions")
            stopLoading("sessions")
        }
    }

    return (
        <ActionSection
            title="Active sessions"
            description="Sign out from all devices where you are currently logged in."
            actionText="Sign out everywhere"
            onAction={handleInvalidateSessions}
            isLoading={isLoading("sessions")}
        />
    )
} 