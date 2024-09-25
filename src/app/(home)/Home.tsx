'use client'

import {Button, Card, CardBody, CardHeader, Divider} from "@nextui-org/react"
import {useRouter} from "next/navigation"
import Image from "next/image"
import React from "react"
import dampfwageOutsideOpenDoor from '../../../public/images/home/dampfwage-outside-open-door.jpg'
import dampfwageOutsideEvening from '../../../public/images/home/dampfwage-outside-evening.jpg'
import dampfwageInsideBench from '../../../public/images/home/dampfwage-inside-bench.jpg'
import dampfwageInsideOven from '../../../public/images/home/dampfwage-inside-oven.jpg'
import {Fade} from 'react-awesome-reveal'
import {Swiper, SwiperSlide} from "swiper/react"
import {Pagination, Autoplay, EffectCreative} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import '../styles/styles.css'

const Home = () => {
    const router = useRouter()
    const swiperImages = [
        {
            image: dampfwageOutsideEvening
        },
        {
            image: dampfwageOutsideOpenDoor
        },
        {
            image: dampfwageInsideBench
        },
        {
            image: dampfwageInsideOven
        },
    ]
    return (
        <Fade triggerOnce duration={500}>
            <div id="home"
                 className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center py-0 lg:py-8 min-h-fit">
                <div
                    className="grid grid-flow-row gap-5 justify-items-center place-content-evenly gap-x-10 min-h-72  py-4">
                    <div
                        className="flex flex-col gap-y-1 sm:gap-y-1.5 lg:gap-y-2 w-fit min-h-16 text-center justify-center">
                        <h1 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl md:col-span-2">
                            Dampfwage
                        </h1>
                        <Divider className="bg-primary"/>
                        <h2 className="text-md sm:text-lg lg:text-xl">
                            Die mobile Sauna
                        </h2>
                    </div>
                    <p className="text-center text-sm md:text-base lg:text-lg">
                        Erlebe die pure Entspannung – egal ob gemütlich zu zweit, mit Freunden, Kollegen oder für ein
                        Teamevent jeder Art. Die mobile Dampfwage-Sauna fährt direkt an deinen Wunschort.<br/>
                        Ambiente bietet dir ein traditioneller finnischer Holzofen, indirekte Innenbeleuchtung, ein
                        Panoramafenster für die perfekte Aussicht, ein kleiner Vorraum zum Umziehen und vieles mehr.
                        Bereit, richtig ins Schwitzen zu kommen?<br/>
                        <span className="font-bold">&nbsp; Jetzt ganz einfach einen Termin anfragen!</span>
                    </p>
                    <Button
                        color="primary"
                        radius="lg"
                        onPress={() => router.push('/anfrage')}
                        size="md"
                        variant="shadow"
                    >Anfrage senden!</Button>
                </div>
                <div className="w-full h-full sm:max-w-screen-sm flex justify-center items-center">
                    <Card
                        className="w-full h-fit rounded-md max-w-sm"
                        shadow="md"
                        radius="none">
                        <CardHeader className="pb-0 py-2 p-4 flex-col items-start">
                            <h4 className="font-bold text-medium sm:text-large">Mobile Sauna mit Holzofen</h4>
                            <small className="text-default-500 ">Geliefert rund um Koppigen</small>
                        </CardHeader>
                        <CardBody className="overflow-visible relative p-0 contain-inline-size">
                            <Swiper
                                loop
                                effect="creative"
                                grabCursor
                                speed={1000}
                                creativeEffect={{
                                    prev: {
                                        shadow: true,
                                        translate: [0, 0, -400],
                                    },
                                    next: {
                                        translate: ['100%', 0, 0],
                                    },
                                }}
                                pagination
                                autoplay={{delay: 5000, pauseOnMouseEnter: true}}
                                modules={[EffectCreative, Pagination, Autoplay]}
                                className="w-full h-auto max-w-sm">
                                {swiperImages.map(({image}, index) => (
                                    <SwiperSlide
                                        key={`slide-${index}`}
                                        className="flex justify-center items-center">
                                        <Image
                                            priority
                                            loading="eager"
                                            key={`image-${index}`}
                                            src={image}
                                            sizes="fill"
                                            style={{
                                                width: '100%',
                                                height: 'auto'
                                            }}
                                            placeholder="blur"
                                            alt="Bild mobile Sauna"
                                            className="transition-transform duration-300 transform hover:scale-105"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </Fade>
    )
}

export default Home
