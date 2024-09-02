'use client'

import {useRouter, usePathname, useSearchParams} from "next/navigation"
import AnfragePage from './[id]/page'
import {Button, Input} from "@nextui-org/react"
import React, {useState} from "react"
import SearchIcon from '@mui/icons-material/Search'

export default function MeineAnfragen() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const id = useSearchParams().get('buchungId')
    const [bookingId, setBookingId] = useState(id ? id?.toString() : '')
    const [inputError, setInputError] = useState(false)

    const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault()
        if (bookingId.length < 4) {
            return setInputError(true)
        }
        setInputError(false)
        const params = new URLSearchParams(searchParams.toString())
        params.set('buchungId', bookingId)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
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
                        />
                        <Button
                            isIconOnly
                            variant="solid"
                            color="primary"
                            type="submit"
                            aria-label="Buchung ID suchen"
                        ><SearchIcon/></Button>
                    </div>
                </div>
            </form>
            {id && <AnfragePage id={id}/>}
        </div>
    )
}
