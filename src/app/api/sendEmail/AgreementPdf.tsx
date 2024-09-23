import React from 'react'
import {Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer'
import {Booking} from "@/types/Booking";

interface AgreementPdfProps {
    emailData: {message: string}
    booking: Booking
}

const styles = StyleSheet.create({
    page: {padding: 30},
    section: {marginBottom: 10},
    heading: {fontSize: 20, marginBottom: 10},
    content: {fontSize: 14},
})

const AgreementPdf = ({emailData, booking}: AgreementPdfProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.heading}>Mietvertrag</Text>
                {/*<Text style={styles.content}></Text>*/}
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Vermieter</Text>
                <Text style={styles.content}>
                    Tobias Aebi<br/>
                    3425 Koppigen<br/>
                    dampfwage@gmail.com
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Mieter</Text>
                <Text style={styles.content}>
                    {`${booking.user?.firstName} ${booking.user?.lastName}`}<br/>
                    {booking.user?.street}<br/>
                    {`${booking.user?.postalCode} ${booking.user?.city}`}<br/>
                    {booking.user?.email}
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Inhalt</Text>
                <Text style={styles.content}>{emailData.message}</Text>
            </View>
        </Page>
    </Document>
)

export default AgreementPdf
