import prisma from "@/lib/prisma"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { compare } from "bcryptjs"

import { logActivity } from "./activity"
import { ActivityTypes } from "./constants"
import { getClientIP } from "./ip"

import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

/**
 * NextAuth configuration options
 * Defines authentication providers, callbacks, and session handling
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,    // 24 hours
  },

  pages: {
    signIn: "/login", // Custom login page
    error: "/login",  // Redirect errors to login
  },

  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),

    // Custom credentials provider for email/password login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate presence of credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Look up user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Reject if user not found or missing password
        if (!user || !user.password) {
          throw new Error("Email or password incorrect")
        }

        // Verify password hash
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return user
      }
    })
  ],

  callbacks: {
    // Runs on every sign-in
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Extract Google profile image if available
        const googleImage = account?.provider === "google"
          ? (profile as { picture?: string })?.picture || undefined
          : undefined;

        // Retrieve user from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        // Capture user IP address
        const ipAddress = await getClientIP();

        // Handle Google sign-in
        if (account?.provider === "google") {
          if (!dbUser) {
            // Create user and account if not found
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: googleImage,
                emailVerified: new Date(),
                accounts: {
                  create: {
                    type: account.type!,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId!,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state
                  }
                }
              }
            });

            // Log Google login activity
            await logActivity(newUser.id, ActivityTypes.REGISTER, ipAddress);
            return true;
          }

          // Link Google account to existing user
          if (!dbUser.accounts.find(acc => acc.provider === "google")) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state
              }
            });

            // Update user profile with Google data
            if (googleImage) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  image: googleImage,
                  name: user.name || dbUser.name
                }
              });
            }
          }

          // Log Google login
          await logActivity(dbUser.id, ActivityTypes.LOGIN_GOOGLE, ipAddress);
          return true;
        }

        // Handle email/password login
        if (account?.provider === "credentials" && dbUser) {
          await logActivity(dbUser.id, ActivityTypes.LOGIN, ipAddress);
        }

        return !!dbUser;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },

    // Populate session with user data
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.image = token.picture || null;
        session.user.language = (token as any).language || "en";
        session.user.createdAt = (token as any).createdAt;
      }
      return session;
    },

    // Customize JWT token payload
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name || '';
        token.email = user.email || '';
        token.picture = user.image || null;
        token.language = (user as any).language || "en";
        token.createdAt = (user as any).createdAt;
      }

      // Update token on session update
      if (trigger === "update" && session?.user) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub! }
        });

        if (updatedUser) {
          token.picture = updatedUser.image;
          token.name = session.user.name || token.name;
          token.email = session.user.email || token.email;
          token.language = (session.user as any).language || token.language;
          token.createdAt = updatedUser.createdAt;
        }
      }

      return token;
    }
  }
};

export default authOptions;