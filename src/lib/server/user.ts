import { cookies } from "next/headers"
import { User } from "@/types/user"
import axios from "axios"   

/**
 * Query user data in the server.
 * @returns User if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
    try {

        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('next-auth.session-token')

        if (!sessionCookie) {
            return null
        }

        const user = await axios.get(`${process.env.NEXTAUTH_URL}/api/user`, {
            headers: {
                cookie: `${sessionCookie.name}=${sessionCookie.value}`,
                'Content-Type': 'application/json'
            }
        })

        if (!user) {
            return null
        }

        return user.data as User
    } catch (error) {
        console.error("Error fetching user data:", error)
        return null
    }
}
