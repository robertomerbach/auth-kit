"use client"

import { useState } from "react"
import { useFormState } from "@/hooks/use-form-state"
import { User } from "@/types/user"
import { DeleteAccountDialog } from "./dialog-delete"
import { ActionSection } from "./action-section"

export function SectionDelete({ user }: { user: User }) {
    const { isLoading } = useFormState()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    return (
        <>            
            <ActionSection
                title="Delete account"
                description="Permanently delete your account and all associated data."
                actionText="Delete account"
                onAction={() => setIsDeleteDialogOpen(true)}
                isLoading={isLoading("delete")}
                variant="destructive"
            />

            <DeleteAccountDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                userEmail={user.email || ""}
            />
        </>
    )
}