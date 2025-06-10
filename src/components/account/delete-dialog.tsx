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
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Loader } from "../loader"

interface DeleteAccountDialogProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string
}

export function DeleteAccountDialog({ isOpen, onClose, userEmail }: DeleteAccountDialogProps) {
    const { setFormError, isLoading, startLoading, stopLoading } = useFormState()
    const [confirmEmail, setConfirmEmail] = useState("")

    const handleDelete = async () => {
        if (confirmEmail !== userEmail) return

        startLoading()
        try {
            await axios.delete("/api/user/delete-account")
            // Sign out and redirect to home page after successful deletion
            await signOut({ redirect: false })
            window.location.href = "/"
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setFormError(error.response?.data?.error || "Failed to delete account")
            } else {
                setFormError("An unexpected error occurred")
            }
            stopLoading()
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
                    <Label htmlFor="confirm-email" className="text-sm text-muted-foreground ">Enter <b>{userEmail}</b> to confirm account deletion</Label>
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
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="cursor-pointer"
                        disabled={isLoading || confirmEmail !== userEmail}
                    >
                        {isLoading ? <Loader size={16} /> : "Delete Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 