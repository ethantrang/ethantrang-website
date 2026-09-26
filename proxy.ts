import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only the home page is public for now. Admin, media and content pages
// still work on localhost; everywhere else they redirect to /.
export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (!isLocalhost) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).+)'],
};
