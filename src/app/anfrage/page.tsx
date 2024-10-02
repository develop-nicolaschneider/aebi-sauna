'use client'

import {
    getLocalTimeZone,
    today,
    parseDate,
    getDayOfWeek,
    isWeekend,
    CalendarDate,
    DateDuration
} from "@internationalized/date"
import styles from "@/app/anfrage/page.module.css"
import {
    Input, Textarea, Button,
    DateValue, RangeCalendar, useDisclosure, Tooltip, Switch,
} from "@nextui-org/react"
import React, {Fragment, useCallback, useEffect, useState} from "react"
import {AnfrageFormSchema} from "@/app/lib/AnfrageFormSchema"
import {Checkbox} from "@nextui-org/checkbox"
import {Link} from "@nextui-org/link"
import {ModalComponent} from "@/components/ModalComponent"
import {addBooking, getBookings} from "@/utils/firebase"
import {BookingTable} from "@/components/BookingTable"
import ConvertToChDate from "@/utils/ConvertToChDate"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {Booking} from "@/types/Booking"
import {Fade} from "react-awesome-reveal"
import {LoadingProgressAnimation} from "@/components/base/Loading"
import Disclaimer from "@/app/disclaimer/page"
import UsageRegulations from "@/components/UsageRegulations"

type ModalContent = {
    title?: string
    handleAction: () => void
    actionText: string
    content: React.JSX.Element
}

