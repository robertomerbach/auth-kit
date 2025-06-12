
import axios from "axios"
import { useFormState } from "@/hooks/use-form-state"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader } from "../loader"
import { useRouter } from "next/navigation"
import { useCurrentSession } from "@/hooks/use-current-session"

interface   GoogleUnlinkDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function GoogleUnlinkDialog({ isOpen, onClose }: GoogleUnlinkDialogProps) {
    const router = useRouter()    
    const { update } = useCurrentSession()
    const { setFormError, isLoading, startLoading, stopLoading, setFormSuccess } = useFormState()

    // Unlink Google account
    const handleUnlinkGoogle = async () => {
        if (isLoading('google')) return

        startLoading('google')
        try {
            await axios.post("/api/user/unlink-google")
            router.refresh()
            await update()
            setFormSuccess("Google account unlinked successfully!")
            onClose()
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error
                : "An unexpected error occurred."
            setFormError(errorMessage || "Failed to unlink Google account")
        } finally {
            stopLoading('google')
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Disconnect Google</DialogTitle>
                    <DialogDescription className="text-base">
                        You are about to remove the Login Connection for Google.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <p className="text-base text-muted-foreground pb-6">
                        After removing it, you won&apos;t be able to use Google to log into your account anymore.
                    </p>
                    <p className="text-base text-muted-foreground">
                        Do you want to continue?
                    </p>
                </div>

                <DialogFooter className="pt-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading('google')}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUnlinkGoogle}  
                        disabled={isLoading('google')}
                    >
                        {isLoading('google') ? <Loader size={16} /> : "Disconnect"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 