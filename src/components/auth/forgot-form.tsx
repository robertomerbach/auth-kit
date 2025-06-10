'use client'

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { FormField, Form } from "@/components/ui/form"

import { Loader } from "@/components/loader"
import AuthCard from "@/components/auth/auth-card"

import { useFormState } from "@/hooks/use-form-state"
import { EmailSchema, emailSchema } from "@/lib/validations"
import { InputDefault } from "../input-default"

interface ForgotFormProps {
    email: string
}

export function ForgotForm({
    email
}: ForgotFormProps) {
    const router = useRouter()
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()

    const form = useForm<EmailSchema>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: email || "",
        },
        mode: "onChange"
    })

    const handleBack = () => {
        router.push("/login")
    }

    const onSubmit = async (data: EmailSchema) => {
        startLoading("forgot")

        try {
            // First, check if the email exists and is associated with a password-based account
            const checkEmailResponse = await axios.get("/api/auth/check-email", {
                params: { email: data.email }
            });

            if (!checkEmailResponse.data.exists ) {
                setFormError("We couldn't find an account with password-based sign-in for this email. Please check the email address or sign up.");
                return;
            }

            // If email exists and is not social, proceed to request password reset
            const res = await axios.post("/api/auth/send-reset-password", {
                email: data.email,
            });

            if (res.status === 200) {
                setFormSuccess(res.data.message || "Email sent with instructions to reset your password for your account.");
                form.reset();
                router.push("/login");
            } else {
                // This case might not be hit if the API always returns 200 on success/user-not-found
                // but good to have as a fallback.
                setFormError(res.data.error || "An unexpected error occurred. Please try again.");
            }
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message?: string; error?: string }>;
                const errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || "An unexpected error occurred while processing your request.";
                setFormError(errorMessage);
            } else if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("An unexpected and unknown error occurred.");
            }
        } finally {
            stopLoading("forgot")
        }
    }

    return (
        <AuthCard 
            title="Reset your password"
            description="Enter your email address and we will send you instructions to reset your password."
        >
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <InputDefault
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...field}
                        />
                    )}
                />
                <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    disabled={isLoading("forgot") || !form.formState.isValid}
                >
                    {isLoading("forgot") ? <Loader size={20} /> : "Send Instructions"}
                </Button>
                <Button 
                    type="button"
                    variant="outline"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    onClick={handleBack}
                >
                    Back to login
                </Button>
            </form>
            </Form>
        </AuthCard>
    )
}