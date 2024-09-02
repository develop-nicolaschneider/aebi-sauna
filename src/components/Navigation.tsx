'use client'

import {useState} from "react"
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Link
} from "@nextui-org/react"
import Image from "next/image"

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        // <nav>
        //     <ul>
        //         <li>
        //             <Link href="/dampfwage">Zum Dampfwage</Link>
        //         </li>
        //         <li>
        //             <Link href="/kontakt">Über mich</Link>
        //         </li>
        //         <li>
        //             <Link href="/anfrage">Anfrage</Link>
        //         </li>
        //         <li>
        //             <Link href="/anfrage/meine-anfrage">Meine Anfragen</Link>
        //         </li>
        //     </ul>
        // </nav>
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarBrand>
                        <Image
                            src="/Dampfwage-quadrat.svg"
                            alt="Dampfwage-Logo"
                            width="60"
                            height="60"
                        />
                        <p className="font-bold text-inherit">Dampfwage</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#" aria-current="page">
                            Customers
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Integrations
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                        <Link href="#">Login</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Menü schliessen" : "Menü öffnen"}
                            className="sm:hidden"
                        />
                    </NavbarItem>
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>
                        <Link
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            Anfrage
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            Meine Anfrage prüfen
                        </Link>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
        </>
    )
}
