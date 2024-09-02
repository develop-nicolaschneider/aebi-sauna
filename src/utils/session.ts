'use server'

import {jwtVerify, SignJWT} from "jose";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

type SessionPayload = {
    userId: string
    expiresAt: Date
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

const cookie = {
    name: 'session.dampfwage.ch',
    options: {httpOnly: true, secure: true, sameSite: 'lax', path: '/'},
    duration: 60 * 60 * 1000
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1hr')
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

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + cookie.duration)
    const session = await encrypt({userId, expiresAt})
    cookies().set(cookie.name, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    redirect('/dashboard')
}

export async function verifySession() {
    const myCookie = cookies().get(cookie.name)?.value
    const session = await decrypt(myCookie)
    if (!session?.userId) {
        redirect('/login')
    }
    return {isAuth: true, userId: session.userId}
}

export async function deleteSession() {
    cookies().delete(cookie.name)
    redirect('/login')
}
