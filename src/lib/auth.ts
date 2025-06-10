import prisma from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { compare } from "bcryptjs"

import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"

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
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Email or password incorrect")
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return user
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Get profile image from Google profile data
        const googleImage = account?.provider === "google" 
          ? (profile as { picture?: string })?.picture || undefined
          : undefined;

        // Check if user exists
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        // For Google sign in
        if (account?.provider === "google") {
          if (!dbUser) {
            // Create new user directly in database
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: googleImage,
                emailVerified: new Date(),
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  }
                }
              }
            });
            return true;
          }

          // If user exists but doesn't have Google account linked
          if (!dbUser.accounts.find(acc => acc.provider === "google")) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
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
          return true;
        }

        // For other providers, only allow if user exists
        return !!dbUser;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub }
        });

        if (user) {
          session.user.id = token.sub;
          session.user.name = user.name || '';
          session.user.email = user.email || '';
          session.user.image = user.image || null;
          session.user.language = user.language || "en";
          session.user.createdAt = user.createdAt;
        }
      }
      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name || '';
        token.email = user.email || '';
        token.picture = user.image || null;
        token.language = user.language || "en";
        token.createdAt = user.createdAt;
      }

      if (trigger === "update" && session?.user) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub! }
        });
        
        if (updatedUser) {
          token.picture = updatedUser.image;
          token.name = session.user.name || token.name;
          token.email = session.user.email || token.email;
          token.language = session.user.language || token.language;
          token.createdAt = updatedUser.createdAt;
        }
      }

      return token;
    }
  }
};

export default authOptions;