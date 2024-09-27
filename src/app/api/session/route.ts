import {auth} from "../../../../config/firebaseAdmin"
import {NextRequest, NextResponse} from "next/server"

export async function POST(req: NextRequest) {
    const {idToken, rememberMe} = await req.json()
    try {
        // Verify the ID token
        // await auth.verifyIdToken(idToken)
        const remember = rememberMe ? 14 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 14 days in milliseconds
        // Create session cookie with the ID token
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: remember,
        })

        // Set session cookie in response header
        const response = NextResponse.json({message: 'Session created'})
        response.cookies.set('dampfwage-session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: remember / 1000, // convert from ms to seconds
            path: '/',
            sameSite: 'strict',
        })
        if (!response.ok) {
            console.error(response)
        }
        return response
    } catch (error) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 401})
    }
}
