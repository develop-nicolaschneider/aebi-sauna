'use client'

import React, {useEffect, useState} from "react"
import {usePathname, useRouter} from "next/navigation"
import {
    Button,
    link,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu, NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/react"
import NextLink from "next/link"
import DampfwageLogo from "@/components/DampfwageLogo"
import clsx from "clsx"
import {useUserSession} from "@/hooks/use-user-session";
import {signOut} from "@/utils/firebaseAuth";
import {deleteSession} from "@/utils/session";
import LogoutIcon from "@mui/icons-material/Logout";

interface NavigationProps {
    session: null | string
}

const Navigation = ({session}: NavigationProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    const userSessionId = useUserSession(session);

    const handleSignOut = async () => {
        await signOut()
        await deleteSession()
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault()
                router.push('/dashboard') // Redirect to the dashboard
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [router])

    return (
        <Navbar
            maxWidth="full"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            height="4rem">
            <NavbarContent className="min-w-48" justify="start">
                <NavbarBrand className="flex gap-4">
                    <Link
                        as={NextLink}
                        color="foreground"
                        href="/"
                        onPress={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4">
                        <DampfwageLogo
                            className="p-2"
                            height="80px"
                            width="80px"/>
                        <p className={`text-inherit ${usePathname() === '/' ? 'font-bold' : ''}`}>Dampfwage</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-10" justify="end">
                <NavbarItem isActive={usePathname() === '/anfrage/meine-anfrage'}>
                    <Link as={NextLink} color="foreground" href="/anfrage/meine-anfrage">
                        Meine Anfrage
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={usePathname() === '/anfrage'}>
                    <Link as={NextLink} className={clsx(
                        link({color: 'primary'}),
                        "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )} href="/anfrage">
                        Anfrage
                    </Link>
                </NavbarItem>
                {userSessionId &&
                    <NavbarItem>
                        <Button
                            title="Logout"
                            color="danger"
                            fullWidth={false}
                            className="w-fit"
                            size="sm"
                            onPress={() => handleSignOut()}
                            isIconOnly
                            endContent={<LogoutIcon/>}/>
                    </NavbarItem>
                }
            </NavbarContent>
            <NavbarContent className="sm:hidden" justify="end">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Menü schliessen" : "Menü öffnen"}
                />
            </NavbarContent>
            <NavbarMenu>
                <NavbarMenuItem>
                    <Link
                        as={NextLink}
                        onPress={() => setIsMenuOpen(false)}
                        color="foreground"
                        className="w-full font-bold"
                        href="/#howItWorks">
                        So funktioniert&apos;s
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        onPress={() => setIsMenuOpen(false)}
                        color="foreground"
                        className="w-full font-bold"
                        href="/#dampfwage">
                        Zum Dampfwage
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        onPress={() => setIsMenuOpen(false)}
                        color="foreground"
                        className="w-full font-bold"
                        href="/#price">
                        Preise
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        as={NextLink}
                        onPress={() => setIsMenuOpen(false)}
                        color="foreground"
                        className="w-full font-bold"
                        href="/#about">
                        Über mich
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        className="w-full font-bold"
                        href="/anfrage/meine-anfrage">
                        Meine Anfrage prüfen
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        color="primary"
                        className="w-full font-bold"
                        href="/anfrage">
                        Anfrage
                    </Link>
                </NavbarMenuItem>
                {userSessionId &&
                    <NavbarMenuItem>
                        <Button
                            color="danger"
                            fullWidth={false}
                            className="w-fit"
                            size="sm"
                            onPress={() => handleSignOut()}>
                            Logout
                        </Button>
                    </NavbarMenuItem>
                }
            </NavbarMenu>
        </Navbar>
    )
}

export default Navigation
