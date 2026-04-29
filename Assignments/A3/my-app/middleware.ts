import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-change-in-production-12345');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // STRICT ROLE-BASED ROUTING:
    // If user tries to access admin routes but is an agent -> redirect to agent dashboard
    // If user tries to access agent routes but is an admin -> redirect to admin dashboard
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/agent/dashboard', request.url));
    }

    if (pathname.startsWith('/agent') && role !== 'agent') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Rate limiting for API routes
    if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
      const identifier = (payload.userId as string) || 'unknown';
      const windowMs = 60000;
      const maxRequests = role === 'admin' ? 1000 : 50;

      const rateLimitKey = `rl_${identifier}`;
      const now = Date.now();

      const rlCookie = request.cookies.get(rateLimitKey)?.value;
      let count = 0;
      let resetTime = now + windowMs;

      if (rlCookie) {
        try {
          const parsed = JSON.parse(rlCookie);
          if (parsed.resetTime > now) {
            count = parsed.count;
            resetTime = parsed.resetTime;
          }
        } catch {
          // Invalid cookie, reset
        }
      }

      count++;

      if (count > maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      const response = NextResponse.next();
      response.cookies.set(rateLimitKey, JSON.stringify({ count, resetTime }), {
        httpOnly: true,
        maxAge: 60,
      });
      return response;
    }

    return NextResponse.next();
  } catch {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
