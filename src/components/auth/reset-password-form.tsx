'use client'

import React from "react"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { FormField, Form } from "@/components/ui/form"

import AuthCard from "@/components/auth/auth-card"
import { Loader } from "@/components/loader"
import { useFormState } from "@/hooks/use-form-state"
import { resetPasswordSchema, ResetPasswordSchema } from "@/lib/validations"
import { InputPassword } from "../input-password"

interface ResetPasswordFormProps {
    token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter()
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()

    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onChange"
    })

    const onSubmit = async (data: ResetPasswordSchema) => {
        startLoading("resetPassword")

        try {
            const res = await axios.post("/api/auth/reset-password", {
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });

            if (res.status === 200) {
                setFormSuccess("Your password has been reset successfully. You will be redirected to login...");
                form.reset();

                // Sign out and redirect to login
                await signOut({ redirect: false });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                 // Should be caught by the catch block for AxiosErrors
                setFormError(res.data.error || "An unexpected error occurred.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ error?: string; message?: string; }>;
                let errorMessage = "An unexpected error occurred.";
                if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                }
                setFormError(errorMessage);
            } else if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("An unexpected and unknown error occurred.");
            }
        } finally {
            stopLoading("resetPassword")
        }
    }

    return (
        <AuthCard 
            title="Reset Your Password"
            description="Enter your new password below."
        >
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <InputPassword 
                            id="password"
                            label="New Password"
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            {...field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <InputPassword 
                            id="confirmPassword"
                            label="Confirm New Password"
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            {...field}
                        />
                    )}
                />
                <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    disabled={isLoading("resetPassword") || !form.formState.isValid}
                >
                    {isLoading("resetPassword") ? <Loader size={20} /> : "Reset Password"}
                </Button>
            </form>
            </Form>
        </AuthCard>
    )
} 