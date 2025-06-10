"use client"

import { ScanFace } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AuthHeader() {
    const pathname = usePathname()
    let title = ""
    let linkHref = ""
    let linkText = ""

    if (pathname == "/login") {
        title = "Don't have an account?"
        linkText = "Sign Up"
        linkHref = "/register"
    } else if (pathname == "/register" || pathname == "/register/email") {
        title = "Already have an account?"
        linkText = "Sign In"
        linkHref = "/login"
    } 

    return (
        <header className="sticky top-0 z-50 w-full bg-mutedd/60 backdrop-blur">
            <div className="flex items-center justify-between h-16 w-full px-4 sm:px-6 md:px-10">
                <Link href="/" className="flex items-center gap-2">
                    <ScanFace className="w-7 h-7" />
                    <span className="text-xl font-normal">AuthKit</span>
                </Link>
                <p className="text-sm flex items-center">
                    <span className="hidden md:block text-muted-foreground mr-3">{title}</span>
                    <Link
                        href={linkHref}
                        className="text-base font-medium text-foreground underline leading-6 letter-spacing-[0]"
                        rel="noopener noreferrer"
                    >
                        {linkText}
                    </Link>
                </p>
            </div>
        </header>
    )
}