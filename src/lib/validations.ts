import * as z from "zod"

/**
 * Schema for login validation
 * Requires email and non-empty password
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1,"You must provide a password."),
});

/**
 * Schema for register validation
 * Requires name, email, password, and language
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  language: z.string().default("en")
});

/**
 * Schema for email step validation
 * Requires email
 */
export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

/**
 * Schema for code step validation
 * Requires code
 */
export const codeSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
})

/**
 * Schema for profile step validation
 * Requires name and password
 */
export const accountSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

/**
 * Schema for reset password validation
 * Requires password and confirm password
 */
export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Schema for updating account
 */
export const updateAccountSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  image: z.string().url("Invalid image URL").optional().nullable(),
  email: z.string().email("Invalid email address"),
})

/**
 * Schema for setting/updating password
 */
export const passwordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type exports for form handling
export type EmailSchema = z.infer<typeof emailSchema>
export type CodeSchema = z.infer<typeof codeSchema>
export type AccountSchema = z.infer<typeof accountSchema>
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>