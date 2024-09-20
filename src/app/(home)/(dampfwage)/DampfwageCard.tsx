import {Card, CardBody, CardFooter} from "@nextui-org/react"
import Image from "next/image"
import {StaticImport} from "next/dist/shared/lib/get-img-props"
import {Autoplay, Pagination} from "swiper/modules"
import {Swiper, SwiperSlide} from "swiper/react"

interface DampfwageCardProps {
    img: StaticImport[]
    title: string
    description: string
}

export const DampfwageCard = ({img, title, description}: DampfwageCardProps) => {

    return (
        <Card className="grid grid-flow-row content-start rounded-md h-full w-full max-w-sm"
              radius="none"
              shadow="md">
            <CardBody className="p-0 overflow-hidden h-fit">
                {img.length > 1 ?
                    <Swiper
                        loop
                        pagination
                        autoplay={{delay: 3000, pauseOnMouseEnter: true}}
                        modules={[Pagination, Autoplay]}
                        className="w-full h-auto">
                        {img.map((img, index) => (
                            <SwiperSlide
                                key={`slide-${index}`}
                                className="flex justify-center items-center">
                                <Image
                                    key={`image-${index}`}
                                    src={img}
                                    sizes="100vw"
                                    style={{
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                    placeholder="blur"
                                    alt="Bild mobile Sauna"
                                    className="ransition-transform duration-300 transform hover:scale-105"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    :
                    <Image
                        src={img[0]}
                        sizes="100vw"
                        placeholder="blur"
                        alt="Bild mobile Sauna"
                        className="object-cover h-auto w-full transition-transform duration-300 transform hover:scale-105"
                    />
                }
            </CardBody>
            <CardFooter className="flex flex-col gap-2 h-full place-self-start">
                <h4 className="font-bold text-medium sm:text-large">{title}</h4>
                <small className="text-default-500 leading-5">{description}</small>
            </CardFooter>
        </Card>
    )
}
