"use client"

import axios from "axios"
import { signIn } from "next-auth/react"
import { Icons } from "../icons"
import { ActionSection } from "./action-section"
import { User } from "@/types/user"
import { useFormState } from "@/hooks/use-form-state"
import { useCurrentSession } from "@/hooks/use-current-session"
import { useRouter } from "next/navigation"

export function SectionSignIn({user}: {user: User}) {
    const router = useRouter()    
    const { update } = useCurrentSession()
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()

    // Unlink Google account
    const handleUnlinkGoogle = async () => {
        if (isLoading('google')) return

        startLoading('google')
        try {
            await axios.post("/api/user/unlink-google")
            router.refresh()
            await update()
            setFormSuccess("Google account unlinked successfully!")
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error
                : "An unexpected error occurred."
            setFormError(errorMessage || "Failed to unlink Google account")
        } finally {
            stopLoading('google')
        }
    }
    
    // Check if Google account is connected
    const isGoogleConnected = user.accounts?.some(acc => acc.provider === "google")

    return (
        <ActionSection
            title="Sign-in method"
            description={
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-foreground">
                        {isGoogleConnected ? <Icons.Google size={16} /> : null}
                        <span>{isGoogleConnected ? "Google" : "Email"}</span>
                    </div>
                    <span className="text-muted-foreground">{user.email}</span>
                </div>
            }
            actionText={isGoogleConnected ? "Disconnect" : "Connect Google"}
            onAction={isGoogleConnected ? handleUnlinkGoogle : () => signIn("google")}
            isLoading={isLoading('google')}
        />
    )
}