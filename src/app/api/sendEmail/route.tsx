import {NextRequest, NextResponse} from "next/server"
import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"
import {Booking} from "@/types/Booking"
import ConfirmationEmailTemplate from "@/app/api/sendEmail/ConfirmationEmailTemplate"

export async function POST(req: NextRequest) {
    try {
        const { email, subject, booking }: { email: string; subject: string; booking: Booking } = await req.json();
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
