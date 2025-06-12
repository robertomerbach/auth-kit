import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { User } from "@/types/user"

// Function to fetch the current user
async function fetchUser() {
  const { data } = await axios.get<User>("/api/user")
  return data
}

interface UseCurrentUserOptions {
  initialData?: User
}

// Hook to fetch the current user
export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    initialData: options.initialData, // Allow hydrating with server data
  })
} 