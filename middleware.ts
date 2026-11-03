import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const pathname = request.nextUrl.pathname
  headers.set(
    'x-resume-locale',
    pathname === '/resume/ko' || pathname.startsWith('/resume/ko/')
      ? 'ko'
      : 'en',
  )
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/resume/:path*'],
}
