'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ReactNode} from "react"
import {GregorianCalendar} from "@internationalized/date"

interface ProviderProps {
    children: ReactNode;
    className?: string;
}

export function NextUIContextProvider({children, className}: ProviderProps) {
    function createCalendar(identifier: string) {
        switch (identifier) {
            case 'gregory':
                return new GregorianCalendar();
            default:
                throw new Error(`Unsupported calendar ${identifier}`);
        }
    }

    return (
        <NextUIProvider
            className={className}
            locale={'de-CH'}
            createCalendar={(calendar) => createCalendar(calendar)}
        >
            {children}
        </NextUIProvider>
    )
}
