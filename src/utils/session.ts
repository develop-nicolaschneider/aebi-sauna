'use server'

import {jwtVerify, SignJWT} from "jose"
import {redirect} from "next/navigation"
import {cookies} from "next/headers"

type SessionPayload = {
    uid: string
    expiresAt: number
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

const cookie = {
    name: 'dampfwage-session',
    options: {httpOnly: true, secure: true, sameSite: 'lax', path: '/'},
    duration: 24 * 60 * 60, // 1day
    durationRemember: 4 * 7 * 24 * 60 * 60 * 1000, // 4weeks
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(`${payload.expiresAt} day`)
        .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function createSession(uid: string, rememberMe?: string | undefined) {
    const expiresAt = rememberMe ? 14 : 1 // 14days or 1day
    const maxAge = rememberMe ? 14 * 24 * 60 * 60 : 24 * 60 * 60
    const session = await encrypt({uid, expiresAt})
    cookies().set('dampfwage-session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAge,
        sameSite: 'lax',
        path: '/',
    })
    redirect('/dashboard')
}

export async function verifySession() {
    const myCookie = cookies().get(cookie.name)?.value
    const session = await decrypt(myCookie)
    if (!session?.uid) {
        redirect('/login')
    }
    return {isAuth: true, uid: session.uid}
}

export async function deleteSession() {
    cookies().delete(cookie.name)
    redirect('/login')
}
