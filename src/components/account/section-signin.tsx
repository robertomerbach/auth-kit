"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { User } from "@/types/user"

import { Mail } from "lucide-react"
import { Icons } from "../icons"

import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { GoogleUnlinkDialog } from "./dialog-unlink-google"

export function SectionSignIn({user}: {user: User}) {

    // Google unlink dialog
    const [isGoogleUnlinkDialogOpen, setIsGoogleUnlinkDialogOpen] = useState(false)

    // Check if Google account is connected
    const isGoogleConnected = user.accounts?.some(acc => acc.provider === "google")

    return (
    <>
        <div className="flex flex-col gap-4 pb-8">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight leading-snug">Sign-in method</h3>
                <p className="text-muted-foreground text-sm">Manage your sign-in methods</p>
            </div>
            <Card className="bg-background">
                <div className="flex flex-col gap-6 divide-y divide-border">
                    <div className="flex flex-row justify-between gap-2 items-center pb-6 px-6">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-4 items-center">  
                                <Mail size={28} />
                                <div className="flex flex-col space-y-1 text-foreground">
                                    <span className="leading-none">Email</span>
                                    <span className="text-muted-foreground text-sm leading-none text-ellipsis overflow-hidden max-w-[150px] sm:max-w-full">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {}}> 
                            Manage
                        </Button>
                    </div>
                    <div className="flex flex-row justify-between gap-2 items-center px-6">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-4 items-center">  
                                <Icons.Google size={28} />
                                <div className="flex flex-col space-y-1 text-foreground">
                                    <span className="leading-none">Google</span>
                                    <span className="text-muted-foreground text-sm leading-none text-ellipsis overflow-hidden max-w-[150px] sm:max-w-full">
                                        {isGoogleConnected ? user.email : "Connect your google account"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={isGoogleConnected ? () => setIsGoogleUnlinkDialogOpen(true) : () => signIn("google")}>
                            {isGoogleConnected ? "Disconnect" : "Connect Google"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

        <GoogleUnlinkDialog
            isOpen={isGoogleUnlinkDialogOpen}
            onClose={() => setIsGoogleUnlinkDialogOpen(false)}
        />
    </>
    )
}