export default function Anfrage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const maxBookingDate: DateDuration = {days: 365}
    const maxBookingDuration: DateDuration = {days: 14}
    const maxBookingDurationMessage = `Max. Buchungsdauer: ${Number(maxBookingDuration.days)} Tage.`
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const [loading, setLoading] = useState<boolean>(false)
    const [isDateSelected, setIsDateSelected] = React.useState(false)
    const [regulationsAgreed, setRegulationsAgreed] = useState(false)
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        handleAction: () => {
        },
        actionText: '',
        content: <Fragment/>,
    })
    const [bookings, setBookings] = useState<Booking[]>([])
    const [errors, setErrors] = useState<any>({})
    const minValue = today(getLocalTimeZone())
    const maxValue = minValue.add(maxBookingDate)
    const [focusedDate, setFocusedDate] = useState(minValue)
    const [selectedRange, setSelectedRange] = useState({
        start: minValue,
        end: minValue
    })
    const disabledRanges = bookings.map(booking => {
        if (booking != null) {
            if (booking.booking_from !== '' && booking.booking_to !== '') {
                return ([
                    parseDate(booking?.booking_from), parseDate(booking?.booking_to)
                ])
            }
        }
        return ([today(getLocalTimeZone()), today(getLocalTimeZone())])
    })
    const isDateUnavailable = useCallback((date: DateValue) => {
        if (disabledRanges !== undefined) {
            return disabledRanges.some(
                (interval) => {
                    if (interval !== undefined) {
                        return date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
                    }
                }
            )
        }
        return false
    }, [disabledRanges])

    function isDateFromBookingsUnavailable(bookings: Booking[], date: DateValue) {
        if (date.compare(today(getLocalTimeZone())) === 0) {
            return true
        }
        if (bookings.length > 0) {
            return bookings.some(
                (booking) => {
                    if (booking.booking_from !== '' && booking.booking_to !== '') {
                        return date.compare(parseDate(booking?.booking_from)) >= 0 && date.compare(parseDate(booking?.booking_to)) <= 0
                    }
                    return false
                }
            )
        }
        return false
    }

    let isInvalid = selectedRange?.start ? selectedRange.end > selectedRange.start.add(maxBookingDuration) : false

    const DataProtectionComponent = () => <Disclaimer/>
    const UsageProtectionComponent = () => <UsageRegulations/>


    type UserFieldsType = {
        name: string,
        label: string,
        placeholder: string,
        title: string,
        type: 'text' | 'number' | 'email' | 'tel',
        autoComplete: string,
        className?: string
    }

    const userFields: UserFieldsType[] = [
        {
            name: 'firstName',
            label: 'Vorname',
            placeholder: 'Vorname eingeben',
            title: 'Vorname',
            type: 'text',
            autoComplete: 'given-name'
        },
        {
            name: 'lastName',
            label: 'Nachname',
            placeholder: 'Nachname eingeben',
            title: 'Nachname',
            type: 'text',
            autoComplete: 'family-name'
        },
        {
            name: 'email',
            label: 'Email',
            placeholder: 'deine@email.ch',
            title: 'Email',
            type: 'email',
            autoComplete: 'email'
        },
        {
            name: 'phoneNumber',
            label: 'Telefonnummer',
            placeholder: '0791234567',
            title: 'Telefonnummer',
            type: 'tel',
            autoComplete: 'on'
        },
        {
            name: 'street',
            label: 'Strasse',
            placeholder: 'Strasse eingeben',
            title: 'Strasse',
            type: 'text',
            autoComplete: 'street-address'
        },
        {
            name: 'postalCode',
            label: 'Postleitzahl',
            placeholder: 'PLZ',
            title: 'Postleitzahl',
            type: 'number',
            autoComplete: 'postal-code',
            className: 'min-w-24 max-w-min'
        },
        {
            name: 'city',
            label: 'Ort',
            placeholder: 'Ort eingeben',
            title: 'Ort',
            type: 'text',
            autoComplete: 'address-level2',
            className: 'w-full'
        },
    ]
    const checkboxFields = [
        {
            name: "dataRegulations",
            text: "Datenschutzbestimmungen",
            modalContent: {
                handleAction: () => handleModalAction(true),
                actionText: "Akzeptieren",
                content: <DataProtectionComponent/>,
            }
        },
        {
            name: "usageRegulations",
            text: "Nutzungsbestimmungen",
            modalContent: {
                handleAction: () => handleModalAction(true),
                actionText: "Akzeptieren",
                content: <UsageProtectionComponent/>,
            }
        }
    ]

    const handleDateChange = useCallback((range: { start: CalendarDate, end: CalendarDate }) => {
        // check if start or end is weekend
        let correctedRange = range
        if (isWeekend(range.start, 'de-CH') || isWeekend(range.end, 'de-CH')) {
            if (getDayOfWeek(range.start, 'de-CH') === 6) {
                correctedRange = {start: range.start.add({days: -1}), end: range.end}
            }
            if (getDayOfWeek(range.end, 'de-CH') === 5) {
                correctedRange = {start: range.start, end: range.end.add({days: 1})}
            }
        }
        setSelectedRange(correctedRange)
    }, [setSelectedRange])

    const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        // client actions
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        const checkBookings = await getBookings()
        data['booking_from'] = isDateSelected ? selectedRange.start.toString() : ''
        data['booking_to'] = isDateSelected ? selectedRange.end.toString() : ''
        data['phoneNumber'] = data.phoneNumber.toString().replaceAll(' ', '')

        if (isDateSelected && checkBookings !== null) {
            setBookings(checkBookings)
            if (isInvalid) {
                data.booking_from = 'error'
                data.booking_to = 'error'
            } else if (selectedRange.start.toString() !== '' && selectedRange.end.toString() !== '') {
                if (isDateFromBookingsUnavailable(checkBookings, selectedRange.start)) {
                    data.booking_from = 'error'
                }
                if (isDateFromBookingsUnavailable(checkBookings, selectedRange.start)) {
                    data.booking_to = 'error'
                }
            }
        }
        const result = AnfrageFormSchema.safeParse(data)
        if (!result.success) {
            setErrors(result.error.flatten())
            setFocusedDate(selectedRange?.start ? selectedRange?.start : minValue)
            return
        }
        setErrors({})
        const formCheckRows = [
            {
                description: 'Email',
                value: data ? data.email.toString() : ''
            },
            {
                description: 'Telefonnummer',
                value: data ? data.phoneNumber.toString() : ''
            },
            {
                description: 'Vorname',
                value: data ? data.firstName.toString() : '',
            },
            {
                description: 'Nachname',
                value: data ? data.lastName.toString() : ''
            },
            {
                description: 'Strasse',
                value: data ? data.street.toString() : ''
            },
            {
                description: 'Postleitzahl',
                value: data ? data.postalCode.toString() : ''
            },
            {
                description: 'Ort',
                value: data ? data.city.toString() : ''
            },
            {
                description: 'Datum von',
                value: data ? ConvertToChDate(data.booking_from.toString()) as string : ''
            },
            {
                description: 'Datum bis',
                value: data ? ConvertToChDate(data.booking_to.toString()) as string : ''
            },
            {
                description: 'Bemerkungen',
                value: data ? data.remarks.toString() as string : ''
            }
        ]
        const formCheckColumns = [
            {
                key: 'description',
                label: 'Beschreibung'
            },
            {
                key: 'value',
                label: 'Wert'
            }
        ]
        const formCheckModal = {
            title: "Angaben Prüfen",
            handleAction: () => handleFormCheck(data),
            actionText: "Senden",
            content: <BookingTable columns={formCheckColumns} rows={formCheckRows}/>
        }
        setModalContent(formCheckModal)
        handleModalOpen(formCheckModal)
    }

    const handleModalOpen = (modalContent: ModalContent) => {
        setModalContent(modalContent)
        onOpen()
    }

    const handleModalAction = (selected: boolean) => {
        setRegulationsAgreed(selected)
    }

    const handleFormCheck = async (data: { [p: string]: FormDataEntryValue }) => {
        // server actions
        setLoading(true)
        const response = await addBooking(data)
        if (response.type === 'validation') {
            setErrors(response)
            setFocusedDate(selectedRange?.start ? selectedRange?.start : minValue)
            return
        } else if (response.type === 'server') {
            console.error(response.message)
            setErrors({})
        } else if (response.type === 'success') {
            setErrors({})
            const booking = response.booking
            if (Boolean(process.env.NEXT_PUBLIC_SEND_EMAILS) && booking.user !== null) {
                const res = await fetch('api/sendEmail', {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify({
                        email: booking.user?.email,
                        subject: 'Anfrage bestätigt',
                        booking: booking
                    })
                })
                await res.json()
                if (!res.ok) {
                    console.error(res)
                }
            }
            const params = new URLSearchParams(searchParams.toString())
            params.set('buchungId', booking.id)
            router.push(`${pathname}/meine-anfrage?${params.toString()}`)
        }
        setLoading(false)
    }

    useEffect(() => {
        (async () => {
            const bookings = await getBookings()
            if (bookings !== null)
                setBookings(bookings)
        })()
    }, [setBookings])

    return (
        <form name='anfrageForm' onSubmit={handleSubmit} className="grow">
            {!loading ?
                <Fade triggerOnce duration={500}>
                    <div
                        id="anfrage-div"
                        className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 justify-items-center content-center py-7">
                        <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl md:col-span-2">Anfrage
                            senden</h1>
                        <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 md:col-span-2 text-center">
                            Sende Deine Anfrage zur Saunamiete jetzt! Wähle Deine unverbindlichen Wunschdaten direkt
                            im Kalender.
                            Bei Fragen, Miete von längerer Dauer oder <span className="font-bold">&nbsp;abweichender
                            Lieferadresse&nbsp;</span> nutze das Feld
                            <span className="font-bold">&nbsp;Bemerkungen&nbsp;</span>oder sende mir eine E-Mail:
                            <Link
                                className="text-xs sm:text-xs md:text-sm lg:text-base"
                                isExternal
                                href="mailto:dampfwage@gmail.com?subject=Anfrage Dampfwage"
                                target="_blank"
                                rel="noopener noreferrer">
                                &nbsp;dampfwage@gmail.com
                            </Link>.
                        </p>
                        <div className="grid grid-cols-1 gap-y-3 w-full max-w-md">
                            {userFields.map((userField, index) => {
                                function getInput(field: UserFieldsType) {
                                    return <Input
                                        key={field.name}
                                        name={field.name}
                                        id={field.name}
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        title={field.title}
                                        type={field.type === 'number' ? 'text' : field.type}
                                        inputMode={field.type === 'number' || field.type === 'tel' ? 'numeric' : field.type}
                                        autoComplete={field.autoComplete}
                                        isInvalid={!!errors?.fieldErrors?.[field.name]}
                                        errorMessage={errors?.fieldErrors?.[field.name]}
                                        variant="underlined"
                                        size="sm"
                                        className={field.className + ' col-start-1'}
                                    />
                                }

                                if (userFields[index].name !== 'postalCode' && userFields[index].name !== 'city') {
                                    return getInput(userField)
                                } else if (userFields[index].name === 'postalCode' && userFields[index + 1]) {
                                    return (
                                        <div key="postalCode-city-div" className="flex w-full gap-x-2 col-start-1">
                                            {getInput(userField)}
                                            {getInput(userFields[index + 1])}
                                        </div>
                                    )
                                }
                            })}
                            <Textarea
                                classNames={{
                                    description: 'text-zinc-400'
                                }}
                                maxLength={250}
                                id="remarks"
                                name="remarks"
                                title="Bemerkungen"
                                size="sm"
                                minRows={3}
                                maxRows={3}
                                variant="underlined"
                                label="Bemerkungen"
                                labelPlacement="inside"
                                placeholder="Zusätzliche Bemerkungen & Fragen eingeben"
                                description="Maximal 250 Zeichen"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center h-full py-4 gap-1">
                            <Tooltip
                                showArrow
                                color="primary"
                                closeDelay={0}
                                content="Datum optional">
                                <RangeCalendar
                                    isDisabled={!isDateSelected}
                                    id="calendar"
                                    className="col-start-1 md:col-start-2"
                                    classNames={{
                                        title: styles.title,
                                        gridHeader: styles.gridHeader,
                                        gridHeaderRow: styles.gridHeaderRow,
                                        prevButton: styles.prevButton,
                                        nextButton: styles.nextButton
                                    }}
                                    calendarWidth={320}
                                    value={selectedRange}
                                    minValue={minValue.add({days: 1})}
                                    maxValue={maxValue}
                                    isDateUnavailable={isDateUnavailable}
                                    isInvalid={isInvalid || !!errors.fieldErrors?.['booking_from']}
                                    errorMessage={isInvalid ? maxBookingDurationMessage :
                                        errors?.fieldErrors?.['booking_from'] !== undefined ? errors?.fieldErrors?.['booking_from'] :
                                            (selectedRange?.start.toString() === today(getLocalTimeZone()).toString() ?
                                                ' ' : 'Datum nicht verfügbar.')
                                    }
                                    onChange={handleDateChange}
                                    focusedValue={focusedDate}
                                    onFocusChange={setFocusedDate}
                                    pageBehavior="single"
                                    weekdayStyle="short"
                                />
                            </Tooltip>
                            <Switch name="date-switch" size="sm" isSelected={isDateSelected}
                                    onValueChange={setIsDateSelected}>
                                Wunschdatum wählen
                            </Switch>
                            <small className="text-center text-zinc-400 leading-5 max-w-sm">
                                Wochenendanfragen nur Sa+So möglich.
                            </small>
                        </div>
                        <div className="text-center h-full self-center leading-5">
                            <Checkbox
                                isSelected={regulationsAgreed}
                                onValueChange={setRegulationsAgreed}
                                classNames={{label: 'text-xs'}}
                                name="regulations"
                                key="ragulations"
                                isInvalid={!!errors?.fieldErrors?.['regulations']}
                                isRequired
                                size="sm"
                            >Ich akzeptiere die</Checkbox>
                            {checkboxFields.map(({name, text, modalContent}, index) => (
                                <Link
                                    size="sm"
                                    className="hover:cursor-pointer text-xs"
                                    key={name + "-link"}
                                    onPress={() => handleModalOpen(modalContent)}
                                >&nbsp;{text}{index < checkboxFields.length - 2 ? ',' : index === checkboxFields.length - 1 ? '.' : ' &'}</Link>
                            ))}
                        </div>
                        <Button
                            name="submitButton"
                            id="submitButton"
                            variant="shadow"
                            color="primary"
                            type="submit"
                            size="md"
                            className="self-center"
                            isDisabled={loading}
                        >Anfrage senden</Button>
                        <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} modalContent={modalContent}/>
                    </div>
                </Fade>
                : <LoadingProgressAnimation label={"Anfrage senden..."}/>
            }
        </form>
    )
}
