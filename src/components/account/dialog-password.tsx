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
import { InputPassword } from "../input-password"
import { Form, FormField } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordSchema, PasswordSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"

interface PasswordDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function PasswordDialog({ isOpen, onClose }: PasswordDialogProps) {
    const { isLoading, startLoading, stopLoading, setFormSuccess, setFormError } = useFormState()
    const router = useRouter()
    
    const form = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    })
    
    // Close dialog and reset form
    const handleClose = () => {
        form.reset()
        onClose()
    }

    // Update password
    const onSubmit = async (data: PasswordSchema) => {
 
        startLoading('password')
        try {
            await axios.post("/api/user/update-password", data)
            setFormSuccess("Password updated successfully!")
            handleClose()
            router.refresh()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setFormError(error.response?.data?.error || "Failed to create password")
            } else {
                setFormError("An unexpected error occurred")
            }
        } finally {
            stopLoading('password')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Password</DialogTitle>
                    <DialogDescription>
                        Set a password for your account to enable email/password login.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-2 py-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <InputPassword {...field} id="password" label="New password" autoComplete="new-password" placeholder="New password" />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <InputPassword {...field} id="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Confirm password" />
                            )}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading('password') || !form.formState.isValid}
                        >
                            {isLoading('password') ? <Loader size={16} /> : "Set Password"}
                            </Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 