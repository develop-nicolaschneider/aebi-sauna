'use client'

import NextLink from "next/link"
import {Link} from "@nextui-org/react"
import {Fade} from "react-awesome-reveal"
import React from "react"

const UsageRegulations = () => {

    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="howItWorks"
                 className="grid grid-cols-1 gap-8 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Nutzungsbedingungen
                </h1>
                <div>
                    <div className="max-w-lg text-xs sm:text-xs md:text-sm lg:text-base text-center">
                        Hier findest du die
                        <Link
                            isExternal href="/files/Nutzungsbedingungen.pdf"
                            target="_blank"
                            as={NextLink}
                            className="text-xs sm:text-xs md:text-sm lg:text-base">
                            &nbsp;Nutzungsbedingungen als PDF.
                        </Link>
                    </div>
                </div>
            </div>
        </Fade>
    )
}

export default UsageRegulations
