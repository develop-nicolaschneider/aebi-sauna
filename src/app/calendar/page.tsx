"use client"

import {RangeCalendar} from "@nextui-org/calendar"
import {parseDate, DateFormatter} from "@internationalized/date"
import React, {useState} from "react";
// import {useLocale} from "@react-aria/i18n";
import styles from "./Calendar.module.css"

export default function Calendar({minValue, maxValue}) {
    const parsedMinValue = parseDate(minValue)
    const parsedMaxValue = parseDate(maxValue)
    const [focusedDate, setFocusedDate] = React.useState(parsedMinValue);
    const [selectedRange, setSelectedRange] = useState(null)

    const dateFormatter = (date) => {
        const formatter = new DateFormatter(
            "de-CH", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        )
        return formatter.format(new Date(date.toString()))
    }

    let disabledRanges = [
        // [parsedMinValue, parsedMinValue.add({days: 5})],
        // [parsedMinValue.add({days: 14}), parsedMinValue.add({days: 16})],
        // [parsedMinValue.add({days: 23}), parsedMinValue.add({days: 24})],
    ];
    // let {locale} = useLocale();

    let isDateUnavailable = (date) =>
        // isWeekend(date, locale) ||
        disabledRanges.some(
            (interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0,
        )

    const handleDateChange = (range) => {
        setSelectedRange(range);
        console.log("Selected range:", range);
        // send date to server
    };

    return (
        <>
            <RangeCalendar
                classNames={{
                    header: styles.header,
                    title: styles.title,
                    gridHeader: styles.gridHeader,
                    gridHeaderRow: styles.gridHeaderRow
                }}
                aria-label="Date (No Selection)"
                minValue={parsedMinValue}
                maxValue={parsedMaxValue}
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
                isDateUnavailable={isDateUnavailable}
                onChange={handleDateChange}
                color={"primary"}
            />
            {selectedRange && selectedRange.start && selectedRange.end && (
                <div>
                    <p>Startdatum: {dateFormatter(selectedRange.start)}</p>
                    <p>Enddatum: {dateFormatter(selectedRange.end)}</p>
                </div>
            )}
        </>
    )
}
