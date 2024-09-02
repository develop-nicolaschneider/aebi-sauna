'use client'

import LogoutIcon from '@mui/icons-material/Logout'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import {
    Button,
    Chip,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    User,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
    SharedSelection,
    Selection,
    useDisclosure,
    ButtonGroup
} from "@nextui-org/react"
import {Booking, deleteBooking, getBookings, logout, updateBookingState} from "@/utils/firebase"
import React, {Fragment, useCallback, useMemo, useState} from "react"
import {BookingDateFilter, BookingState, getColorByValue, getDateFilterKey, getKeyByValue} from "@/utils/BookingState"
import ConvertToChDate from "@/utils/ConvertToChDate"
import {useAsyncList} from "@react-stately/data"
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FilterListIcon from '@mui/icons-material/FilterList'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import {EditBookingModal} from "@/components/EditBookingModal"
import {ModalComponent} from "@/components/ModalComponent"
import {BookingTable} from "@/components/BookingTable"
import {getLocalTimeZone, parseDate, today} from "@internationalized/date"

const bookingColumns = [
    {key: "user", label: "Kontakt"},
    {key: "booking_from", label: "Gebucht vom"},
    {key: "booking_to", label: "Gebucht bis"},
    {key: "booking_date", label: "Gebucht am"},
    {key: "booking_state", label: "Status"},
    {key: "edit", label: "Edit"},
]

