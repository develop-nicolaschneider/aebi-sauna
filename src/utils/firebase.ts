'use server'

import {db} from "../../config/firebase"
import {collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc, writeBatch} from "@firebase/firestore"
import {BookingState} from "@/utils/BookingState"
import {redirect} from "next/navigation"
import {AnfrageFormSchema} from "@/utils/AnfrageFormSchema"
import {createSession, deleteSession, verifySession} from "@/utils/session"
import {LoginFormSchema} from "@/utils/LoginFormSchema"
import bcrypt from "bcrypt"

export type BookingUser = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    street: string,
    postalCode: string,
    city: string,
}
export type Booking = {
    id: string,
    booking_from: string,
    booking_to: string,
    booking_state: string,
    booking_date: string,
    user: BookingUser | null
}

const addBooking = async (data: { [p: string]: FormDataEntryValue }, doRedirect = true) => {
    const result = AnfrageFormSchema.safeParse(data)
    if (!result.success) {
        return result.error.flatten()
    }
    const transaction = writeBatch(db)
    const userDocRef = doc(db, 'users', result.data.email)
    const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
    }
    transaction.set(userDocRef, userData)
    const bookingDocRef = doc(collection(db, 'bookings'))
    const bookingData = {
        booking_date: serverTimestamp(),
        booking_state: BookingState.PENDING,
        booking_from: data.booking_from,
        booking_to: data.booking_to,
        user: userDocRef,
    }
    transaction.set(bookingDocRef, bookingData)
    try {
        await transaction.commit()
    } catch (e: any) {
        console.error(e)
        return e?.error?.toString()
    }
    if (doRedirect)
        redirect(`/anfrage/meine-anfrage?buchungId=${bookingDocRef.id}`)
    return result
}

const getUserByRef = async (userDocRef: any): Promise<BookingUser | null> => {
    let user: any | null = null
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists())
        user = {id: userDocSnap.id, ...userDocSnap.data() as BookingUser | null}
    return user
}

const getBookingById = async (id: string): Promise<Booking | null> => {
    let booking: any | null = null
    const bookingDocRef = doc(db, 'bookings', id)
    const bookingDocSnap = await getDoc(bookingDocRef)
    if (bookingDocSnap.exists())
        booking = {id: bookingDocSnap.id, ...bookingDocSnap.data() as Booking | null}
    if (!booking) return null
    const user = await getUserByRef(booking.user)
    if (!user) return null
    booking.booking_date = booking.booking_date.toDate().toString()
    booking.user = user
    return booking
}

const getBookings = async (datesOnly = true): Promise<Booking[] | null> => {
    let verified = false
    if (!datesOnly) {
        await verifySession()
        verified = true
    }
    const bookingsRef = collection(db, 'bookings')
    const bookingsSnap = await getDocs(bookingsRef)
    return await Promise.all(bookingsSnap.docs.map(async (booking) => {
            if (verified) {
                let user: BookingUser | null = await getUserByRef(booking.get('user'))
                return {
                    id: booking.id,
                    booking_from: booking.get('booking_from')?.toString() as string ?? '',
                    booking_to: booking.get('booking_to')?.toString() as string ?? '',
                    booking_state: booking.get('booking_state')?.toString() as string ?? '',
                    booking_date: booking.get('booking_date')?.toDate()?.toString() as string ?? '',
                    user: user,
                } as Booking
            }
            return {
                id: booking.id,
                booking_from: booking.get('booking_from')?.toString() as string ?? '',
                booking_to: booking.get('booking_to')?.toString() as string ?? ''
            } as Booking
        }
    ))
}

const updateBookingState = async (id: string, state: string) => {
    try {
        const bookingDocRef = doc(db, 'bookings', id)
        if (!bookingDocRef) return false
        await updateDoc(bookingDocRef, {
            booking_state: state
        })
        return true
    } catch (error) {
        return false
    }
}

const updateBooking = async (data: { [p: string]: FormDataEntryValue }) => {
    const result = AnfrageFormSchema.safeParse(data)
    if (!result.success) {
        return result.error.flatten()
    }
    const transaction = writeBatch(db)
    if (data.email as string &&  data.id as string) {
        const userDocRef = doc(db, 'users', data.email as string)
        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            street: data.street,
            postalCode: data.postalCode,
            city: data.city,
        }
        transaction.set(userDocRef, userData)
        const bookingDocRef = doc(db, 'bookings', data.id as string)
        const bookingData = {
            booking_from: data.booking_from,
            booking_to: data.booking_to,
            user: userDocRef,
        }
        transaction.update(bookingDocRef, bookingData)
        try {
            await transaction.commit()
        } catch (e: any) {
            console.error(e)
            return e?.error?.toString()
        }
        return result
    }
}

const deleteBooking = async (id: string) => {
    const docRef = doc(db, 'bookings', id)
    await deleteDoc(docRef)
}

const login = async (data: { [p: string]: FormDataEntryValue }) => {
    let errorMessage = 'Email oder Passwort ungültig'
    let admin: any | null | undefined = null
    if (!data) return errorMessage

    const result = LoginFormSchema.safeParse(data)
    if (!result.success) return errorMessage

    const adminDocRef = doc(db, 'admins', data.email.toString())
    const adminDocSnap = await getDoc(adminDocRef)
    if (adminDocSnap.exists())
        admin = {id: adminDocSnap.id, ...adminDocSnap.data() as Object | undefined}
    // Check if admin exists
    if (!admin) return errorMessage
    const passwordMatch = await bcrypt.compare(
        data.password.toString(),
        admin.password
    )
    // Check if passwords match
    if (!passwordMatch) return errorMessage
    // Create Session -> redirect
    await createSession(admin.email.toString())
    return ''
}

export async function logout() {
    await deleteSession()
}

export {addBooking, getBookingById, getBookings, updateBookingState, updateBooking, deleteBooking, login}
