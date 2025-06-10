import { Separator } from "../ui/separator"
import { UploadAvatar } from "./upload-avatar"
import { UserFields } from "./user-fields"

interface AccountLayoutProps {
    user: {
        id: string
        name: string
        email: string
        image: string
        language: string
        createdAt: Date
        accounts: {
            provider: string
        }[]
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
            <UserFields user={user} />
        </div>
    )
}