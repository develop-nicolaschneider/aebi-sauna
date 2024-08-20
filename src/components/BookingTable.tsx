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
import BookingState from "@/utils/BookingState"

type BookingTableProps = {
    rows: { key: string, description: string, value: string }[]
    columns: { key: string, label: string }[]
}

export const BookingTable = ({rows, columns}: BookingTableProps) => {

    const statusColorMap: Record<string, "danger" | "success" | "warning"> = {
        PENDING: 'warning',
        CONFIRMED: 'success',
        CANCELLED: 'danger',
    }
    const statusTooltipMap: Record<string, string> = {
        PENDING: 'Anfrage wird geprüft',
        CONFIRMED: 'Anfrage wurde bestätigt',
        CANCELLED: 'Anfrage wurde abgelehnt',
    }

    function getKeyByValue(value: string) {
        const key = Object.keys(BookingState).find(key => BookingState[key] === value)
        return key ? key : "PRIMARY"
    }

    return (
        <Table aria-label="Buchungstabelle" selectionMode="single">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.key}>
                        {(columnKey) =>
                            <TableCell>
                                {statusTooltipMap[getKeyByValue(item['value'])] && columnKey === 'value' ?
                                    <Tooltip content={statusTooltipMap[getKeyByValue(item['value'])]}>
                                        <Chip color={statusColorMap[getKeyByValue(item['value'])]} variant="flat">
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
