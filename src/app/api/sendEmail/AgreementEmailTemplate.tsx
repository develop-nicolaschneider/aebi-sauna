'use server'

import {Booking} from "@/types/Booking"
import convertToChDate from "@/utils/ConvertToChDate"

type ConfirmationEmailTemplateProps = {
    booking: Booking
    imageSrc: string
}

const AgreementEmailTemplate = ({booking, imageSrc}: ConfirmationEmailTemplateProps) => (
    <html lang="de">
    <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Anfrage bestätigt & Mietvertrag</title>
        <style>{`
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #C4841D;
                color: #fff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin: 10px 0;
            }
            .noMarginBottom {
                margin-bottom: 0 !important;
            }
            .noMarginTop {
                margin-top: 0 !important;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777;
            }
            .preLine {
                white-space: pre-line;
            }
        `}</style>
    </head>
    <body>
    <div className="container">
        <div className="header">
            <h1>Anfrage bestätigt & Mietvertrag</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="dampfwage-logo" src={imageSrc} height={60} width={60}/>
        </div>
        <div className="content">
            <h2>
                Hallo {booking.user?.firstName},
            </h2>
            <p>Deine Anfrage für den &quote;Dampfwage&quote; ist hiermit bestätigt!</p>
            <p>Damit ich Dir die mobile Sauna wie angefragt vorbeibringe, bestätige mir den Mietvertrag mit einer
                Antwort auf diese Email.<br/>
                Bitte stelle sicher, dass Du den Mietpreis sowie den Mietpreis bei Auslieferung Bar oder mit Twint bezahlst.
            </p>
            <p className="noMarginBottom"><strong>Hier nochmals die Details zu Deiner Anfrage:</strong></p>
            <ul className="noMarginTop">
                <li>
                    <strong>Angefragt am:</strong> {convertToChDate(booking.booking_date)}
                </li>
                <li>
                    <strong>Buchungsnummer:</strong> {booking.id}
                </li>
                {booking.booking_from !== '' &&
                    <li>
                        <strong>Anfrage vom:</strong>
                        &nbsp;{convertToChDate(booking.booking_from)} bis {convertToChDate(booking.booking_to)}
                    </li>
                }
                {booking.remarks && booking.remarks !== '' &&
                    <li className="preLine">
                        <strong>Bemerkungen:</strong> {booking.remarks}
                    </li>
                }
            </ul>
            <p>Falls Du noch Fragen hast, zögere nicht mich zu kontaktieren.</p>
            <p className="noMarginBottom">Beste Grüßen</p>
            <p className="noMarginTop">Tobias Aebi</p>
        </div>
        <div className="footer">
            <p>&copy; 2024 Dampfwage. Alle Rechte vorbehalten.</p>
        </div>
    </div>
    </body>
    </html>
)

export default AgreementEmailTemplate
