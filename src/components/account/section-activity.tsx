"use client"

import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useActivities } from "@/hooks/use-activities"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionActivity() {
  const { data: activities, isLoading, error } = useActivities()

  if (error) {
    return (
      <Card className="p-2 bg-transparent">
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">Failed to load activity log.</p>
        </CardContent>
      </Card>
    )
  }

  return (
     <Card className="p-2 bg-transparent shadow-none">
      <CardContent className="p-0">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !activities?.length ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>{activity.ipAddress}</TableCell>
                  <TableCell className="w-1/3">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: enUS })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
  