import { useSession } from "next-auth/react"

/**
 * Custom hook to access and format the current user session
 * Provides session data, loading state, and authentication status
 */
export function useCurrentSession() {
  const { data: session, status, update } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Return a formatted session object or null if no session exists
  const currentSession = session
    ? {
        id: session.user?.id || "",
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: session.user?.image || "",
        language: session.user?.language || "",
        createdAt: session.user?.createdAt || new Date().toISOString()
      }
    : null;

  return { session: currentSession, isLoading, isAuthenticated, update };
}