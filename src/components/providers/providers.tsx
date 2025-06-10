"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"
import QueryProvider from "./query-provider"

/**
 * Props for the Providers component
 */
type ProvidersProps = {
  children: ReactNode;
};

/**
 * Global providers wrapper component
 * Combines React Query, NextAuth and theme providers
 */
export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  
  // Restore theme from localStorage if available
  useEffect(() => {
    // Skip SSR
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      // If a theme was saved, apply it immediately to avoid flash
      if (savedTheme && savedTheme !== 'system') {
        document.documentElement.classList.add(savedTheme);
      }
      
      setMounted(true);
    }
  }, []);

  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        > 
          {/* Only render children when mounted to avoid hydration mismatch */}
          {mounted ? children : null}
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  )
}