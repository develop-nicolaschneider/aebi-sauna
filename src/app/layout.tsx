import type {Metadata} from "next"
import {Montserrat} from "next/font/google"
import Footer from "@/components/base/Footer"
import React from "react"
import {NextUIContextProvider} from "@/utils/context/nextUIContextProvider"
import Navigation from "@/components/base/Navigation"
import {cookies} from "next/headers"
import "./styles/globals.css"

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap'
})

export const metadata: Metadata = {
    title: 'Dampfwage',
    applicationName: 'Dampfwage',
    category: "mobile Sauna",
    keywords: [
        'Dampfwage',
        'mobile Sauna',
        'mobile Sauna mieten',
        'Koppigen',
        'Tobias Aebi',
    ],
    description: 'Willkommen bei Dampfwage, Deiner Anlaufstelle für pure Entspannung! ' +
        'Hier kannst Du die mobile Sauna mieten und Dir direkt an Deinen Wunschort liefern lassen - ' +
        'egal ob zu zweit, mit Freunden, Kollegen oder für ein Teamevent jeder Art.' +
        'Der traditionell finnische Holzofen sorgt für ein gemütliches Wellness-Erlebnis. ' +
        'Miete jetzt den Dampfwage - die mobile Sauna geliefert ab 3425 Koppigen.'
}

export default function RootLayout({children}: { children: React.ReactNode }) {

    const session = cookies().get('__session')?.value || null

    return (
        <html lang="de" className={montserrat.className + " text-xl"}>
        <body>
        <NextUIContextProvider>
            <div className="flex flex-col h-screen justify-between">
                <main className="flex flex-col grow">
                    <Navigation session={session}/>
                    <div className="flex flex-col grow px-5 h-fit">
                        {children}
                    </div>
                </main>
                <Footer/>
            </div>
        </NextUIContextProvider>
        </body>
        </html>
    )
}
