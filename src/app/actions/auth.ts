'use client'

import {createSession, deleteSession} from "@/app/lib/session"
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "../../../config/firebase"

export async function signIn(data: { [p: string]: FormDataEntryValue }) {
    try {
        const result = await signInWithEmailAndPassword(auth, data.email.toString(), data.password.toString())
        if (result.user.uid) {
            await createSession(result.user.uid, data.rememberMe !== undefined)
        }
    } catch (error) {
        console.error('signIn error', error)
    }
}

export async function logout() {
    try {
        await auth.signOut()
        deleteSession()
    } catch (error) {
        console.error('Error signing out', error)
    }
}
