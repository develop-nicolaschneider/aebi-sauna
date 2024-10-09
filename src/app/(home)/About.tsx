'use client'

import {Fade} from "react-awesome-reveal"
import React from "react"
import Image from "next/image"
import aboutImage from '../../../public/images/about/about-tobias.jpg'

const About = () => {
    return (
        <Fade triggerOnce duration={500} cascade damping={0.2} delay={200}>
            <div id="ueber-mich"
                 className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center content-center py-7">
                <h1 className="col-span-1 lg:col-span-2 font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Über mich
                </h1>
                <div className="flex justify-center items-center">
                    <Image
                        alt="Bild von Tobias Aebi"
                        width={600}
                        height={600}
                        src={aboutImage}
                        className="rounded-full shadow-xl transition-transform duration-300 transform hover:scale-105"
                    />
                </div>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 text-center content-center">
                    «Dampfwage» habe ich ins Leben gerufen, weil ich gerne sauniere, um die kalten Wintermonate
                    angenehmer zu gestalten und weil es einfach sehr gesund und entspannend ist. Da ich gerne kleinere
                    Projekte verwirkliche, wurde aus einer Idee Wirklichkeit. In Eigenregie baute ich mir den
                    «Dampfwage» ganz nach meinen Wünschen und Vorstellungen. Gerne teile ich jetzt das Erlebnis der
                    mobilen Sauna.<br/>
                    <small className="leading-loose block pt-2">Tobias Aebi</small>
                </p>
            </div>
        </Fade>
    )
}

export default About
