import {Accordion, AccordionItem} from "@nextui-org/react"
import React from "react"

type accordionItems = {
    title: string
    price: string
    subtitle: string
    description: string
}[]

interface PriceAccordionProps {
    items: accordionItems
    title: string
}

const PriceAccordion = (props: PriceAccordionProps) => (
    <div className="w-full h-fit grid grid-cols-1 justify-items-center">
        <h2 className="h-fit font-bold text-base sm:text-large">{props.title}</h2>
        <Accordion className="grid grid-cols-1 justify-center max-w-xl">
            {props.items.map(({title, price, subtitle, description}, index) => (
                <AccordionItem
                    key={index}
                    title=
                        {<div
                            className="grid grid-flow-col justify-between text-sm sm:text-base md:text-large">
                            <span>{title}</span>
                            <span className="font-bold">{price}</span>
                        </div>}
                    subtitle=
                        {<span className="text-xs sm:text-sm md:text-md text-zinc-500">{subtitle}</span>}
                    aria-label={"Accordion-" + index}>
                    <p className="text-xs md:text-sm whitespace-pre-line">{description}</p>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
)

export default PriceAccordion