const Dashboard = () => {
    const [filterValue, setFilterValue] = useState('')
    const [statusFilter, setStatusFilter] = useState<Selection>('all')
    const [dateFilter, setDateFilter] = useState<Selection>('all')
    const hasSearchFilter = Boolean(filterValue)
    const [, setSelectedState] = useState<SharedSelection>(new Set([]))
    const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure()
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange} = useDisclosure()
    const [editBooking, setEditBooking] = useState<Booking>()
    const [modalContent, setModalContent] = useState({
        title: "",
        handleAction: () => {
        },
        actionText: "",
        content: <Fragment/>,
    })

    let list = useAsyncList<Booking>({
        async load() {
            const bookingList = await getBookings(false)
            const initialStates: Record<string, string> = {}
            if (bookingList !== null) {
                bookingList.forEach((booking) => {
                    initialStates[booking.id] = getKeyByValue(booking.booking_state)
                })
            }
            const sortedItems = bookingList?.sort((a, b) => {
                return new Date(a.booking_from).getTime() - new Date(b.booking_from).getTime()
            }) || []
            return {
                items: sortedItems,
                sortDescriptor: {
                    column: 'booking_from',
                    direction: 'ascending'
                }
            }
        },
        async sort({items, sortDescriptor}) {
            return {
                items: items.sort((a, b) => {
                    const direction = (sortDescriptor.direction === 'descending') ? 1 : -1
                    let first: string | undefined
                    let second: string | undefined
                    if (sortDescriptor.column === 'user') {
                        first = a.user?.firstName
                        second = b.user?.firstName
                    } else if (sortDescriptor.column === 'booking_state') {
                        first = a[sortDescriptor.column]
                        second = b[sortDescriptor.column]
                    } else if (sortDescriptor.column === 'booking_from' ||
                        sortDescriptor.column === 'booking_to' ||
                        sortDescriptor.column === 'booking_date') {
                        return direction * (new Date(b[sortDescriptor.column]).getTime() - new Date(a[sortDescriptor.column]).getTime())
                    }
                    if (first && second) {
                        let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? 1 : -1
                        return direction * cmp
                    }
                    return 0
                }),
            }
        },
    })

    const filteredItems = React.useMemo(() => {
        let filteredBookings = [...list.items]
        if (hasSearchFilter) {
            filteredBookings = filteredBookings.filter((booking) => {
                    const name = booking.user !== null ? booking.user.firstName.toLowerCase() + ' ' + booking.user?.lastName.toLowerCase() : ''
                    return name.includes(filterValue.toLowerCase())
                }
            )
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== Object.entries(BookingState).length) {
            filteredBookings = filteredBookings.filter((booking) => {
                return Array.from(statusFilter).includes(getKeyByValue(booking.booking_state))
            })
        }
        if (dateFilter !== 'all' && Array.from(dateFilter).length !== Object.entries(BookingDateFilter).length) {
            filteredBookings = filteredBookings.filter((booking) => {
                if (Array.from(dateFilter).includes(getDateFilterKey(BookingDateFilter.OLD_ENTRIES))) {
                    return parseDate(booking.booking_from).compare(today(getLocalTimeZone())) < 0
                } else if (Array.from(dateFilter).includes(getDateFilterKey(BookingDateFilter.NEW_ENTRIES))) {
                    return parseDate(booking.booking_from).compare(today(getLocalTimeZone())) > 0
                }
            })
        }
        return filteredBookings
    }, [filterValue, hasSearchFilter, list.items, dateFilter, statusFilter])

    const handleSelectChange = async (id: string, value: SharedSelection, booking: Booking) => {
        if (id && value.currentKey) {
            try {
                await updateBookingState(id, BookingState[value.currentKey]).then()
                if (Boolean(process.env.NEXT_PUBLIC_SEND_EMAILS) && BookingState.CONFIRMED === BookingState[value.currentKey]) {
                    try {
                        const res = await fetch('api/sendEmail', {
                            method: 'POST',
                            headers: {'content-type': 'application/json'},
                            body: JSON.stringify({
                                email: booking?.user?.id,
                                subject: 'Buchungsbestätigung',
                                booking: booking
                            })
                        })
                        await res.json()
                        if (res.ok) {
                            console.log(res)
                        } else {
                            console.log(res)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
                list.reload()
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handleEditModal = (booking: Booking) => {
        setEditBooking(booking)
        onEditOpen()
    }

    const handleEditReload = () => {
        list.reload()
    }

    const handleDeleteModal = (booking: Booking) => {
        const user = booking.user
        const formCheckRows = [
            {
                key: '1',
                description: 'Datum von',
                value: booking ? ConvertToChDate(booking.booking_from.toString()) as string : ''
            },
            {
                key: '2',
                description: 'Datum bis',
                value: booking ? ConvertToChDate(booking.booking_to.toString()) as string : ''
            },
            {
                key: '3',
                description: 'Email',
                value: user !== null ? user.id.toString() as string : ''
            },
            {
                key: '4',
                description: 'Telefonnummer',
                value: user !== null ? user.phoneNumber.toString() as string : ''
            },
            {
                key: '5',
                description: 'Vorname',
                value: user !== null ? user.firstName.toString() as string : '',
            },
            {
                key: '6',
                description: 'Nachname',
                value: user !== null ? user.lastName.toString() as string : ''
            },
            {
                key: '7',
                description: 'Strasse',
                value: user !== null ? user.street.toString() as string : ''
            },
            {
                key: '8',
                description: 'Postleitzahl',
                value: user !== null ? user.postalCode.toString() as string : ''
            },
            {
                key: '9',
                description: 'Ort',
                value: user !== null ? user.city.toString() as string : ''
            }
        ]
        const formCheckColumns = [
            {
                key: 'description',
                label: 'Beschreibung'
            },
            {
                key: 'value',
                label: 'Wert'
            }
        ]
        const Content = () => <BookingTable columns={formCheckColumns} rows={formCheckRows} bottomContent={
            <span className="text-default-400 text-small">
                Es werden nur die Buchungsdaten gelöscht! Die Personendaten bleiben weiterhin im System gespeichert.
            </span>}/>
        setModalContent({
                title: "Anfrage endgültig löschen",
                handleAction: () => handleDelete(booking),
                actionText: "Anfrage endgültig löschen",
                content: <Content/>
            }
        )
        onDeleteOpen()
    }

    const handleDelete = async (booking: Booking) => {
        try {
            await deleteBooking(booking.id)
            list.reload()
        } catch (error) {
        }
    }

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value)
        } else {
            setFilterValue('')
        }
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-1">
                    <Input
                        className="min-w-40 max-w-[44%]"
                        isClearable
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                        placeholder="Name suchen"
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        autoComplete="off"
                    />
                    <ButtonGroup>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button startContent={<CalendarMonthIcon/>} variant="flat"
                                        className="max-w-36 sm:max-w-xs">
                                    <span className="hidden sm:inline">Daten filtern</span>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Anfrage filtern"
                                closeOnSelect={false}
                                selectedKeys={dateFilter}
                                selectionMode="multiple"
                                onSelectionChange={setDateFilter}>
                                {Object.entries(BookingDateFilter).map(([key, value]) => (
                                    <DropdownItem key={key} className="capitalize">
                                        {value}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button endContent={<FilterListIcon/>} variant="flat"
                                        className="max-w-36 sm:max-w-xs">
                                    <span className="hidden sm:inline">Status</span>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Buchung Status"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}>
                                {Object.entries(BookingState).map(([key, value]) => (
                                    <DropdownItem key={key} className="capitalize">
                                        {value}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </ButtonGroup>
                    <Button
                        name="logoutButton"
                        isIconOnly
                        onPress={() => logout()}
                        variant="flat"
                        size="md">
                        <LogoutIcon/>
                    </Button>
                </div>
            </div>
        )
    }, [onSearchChange, filterValue, dateFilter, statusFilter])
    const bottomContent = useMemo(() => {
        return (
            <span className="text-default-400 text-small">
                Total {list?.items.length} Buchungen
            </span>
        )
    }, [list])

    const renderCell = (booking: any, columnKey: any) => {
        console.log('renderCell')
        switch (columnKey) {
            case 'user':
                const fullName = booking.user.firstName + ' ' + booking.user.lastName
                const address = booking.user.postalCode + ' ' + booking.user.city
                return (
                    <Popover showArrow>
                        <PopoverTrigger>
                            <User name={fullName}
                                  description={booking.user.id}
                                  avatarProps={{
                                      fallback: <AlternateEmailIcon/>,
                                      color: getColorByValue(booking.booking_state),
                                  }}
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div>
                                {fullName}<br/>
                                {booking.user.phoneNumber}<br/>
                                {booking.user.id}<br/>
                                {booking.user.street}<br/>
                                {address}
                            </div>
                        </PopoverContent>
                    </Popover>
                )
            case 'booking_from':
                return (ConvertToChDate(booking.booking_from, 'sd'))
            case 'booking_to':
                return (ConvertToChDate(booking.booking_to, 'sd'))
            case 'booking_state':
                return (
                    <Select
                        aria-label="Buchungsstatus wählen"
                        className={"min-w-44 max-w-min"}
                        items={Object.entries(BookingState)}
                        size="sm"
                        radius="full"
                        defaultSelectedKeys={booking ? [getKeyByValue(booking.booking_state)] : []}
                        onSelectionChange={selection => {
                            setSelectedState(selection)
                            handleSelectChange(booking.id, selection, booking)
                        }}
                        renderValue={(items) => {
                            return (
                                <div>
                                    {items.map((item) => (
                                        <Chip
                                            className={"min-w-32 max-w-min text-center"}
                                            color={item.textValue ? getColorByValue(item.textValue) : 'default'}
                                            key={item.key}>{item.textValue}</Chip>
                                    ))}
                                </div>
                            )
                        }}
                    >
                        {Object.entries(BookingState).map(([key, value]) => (
                            <SelectItem key={key}>
                                {value}
                            </SelectItem>
                        ))}
                    </Select>
                )
            case 'booking_date':
                return (ConvertToChDate(booking.booking_date, 'sd-full'))
            case 'edit':
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Anfrage Bearbeiten">
                        <span onClick={() => handleEditModal(booking)}
                              className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon fontSize="small"/>
                        </span>
                        </Tooltip>
                        <Tooltip content="Anfrage löschen">
                            <span onClick={() => {
                                handleDeleteModal(booking)
                            }}
                                  className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <DeleteForeverIcon color="error" fontSize="small"/>
                        </span>
                        </Tooltip>
                    </div>
                )
            default:
                return <></>
        }
    }

    return (
        <>
            <Table
                aria-label="Buchungstabelle"
                topContent={topContent}
                bottomContent={bottomContent}
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}>
                <TableHeader columns={bookingColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            align={column.key === 'booking_state' || column.key === 'edit' ? 'center' : 'start'}
                            allowsSorting={column.key !== 'edit'}
                        >{column.label}</TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"Keine Buchungen vorhanden"}
                    items={filteredItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) =>
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {editBooking && (
                <EditBookingModal
                    isOpen={isEditOpen}
                    onOpenChange={onEditOpenChange}
                    booking={editBooking}
                    bookingList={list.items}
                    handleEditReload={handleEditReload}
                />
            )}
            <ModalComponent
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                modalContent={modalContent}/>
        </>
    )
}

export default Dashboard
