'use client'

import React, { memo } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarWrapper } from "@/components/avatar"

import { User } from "@/types/user"
import { ThemeSelector } from "./nav-user-theme"
import { SignOutItem } from "./nav-user-signout"
import Link from "next/link"
import { UserIcon } from "lucide-react"

/**
 * Props for NavUser component
 */
interface NavUserProps {
  user?: User | null;
}

/**
 * User navigation component that displays user avatar and dropdown menu
 * Provides access to profile, team management, theme settings and logout
 */
export const NavUser = memo(function NavUser({ user }: NavUserProps) {

  const { name, email, image } = user || {}

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="rounded-full p-1 -mr-1 cursor-pointer hover:bg-muted transition-background">
            <AvatarWrapper 
              name={name || "User avatar"} image={image || undefined}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[239px]" align="end">

          <DropdownMenuLabel className="flex items-center gap-2 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{email || ""}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link className="cursor-pointer text-muted-foreground" href="/account">
              <span>My Account</span>
              <DropdownMenuShortcut>
                <UserIcon className="size-4" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          <ThemeSelector name="Theme" />

          <DropdownMenuSeparator />

          <SignOutItem name="Sign out" />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});