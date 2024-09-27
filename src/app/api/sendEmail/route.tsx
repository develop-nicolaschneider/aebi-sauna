import {NextRequest, NextResponse} from "next/server"
import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"
import {Booking} from "@/types/Booking"
import RequestSentEmailTemplate from "@/app/api/sendEmail/RequestSentEmailTemplate"
import React from "react"

type EmailProps = {
    email: string,
    subject: string,
    booking: Booking,
}

export async function POST(req: NextRequest) {
    try {
        const {email, subject, booking}: EmailProps = await req.json()
        const {renderToStaticMarkup} = await import( "react-dom/server" )
        const imageSrc = 'https://dampfwage.ch/images/icons/dampfwage-quadrat.svg'
        const emailContent = renderToStaticMarkup(<RequestSentEmailTemplate booking={booking} imageSrc={imageSrc}/>)
        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: process.env.NODE_ENV === 'production' ? 465 : 587,
            secure: process.env.NODE_ENV === 'production',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        } as SMTPTransport.Options)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: emailContent,
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
