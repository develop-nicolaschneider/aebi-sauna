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
    title: "Dampfwage",
    description:
        "Die mobile Sauna in Deiner Umgebung! " +
        "Miete die Holzsauna auf rädern und lasse sie direkt vor Deine Haustür liefern. " +
        "Sende Deine Anfrage mit Deinen Wunschdaten jetzt!",
}

export default function RootLayout({children}: { children: React.ReactNode }) {

    const session = cookies().get('session.dampfwage.ch')?.value || null

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
