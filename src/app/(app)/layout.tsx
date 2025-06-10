import { Header } from "@/components/header/header";

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {

    return (
        <>
            <Header />
            <div className="w-full max-w-3xl lg:max-w-5xl mx-auto p-4 sm:p-6 md:p-10">
                {children}
            </div>
        </>
    )
}