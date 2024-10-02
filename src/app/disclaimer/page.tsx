'use client'

import {Fade} from "react-awesome-reveal"
import React from "react"

const Disclaimer = () => {
    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="howItWorks"
                 className="grid grid-cols-1 gap-8 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Datenschutz
                </h1>
                <div>
                    <h2 className="h-fit font-bold text-base sm:text-large text-center pb-2">
                        Bestimmungen
                    </h2>
                    <div className="max-w-lg text-xs sm:text-xs md:text-sm lg:text-base text-center">
                        <p>
                            Der Schutz Deiner persönlichen Daten ist mir wichtig. Die von Dir über das Formular
                            bereitgestellten Informationen werden vertraulich behandelt und ausschließlich zur
                            Bearbeitung Deiner Anfrage verwendet. Ich speichere diese Daten in der Cloud-Datenbank
                            Google Firestore. Google Firestore ist ein Dienst, der den Datenschutzrichtlinien von Google
                            unterliegt und eine sichere Speicherung Deiner Daten gewährleistet.<br/>
                            Es werden keine persönlichen Daten ohne Deine ausdrückliche Zustimmung an Dritte
                            weitergegeben. Du hast jederzeit das Recht, Auskunft über die von Dir gespeicherten Daten zu
                            erhalten und deren Löschung zu verlangen. Bei Fragen zum Datenschutz kannst Du mich jederzeit
                            kontaktieren.
                        </p>
                    </div>
                </div>
                <small className="text-zinc-600 text-center">
                    Oktober 2024
                </small>
            </div>
        </Fade>
    )
}

export default Disclaimer
