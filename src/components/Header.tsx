import Image from "next/image"
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Header() {
    return (
        <header>
            <Link href="/">
                <Image
                    src="/Dampfwage-quadrat.svg"
                    alt="dampfwage-logo"
                    width="60"
                    height="60"
                    className="header-dampfwage-logo"
                />
            </Link>
            <Navigation/>
        </header>
    )
}
