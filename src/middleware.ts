import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Export the default middleware from 'next-auth'
export { default } from 'next-auth/middleware';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request});
  const url = request.nextUrl;

  // Redirect authenticated users away from sign-in, sign-up, and verify pages
  if (
    token && (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not authenticated and is trying to access protected routes, redirect to sign-in page
  if (
    !token && (
      url.pathname.startsWith('/dashboard')
    )
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow the request to proceed if none of the conditions are met
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/',
    '/sign-up',
    '/sign-in',
    '/verify/:path*'
  ]
};
