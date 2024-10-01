'use server'

import 'server-only'
import {cookies} from "next/headers"
import {jwtVerify, SignJWT} from "jose"
import {redirect} from "next/navigation"

type SessionPayload = {
    uid: string
    rememberMe: boolean
}

const cookie = {
    name: '__session',
    expirationTime: '1d',
    expirationTimeLong: '7d',
    maxAge: 24 * 60 * 60 * 1000,
    maxAgeLong: 7 * 24 * 60 * 60 * 1000
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(payload.rememberMe ? cookie.expirationTimeLong : cookie.expirationTime)
        .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createSession(uid: string, rememberMe = false) {
    const time = rememberMe ? cookie.maxAgeLong : cookie.maxAgeLong
    const expiresAt = new Date(Date.now() + time)
    const session = await encrypt({uid, rememberMe})
    cookies().set(cookie.name, session, {
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV !== 'development',
        expires: expiresAt,
        sameSite: 'none',
        path: '/',
        domain: process.env.NODE_ENV !== 'development' ? '.dampfwage.ch' : undefined,
    })
    redirect('/dashboard')
}

// used to get user name
export async function getSession() {
    const cookieStore = cookies()
    const token = cookieStore.get('session-token')?.value

    if (!token) {
        return null; // No session
    }

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null; // Invalid session
    }
}

export async function deleteSession() {
    cookies().delete(cookie.name)
    redirect('/login')
}
