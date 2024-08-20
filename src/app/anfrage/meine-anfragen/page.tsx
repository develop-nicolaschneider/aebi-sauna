'use client'

import {useRouter, usePathname, useSearchParams} from "next/navigation"
import AnfragePage from './[id]/page'
import {Button, Input} from "@nextui-org/react"
import {useState} from "react"
import SearchIcon from '@mui/icons-material/Search'

export default function MeineAnfragen() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const id = useSearchParams().get('buchungId')
    const [bookingId, setBookingId] = useState(id ? id?.toString() : '')
    const [inputError, setInputError] = useState(false)
    const handleSubmit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
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
                <Input
                    name="bookingId"
                    id="bookingId"
                    key="bookingId"
                    label="Buchung ID"
                    title="Buchung ID"
                    type="text"
                    variant="flat"
                    placeholder="Buchung ID"
                    size="sm"
                    value={bookingId}
                    onValueChange={setBookingId}
                    isClearable
                    isInvalid={inputError}
                    errorMessage={"Buchung ID ungültig"}
                />
                <Button isIconOnly variant="flat" type="submit" aria-label="Buchung ID suchen">
                    <SearchIcon />
                </Button>
            </form>
            {id && <AnfragePage id={id}/>}
        </div>
    )
}
