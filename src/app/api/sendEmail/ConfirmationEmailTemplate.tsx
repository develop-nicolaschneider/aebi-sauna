import {Booking} from "@/utils/firebase"
import convertToChDate from "@/utils/ConvertToChDate"

type ConfirmationEmailTemplateProps = {
    booking: Booking
}

const ConfirmationEmailTemplate = ({booking}: ConfirmationEmailTemplateProps) => (
    <html lang="de">
    <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Buchungsbestätigung</title>
        <style>
            {`
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
                        background-color: #004085;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h2 {
                        color: #004085;
                    }
                    .content p {
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #777;
                    }
                `}
        </style>
    </head>
    <body>
    <div className="container">
        <div className="header">
            <h1>Buchungsbestätigung</h1>
        </div>
        <div className="content">
            <h2>
                Hallo {booking.user?.firstName} {booking.user?.lastName},
            </h2>
            <p>Wir freuen uns, Ihnen mitzuteilen, dass Ihre Buchung erfolgreich bestätigt wurde.</p>
            <p>Hier sind die Details Ihrer Buchung:</p>
            <ul>
                <li>
                    <strong>Buchungsnummer:</strong> {booking.id}
                </li>
                <li>
                    <strong>Buchungsdatum:</strong> {convertToChDate(booking.booking_date)}
                </li>
                <li>
                    <strong>Buchungszeitraum:</strong> {convertToChDate(booking.booking_from)} bis {convertToChDate(booking.booking_to)}
                </li>
            </ul>
            <p>Falls Sie noch Fragen haben, zögern Sie bitte nicht, uns zu kontaktieren.</p>
            <p>Mit freundlichen Grüßen,</p>
            <p>Ihr Dampfwage-Team</p>
        </div>
        <div className="footer">
            <p>&copy; 2024 Dampfwage. Alle Rechte vorbehalten.</p>
        </div>
    </div>
    </body>
    </html>
)

export default ConfirmationEmailTemplate
