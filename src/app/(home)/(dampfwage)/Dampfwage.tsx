'use client'

import React from "react"
import {Fade} from "react-awesome-reveal"
import dampfwageWood from "../../../../public/images/dampfwage-wood.jpg"
import dampfwageInside from "../../../../public/images/dampfwage-inside.jpg"
import dampfwageOutside from "../../../../public/images/dampfwage-outside-open-door.jpg"
import {DampfwageCard} from "@/app/(home)/(dampfwage)/DampfwageCard"

const Dampfwage = () => {

    const cards = [
        {
            key: 'card-1',
            img: [dampfwageWood,dampfwageWood],
            title: "Planung",
            description: "Der Dampfwagen ist die zweite selbstgebaute mobile Sauna. Mehr Platz im Innenraum, ein Vorraum zum Umziehen, ein Panoramafenster und der neue Holzofen zeichnen den Dampfwagen aus",
        },
        {
            key: 'card-2',
            img: [dampfwageInside, dampfwageInside],
            title: "Bau",
            description: "Die Sauna wurde komplett selbst gebaut aus massivem Holz. Der Eckbank bietet Platz für ca. 4- max. 6 Personen.",
        },
        {
            key: 'card-3',
            img: [dampfwageOutside, dampfwageOutside],
            title: "Resultat",
            description: "Das Treppchen zur puren Entspannung! Der geräumige Vorraum kann zum Umziehen und als Ablage genutzt werden. Durch die Glastüre geht’s dann direkt in die heisse Schwitzstube."
        }
    ]

    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="dampfwage"
                 className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl col-span-1 md:col-span-3">
                    Das Projekt
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 col-span-1 md:col-span-3 text-center">
                    Bereits seit 2020 besitze ich eine mobile Sauna. Diese wurde bis anhin mit Strom betrieben.
                    Im Januar 2024 entdeckte ich dann das traditionelle Ambiente einer holzbefeuerten Sauna.
                    Danach war mit klar, dass ich mir selbst eine Holzofensauna bauen will, natürlich, traditionell und
                    nachhaltig mit Fichtenholz.
                    So begann ich im Frühling 2024 mit der Planung der mobilen Sauna – schliesslich soll sie am Ende ja
                    perfekt auf den Anhänger passen, möglichst kompakt sein und ein einmaliges Saunaerlebnis bieten.
                    Nach langer Planung war es dann so weit.
                    Mitten im Sommer bei grösster Hitze entstand der Dampfwagen aus Massivholz und mit einem echten
                    finnischen Holzofen.
                    Nach vielen kleinen Detailarbeiten war der Moment da, die zweite, grössere und verbesserte mobile
                    Sauna war geboren!
                </p>
                <Fade triggerOnce cascade damping={0.2} delay={500} className="grid justify-items-center w-full">
                    {cards.map(({key, img, title, description}) => (
                        <DampfwageCard key={key} img={img} title={title} description={description}/>
                    ))}
                </Fade>
            </div>
        </Fade>
    )
}

export default Dampfwage
