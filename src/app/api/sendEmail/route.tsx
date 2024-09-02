import {NextResponse} from "next/server"
import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"
import {Booking} from "@/utils/firebase"
import ConfirmationEmailTemplate from "@/app/api/sendEmail/ConfirmationEmailTemplate"

export async function POST(req: {
    json: () => PromiseLike<{ email: string; subject: string; booking: Booking }> | {
        email: string
        subject: string
        booking: Booking
    }
}) {
    try {
        const {email, subject, booking} = await req.json()
        console.log(email)
        console.log(subject)
        console.log({booking})
        const { renderToStaticMarkup } = await import( "react-dom/server" )
        const emailContent = renderToStaticMarkup( <ConfirmationEmailTemplate booking={booking}/> )
        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: Number(process.env.GMAIL_PORT),
            secure: process.env.NODE_ENV !== 'development', // Use SSL in production
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        } as SMTPTransport.Options)
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"Dampfwage" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: subject,
            html: emailContent
        }
        console.log('sendEmail', mailOptions)
        await transporter.sendMail(mailOptions)
        return NextResponse.json(
            {message: 'Email sent successfully!'},
            {status: 200}
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {message: 'Failed to send email!'},
            {status: 500},
        )
    }
}
