import React, {useCallback, useEffect, useRef, useState} from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    RangeCalendar, DateValue
} from "@nextui-org/react"
import {Booking, updateBooking} from "@/utils/firebase"
import {CalendarDate, getLocalTimeZone, parseDate, today} from "@internationalized/date"
import {AnfrageFormSchema} from "@/utils/AnfrageFormSchema"
import styles from "@/app/anfrage/page.module.css"

type ModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    booking: Booking | undefined,
    bookingList: Booking[] | undefined,
    handleEditReload: () => void
}

export const EditBookingModal = ({isOpen, onOpenChange, booking, bookingList, handleEditReload}: ModalProps) => {
    const onCloseRef = useRef(() => {
        return
    })
    const start = booking ? parseDate(booking.booking_from) : today(getLocalTimeZone())
    const end = booking ? parseDate(booking.booking_to) : today(getLocalTimeZone())
    const [selectedRange, setSelectedRange] = useState(
        {start: start, end: end}
    )
    const [focusedDate, setFocusedDate] = useState<CalendarDate>(start)
    const disabledRanges = bookingList?.map(bookingItem => {
        if (booking !== undefined) {
            if (bookingItem.booking_from !== booking.booking_from)
                return [parseDate(bookingItem.booking_from), parseDate(bookingItem.booking_to)]
        }
    })
    const isDateUnavailable = (date: DateValue) => {
        if (disabledRanges !== undefined) {
            return disabledRanges.some(
                (interval) =>
                    interval ? date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0 : false
            )
        }
        return false
    }
    const [errors, setErrors] = useState<any>({})
    const user = booking?.user
    const inputFields = [
        {
            name: 'firstName',
            label: 'Vorname',
            placeholder: 'Vorname eingeben',
            title: 'Vorname',
            type: 'text',
            defaultValue: user ? user.firstName : '',
        },
        {
            name: 'lastName',
            label: 'Nachname',
            placeholder: 'Nachname eingeben',
            title: 'Nachname',
            type: 'text',
            defaultValue: user ? user.lastName : '',
        },
        {
            name: 'email',
            label: 'Email',
            placeholder: 'email@email.ch',
            title: 'Email',
            type: 'text',
            defaultValue: user ? user.id : '',
        },
        {
            name: 'phoneNumber',
            label: 'Telefonnummer',
            placeholder: '0791234567',
            title: 'Telefonnummer',
            type: 'text',
            defaultValue: user ? user.phoneNumber : '',
        },
        {
            name: 'street',
            label: 'Strasse',
            placeholder: 'Strasse eingeben',
            title: 'Strasse',
            type: 'text',
            defaultValue: user ? user.street : '',
        },
        {
            name: 'postalCode',
            label: 'Postleitzahl',
            placeholder: 'PLZ eingeben',
            title: 'Postleitzahl',
            type: 'text',
            defaultValue: user ? user.postalCode : '',
        },
        {
            name: 'city',
            label: 'Ort',
            placeholder: 'Ort eingeben',
            title: 'Ort',
            type: 'text',
            defaultValue: user ? user.city : '',
        },
    ]

    const handleSave = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        data['booking_from'] = selectedRange.start.toString()
        data['booking_to'] = selectedRange.end.toString()
        data['agbRegulations'] = 'on'
        data['dataRegulations'] = 'on'
        data['usageRegulations'] = 'on'
        if (isDateUnavailable(parseDate(data.booking_from as string))) {
            data.booking_from = ''
        }
        if (isDateUnavailable(parseDate(data.booking_to as string))) {
            data.booking_to = ''
        }
        data['id'] = booking ? booking.id : ''
        const result = AnfrageFormSchema.safeParse(data)
        if (!result.success) {
            setErrors(result.error.flatten())
            return
        }
        setErrors({})
        const response = await updateBooking(data)
        if (!response) {
            setErrors(response)
            return
        }
        setErrors({})
        if (onCloseRef.current) {
            onCloseRef.current()
        }
        handleEditReload()
    }

    const handleDateChange = useCallback((range: { start: CalendarDate, end: CalendarDate }) => {
        setSelectedRange(range)
    }, [setSelectedRange])

    useEffect(() => {
        if (booking) {
            setSelectedRange({
                start: parseDate(booking.booking_from),
                end: parseDate(booking.booking_to)
            })
            setFocusedDate(parseDate(booking.booking_to))
        }
    }, [booking])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => {
                    onCloseRef.current = onClose
                    return (
                        <form name="editForm" onSubmit={handleSave}>
                            <ModalHeader className="flex flex-col gap-1">Angaben bearbeiten</ModalHeader>
                            <ModalBody>
                                {inputFields.map(({name, label, placeholder, title, type, defaultValue}) => {
                                    return (
                                        <Input
                                            name={name}
                                            id={name}
                                            key={name}
                                            title={title}
                                            type={type}
                                            label={label}
                                            placeholder={placeholder}
                                            defaultValue={defaultValue}
                                            isInvalid={!!errors?.fieldErrors?.[name]}
                                            errorMessage={errors?.fieldErrors?.[name]}
                                            variant="flat"
                                            autoComplete="off"
                                            size="sm"
                                        />
                                    )
                                })}
                                <RangeCalendar
                                    id="calendar"
                                    title="Kalender"
                                    className={styles.rangeCalendar}
                                    classNames={{
                                        title: styles.title,
                                        gridHeader: styles.gridHeader,
                                        gridHeaderRow: styles.gridHeaderRow,
                                        prevButton: styles.prevButton,
                                        nextButton: styles.nextButton
                                    }}
                                    value={selectedRange}
                                    onChange={handleDateChange}
                                    isDateUnavailable={isDateUnavailable}
                                    errorMessage="Datum nicht verfügbar"
                                    autoFocus={false}
                                    focusedValue={focusedDate}
                                    onFocusChange={setFocusedDate}
                                    pageBehavior="single"
                                    weekdayStyle="short"
                                />
                                <span className="text-default-400 text-small">
                                    Beim Ändern von Personendaten werden alle Daten angepasst, welche unter dieser Email abgespeichert wurden.
                                </span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                    size="sm"
                                >Schliessen
                                </Button>
                                <Button
                                    name="submitButton"
                                    id="submitButton"
                                    color="primary"
                                    type="submit"
                                    size="sm"
                                >Speichern</Button>
                            </ModalFooter>
                        </form>
                    )
                }}
            </ModalContent>
        </Modal>
    )
}
