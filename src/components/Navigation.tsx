import Link from "next/link";

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/dampfwage">Zum Dampfwage</Link>
                </li>
                <li>
                    <Link href="/kontakt">Über</Link>
                </li>
                <li>
                    <Link href="/anfrage">Anfrage</Link>
                </li>
            </ul>
        </nav>
    )
}
