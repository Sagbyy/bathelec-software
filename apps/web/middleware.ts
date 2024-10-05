import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Liste des chemins à protéger
const protectedRoutes = ['/protected', '/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Si le token n'existe pas, rediriger vers la page de login
  if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Si l'utilisateur est déjà authentifié, laisser la requête passer
  return NextResponse.next();
}

// Spécifier les routes où le middleware s'applique
export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*', '/profile/:path*'],
};
