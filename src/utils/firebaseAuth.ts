import {
    type User as FirebaseUser, onAuthStateChanged as _onAuthStateChanged, signInWithEmailAndPassword
} from 'firebase/auth'
import {auth} from "../../config/firebase"
import {LoginFormSchema} from "@/utils/LoginFormSchema"

// Firebase Authentication
export function onAuthStateChanged(callback: (authUser: FirebaseUser | null) => void) {
    return _onAuthStateChanged(auth, callback)
}

export async function signIn(data: { [p: string]: FormDataEntryValue }) {
    if (!data) return undefined
    const result = LoginFormSchema.safeParse(data)
    if (!result.success) return undefined
    try {
        const result = await signInWithEmailAndPassword(auth, data.email.toString(), data.password.toString())
        return result.user
    } catch (error) {
        console.error(error)
    }
}

export async function signOut() {
    try {
        await auth.signOut()
    } catch (error) {
        console.error('Error signing out', error)
    }
}
