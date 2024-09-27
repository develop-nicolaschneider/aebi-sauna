'use client'

import {useRouter, usePathname, useSearchParams} from "next/navigation"
import AnfragePage from './[id]/page'
import {Button, Input} from "@nextui-org/react"
import React, {useEffect, useState} from "react"
import SearchIcon from '@mui/icons-material/Search'
import {Link} from "@nextui-org/link"
import {BookingState} from "@/types/BookingState"
import NextLink from "next/link"
import {Fade} from "react-awesome-reveal"

export default function MeineAnfragen() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const id = useSearchParams().get('buchungId')
    const [bookingId, setBookingId] = useState(id !== null ? id.toString() : '')
    const [inputError, setInputError] = useState(false)

    const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault()
        if (bookingId.length < 4) {
            setInputError(true)
            router.push(`${pathname}`)
            return
        }
        setInputError(false)
        const params = new URLSearchParams(searchParams.toString())
        params.set('buchungId', bookingId)
        router.push(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
        if (id !== null) {
            setBookingId(id)
        } else {
            setBookingId('')
        }
    }, [id])

    return (
        <Fade triggerOnce className="grow">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl md:col-span-2">
                    Prüfe Deine Anfrage
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 md:col-span-2 text-center">
                    Hast Du den Dampfwagen bereits angefragt, kannst Du hier Deine Anfrage jederzeit prüfen.<br/>
                    <span className="font-bold">
                        Noch keine Anfrage gesendet?
                        <Link
                            href="/anfrage"
                            as={NextLink}
                            isBlock
                            color="primary"
                            className="text-xs sm:text-xs md:text-sm lg:text-base">
                            &nbsp;Frage den Dampfwagen jetzt an.
                        </Link>
                    </span><br/>
                    Sobald der Status als<span className="italic">&nbsp;{BookingState.CONFIRMED}&nbsp;</span>erscheint,
                    liefere ich den Dampfwagen wie vereinbart zu Dir.<br/>
                    Deine Buchung ID steht in der Email, welche Du nach dem Senden der Anfrage erhalten hast.
                </p>
                <form onSubmit={handleSubmit}
                      className="flex flex-col gap-1 md:col-span-2 justify-items-center">
                    <div className="flex justify-between gap-3">
                        <Input
                            name="bookingId"
                            id="bookingId"
                            key="bookingId"
                            title="Buchung ID"
                            type="text"
                            variant="flat"
                            placeholder="Buchung ID"
                            value={bookingId}
                            onValueChange={setBookingId}
                            isClearable
                            isInvalid={inputError}
                            errorMessage={"Buchung ID ungültig"}
                            startContent={<SearchIcon/>}
                            autoComplete="off"
                            className="min-w-48 max-w-64 sm:w-64"
                        />
                        <Button
                            isIconOnly
                            variant="solid"
                            color="primary"
                            type="submit"
                            aria-label="Buchung ID suchen"
                        ><SearchIcon/></Button>
                    </div>
                </form>
            </div>
            {id &&
                <AnfragePage params={{id}}/>
            }
        </Fade>
    )
}
