import { auth } from '@/auth'

export default auth((req) => {
  if (req.nextUrl.pathname === '/admin/login') return

  if (!req.auth) {
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
