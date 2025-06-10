"use client"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function AuthCard({
  children,
  title,
  description,
  center = false,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  center?: boolean;
}>) {

  return (
    <Card className="relative overflow-hidden gap-0 border-none shadow-none bg-transparent px-0 -mx-2">
      <div className="px-2">
        <CardHeader className="space-y-4 gap-0 pb-8 px-0">
          <CardTitle className={cn("text-xl md:text-3xl font-bold", center && "text-center")}>{title}</CardTitle>
          {typeof description === "string" ? <CardDescription className={cn("text-base text-muted-foreground", center && "text-center")}>{description}</CardDescription> : description}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mb-3 px-0">
          {children}
      </CardContent>
      </div>
    </Card>
  );
}