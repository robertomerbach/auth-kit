import { signOut } from "next-auth/react"
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

/**
 * Renders a dropdown menu item for signing out
 * @param {Object} props - Component props
 * @param {string} props.name - Display name for the sign out option
 */
export function SignOutItem({ name }: { name: string }) {

  return (
    <DropdownMenuItem
      className="cursor-pointer text-muted-foreground"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <span>{name}</span>
      <DropdownMenuShortcut>
        <LogOut className="size-4" />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
