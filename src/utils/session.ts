'use server'

import {redirect} from "next/navigation"
import {cookies} from "next/headers"
import {auth} from "../../config/firebaseAdmin"

const cookie = {
    name: 'dampfwage-session',
    options: {httpOnly: true, secure: true, sameSite: 'lax', path: '/'},
    duration: 24 * 60 * 60, // 1day
    durationRemember: 4 * 7 * 24 * 60 * 60 * 1000, // 4weeks
}

export async function verifySession() {
    const sessionCookie = cookies().get('dampfwage-session')?.value
    if (!sessionCookie) {
        redirect('/login')
    }
    try {
        // Verify the session cookie using Firebase Admin SDK (server-side only)
        await auth.verifySessionCookie(sessionCookie, true);
        return true
        // return null
    } catch (error) {
        console.error('Session verification failed:', error)
        redirect('/login')
    }
}

export async function deleteSession() {
    cookies().delete(cookie.name)
    redirect('/login')
}
