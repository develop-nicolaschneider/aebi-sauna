'use client'

import {Fade} from "react-awesome-reveal"
import React from "react"
import SendIcon from '@mui/icons-material/Send'
import ReplyIcon from '@mui/icons-material/Reply'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import ChecklistIcon from '@mui/icons-material/Checklist'
import DoneIcon from '@mui/icons-material/Done'
import HowItWorksCard from "@/app/(home)/(howItWorks)/HowItWorksCard"
import icon from '../../../../public/images/icons/DampfwageIconFilled.svg'
import Image from "next/image"
import {Divider} from "@nextui-org/react";

const HowItWorks = () => {
    const items = [
        {
            icon: <SendIcon className="-rotate-12"/>,
            title: 'Anfrage senden',
            description: 'Du kontaktierst mich über das Anfrage-Formular und gibst Deinen Wunschtermin ein.',
            color: 'bg-yellow-100'
        },
        {
            icon: <ReplyIcon fontSize="large"/>,
            title: 'Rückmeldung',
            description: 'Deine Anfrage oder Dein Anliegen wird rasch bearbeitet damit du schnellstmöglich eine Rückmeldung erhältst.',
            color: 'bg-yellow-200'
        },
        {
            icon: <QuestionAnswerIcon/>,
            title: 'Bestätigung',
            description: 'Im Anschluss erhältst Du den Mietvertrag. Du bestätigst mir diesen und bezahlst mir die Miete + Kaution.',
            color: 'bg-yellow-300'
        },
        {
            icon: <Image src={icon} alt="dampfwage-icon" height={40} width={40}/>,
            title: 'Auslieferung',
            description: 'Am vereinbarten Termin wird die Sauna bequem an Deinen gewünschten Ort zur abgemachten Zeit geliefert.',
            color: 'bg-yellow-400'
        }
    ]

    const advantages = [
        "Sauniere wo du willst, für 4-6 Personen",
        "Finnischer Holzofen",
        "Eine Kiste Holz für ca. 4 Stunden saunieren ist inklusive (weitere können dazu gekauft werden)",
        "Saunakübel mit Schöpfkelle für Aufgüsse",
        "Panoramafenster",
        "Vorraum zum Umziehen, Taschen verstauen, Gegenstände deponieren",
        "Eine kleine Garderobe um Utensilien aufzuhängen",
        "Indirekte Innenbeleuchtung"
    ]

    return (
        <Fade triggerOnce duration={500} delay={200}>
            <div id="howItWorks"
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center content-center py-7">
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl col-span-1 sm:col-span-2 lg:col-span-4">
                    So funktioniert&apos;s
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 col-span-1 sm:col-span-2 lg:col-span-4 text-center">
                    Bereit, den Dampfwagen zu mieten?
                </p>
                <Fade triggerOnce cascade damping={0.2} className="grid justify-items-center w-full h-full">
                    {items.map(({icon, title, description, color}, index) => (
                        <HowItWorksCard key={index} cardNumber={index + 1} icon={icon} title={title}
                                        description={description}
                                        color={color}/>
                    ))}
                </Fade>
                <Fade triggerOnce delay={500} duration={500}
                      className="grid col-span-1 sm:col-span-2 lg:col-span-4 justify-items-center w-full h-full pt-4">
                    <div className="w-full max-w-2xl h-fit justify-items-center">
                        <HowItWorksCard
                            icon={<ChecklistIcon/>}
                            title="Deine Vorteile"
                            description={
                                <ul>{advantages.map((value, index) => (
                                    <Fade key={"fade-" + index} triggerOnce cascade damping={0.1} delay={500}>
                                        <li key={"list-" + index} className="flex items-center space-x-2 hover:font-medium">
                                            <DoneIcon className="text-primary" fontSize="small"/>
                                            <span>{value}</span>
                                        </li>
                                        {index < advantages.length - 1 &&
                                            <Divider orientation="horizontal" className="w-full m-1"/>
                                        }
                                    </Fade>
                                ))}
                                </ul>
                            }
                            color="border-2 border-primary"/>
                    </div>
                </Fade>
            </div>
        </Fade>
    )
}

export default HowItWorks
