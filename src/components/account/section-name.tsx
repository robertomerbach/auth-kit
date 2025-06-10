"use client"

import axios from "axios"
import { User } from "@/types/user"
import { useFormState } from "@/hooks/use-form-state"
import { useEffect } from "react"
import { Form, FormField } from "../ui/form"
import { EditableField } from "./editable-section"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateAccountSchema, type UpdateAccountSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useCurrentSession } from "@/hooks/use-current-session"

export function SectionName({user}: {user: User}) {
    const router = useRouter()
    const { update } = useCurrentSession()
    const { setFormSuccess, setFormError, startLoading, stopLoading, isLoading } = useFormState()
    
    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: { 
            name: user.name || "",
            email: user.email || ""
        },
        mode: "onChange",
    })

    useEffect(() => {
        form.reset({ 
            name: user.name || "",
            email: user.email || ""
        })
    }, [user.name, user.email, form])
    
    const handleUpdateName = async () => {
        if (isLoading("name")) return
        
        startLoading("name")
        try {
            await axios.patch("/api/user/update", { 
                name: form.getValues("name"),
                email: user.email
            })
            setFormSuccess("Name updated successfully!")
            router.refresh()
            await update()
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error
                : "An unexpected error occurred."
            setFormError(errorMessage || "Failed to update name")
        } finally {
            stopLoading("name")
        }
    }

    return (
        <Form {...form}>
            <EditableField
                title="Name"
                displayValue={<p>{user.name}</p>}
                onSave={handleUpdateName}
                onCancel={() => form.resetField("name")}
                isLoading={isLoading("name")}
                isSaveDisabled={!form.formState.isDirty || form.formState.errors.name !== undefined}
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
    )
}