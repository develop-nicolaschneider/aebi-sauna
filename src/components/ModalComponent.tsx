import React from "react"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react"

type ModalProps = {
    isOpen: boolean,
    onOpenChange: () => void,
    modalContent: {
        title: string,
        handleAction: () => void,
        actionText: string,
        content: React.JSX.Element,
    }
}

export const ModalComponent = (
    {
        isOpen,
        onOpenChange,
        modalContent
    }: ModalProps) => {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{modalContent?.title}</ModalHeader>
                        <ModalBody>
                            {modalContent?.content}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Schliessen
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    modalContent?.handleAction()
                                    onClose()
                                }}
                            >{modalContent?.actionText}</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
