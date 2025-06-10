import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

/**
 * Skeleton component shown while user data is loading
 */
export const UserSkeleton = memo(function UserSkeleton() {
    return (
      <div className="relative">
        <div className="w-full rounded-full p-1 -mr-1">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
});