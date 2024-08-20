'use server'

import {db} from "../../config/firebase"
import {collection, doc, getDoc, serverTimestamp, writeBatch} from "@firebase/firestore"
import BookingState from "@/utils/BookingState"
import {redirect} from "next/navigation"
import {AnfrageFormSchema} from "@/utils/AnfrageFormSchema"

const addBooking = async (data: { [p: string]: FormDataEntryValue }) => {
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
        console.log("transaction success")
        await transaction.commit()
    } catch (e: any) {
        console.error(e)
        return e.error
    }
    redirect(`/anfrage/meine-anfragen?buchungId=${bookingDocRef.id}`)
}

// const getBookingById: ({params: {id}}: { params: { id: string } }) => Promise<any> = async ({params: {id}}: {
//     params: { id: string }
// }) => {
const getBookingById = async (id: string) => {
    let booking: any | null = null
    let user: any | null | undefined = null
    const bookingDocRef = doc(db, 'bookings', id)
    console.log('bookingDocRef', bookingDocRef)
    const bookingDocSnap = await getDoc(bookingDocRef)
    console.log("bookingDocSnap", bookingDocSnap.exists())
    if (bookingDocSnap.exists())
        booking = {id: bookingDocSnap.id, ...bookingDocSnap.data() as Object | undefined}
    if (!booking) return null
    const userDocRef = booking.user
    const userDocSnap = await getDoc(userDocRef)
    if (bookingDocSnap.exists())
        user = {id: userDocSnap.id, ...userDocSnap.data() as Object | undefined}
    if (!user) return null
    booking.booking_date = booking.booking_date.toDate()
    booking.user = user
    return {booking}
}

export {addBooking, getBookingById}
