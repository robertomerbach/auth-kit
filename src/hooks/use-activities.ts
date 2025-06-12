import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface Activity {
  id: string
  action: string
  ipAddress: string
  createdAt: string
}

async function fetchActivities() {
  const { data } = await axios.get<Activity[]>("/api/user/activities")
  return data
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  })
} 