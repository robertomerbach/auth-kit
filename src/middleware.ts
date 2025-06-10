import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't need authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',  
  '/api/auth'
]

// Authentication routes that should redirect to home if the user is logged in
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password'
]

// Routes that are always public even starting with /api
const publicApiRoutes = [
  '/api/auth'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token first to avoid multiple calls
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // If the user is logged in and tries to access authentication routes, redirect to home
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if it's an API route
  const isApiRoute = pathname.startsWith('/api')
  
  // If it's an API route that's not in the list of public APIs, check the token
  if (isApiRoute && !publicApiRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return NextResponse.next()
  }

  // For normal routes (non-API), check the token
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure in which paths the middleware will be executed
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/ (Next.js internals)
     * 2. /static (static files)
     * 3. /favicon.ico, sitemap.xml (public files)
     */
    '/((?!_next/|static/|favicon.ico|sitemap.xml).*)',
  ],
} 