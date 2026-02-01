import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER = process.env.ARES_BASIC_USER || 'bryce';
const PASS = process.env.ARES_BASIC_PASS || 'CHANGE_ME_NOW';

export function middleware(req: NextRequest) {
  // Allow health checks without auth
  if (req.nextUrl.pathname.startsWith('/health')) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Ares Control"' },
    });
  }

  const b64 = auth.slice('Basic '.length);
  const [u, p] = Buffer.from(b64, 'base64').toString('utf8').split(':');
  if (u !== USER || p !== PASS) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Ares Control"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
