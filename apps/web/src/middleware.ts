import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  HOME_PATH,
  LOGIN_PATH,
  SESSION_COOKIE_NAME,
  isProtectedPath,
  isRoleAllowedForPath,
} from '@/shared/config/access-control';
import { verifySessionToken } from '@/shared/lib/verify-session-token';

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function withoutStaleSession(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
    process.env.JWT_SECRET
  );

  if (pathname === LOGIN_PATH) {
    if (session) return redirectTo(request, HOME_PATH);
    return withoutStaleSession(NextResponse.next(), request);
  }

  if (!isProtectedPath(pathname)) return NextResponse.next();

  if (!session) {
    return withoutStaleSession(redirectToLogin(request), request);
  }

  if (!isRoleAllowedForPath(session.role, pathname)) {
    return redirectTo(request, HOME_PATH);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/protected/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth',
  ],
};
