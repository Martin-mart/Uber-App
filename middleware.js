import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token');

  const url = req.nextUrl.clone();

  if (!token && url.pathname !== '/login' && url.pathname !== '/signup') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};

