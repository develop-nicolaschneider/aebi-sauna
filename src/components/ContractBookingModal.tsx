import React, {useEffect, useRef, useState} from "react"
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
    Input, DateInput, TimeInput
} from "@nextui-org/react"
import {parseDate, Time} from "@internationalized/date"
import {Booking} from "@/types/Booking"
import '@/app/styles/globals.css'

type ModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    booking: Booking | undefined,
}

export const ContractBookingModal = ({isOpen, onOpenChange, booking}: ModalProps) => {
    const [priceDeposit, setPriceDeposit] = useState(0)
    const [priceSauna, setPriceSauna] = useState(0)
    const [priceWood, setPriceWood] = useState(0)
    const [priceDelivery, setPriceDelivery] = useState(0)
    const [priceAdd, setPriceAdd] = useState(0)
    const [priceTotal, setPriceTotal] = useState(0)

    useEffect(() => {
        setPriceTotal(priceSauna + priceWood + priceDelivery + priceAdd)
    }, [priceSauna, priceWood, priceDelivery, priceAdd])

    useEffect(() => {
        // Reset the form values
        setPriceDeposit(0)
        setPriceSauna(0)
        setPriceWood(0)
        setPriceDelivery(0)
        setPriceAdd(0)
        setPriceTotal(0)
    }, [onOpenChange])

    const onCloseRef = useRef(() => {
        setPriceDeposit(0)
        setPriceSauna(0)
        setPriceWood(0)
        setPriceDelivery(0)
        setPriceAdd(0)
        setPriceTotal(0)
        return
    })

    const handleSave = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        const response = await fetch('/api/createContract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                booking, data
            }),
        })
        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Dampfwage-Mietvertrag${booking && '-' + booking.user?.firstName + '_' + booking.user?.lastName + '-' + booking.id}.docx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            console.error('Error downloading the document')
        }
        if (onCloseRef.current) {
            onCloseRef.current()
        }
    }

    const endContent = (
        <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">CHF</span>
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside">
            <ModalContent>
                {onClose => {
                    onCloseRef.current = onClose
                    return (
                        <form name="editForm" onSubmit={handleSave}>
                            <ModalHeader id="modalHeader" className="flex flex-col gap-1">
                                Mietvertrag erstellen
                            </ModalHeader>
                            <ModalBody id="modalBody" className="grid justify-items-center h-fit">
                                <DateInput
                                    variant="underlined"
                                    label="Gebucht vom"
                                    isDisabled id="bookingFrom"
                                    name="bookingFrom"
                                    defaultValue={booking?.booking_from ? parseDate(booking?.booking_from) : undefined}
                                    size="sm"
                                />
                                <DateInput
                                    variant="underlined"
                                    label="Gebucht bis"
                                    isDisabled id="bookingTo"
                                    name="bookingTo"
                                    defaultValue={booking?.booking_to ? parseDate(booking?.booking_to) : undefined}
                                    size="sm"
                                />
                                <TimeInput
                                    variant="underlined"
                                    label="Anlieferzeit"
                                    id="fromTime"
                                    name="fromTime"
                                    defaultValue={new Time(18)}
                                    size="sm"
                                />
                                <TimeInput
                                    variant="underlined"
                                    label="Abholungszeit"
                                    id="toTime"
                                    name="toTime"
                                    defaultValue={new Time(18)}
                                    size="sm"
                                />
                                <Input
                                    variant="underlined"
                                    id="priceDeposit"
                                    name="priceDeposit"
                                    type="number"
                                    inputMode="numeric"
                                    label="Mietkaution"
                                    value={priceDeposit.toFixed(0)}
                                    onChange={e => setPriceDeposit(Number(e.target.value))}
                                    endContent={endContent}
                                    size="sm"
                                    className="appearance-none"
                                />
                                <Input
                                    variant="underlined"
                                    id="priceSauna"
                                    name="priceSauna"
                                    type="number"
                                    inputMode="numeric"
                                    label="Preis Sauna"
                                    value={priceSauna.toFixed(0)}
                                    onChange={e => setPriceSauna(Number(e.target.value))}
                                    endContent={endContent}
                                    size="sm"
                                    className="appearance-none"
                                />
                                <Input
                                    variant="underlined"
                                    id="priceWood"
                                    name="priceWood"
                                    type="number"
                                    inputMode="numeric"
                                    label="Preis Brennholz"
                                    value={priceWood.toFixed(0)}
                                    onChange={e => setPriceWood(Number(e.target.value))}
                                    endContent={endContent}
                                    size="sm"
                                />
                                <Input
                                    variant="underlined"
                                    id="priceDelivery"
                                    name="priceDelivery"
                                    type="number"
                                    inputMode="numeric"
                                    label="Preis Lieferung"
                                    value={priceDelivery.toFixed(0)}
                                    onChange={e => setPriceDelivery(Number(e.target.value))}
                                    endContent={endContent}
                                    size="sm"
                                />
                                <Input
                                    variant="underlined"
                                    id="priceAdd"
                                    name="priceAdd"
                                    type="number"
                                    inputMode="numeric"
                                    label="Preis Zusätzliches"
                                    value={priceAdd.toFixed(0)}
                                    onChange={e => setPriceAdd(Number(e.target.value))}
                                    endContent={endContent}
                                    size="sm"
                                />
                                <Input
                                    readOnly
                                    variant="underlined"
                                    id="priceTotal"
                                    name="priceTotal"
                                    type="number"
                                    inputMode="numeric"
                                    label="Preis Total"
                                    value={priceTotal.toFixed(0)}
                                    endContent={endContent}
                                    size="sm"
                                    classNames={{
                                        base: 'text-black font-bold',
                                        input: 'text-black font-bold',
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter id="modalFooter">
                                <Button
                                    id="close-button"
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
                                >Erstellen</Button>
                            </ModalFooter>
                        </form>
                    )
                }}
            </ModalContent>
        </Modal>
    )
}
