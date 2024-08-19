import {doc, getDoc} from "@firebase/firestore"
import {db} from "../../../../config/firebase"
import ConvertToChDate from "@/utils/ConvertToChDate"

export const dynamic = 'force-dynamic'

const AnfragePage = async ({params: {id}}: { params: { id: string } }) => {
    let booking: any | null = null
    let user: any | null | undefined = null
    const bookingDocRef = doc(db, 'bookings', id)
    const bookingDocSnap = await getDoc(bookingDocRef)

    if (bookingDocSnap.exists()) booking = {id: bookingDocSnap.id, ...bookingDocSnap.data()}
    if (!booking) {
        return (
            <h1>
                Keine Anfrage mit dieser ID!
            </h1>
        )
    }

    const userDocRef = booking.user
    const userDocSnap = await getDoc(userDocRef)
    if (bookingDocSnap.exists()) user = {id: userDocSnap.id, ...userDocSnap.data() as Object | undefined}
    if (!user) {
        return (
            <h1>
                Keine Anfrage mit diesem User!
            </h1>
        )
    }

    return (
        <div>
            <label>Danke {user.firstName} für Deine Anfrage!</label><br/>
            <label>Anfrage ID: {booking.id}</label><br/>
            <label>von: {user.id}</label><br/>
            <label>Anfrage-Status: {booking.booking_state}</label><br/>
            <label>Vom: {ConvertToChDate(booking.booking_from)}</label><br/>
            <label>Bis: {ConvertToChDate(booking.booking_to)}</label><br/>
            <label>Angefragt am: {ConvertToChDate(booking.booking_date.toDate(), true)}</label><br/>
        </div>
    )
}

export default AnfragePage
