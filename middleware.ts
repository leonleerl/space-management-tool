import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET

  // Try default detection first
  let token = await getToken({ req, secret })

  // Fallback: explicitly try both cookie names in case proxy headers confuse secureCookie detection
  if (!token) {
    token = await getToken({ req, secret, cookieName: 'next-auth.session-token' })
  }
  if (!token) {
    token = await getToken({ req, secret, cookieName: '__Secure-next-auth.session-token' })
  }
  
  if (!token) {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/edit', '/edit/:path*', '/download', '/download/:path*'],
}


