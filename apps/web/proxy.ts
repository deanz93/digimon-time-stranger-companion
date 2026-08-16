import { NextResponse, type NextRequest } from 'next/server';

/**
 * Chrome DevTools discovers local workspaces through this well-known URL.
 *
 * The development server runs inside WSL, so Next.js advertises a Linux path
 * (`/root/...`) that Chrome on Windows cannot mount. Returning 404 for only
 * this optional discovery request prevents the noisy "<illegal path>" warning.
 */
export function proxy(_request: NextRequest) {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: '/.well-known/appspecific/com.chrome.devtools.json',
};
