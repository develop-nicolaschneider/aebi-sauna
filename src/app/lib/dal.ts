'use server'

import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import {redirect} from "next/navigation"
import { cache } from 'react'

export const verifySession = cache(async () => {
    const cookie = cookies().get('__session')?.value
    const session = await decrypt(cookie)

    if (!session?.uid) {
        redirect('/login')
    }
    return { isAuth: true, userId: session.userId }
})