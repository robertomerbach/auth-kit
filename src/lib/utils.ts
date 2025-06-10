import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges multiple class names using clsx and tailwind-merge
 * @param inputs - Array of class values to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates initials from a given name based on the number of initials requested
 * @param name - Full name string
 * @param count - Number of initials to extract (1 or 2). Defaults to 2.
 * @returns Initials (1-2 characters) or "#" if input is invalid
 */
export function getInitials(name: string, count: 1 | 2 = 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "#";

  if (count === 1 || parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
} 

/**
 * Returns a color based on the first letter of the given name.
 * There are 7 predefined colors, repeated cyclically.
 * @param name - Full name string
 * @returns A hex color string
 */
export function getColorByName(name: string): string {
  const colors = [
    "#FF6B6B", // red
    "#6BCB77", // green
    "#4D96FF", // blue
    "#FFD93D", // yellow
    "#845EC2", // purple
    "#FF9671", // orange
    "#00C9A7", // teal
  ];

  const firstChar = name.trim().charAt(0).toUpperCase();

  if (!firstChar || !/[A-Z]/.test(firstChar)) {
    return colors[0]; // default to first color if invalid
  }

  const index = (firstChar.charCodeAt(0) - 65) % colors.length;
  return colors[index];
}