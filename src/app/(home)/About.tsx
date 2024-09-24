'use client'

import {Fade} from "react-awesome-reveal"
import React from "react"
import Image from "next/image"
import aboutImage from '../../../public/images/about/about-tobias.jpg'

const About = () => {
    return (
        <Fade triggerOnce duration={500} cascade damping={0.2} delay={200}>
            <div id="about"
                 className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 gap-4 justify-items-center content-center py-7">
                <h1 className="col-span-1 md:col-span-2 font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Über mich
                </h1>
                <div className="flex justify-center items-center col-start-1 col-end-2 lg:row-span-2">
                    <Image
                        alt="Bild von Tobias Aebi"
                        width={600}
                        height={600}
                        src={aboutImage}
                        className="rounded-full shadow-xl transition-transform duration-300 transform hover:scale-105"
                    />
                </div>
                <q className="col-start-1 col-end-2 lg:col-start-2 lg:col-end-3 lg:justify-self-end font-semibold text-sm sm:text-base content-center lg:content-end text-center">
                    Weil ich das Erlebnis einer Sauna gerne mit anderen Leuten teile, ist daraus der fahrbare
                    «Dampfwage» entstanden.
                </q>
                <p className="row-span-1 md:row-span-2 lg:row-span-1 text-xs sm:text-xs md:text-sm lg:text-base mb-2 text-center content-center">
                    Tobias Aebi ist mein Name und ich bin der Gründer von «Dampfwage»
                    Gerne bin ich in der Natur unterwegs treibe oft Sport und mag den Sommer einfach lieber als den
                    Winter. Eine Sache, die mir die dunklen Monate jedoch etwas kurzweiliger erscheinen lässt:
                    Regelmässige Saunagänge! Das ist nicht nur gesund und stärkt das Immunsystem, nein es ist auch
                    sehr erholsam und macht
                    mir auch richtig viel Spass. Das Realisieren von kleineren und grösseren Projekten bereitet mir
                    Freude und haben mich
                    schlussendlich auch auf die Idee gebracht, selbst eine Sauna zu bauen.
                </p>
            </div>
        </Fade>
    )
}

export default About
