'use client'

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react"
import React, {useState} from "react"

interface EmailModalProps {
    isOpen: boolean
    onOpenChange: () => void
    stateChange: (emailModalData: {message: string}) => void
}

const EmailModal = ({isOpen, onOpenChange, stateChange}: EmailModalProps) => {

    const [emailModalData, setEmailModalData] = useState({
        message: ''
    })

    const handleInputChange = (input: string, content: string) => {
        setEmailModalData((prev) => ({ ...prev, [input]: content }))
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
            size="lg">
            <form>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Anfrage bestätigen
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    classNames={{
                                        description: 'text-zinc-400'
                                    }}
                                    name="message"
                                    title="Email Inhalt"
                                    size="sm"
                                    minRows={3}
                                    maxRows={20}
                                    variant="underlined"
                                    label="Email Inhalt"
                                    labelPlacement="inside"
                                    placeholder="Inhalt, Preise, ..."
                                    value={emailModalData.message}
                                    onValueChange={content => handleInputChange('message', content)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Schliessen
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        stateChange(emailModalData)
                                        onClose()
                                    }}
                                >Anfrage bestätigen</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </form>
        </Modal>
    )
}

export default EmailModal
