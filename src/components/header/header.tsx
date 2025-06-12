'use client'

import Link from "next/link"
import { ScanFace } from "lucide-react"
import { usePathname } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"
import { NavUser } from "./nav-user"
import { User } from "@/types/user"

interface HeaderProps {
  user: User
}

/**
 * Application header component that displays the top navigation bar
 * Contains the dashboard title and user navigation menu
 */
export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  let title = "";

  if (pathname == "/") {
    title = "Dashboard";
  } else if (pathname == "/account") {
    title = "My Account";
  } 

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-background/90 backdrop-blur-sm">
      <div className="flex shrink-0 items-center justify-between gap-2 py-4 px-4 sm:px-6 md:px-10 transition-[width,height] ease-linear">
        <div className="flex flex-row items-center space-x-4">
          <Link href="/" rel="noopener noreferrer">
            <ScanFace className="w-7 h-7" />
          </Link>
          <Separator orientation="vertical" className="h-8 w-px bg-border" />
          <h1 className="text-lg font-bold leading-none">{title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2 h-10">
          <NavUser user={user} />
        </div>
      </div>
    </header>
  );
}