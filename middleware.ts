import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/' },
  secret: process.env.NEXTAUTH_SECRET,
})

export const config = {
  matcher: ['/edit', '/edit/:path*', '/download', '/download/:path*'],
}


