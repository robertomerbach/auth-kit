import prisma from "@/lib/prisma"

export async function logActivity(userId: string, action: string, ipAddress: string) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        ipAddress,
      },
    })
  } catch (error) {
    console.error("[LOG_ACTIVITY]", error)
  }
}