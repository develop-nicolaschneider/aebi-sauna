import {
    type User as FirebaseUser, onAuthStateChanged as _onAuthStateChanged
} from 'firebase/auth'
import {auth} from "../../config/firebase"

// Firebase Authentication
export function onAuthStateChanged(callback: (authUser: FirebaseUser | null) => void) {
    return _onAuthStateChanged(auth, callback)
}
