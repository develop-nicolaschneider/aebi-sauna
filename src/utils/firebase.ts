'use server'

import {db} from "../../config/firebase"
import {collection, doc, serverTimestamp, writeBatch} from "@firebase/firestore"
import BookingState from "@/utils/BookingState"
import {redirect} from "next/navigation"
import {AnfrageFormSchema} from "@/utils/AnfrageFormSchema";

const addBooking = async (data:  {[p: string]: FormDataEntryValue}) => {
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
        console.log("transaction success")
    } catch (e: any) {
        console.log(e)
        return e.error
    }
    redirect(`/anfrage/${bookingDocRef.id}`)
}

export {addBooking}
