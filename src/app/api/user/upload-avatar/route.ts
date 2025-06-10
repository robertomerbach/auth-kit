import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 }
      )
    }

    // TODO: Implement file upload to your server/CDN
    // For now, we'll just update the user with a placeholder image
    const imageUrl = "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=" + session.user.name

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl
      }
    })

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error("Upload avatar error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 