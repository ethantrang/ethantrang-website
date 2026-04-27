import { NextRequest, NextResponse } from 'next/server';

export function requireLocalhost(request: NextRequest): NextResponse | null {
  const host = request.headers.get('host') ?? '';
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (!isLocal) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
