import { useState } from "react"
import axios from "axios"
import { useFormState } from "@/hooks/use-form-state"
import { signOut } from "next-auth/react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader } from "../loader"

interface DeleteAccountDialogProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string
}

export function DeleteAccountDialog({ isOpen, onClose, userEmail }: DeleteAccountDialogProps) {
    const { setFormError, isLoading, startLoading, stopLoading, setFormSuccess } = useFormState()
    const [confirmEmail, setConfirmEmail] = useState("")

    // Delete account
    const handleDelete = async () => {
        if (confirmEmail !== userEmail) return

        startLoading('delete')
        try {
            await axios.delete("/api/user/delete-account")
            setFormSuccess("Account deleted successfully!")
            onClose()
            await signOut({ redirect: true })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setFormError(error.response?.data?.error || "Failed to delete account")
            } else {
                setFormError("An unexpected error occurred")
            }
            stopLoading('delete')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 pb-4">
                    <p className="text-sm text-muted-foreground ">Enter &quot;<b className="select-all" onClick={() => setConfirmEmail(userEmail)}>{userEmail}</b>&quot; to confirm account deletion</p>
                    <Input
                        id="confirm-email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="p-2 h-10"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading('delete')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}  
                        disabled={isLoading('delete') || confirmEmail !== userEmail}
                    >
                        {isLoading('delete') ? <Loader size={16} /> : "Delete Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 