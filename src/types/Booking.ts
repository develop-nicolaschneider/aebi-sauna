import {BookingUser} from "@/types/BookingUser"

export type Booking = {
    id: string,
    booking_from: string,
    booking_to: string,
    booking_state: string,
    booking_date: string,
    remarks?: string | undefined,
    user: BookingUser | null
}
