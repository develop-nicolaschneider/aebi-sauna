import fs from 'fs'
import path from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { NextResponse } from 'next/server'
import ConvertToChDate from "@/utils/ConvertToChDate"

export async function POST(req: Request) {
    try {
        const { booking, data } = await req.json()
        const templatePath = path.resolve('src/app/api/createContract/templates/dampfwage-mietvertrag.docx')
        const templateContent = fs.readFileSync(templatePath, 'binary')
        const zip = new PizZip(templateContent)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        })
        console.log(booking)
        console.log(data)
        console.log(ConvertToChDate(booking.booking_from.toString(), 'md') as string || '',
            ConvertToChDate(booking.booking_to.toString(), 'md') as string || '',
            ConvertToChDate(`1970-01-01T${data.fromTime.toString()}Z`, 'st') as string || '',
            ConvertToChDate(`1970-01-01T${data.toTime.toString()}Z`, 'st') as string || '',
        )
        doc.setData({
            bookingName: `${booking.user.firstName} ${booking.user.lastName}` || '',
            bookingStreet: booking.user.street.toString() || '',
            bookingCity:  `${booking.user.postalCode} ${booking.user.city}` || '',
            bookingPhone: booking.user.phoneNumber.toString() || '',
            bookingEmail: booking.user.id.toString() || '',
            fromDate: ConvertToChDate(booking.booking_from.toString(), 'bd') as string || '',
            toDate: ConvertToChDate(booking.booking_to.toString(), 'bd') as string || '',
            fromTime: ConvertToChDate(`1970-01-01T${data.fromTime.toString()}Z`, 'st') as string || '',
            toTime: ConvertToChDate(`1970-01-01T${data.toTime.toString()}Z`, 'st') as string || '',
            priceSauna: data.priceSauna.toString() || '',
            priceWood: data.priceWood.toString() || '',
            priceDelivery: data.priceDelivery.toString() || '',
            priceAdd: data.priceAdd.toString() || '',
            priceTotal: data.priceTotal.toString() || '',
        })

        doc.render()
        const buffer = doc.getZip().generate({ type: 'nodebuffer' })
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="dampfwage-mietvertrag-filled.docx"',
            },
        })
    } catch (error) {
        console.error('Error generating document:', error)
        return new NextResponse('Error generating document', { status: 500 })
    }
}
