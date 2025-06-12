import { Header } from "@/components/header/header"
import { getCurrentUser } from "@/lib/server/user"

interface AppLayoutProps {
    children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
    // Query the user from the server
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    return (
        <>
            <Header user={user} />
            <div className="w-full max-w-3xl lg:max-w-5xl mx-auto p-4 sm:p-6 md:p-10">
                {children}
            </div>
        </>
    )
}