import {NextRequest, NextResponse} from "next/server"
import {cookies} from "next/headers"
import {decrypt} from "@/utils/session"

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const cookie = cookies().get('dampfwage-session')?.value
    const session = await decrypt(cookie)
    if (isProtectedRoute && !session?.uid) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    return NextResponse.next()
}
