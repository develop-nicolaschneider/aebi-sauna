'use client'

import ConvertToChDate from "@/utils/ConvertToChDate"
import {getBookingById} from "@/utils/firebase"
import {BookingTable} from "@/components/BookingTable"
import {useEffect, useState} from "react"
import {Fade} from "react-awesome-reveal"
import {Booking} from "@/types/Booking"
import {LoadingAnimation} from "@/components/base/Loading"

type BookingRow = {
    key: string
    description: string
    value: any
}

interface AnfragePageProps {
    params: {
        id: string
    }
}

const AnfragePage = ({params}: AnfragePageProps) => {
    const {id} = params;
    const [loading, setLoading] = useState(true);
    const [bookingObj, setBookingObj] = useState<Booking | null>(null)
    const [bookingRows, setBookingRows] = useState<BookingRow[]>()
    const bookingColumns = [
        {key: 'description', label: 'Beschreibung'},
        {key: 'value', label: 'Wert'}
    ]

    useEffect(() => {
        (async () => {
            setLoading(true)
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
                                description: 'Buchungsstatus',
                                value: booking.booking_state?.toString(),
                            },
                            {
                                key: '2',
                                description: 'Email',
                                value: user ? user.id?.toString() : ''
                            },
                            {
                                key: '3',
                                description: 'Telefonnummer',
                                value: user ? user.phoneNumber?.toString() : ''
                            },
                            {
                                key: '4',
                                description: 'Vorname',
                                value: user ? user.firstName : ''
                            },
                            {
                                key: '5',
                                description: 'Nachname',
                                value: user ? user.lastName : ''
                            },
                            {
                                key: '6',
                                description: 'Strasse',
                                value: user ? user.street : ''
                            },
                            {
                                key: '7',
                                description: 'Postleitzahl',
                                value: user ? user?.postalCode : ''
                            },
                            {
                                key: '8',
                                description: 'Ort',
                                value: user ? user?.city : ''
                            },
                            {
                                key: '9',
                                description: 'Gebucht von',
                                value: booking.booking_from !== '' ?
                                    ConvertToChDate(booking.booking_from?.toString()) as string :
                                    <span className="italic">Kein Datum gewählt</span>
                            },
                            {
                                key: '10',
                                description: 'Gebucht bis',
                                value: booking.booking_to !== '' ?
                                    ConvertToChDate(booking.booking_to?.toString()) as string :
                                    <span className="italic">Kein Datum gewählt</span>
                            },
                            {
                                key: '11',
                                description: 'Gebucht um',
                                // value: ''
                                value: ConvertToChDate(new Date(booking.booking_date).toString(), 'ld') as string
                            },
                            {
                                key: '12',
                                description: 'Bemerkungen',
                                value: booking.remarks ? booking.remarks : '-'
                            }
                        ]
                        setBookingRows(rows)
                    } else {
                        setBookingObj(null)
                    }
                } catch (error) {
                    console.error("error", error)
                }
            } else {
                setBookingObj(null)
            }
            setLoading(false)
        })()
    }, [id])

    return (
        <div className="grid grid-flow-col justify-items-center">
            {loading ? (
                <LoadingAnimation label="Anfrage suchen..."/>
            ) : bookingObj !== null && bookingRows ? (
                <Fade triggerOnce duration={500}>
                    <BookingTable rows={bookingRows} columns={bookingColumns}/>
                </Fade>
            ) : (
                <div className="font-medium text-xs sm:text-sm lg:text-base">
                    Keine Anfrage mit dieser ID gefunden
                </div>
            )}
        </div>
    )
}

export default AnfragePage
