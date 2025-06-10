import Link from "next/link"

export default function AuthFooter() {
    return (
        <div className="pt-6">
            <div className="p-4">
                <p className="text-xs text-muted text-center text-balance text-muted-foreground">
                    <Link href="#">Terms of Service</Link>
                    <span> | </span>
                    <Link href="#">Privacy Policy</Link>
                </p>
            </div>
        </div>
    )
}