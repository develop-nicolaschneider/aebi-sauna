'use server'

import {BookingState} from "@/types/BookingState"
import {AnfrageFormSchema} from "@/app/lib/AnfrageFormSchema"
import {verifySession} from "@/app/lib/dal"
import {BookingUser} from "@/types/BookingUser"
import {Booking} from "@/types/Booking"
import {db} from "../../config/firebaseAdmin"
import {typeToFlattenedError, undefined} from "zod"

interface ValidationError {
    type: 'validation'
    error: typeToFlattenedError<{
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: number,
        street: string,
        postalCode: number,
        city: string,
        booking_from: Date,
        booking_to: Date,
        regulations: string,
        remarks?: string | undefined
    }>
}

interface ServerError {
    type: 'server'
    message: string
}

interface BookingSuccess {
    type: 'success'
    booking: Booking
}

const addBooking = async (data: { [p: string]: FormDataEntryValue })
    : Promise<ValidationError | ServerError | BookingSuccess> => {
    const result = AnfrageFormSchema.safeParse(data)
    if (!result.success) {
        return {
            type: 'validation',
            error: result.error.flatten()
        }
    }
    const userData = {
        firstName: data.firstName.toString(),
        lastName: data.lastName.toString(),
        phoneNumber: data.phoneNumber.toString(),
        street: data.street.toString(),
        postalCode: data.postalCode.toString(),
        city: data.city.toString(),
    }
    const bookingData = {
        booking_date: new Date().toISOString(),
        booking_state: BookingState.PENDING.toString(),
        booking_from: data.booking_from.toString(),
        booking_to: data.booking_to.toString(),
        remarks: data.remarks.toString(),
    }
    let booking: Booking | null = null
    let bookingId = ''
    try {
        await db.runTransaction(async transaction => {
            const userDocRef = db.collection('users').doc(result.data.email)
            const bookingDocRef = db.collection('bookings').doc()
            const bookingToAdd = {
                ...bookingData,
                user: userDocRef,
            }
            bookingId = bookingDocRef.id
            transaction.set(userDocRef, userData)
            transaction.set(bookingDocRef, bookingToAdd)
        })
        const user = {
            ...userData,
            id: result.data.email,
            email: result.data.email,
        } as BookingUser
        booking = {
            ...bookingData,
            id: bookingId,
            user: user
        } as Booking
    } catch (error) {
        if (error instanceof Error) {
            return {
                type: 'server',
                message: error.message
            }
        } else {
            return {
                type: 'server',
                message: 'Unerwarteter Server Error'
            }
        }
    }
    if (booking !== null) {
        return {
            type: 'success',
            booking: booking
        }
    } else {
        return {
            type: 'server',
            message: 'Unerwarteter Server Error'
        }
    }

}

const getUserByRef = async (userDocRef: any): Promise<BookingUser | null> => {
    let user: any | null = null
    const userDocSnap = await userDocRef.get()
    if (userDocSnap.exists)
        user = {id: userDocSnap.id, ...userDocSnap.data() as BookingUser | null}
    return user
}

const getBookingById = async (id: string): Promise<Booking | null> => {
    let booking: any | null = null
    const bookingDocRef = db.collection('bookings').doc(id)
    // const bookingDocRef = doc(db, 'bookings', id)
    const bookingDocSnap = await bookingDocRef.get()
    if (bookingDocSnap.exists)
        booking = {id: bookingDocSnap.id, ...bookingDocSnap.data() as Booking | null}
    if (!booking) return null
    const user = await getUserByRef(booking.user)
    if (!user) return null
    booking.booking_date = booking.booking_date.toString()
    booking.user = user
    return booking
}

const getBookings = async (datesOnly = true): Promise<Booking[] | null> => {
    let verified = false
    if (!datesOnly) {
        await verifySession()
        verified = true
    }
    const bookingsRef = db.collection('bookings')
    const bookingsSnap = await bookingsRef.orderBy('booking_from', 'asc').get()
    const bookingsSnapWithSelect = await bookingsRef.orderBy('booking_from', 'asc').select('booking_from', 'booking_to').get()
    if (verified) {
        return await Promise.all(bookingsSnap.docs.map(async (booking) => {
            let user: BookingUser | null = await getUserByRef(booking.get('user'))
            return {
                id: booking.id,
                booking_from: booking.get('booking_from')?.toString() as string ?? '',
                booking_to: booking.get('booking_to')?.toString() as string ?? '',
                booking_state: booking.get('booking_state')?.toString() as string ?? '',
                booking_date: booking.get('booking_date')?.toString() as string ?? '',
                remarks: booking.get('remarks') !== undefined ? booking.get('remarks') as string : undefined,
                user: user,
            } as Booking
        }))
    } else {
        return await Promise.all(bookingsSnapWithSelect.docs.map(async (booking) => {
            return {
                id: booking.id,
                booking_from: booking.get('booking_from')?.toString() as string ?? '',
                booking_to: booking.get('booking_to')?.toString() as string ?? ''
            } as Booking
        }))
    }
}

const updateBookingState = async (id: string, state: string) => {
    try {
        const bookingDocRef = db.collection('bookings').doc(id)
        if (!bookingDocRef) return false
        await bookingDocRef.update({
            booking_state: state
        })
        return true
    } catch (error) {
        return false
    }
}

const updateBooking = async (data: { [p: string]: FormDataEntryValue }) => {
    await verifySession()
    const result = AnfrageFormSchema.safeParse(data)
    if (!result.success) {
        return result.error.flatten()
    }
    const bookingId = data.id as string
    try {
        await db.runTransaction(async transaction => {
            if (data.email as string && data.id as string) {
                const userDocRef = db.collection('users').doc(data.email as string)
                const userData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    street: data.street,
                    postalCode: data.postalCode,
                    city: data.city,
                }
                transaction.update(userDocRef, userData)
                const bookingDocRef = db.collection('bookings').doc(data.id as string)
                const bookingData = {
                    remarks: data.remarks,
                    booking_from: data.booking_from,
                    booking_to: data.booking_to,
                    user: userDocRef,
                }
                transaction.update(bookingDocRef, bookingData)
                return result
            }
        })
    } catch (error) {
        console.error(error)
    }
    return bookingId
}

const deleteBooking = async (id: string) => {
    await verifySession()
    const docRef = db.collection('bookings').doc(id)
    await docRef.delete()
}

export {addBooking, getBookingById, getBookings, updateBookingState, updateBooking, deleteBooking}
