import React, { memo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getColorByName, getInitials } from "@/lib/utils"

/**
 * Props for the AvatarWrapper component
 */
interface AvatarWrapperProps {
  name: string;
  image?: string;
  size?: string;
  classname?: string;
  classnameFalback?: string;
  rounded?: boolean;
}

/**
 * Component that displays a user avatar with image or initials fallback
 * Supports customizable sizing and handles name formatting
 */
function AvatarWrapperComponent({ name, image, size = "32px", classname, classnameFalback, rounded = true }: AvatarWrapperProps) {
  const initials = getInitials(name)
  const color = getColorByName(name)

  return (
    <Avatar className={cn(
        `h-[${size}] w-[${size}] size-auto`,
      rounded ? "rounded-full" : "rounded-md",
    )}>
      {image ? (
        <AvatarImage
          className={cn(
            "object-cover aspect-square",
            `h-[${size}] w-[${size}]`,
            classname
          )}
          style={{ width: size, height: size }}
          src={image}
          alt={name} />
      ) : null}
      <AvatarFallback style={{ width: size, height: size , backgroundColor: color}} className={cn( `size-auto`,classnameFalback)}>{initials}</AvatarFallback>
    </Avatar>
  );
}

export const AvatarWrapper = memo(AvatarWrapperComponent);