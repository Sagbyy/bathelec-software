import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/protected', '/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  console.log(request);
  const token = request.cookies.get('token')?.value;

  if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*', '/profile/:path*'],
};