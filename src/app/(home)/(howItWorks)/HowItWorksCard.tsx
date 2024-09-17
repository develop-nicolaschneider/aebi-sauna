import {Card, CardBody, CardHeader} from "@nextui-org/react"
import React from "react"

interface HowItWorksCardProps {
    cardNumber?: number
    icon: React.JSX.Element
    title: string
    description: string | React.JSX.Element
    color: string
}

const HowItWorks = (props: HowItWorksCardProps) => (
    <Card className={`content-start rounded-md h-full w-full hover:scale-105 ${props.color}`}
          radius="none"
          shadow="md">
        <CardHeader className="font-bold text-base grid grid-flow-col justify-between">
            <h3 className="align-text-bottom">
                {props.cardNumber &&
                    <span className="text-2xl">{props.cardNumber}.&nbsp;</span>
                }
                <span className="text-nowrap">{props.title}</span>
            </h3>
            {props.icon}
        </CardHeader>
        <CardBody className="p-4 text-sm md:text-base">
            {props.description}
        </CardBody>
    </Card>
)

export default HowItWorks
