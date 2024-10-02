'use client'

import EmailIconOutlined from '@mui/icons-material/EmailOutlined'
import {Divider, link, Link} from "@nextui-org/react"
import clsx from "clsx"
import {getLocalTimeZone, today} from "@internationalized/date"
import NextLink from "next/link"

export default function Footer() {

    return (
        <footer className="flex items-center flex-col px-4 py-10 w-full m-0">
            <div id="footer-icons">
                <Link
                    isBlock
                    isExternal
                    href="mailto:dampfwage@gmail.com?subject=Anfrage Dampfwage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm">
                    Kontakt via Email &nbsp; <EmailIconOutlined fontSize="inherit"
                                                                className={clsx(link({color: 'primary'}))}/>
                </Link>
            </div>
            <div className="flex flex-col justify-center sm:flex-row items-center h-fit space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 my-4">
                <Link
                    href="/impressum"
                    as={NextLink}
                    className="text-xs sm:text-sm">
                    Impressum
                </Link>
                <Divider orientation="vertical" className="hidden sm:inline bg-zinc-400"/>
                <Link
                    isExternal
                    href="/files/Nutzungsbedingungen.pdf"
                    as={NextLink}
                    className="text-xs sm:text-sm">
                    Nutzungsbedingungen
                </Link>
                <Divider orientation="vertical" className="hidden sm:inline bg-zinc-400"/>
                <Link
                    href="/disclaimer"
                    as={NextLink}
                    className="text-xs sm:text-sm">
                    Datenschutz
                </Link>
            </div>
            <div id="footer-poweredby" className="flex h-5 items-center space-x-2 text-xs text-zinc-400 mt-2">
                <div>{today(getLocalTimeZone()).year.toString()}</div>
                <Divider orientation="vertical" className="bg-zinc-400"/>
                <div>
                    Powered by
                    <Link isExternal href="https://nicolaschneider.ch" target="_blank"
                          className="text-inherit text-xs hover:text-zinc-600">
                        &nbsp;&copy;nicolaschneider
                    </Link>
                </div>
            </div>
        </footer>
    )
}
