import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      language: string
      createdAt: Date
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string | null
    image?: string | null
    password?: string | null
    language: string
    createdAt: Date
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
    name?: string | null
    email?: string | null
    picture?: string | null
    language?: string
    createdAt: Date
  }
}
