import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { Icons } from "../icons"

type ButtonProps = {
  title: string
}

export const GoogleButton = ({ title }: ButtonProps) => {
    return (
        <Button 
            variant="outline"
            className="w-full rounded-full h-12 has-[>svg]:px-6 px-6 gap-4 bg-muted text-base [&_svg:not([class*='size-'])]:size-4 shadow-none cursor-pointer disabled:cursor-not-allowed" 
            onClick={() => signIn("google", { callbackUrl: "/" })}
        >
            <Icons.Google size={16} />
            <span>{title}</span>
        </Button>
    )
}

export const FacebookButton = ({ title }: ButtonProps) => {
    return (
        <Button 
            variant="outline"
            className="w-full rounded-full h-12 has-[>svg]:px-6 px-6 gap-4 justify-start bg-muted text-base [&_svg:not([class*='size-'])]:size-4 shadow-none cursor-pointer disabled:cursor-not-allowed" 
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
        >
            <Icons.Facebook size={16} />
            <span>{title}</span>
        </Button>
    )
}