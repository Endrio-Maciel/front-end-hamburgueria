import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
 const token = request.cookies.get('authToken')?.value

 const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login')
 const isProtectedPage = !isAuthPage

 if(token && isAuthPage) {
  return NextResponse.redirect(new URL('/', request.url))
 }

 if(!token && isProtectedPage) {
  return NextResponse.redirect(new URL('/auth/login', request.url))
 }

 return NextResponse.next()
}

export const config = {
 matcher: ['/', '/auth/login']
}