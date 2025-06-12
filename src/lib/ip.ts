import { headers } from "next/headers"
import { type NextRequest } from "next/server"

/**
 * Analyses the IP address from a Headers object.
 * @param headers - The Headers object of the request.
 * @returns The IP address of the client or 'unknown'.
 */
function getIPFromHeaders(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get('x-forwarded-for');
  // The 'x-forwarded-for' header can contain a list of IPs separated by commas.
  // The first one in the list is the original client IP.
  const firstIP = forwardedFor?.split(',')[0]?.trim();

  return (
    // Headers specific to providers (more reliable)
    requestHeaders.get('cf-connecting-ip') || // Cloudflare
    requestHeaders.get('x-vercel-forwarded-for') || // Vercel
    
    // Default header
    firstIP ||

    // Other common proxy headers
    requestHeaders.get('x-real-ip') || // Nginx
    requestHeaders.get('x-client-ip') ||
    
    // Fallbacks (if all else fails)
    requestHeaders.get('x-forwarded') ||
    requestHeaders.get('forwarded-for') ||
    requestHeaders.get('forwarded') || // RFC 7239
    requestHeaders.get('remote-addr') || // Last resort
    'unknown'
  );
}

/**
 * Gets the client IP address from the request headers.
 * * Use this function in Server Components, Route Handlers (App Router) and Server Actions.
 *
 * @returns The IP address of the client as a string.
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return getIPFromHeaders(headersList);
}

/**
  * Gets the client IP address from a NextRequest object.
  * * Use this function in Middleware and Edge API Routes.
  * For Middleware, the `request.ip` property is usually the simplest way.
  *
  * @param request - The NextRequest object.
  * @returns The IP address of the client as a string.
  */
export async function getClientIPFromRequest(request: NextRequest): Promise<string> {
  return getIPFromHeaders(request.headers);
}