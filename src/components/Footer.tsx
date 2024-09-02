import Link from "next/link"
import EmailIconOutlined from '@mui/icons-material/EmailOutlined'
import InstagramIcon from '@mui/icons-material/Instagram'

export default function Footer() {
    return (
        <footer>
            <div id="footer-icons">
                <a href="mailto:info@dampfwage.ch" target="_blank" rel="noopener noreferrer">
                    <EmailIconOutlined/>
                </a>
                <a href="https://www.instagram.com/dampfwage/" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon/>
                </a>
            </div>
            <div id="footer-impressum">
                <Link href={"/impressum"}>
                    Impressum
                </Link>
            </div>
            <div id="footer-disclaimer">
                <Link href={"/disclaimer"}>
                    Disclaimer
                </Link>
            </div>
            <div id="footer-poweredby">
                Powered by <a href="https://nicolaschneider.ch" target="_blank">&copy;nicolaschneider</a>
            </div>
        </footer>
    )
}
