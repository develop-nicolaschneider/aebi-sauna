import Link from "next/link";

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/dampfwage">Zum Dampfwage</Link>
                </li>
                <li>
                    <Link href="/kontakt">Über mich</Link>
                </li>
                <li>
                    <Link href="/anfrage">Anfrage</Link>
                </li>
                <li>
                    <Link href="/anfrage/meine-anfragen">Meine Anfragen</Link>
                </li>
            </ul>
        </nav>
    )
}
