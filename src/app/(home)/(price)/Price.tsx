'use client'

import {Fade} from "react-awesome-reveal"
import React from "react"
import {Link} from "@nextui-org/link"
import PriceAccordion from "@/app/(home)/(price)/PriceAccordion"
import NextLink from "next/link";

const Price = () => {

    const accordionPrices = [
        {
            title: 'Tagesmiete',
            price: 'CHF 160.-',
            subtitle: 'Montag bis Freitag',
            description: 'Möchtest Du den Dampfwagen einen Tag mieten? Kein Problem! Jeder weitere Tag im Anschluss kostet CHF 70.- '
        },
        {
            title: 'Wochenendmiete',
            price: 'CHF 320.-',
            subtitle: 'Samstag und Sonntag',
            description: 'Die Wochenendmiete ist nur im Paket möglich.'
        },
        {
            title: '1 Woche',
            price: 'CHF 480.-',
            subtitle: '7 Tage am Stück schwitzen',
            description: 'Geniesse den Dampfwagen eine ganze Woche lang!'
        },
        {
            title: '2 Woche',
            price: 'CHF 720.-',
            subtitle: '14 Tage am Stück schwitzen',
            description: 'Geniesse den Dampfwagen zwei ganze Wochen lang!'
        },
        {
            title: 'Längerer Zeitraum',
            price: 'Auf Anfrage',
            subtitle: 'Miete von mehr als 2 Wochen',
            description: 'Auch die Miete von mehr als 2 Wochen ist möglich! Sende mir Deine Anfrage einfach per Kontaktformular oder Email.'
        }
    ]

    const accordionSpecials = [
        {
            title: 'Lieferkosten',
            price: 'inklusive',
            subtitle: '5 km rund um Koppigen kostenlos!',
            description: 'Die Distanz wird anhand von Google Maps berechnet.'
        },
        {
            title: 'Lieferkosten',
            price: 'CHF 1.50.-/km',
            subtitle: 'Distanz mehr als 5km von Koppigen',
            description: 'Die Distanz wird anhand von Google Maps berechnet.\n' +
                'Geliefert wird in der Region Bern, Solothurn, Oberaargau & Emmental.\n' +
                'Anlieferung und Abholung werden ab 3425 Koppigen berechnet.'
        },
        {
            title: 'Mietkaution',
            price: 'CHF 200.-',
            subtitle: 'Pro Miete wird eine Kaution verlangt',
            description: 'Die Kaution wird bei Rücknahme zurückbezahlt, sofern der Zustand in Ordnung ist.\n' +
                'Zum Mietobjekt ist Sorge zur tragen. Es gilt die Sorgfaltspflicht.\n' +
                'Defekte, allfällige Reparaturen oder fehlende Gegenstände werden dem Mieter verrechnet. '
        },
        {
            title: 'Brennholz',
            price: 'CHF 15.-',
            subtitle: 'Zusätzliches Feuerholz für ca. 4 Stunden saunieren',
            description: 'Brennholz für ca. 4 Stunden saunieren ist inklusive. Falls Du mehr Holz benötigst, kann dieses direkt mitbestellt werden.',
        },
    ]

    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="price"
                 className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-8 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl col-span-1 lg:col-span-2">
                    Preise
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 col-span-1 lg:col-span-2 text-center">
                    Alle Preise vorbehalten. Der definitive Preis erhältst Du mit der Bestätigung der Anfrage und dem
                    Mietvertrag.
                </p>
                <Fade triggerOnce cascade damping={0.2} delay={500} className="grid justify-items-center w-full">
                    <PriceAccordion items={accordionPrices} title="Mietpreise"/>
                    <PriceAccordion items={accordionSpecials} title="Zusätzliche Kosten"/>
                </Fade>
                <small className="text-xs sm:text-xs md:text-sm lg:text-base col-span-1 leading-4 lg:col-span-2 text-zinc-600 text-center">
                    Beachte bitte die
                    <Link
                        isExternal
                        href="/files/Nutzungsbedingungen.pdf"
                        target="_blank"
                        as={NextLink}
                        className="text-xs sm:text-xs md:text-sm lg:text-base leading-4">
                        &nbsp;Nutzungsbedingungen&nbsp;
                    </Link>
                    für die Miete und Nutzung der mobilen Sauna!
                </small>
            </div>
        </Fade>
    )
}

export default Price
