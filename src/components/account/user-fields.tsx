"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { updateAccountSchema, UpdateAccountSchema, passwordSchema, PasswordSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from "@/hooks/use-form-state"
import { useCurrentSession } from "@/hooks/use-current-session"

// Componentes Abstraídos
import { DeleteAccountDialog } from "./delete-dialog"
import { EditableField } from "./editable-section"
import { ActionSection } from "./action-section"

// Inputs e UI
import { Form, FormField } from "../ui/form"
import { InputPassword } from "../input-password"
import { Icons } from "../icons"
import { Input } from "../ui/input"

// Props permanecem as mesmas
interface UserFieldsProps {
    user: {
        id: string
        name: string
        email: string
        accounts?: { provider: string }[]
        hasPassword?: boolean
    }
}

export function UserFields({ user }: UserFieldsProps) {
    const router = useRouter()
    const { update } = useCurrentSession()
    const { setFormSuccess, setFormError, isLoading, startLoading, stopLoading } = useFormState()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Formulários
    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: { name: user.name || "", email: user.email || "" },
        mode: "onChange",
    })

    const passwordForm = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "", confirmPassword: "" },
        mode: "onChange",
    })

    // Sincroniza o formulário com as props do usuário
    useEffect(() => {
        form.reset({ name: user.name || "", email: user.email || "" })
    }, [user.name, user.email, form])

    // Função auxiliar para lidar com chamadas de API
    const handleApiRequest = async (
        apiCall: () => Promise<unknown>,
        successMessage: string,
        sectionId: string,
        onSuccess?: () => void
    ) => {
        startLoading(sectionId)
        try {
            await apiCall()
            setFormSuccess(successMessage)
            router.refresh()
            await update()
            onSuccess?.()
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error
                : "An unexpected error occurred."
            setFormError(errorMessage || "Failed to complete the action.")
        } finally {
            stopLoading(sectionId)
        }
    }

    // Handlers específicos para cada ação
    const handleUpdateName = () => {
        const value = form.getValues("name")
        return handleApiRequest(
            () => axios.patch("/api/user/update", { 
                name: value,
                email: user.email
            }),
            "Name updated successfully!",
            "name"
        )
    }

    const handleUpdatePassword = (data: PasswordSchema) => {
        return handleApiRequest(
            () => axios.post("/api/user/update-password", data),
            "Password updated successfully!",
            "password",
            () => passwordForm.reset()
        )
    }

    const handleSendResetEmail = () => {
        return handleApiRequest(
            () => axios.post("/api/auth/send-reset-password", { email: user.email }),
            "Password reset email sent successfully!",
            "password-reset"
        )
    }
    
    const handleUnlinkGoogle = () => {
        return handleApiRequest(
            () => axios.post("/api/user/unlink-google"),
            "Google account unlinked successfully!",
            "google"
        );
    };

    const isGoogleConnected = user.accounts?.some(acc => acc.provider === "google")

    return (
        <div className="space-y-7 divide-y divide-border">
            <Form {...form}>
                <EditableField
                    title="Name"
                    displayValue={<p>{user.name}</p>}
                    onSave={handleUpdateName}
                    onCancel={() => form.resetField("name")}
                    isLoading={isLoading("name")}
                    isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <Input {...field} id="name" placeholder="Your name" className="p-2 h-10" />
                        )}
                    />
                </EditableField>
            </Form>

            {user.hasPassword ? (
                <ActionSection
                    title="Password"
                    description={
                        <div className="flex items-center justify-between gap-4">
                            <p>Send a password reset email to change your password</p>
                        </div>
                    }
                    actionText="Send Reset Email"
                    onAction={handleSendResetEmail}
                    isLoading={isLoading("password-reset")}
                />
            ) : (
                <Form {...passwordForm}>
                    <EditableField
                        title="Password"
                        displayValue={
                            <div className="flex items-center justify-between gap-4">
                                <p>No password set. Add one for security.</p>
                            </div>
                        }
                        onSave={passwordForm.handleSubmit(handleUpdatePassword)}
                        onCancel={() => passwordForm.reset()}
                        isLoading={isLoading("password")}
                        isSaveDisabled={!passwordForm.formState.isValid}
                        editButtonText="Set Password"
                    >
                        <div className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <InputPassword {...field} id="password" placeholder="New password" />
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <InputPassword {...field} id="confirmPassword" placeholder="Confirm password" />
                                )}
                            />
                        </div>
                    </EditableField>
                </Form>
            )}

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
                isLoading={isLoading("google")}
            />

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
                userEmail={user.email}
            />
        </div>
    )
}