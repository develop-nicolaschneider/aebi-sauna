'use client'

import {getLocalTimeZone, today, parseDate, CalendarDate} from "@internationalized/date"
import styles from "@/app/anfrage/page.module.css"
import {
    Input, Button, RangeCalendar, useDisclosure, DateValue, CheckboxGroup
} from "@nextui-org/react"
import React, {Fragment, useCallback, useEffect, useState} from "react"
import {db} from "../../../config/firebase"
import {collection, getDocs} from "@firebase/firestore"
import {AnfrageFormSchema} from "@/utils/AnfrageFormSchema"
import {Checkbox} from "@nextui-org/checkbox"
import {Link} from "@nextui-org/link"
import {ModalComponent} from "@/components/ModalComponent"
import {addBooking} from "@/utils/firebase"
import {BookingTable} from "@/components/BookingTable";
import ConvertToChDate from "@/utils/ConvertToChDate";

export default function Anfrage() {
    console.log("start")
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const [checkboxSelected, setCheckboxSelected] = useState([""])
    const [modalContent, setModalContent] = useState({
        title: "",
        handleAction: () => {
        },
        actionText: "",
        content: <Fragment/>,
    })
    const [bookings, setBookings] = useState<any[]>([])
    const [errors, setErrors] = useState<any>({})
    const disabledRanges = bookings.map(booking => [
        parseDate(booking.booking_from), parseDate(booking.booking_to)
    ])
    const isDateUnavailable = useCallback((date: DateValue) => {
        return disabledRanges.some(
            (interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0,
        )
    }, [disabledRanges])
    const minValue = today(getLocalTimeZone())
    const maxValue = minValue.add({years: 1})
    const [focusedDate, setFocusedDate] = useState(minValue)
    const maxBooking = minValue.add({months: 1})
    const [selectedRange, setSelectedRange] = useState({
        start: minValue,
        end: minValue
    })
    const AgbComponent = () => <div>Content for Modal 1</div>
    const DataProtectionComponent = () => <div>Content for Modal 2</div>
    const UsageProtectionComponent = () => <div>Content for Modal 3</div>

    const userFields = [
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
            placeholder: 'email@email.ch',
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
            placeholder: 'PLZ eingeben',
            title: 'Postleitzahl',
            type: 'number',
            autoComplete: 'postal-code'
        },
        {
            name: 'city',
            label: 'Ort',
            placeholder: 'Ort eingeben',
            title: 'Ort',
            type: 'text',
            autoComplete: 'city'
        },
    ]
    const bookingFields = [
        {
            name: 'booking_from',
            label: 'Datum von',
            isReadOnly: true,
            min: minValue.toString(),
            max: maxValue.toString(),
            value: selectedRange?.start.toString(),
            range: {start: null, end: selectedRange?.end},
        },
        {
            name: 'booking_to',
            label: 'Datum bis',
            isReadOnly: true,
            min: selectedRange?.start.toString(),
            max: maxBooking.toString(),
            value: selectedRange?.end.toString(),
            range: {start: selectedRange?.start, end: null},
        },
    ]
    const checkboxFields = [
        {
            name: "agbRegulations",
            text: "AGBs",
            modalContent: {
                title: "Allgemeine Geschäftsbedingungen",
                handleAction: () => handleModalAction("agbRegulations"),
                actionText: "Akzeptieren",
                content: <AgbComponent/>,
            }
        },
        {
            name: "dataRegulations",
            text: "Datenschutzerklärungen",
            modalContent: {
                title: "Datenschutzerklärungen",
                handleAction: () => handleModalAction("dataRegulations"),
                actionText: "Akzeptieren",
                content: <DataProtectionComponent/>,
            }
        },
        {
            name: "usageRegulations",
            text: "Nutzungsbestimmungen",
            modalContent: {
                title: "Nutzungsbestimmungen",
                handleAction: () => handleModalAction("usageRegulations"),
                actionText: "Akzeptieren",
                content: <UsageProtectionComponent/>,
            }
        }
    ]

    const handleDateChange = useCallback((range: { start: CalendarDate, end: CalendarDate }) => {
        setSelectedRange(range)
    }, [setSelectedRange])

    const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        // client actions
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        if (isDateUnavailable(parseDate(data.booking_from as string))) {
            data.booking_from = ""
        }
        if (isDateUnavailable(parseDate(data.booking_to as string))) {
            data.booking_to = ""
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
                key: '1',
                description: 'Datum von',
                value: data ? ConvertToChDate(data?.booking_from.toString()) : ''
            },
            {
                key: '2',
                description: 'Datum bis',
                value: data ? ConvertToChDate(data?.booking_to.toString()) : ''
            },
            {
                key: '3',
                description: 'Email',
                value: data ? data?.email.toString() : ''
            },
            {
                key: '4',
                description: 'Telefonnummer',
                value: data ? data?.phoneNumber.toString() : ''
            },
            {
                key: '5',
                description: 'Vorname',
                value: data ? data?.firstName.toString() : '',
            },
            {
                key: '6',
                description: 'Nachname',
                value: data ? data?.lastName.toString() : ''
            },
            {
                key: '7',
                description: 'Strasse',
                value: data ? data?.street.toString() : ''
            },
            {
                key: '8',
                description: 'Postleitzahl',
                value: data ? data?.postalCode.toString() : ''
            },
            {
                key: '9',
                description: 'Ort',
                value: data ? data?.city.toString() : ''
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

    const handleModalOpen = (modalContent: {
        title: string,
        handleAction: () => void,
        actionText: string,
        content: React.JSX.Element
    }) => {
        setModalContent(modalContent)
        onOpen()
    }

    const handleModalAction = (selected: string) => {
        setCheckboxSelected([selected, ...checkboxSelected])
    }

    const handleFormCheck = async (data: { [p: string]: FormDataEntryValue }) => {
        // server actions
        const response = await addBooking(data)
        if (!response?.success) {
            setErrors(response)
            setFocusedDate(selectedRange?.start ? selectedRange?.start : minValue)
            return
        }
        setErrors({})
    }

    useEffect(() => {
        (async () => {
            try {
                const bookingsRef = collection(db, 'bookings')
                const bookingsSnap = await getDocs(bookingsRef)
                const list = bookingsSnap.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                })
                console.log(list)
                setBookings(list)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [setBookings])

    // SNAPSHOT -> PULLING NEWEST DATA
    // useEffect(() => {
    //     (async () => {
    //         console.log("useEffect")
    //         const bookingsRef = collection(db, 'bookings')
    //         const bookingsSnap = await onSnapshot(bookingsRef, snapshot => {
    //             console.log("bookingSnap")
    //             const list = snapshot.docs.map(doc => {
    //                 return {id: doc.id, ...doc.data()}
    //             })
    //             console.log("list", list)
    //             setBookings(list)
    //         })
    //         return bookingsSnap()
    //     })()
    // }, [])

    return (
        <form name='anfrageForm' onSubmit={handleSubmit}>
            {userFields.map(({name, label, placeholder, title, type, autoComplete}) => (
                <Input
                    name={name}
                    id={name}
                    key={name}
                    label={label}
                    placeholder={placeholder}
                    title={title}
                    type={type ?? 'text'}
                    autoComplete={autoComplete}
                    variant="flat"
                    isInvalid={!!errors?.fieldErrors?.[name]}
                    errorMessage={errors?.fieldErrors?.[name]}
                    size="sm"
                />
            ))}
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
                minValue={minValue}
                maxValue={maxValue}
                isDateUnavailable={isDateUnavailable}
                errorMessage={"Datum nicht verfügbar"}
                onChange={handleDateChange}
                autoFocus={false}
                pageBehavior="single"
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
                weekdayStyle="short"
            />
            {bookingFields.map(({name, label, value, min, max, range}) => (
                <Input
                    name={name}
                    id={name}
                    key={name}
                    label={label}
                    title="Datum"
                    readOnly
                    type="date"
                    autoComplete="off"
                    variant="flat"
                    labelPlacement="outside-left"
                    isInvalid={!!errors?.fieldErrors?.[name]}
                    errorMessage={errors?.fieldErrors?.[name]}
                    value={value}
                    onChange={e => handleDateChange({
                        start: range.start ?? parseDate(e.target.value),
                        end: range.end ?? parseDate(e.target.value)
                    })}
                    min={min}
                    max={max}
                    size="sm"
                />
            ))}
            <CheckboxGroup value={checkboxSelected} onValueChange={setCheckboxSelected}>
                {checkboxFields.map(({name, text, modalContent}) => (
                    <div key={name}>
                        <Checkbox
                            name={name}
                            key={name + "-checkbox"}
                            value={name}
                            isInvalid={!!errors?.fieldErrors?.[name]}
                            isRequired
                            size="sm"
                        >Meine Zustimmung zu den
                        </Checkbox><Link key={name + "-link"}
                                         onPress={() => handleModalOpen(modalContent)}>&nbsp;{text}</Link>
                    </div>
                ))}
            </CheckboxGroup>
            <Button
                name="submitButton"
                id="submitButton"
                variant="light"
                type="submit"
                size="sm"
            >Anfrage senden</Button>
            <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} modalContent={modalContent}/>
        </form>
    )
}
