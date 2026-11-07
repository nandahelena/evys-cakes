import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/dashboard/session';

// Protege o painel: /dashboard/* exige sessão válida; /login redireciona quem já está logada.
export function proxy(request: NextRequest) {
  const logged = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !logged) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/login' && logged) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
