'use client'

import ConvertToChDate from "@/utils/ConvertToChDate"
import {getBookingById} from "@/utils/firebase"
import {BookingTable} from "@/components/BookingTable"
import {useEffect, useState} from "react";

type BookingRow = {
    key: string
    description: string
    value: any
}
type AnfragePageProps = {
    id: string
}

const AnfragePage = ({id}: AnfragePageProps) => {
    const [bookingObj, setBookingObj] = useState<any>(null)
    const [bookingRows, setBookingRows] = useState<BookingRow[]>()
    const bookingColumns = [
        {key: 'description', label: 'Beschreibung'},
        {key: 'value', label: 'Wert'}
    ]

    useEffect(() => {
        (async () => {
            if (id) {
                try {
                    const data = await getBookingById(id)
                    if (data) {
                        setBookingObj(data)
                        const booking = data
                        const user = booking.user
                        const rows = [
                            {
                                key: '1',
                                description: 'Status',
                                value: booking.booking_state?.toString(),
                            },
                            {
                                key: '2',
                                description: 'Gebucht von',
                                value: ConvertToChDate(booking.booking_from?.toString())
                            },
                            {
                                key: '3',
                                description: 'Gebucht bis',
                                value: ConvertToChDate(booking.booking_to?.toString())
                            },
                            {
                                key: '4',
                                description: 'Gebucht um',
                                // value: ''
                                value: ConvertToChDate(new Date(booking.booking_date).toString(), 'ld')
                            },
                            {
                                key: '5',
                                description: 'Email',
                                value: user ? user.id?.toString() : ''
                            },
                            {
                                key: '6',
                                description: 'Telefonnummer',
                                value: user ? user.phoneNumber?.toString() : ''
                            },
                            {
                                key: '7',
                                description: 'Vorname',
                                value: user ? user.firstName : ''
                            },
                            {
                                key: '8',
                                description: 'Nachname',
                                value: user ? user.lastName : ''
                            },
                            {
                                key: '9',
                                description: 'Strasse',
                                value: user ? user.street : ''
                            },
                            {
                                key: '10',
                                description: 'Postleitzahl',
                                value: user ? user?.postalCode : ''
                            },
                            {
                                key: '11',
                                description: 'Ort',
                                value: user ? user?.city : ''
                            },
                        ]
                        setBookingRows(rows)
                    }
                } catch (error) {
                    console.log("error", error)
                }
            }
        })()
    }, [id])

    return (
        <>
            {bookingObj !== null && bookingRows ?
                <div>
                    <BookingTable rows={bookingRows} columns={bookingColumns}/>
                </div>
                :
                <div>
                    No DATA found with this id
                </div>
            }
        </>
    )
}

export default AnfragePage
