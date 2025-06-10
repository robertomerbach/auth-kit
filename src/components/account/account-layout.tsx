import { Separator } from "../ui/separator"
import { UploadAvatar } from "./upload-avatar"
import { SectionSignIn } from "./section-signin"
import { SectionPassword } from "./section-password"
import { SectionName } from "./section-name"
import { SectionDelete } from "./section-delete"
import { SectionSessions } from "./section-sessions"

interface AccountLayoutProps {
    user: {
        id: string
        name: string
        email: string
        image: string
        language: string
        createdAt: string
        hasPassword: boolean
        accounts?: { provider: string }[]
    }
}

export function AccountLayout({ user }: AccountLayoutProps) {
    return (
        <div className="py-8 space-y-7">
            <div className="flex items-center gap-6">
                <UploadAvatar user={user} />
                <div className="flex flex-col">
                    <h2 className="text-[32px] font-semibold tracking-tight leading-snug">{user.name || "User not found"}</h2>
                    <p className="text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <Separator className="bg-foreground" /> 
            <div className="space-y-7 divide-y divide-border">
                <SectionName user={user} />
                <SectionPassword user={user} />
                <SectionSignIn user={user} />
                <SectionSessions />
                <SectionDelete user={user} />
            </div>
        </div>
    )
}