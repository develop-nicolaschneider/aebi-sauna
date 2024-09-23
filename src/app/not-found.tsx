import React from "react"
import NextLink from "next/link"
import {Link} from "@nextui-org/react"

const NotFound = () => {
    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 justify-items-center content-center py-7">
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl md:col-span-2">
                Not Found
            </h1>
            <p className="text-xs sm:text-xs md:text-sm lg:text-base mb-2 md:col-span-2 text-center">
                Diese Seite wurde nicht gefunden.<br/>
                <Link
                    href="/"
                    as={NextLink}
                    className="text-sm sm:text-sm md:text-base">
                    Zurück zum Dampfwage
                </Link>
            </p>

        </div>
    )
}

export default NotFound
