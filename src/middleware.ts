import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);
const COOKIE_NAME = 'admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Protect /api/admin/* routes
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
