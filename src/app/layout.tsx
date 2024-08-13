import type {Metadata} from "next"
import {Mooli} from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import React from "react"

const inter = Mooli({weight: "400", subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Dampfwage",
    description: "Dampfwage - Die mobile Sauna!",
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">
            <body className={inter.className}>
                <Header/>
                {children}
                <Footer/>
            </body>
        </html>
    )
}
