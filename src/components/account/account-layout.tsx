"use client"

import { SectionActivity, SectionDelete, SectionName, SectionPassword, SectionSignIn, SectionSessions } from "."
import { UploadAvatar } from "./upload-avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { User } from "@/types/user"

interface AccountLayoutProps {
    user: User
}

export function AccountLayout({ user }: AccountLayoutProps) {
    return (
        <div className="py-8 space-y-7">
            <div className="flex items-center gap-6">
                <UploadAvatar user={user} />
                <div className="flex flex-col">
                    <h2 className="text-[32px] font-semibold tracking-tight leading-snug">{user.name || "User not found"}</h2>
                    <p className="text-muted-foreground">Member since {new Date(user.createdAt as Date).toLocaleDateString()}</p>
                </div>
            </div> 
            <Tabs defaultValue="profile" className="w-full space-y-7">
                <div className="sticky top-[72px] z-10 bg-background mb-4 border-b border-border">
                    <TabsList className="bg-transparent rounded-none flex flex-wrap -mb-px text-sm font-medium text-center space-x-2 h-10 p-0">
                        <TabsTrigger className="inline-block dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-foreground dark:data-[state=active]:border-foreground border-0 bg-transparent border-b-2 rounded-none border-transparent px-4" value="profile">Profile</TabsTrigger>
                        <TabsTrigger className="inline-block dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-foreground dark:data-[state=active]:border-foreground border-0 bg-transparent border-b-2 rounded-none border-transparent px-4" value="activity">Activity</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="profile">
                    <div className="space-y-7 divide-y divide-border">
                        <SectionName user={user} />
                        <SectionPassword user={user} />
                        <SectionSignIn user={user} />
                        <SectionSessions />
                        <SectionDelete user={user} />
                    </div>
                </TabsContent>
                <TabsContent value="activity">
                    <div className="space-y-7 divide-y divide-border">
                        <SectionActivity />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}