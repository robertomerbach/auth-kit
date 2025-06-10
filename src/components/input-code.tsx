// components/OTPInput.tsx
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"
import React from "react"

interface InputCodeProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
  maxLength?: number
  className?: string
}

export function InputCode<TFieldValues extends FieldValues>({ field, maxLength = 6, className }: InputCodeProps<TFieldValues>) {
  return (
    <FormItem className={`justify-center gap-1 py-1 ${className ?? ""}`}>
      <FormLabel className="sr-only">Verification Code</FormLabel>
      <FormControl>
        <InputOTP {...field} maxLength={maxLength}>
            <InputOTPGroup>
            {Array.from({ length: maxLength }).map((_, i) => (
                <React.Fragment key={i}>
                  <InputOTPSlot index={i} />
                  {maxLength % 2 === 0 && i === maxLength / 2 - 1 && (
                      <InputOTPSeparator />
                  )}
                </React.Fragment>
            ))}
            </InputOTPGroup>
        </InputOTP>
      </FormControl>
      <span className="text-xs min-h-5 text-muted-foreground">
        <FormMessage />
      </span>
    </FormItem>
  )
}
