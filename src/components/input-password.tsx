'use client'

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormItem, FormMessage, FormLabel, FormControl } from "./ui/form"
import Link from "next/link"

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string
    className?: string
    label?: string
    forgotLink?: string
}

export function InputPassword({ className, label, id, forgotLink, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormItem className="gap-1">
        {(label || forgotLink) && (
            <div className="flex items-center justify-between text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5 font-normal">
                {label && <FormLabel htmlFor={id} className="mb-1.5">{label}</FormLabel>}
                {forgotLink && (
                    <Link href={forgotLink} className="text-xs text-muted-foreground hover:underline">Forgot your password?</Link>
                )}
            </div>
        )}
        <FormControl>
            <div className="relative flex items-center">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-12 pt-2 pb-3 pl-6 h-12 rounded-full", className)}
                    {...props}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 h-7 w-7 rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeIcon className="h-4 w-4" />
                    ) : (
                        <EyeOffIcon className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </FormControl>
        <span className="text-xs min-h-5 text-muted-foreground">
            <FormMessage />
        </span>
    </FormItem>
  )
}
