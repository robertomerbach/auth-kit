"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from "@/hooks/use-form-state"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { MailIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios, { AxiosError } from "axios"
import AuthCard from "./auth-card"
import { Loader } from "../loader"

import { 
  Form,
  FormField,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { emailSchema, codeSchema, accountSchema, EmailSchema, CodeSchema, AccountSchema  } from "@/lib/validations"
import { InputPassword } from "../input-password"
import { InputDefault } from "../input-default"
import { InputCode } from "../input-code"

// Animation variants
const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export function RegisterFormEmail() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [direction, setDirection] = React.useState(0)
  const [submittedEmail, setSubmittedEmail] = React.useState<string>("")
  const { setFormSuccess, setFormError, isLoading, startLoading, stopLoading } = useFormState()

  // Form hooks for each step
  const emailForm = useForm<EmailSchema>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" }, mode: "onChange" })
  const codeForm = useForm<CodeSchema>({ resolver: zodResolver(codeSchema), defaultValues: { code: "" }, mode: "onChange" })
  const profileForm = useForm<AccountSchema>({ resolver: zodResolver(accountSchema), defaultValues: { name: "", password: "" }, mode: "onChange" })

  const goToStep = (step: number, dir: number = 1) => {
    setDirection(dir)
    setCurrentStep(step)
  }

  // Step 1: Email submission
  async function onEmailSubmit(data: EmailSchema) {
    startLoading("email")

    try {
      // Step 1.1: Check if email already exists in Users table
      const checkEmailResponse = await axios.get(`/api/auth/check-email`, {
        params: { email: data.email }
      });

      if (checkEmailResponse.data.exists) {
        emailForm.setError("email", {
          type: "manual",
          message: "This email is already registered. Please login or use a different email."
        });
        return; // Stop processing
      }

      // Step 1.2: If email does not exist in Users table, proceed to send verification code
      const sendCodeResponse = await axios.post('/api/auth/send-verification', {
        email: data.email
      });
      
      setSubmittedEmail(data.email)
      setFormSuccess(sendCodeResponse.data.message || "Verification code sent to " + data.email) 
      goToStep(2)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || "An unexpected error occurred";
        emailForm.setError("email", {
          type: "manual",
          message: errorMessage
        });
      } else {
        emailForm.setError("email", {
          type: "manual",
          message: "An unexpected error occurred"
        });
      }
    } finally {
      stopLoading("email")
    }
  }

  // Step 2: Verification code submission
  async function onCodeSubmit(data: CodeSchema) {
    startLoading("code")

    try {
      const response = await axios.post('/api/auth/verify-email', {
        email: submittedEmail,
        code: data.code
      });
      
      if (!response.data.emailVerified) {
        const errorMessage = response.data.error || "Invalid or expired verification code. Please try again or request a new code.";
        codeForm.setError("code", {
          type: "manual",
          message: errorMessage
        });
        return;
      }
      
      goToStep(3)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || "An unexpected error occurred during code verification";
        codeForm.setError("code", {
          type: "manual",
          message: errorMessage
        });
      } else {
        codeForm.setError("code", {
          type: "manual",
          message: "An unexpected error occurred during code verification"
        });
      }
    } finally {
      stopLoading("code")
    }
  }

  // Step 3: Profile submission (Name and Password)
  async function onProfileSubmit(data: AccountSchema) {
    startLoading("profile")
    try {
      const fullData = {
        email: submittedEmail,
        name: data.name,
        password: data.password,
        language: navigator.language.split('-')[0],
      }

      const response = await axios.post('/api/auth/register', fullData);
      
      if (!response.data.user) {
        throw new Error("Failed to create account");
      }

      const signInResult = await signIn("credentials", { 
        email: fullData.email, 
        password: fullData.password, 
        redirect: false 
      });

      if (signInResult?.error) throw new Error(signInResult.error);
      
      setFormSuccess("Account created successfully! Redirecting to dashboard...");
      window.location.href = "/";

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || "Failed to create account";
        setFormError(errorMessage);
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Failed to create account");
      }
    } finally {
      stopLoading("profile")
    }
  }

  // Navigate to the main register page (without type=email)
  const handleGoToMainRegisterPage = () => {
    router.push("/register") 
  }

  let title = ""
  let description: React.ReactNode = null

  if (currentStep === 1) {  
    title = "Register with email"
  } else if (currentStep === 2) {
    title = "Verify your email"
    description = (
      <p className="text-center text-base text-muted-foreground">We&apos;ve emailed a one time security code to <strong className="text-foreground">{submittedEmail}</strong>, please enter it below:</p>
    )
  } else if (currentStep === 3) {
    title = "Complete your sign up"
    description = (
      <div className="flex justify-center">
        <Badge variant="outline" className="gap-2 bg-muted px-3 py-1.5 text-sm font-medium rounded-full items-center">
          <MailIcon className="w-5 h-5" />{submittedEmail}
        </Badge>
      </div>
    )
  }

  return (
    <AuthCard 
      title={title} 
      description={description}
      center={true}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {/* Step 1: Email */}
        {currentStep === 1 && (
          <motion.div key="step1_email" variants={formVariants} initial="enter" animate="center" exit="exit" custom={direction} transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-3">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <InputDefault
                      id="name"
                      type="name"
                      label="Email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  )}
                />
                <div className="space-y-3">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    disabled={isLoading("email") || !emailForm.formState.isValid}
                  >
                    {isLoading("email") ? <Loader size={20} /> : "Send code"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    onClick={handleGoToMainRegisterPage}
                  >Go back</Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 2: Verification Code */}
        {currentStep === 2 && (
          <motion.div key="step2_code" variants={formVariants} initial="enter" animate="center" exit="exit" custom={direction} transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-3">
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field }) => (
                    <InputCode field={field} maxLength={6} />
                  )}
                />
                <div className="space-y-3">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    disabled={isLoading("code") || !codeForm.formState.isValid}
                  >{isLoading("code") ? <Loader size={20} /> : "Confirm email"}</Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    onClick={() => goToStep(1, -1)}
                    >Go Back</Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 3: Name and Password */}
        {currentStep === 3 && (
          <motion.div key="step3_profile" variants={formVariants} initial="enter" animate="center" exit="exit" custom={direction} transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <InputDefault
                        id="name"
                        type="name"
                        label="Full Name"
                        placeholder="E.g., John Doe"
                        autoComplete="name"
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="password"
                    render={({ field }) => (
                      <InputPassword
                        id="password"
                        label="Password"
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="space-y-3"> 
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-full"
                    disabled={isLoading("profile") || !profileForm.formState.isValid}
                  >
                    {isLoading("profile") ? <Loader size={20} /> : "Complete Sign Up"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-12 rounded-full bg-transparent border border-input"
                    onClick={() => goToStep(2, -1)}
                    >Go Back</Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  )
}