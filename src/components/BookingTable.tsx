'use client'

import {
    Chip,
    getKeyValue,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@nextui-org/react"
import {BookingStateColor, BookingStateStatus, getKeyByValue} from "@/types/BookingState"
import React from "react"

type BookingTableProps = {
    rows: { description: string, value: string }[]
    columns: { key: string, label: string }[]
    bottomContent?: React.JSX.Element | undefined
}

export const BookingTable = ({rows, columns, bottomContent = undefined}: BookingTableProps) => {

    return (
        <Table
            classNames={{
                td: 'text-xs sm:text-sm md:text-base',
            }}
            aria-label="Buchungstabelle"
            selectionMode="single"
            hideHeader
            bottomContent={bottomContent !== undefined ? bottomContent : ''}>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.description.toLowerCase().replace(' ', '')}>
                        {(columnKey) =>
                            <TableCell>
                                {BookingStateStatus[getKeyByValue(item['value'])] && columnKey === 'value' ?
                                    <Tooltip content={BookingStateStatus[getKeyByValue(item['value'])]}>
                                        <Chip color={BookingStateColor[getKeyByValue(item['value'])]} variant="flat">
                                            {getKeyValue(item, columnKey)}
                                        </Chip>
                                    </Tooltip> :
                                    getKeyValue(item, columnKey)
                                }
                            </TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
