'use client'

import React from "react"
import {Fade} from "react-awesome-reveal"
import {Link} from "@nextui-org/link";
import {getLocalTimeZone, today} from "@internationalized/date";
import ConvertToChDate from "@/utils/ConvertToChDate";

const Impressum = () => {
    const impressumContent = [
        {
            title: 'Inhaber Dampfwage',
            content:
                <address>
                    Tobias Aebi<br/>
                    3425 Koppigen<br/>
                    <Link
                        className="text-xs sm:text-xs md:text-sm lg:text-base"
                        isExternal
                        href="mailto:dampfwage@gmail.com?subject=Anfrage Dampfwage&body=Hallo Tobias%0A%0AMein Anliegen zum Dampfwage:"
                        target="_blank"
                        rel="noopener noreferrer">
                        dampfwage@gmail.com
                    </Link>
                </address>
        },
        {
            title: 'Webdesign & Entwicklung',
            content:
                <address>
                    Nicola Schneider<br/>
                    4573 Lohn-Ammannsegg<br/>
                    <Link
                        className="text-xs sm:text-xs md:text-sm lg:text-base"
                        isExternal
                        href="mailto:contact@nicolaschneider.ch"
                        target="_blank"
                        rel="noopener noreferrer">
                        contact@nicolaschneider.ch
                    </Link><br/>
                    <Link
                        className="text-xs sm:text-xs md:text-sm lg:text-base"
                        isExternal
                        href="https://nicolaschneider.ch" target="_blank">
                        nicolaschneider.ch
                    </Link>
                </address>
        },
        {
            title: 'Haftungsausschluss',
            content:
                <p>
                    Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Dennoch übernehmen wir keine
                    Haftung für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen.
                    Für
                    externe Links zu fremden Webseiten wird keine Verantwortung übernommen, da wir auf deren Inhalte
                    keinen Einfluss haben. Der Zugriff und die Nutzung der Webseite erfolgen auf eigenes Risiko des
                    Nutzers.
                </p>
        },
        {
            title: 'Copyright-Hinweise',
            content:
                <p>
                    Alle Inhalte dieser Webseite, einschließlich Texte, Bilder, Grafiken und Designs, unterliegen
                    dem
                    Urheberrecht. Jegliche Vervielfältigung, Bearbeitung, Verbreitung oder Verwendung außerhalb der
                    Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung. Downloads und Kopien
                    dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
        }
    ]

    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="howItWorks"
                 className="grid grid-cols-1 gap-8 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Impressum
                </h1>
                {impressumContent.map(({title, content}, index) => (
                    <div key={index}>
                        <h2 className="h-fit font-bold text-base sm:text-large text-center pb-2">
                            {title}
                        </h2>
                        <div className="max-w-lg text-xs sm:text-xs md:text-sm lg:text-base text-center">
                            {content}
                        </div>
                    </div>
                ))}
                <small className="text-zinc-600 text-center">
                    {ConvertToChDate(today(getLocalTimeZone()).toString(), 'dy')}
                </small>
            </div>
        </Fade>
    )
}

export default Impressum
