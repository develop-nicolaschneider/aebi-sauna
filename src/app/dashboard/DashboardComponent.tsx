'use client'

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import {
    Button, Chip, Popover, PopoverContent, PopoverTrigger,
    Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,
    Tooltip, User, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
    Select, SelectItem, SharedSelection, Selection,
    useDisclosure, ButtonGroup, Badge
} from "@nextui-org/react"
import {deleteBooking, getBookings, updateBookingState} from "@/utils/firebase"
import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react"
import {BookingDateFilter, BookingState, getColorByValue, getDateFilterKey, getKeyByValue} from "@/types/BookingState"
import ConvertToChDate from "@/utils/ConvertToChDate"
import {useAsyncList} from "@react-stately/data"
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FilterListIcon from '@mui/icons-material/FilterList'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CommentIcon from '@mui/icons-material/Comment'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import {EditBookingModal} from "@/components/EditBookingModal"
import {ModalComponent} from "@/components/ModalComponent"
import {BookingTable} from "@/components/BookingTable"
import {getLocalTimeZone, parseDate, today} from "@internationalized/date"
import {Booking} from "@/types/Booking"
import {BookingUser} from "@/types/BookingUser"
import {Link} from "@nextui-org/link"
import {Loading, LoadingAnimation} from "@/components/base/Loading"
import {verifySession} from "@/app/lib/dal"
import {ContractBookingModal} from "@/components/ContractBookingModal"

const bookingColumns = [
    {key: "user", label: "Kontakt"},
    {key: "booking_from", label: "Gebucht vom"},
    {key: "booking_to", label: "Gebucht bis"},
    {key: "booking_date", label: "Gebucht am"},
    {key: "booking_state", label: "Status"},
    {key: "edit", label: "Edit"},
]

const DashboardComponent = () => {
    const [loading, setLoading] = useState(true)
    const [isVerified, setIsVerified] = useState(false)
    const [filterValue, setFilterValue] = useState('')
    const [statusFilter, setStatusFilter] = useState<Selection>('all')
    const [dateFilter, setDateFilter] = useState<Selection>('all')
    const hasSearchFilter = Boolean(filterValue)
    const [, setSelectedState] = useState<SharedSelection>(new Set([]))
    const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure()
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange} = useDisclosure()
    const {isOpen: isContractOpen, onOpen: onContractOpen, onOpenChange: onContractOpenChange} = useDisclosure()
    const [, setStateBooking] = useState<Booking>()
    const [editBooking, setEditBooking] = useState<Booking>()
    const [contractBooking, setContractBooking] = useState<Booking>()
    const [modalContent, setModalContent] = useState({
        title: "",
        handleAction: () => {
        },
        actionText: "",
        content: <Fragment/>,
    })
    const [stateError, setStateError] = useState({id: '', message: ''})

    let list = useAsyncList<Booking>({
        async load() {
            setLoading(true)
            const bookingList = await getBookings(false)
            const initialStates: Record<string, string> = {}
            if (bookingList !== null) {
                bookingList.forEach((booking) => {
                    initialStates[booking.id] = getKeyByValue(booking.booking_state)
                })
            }
            setLoading(false)
            return {items: bookingList || []}
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
                    // Without Date
                    if (booking.booking_from === '' || booking.booking_to === '') {
                        return Array.from(dateFilter).includes(getDateFilterKey(BookingDateFilter.WITHOUT_DATE))
                    } else {
                        // New Entries
                        if (parseDate(booking.booking_to).compare(today(getLocalTimeZone())) >= 0)
                            return Array.from(dateFilter).includes(getDateFilterKey(BookingDateFilter.NEW_ENTRIES))
                        // Old Entries
                        if (parseDate(booking.booking_to).compare(today(getLocalTimeZone())) < 0)
                            return Array.from(dateFilter).includes(getDateFilterKey(BookingDateFilter.OLD_ENTRIES))
                    }
                })
            }
            return filteredBookings
        }
        ,
        [filterValue, hasSearchFilter, list.items, dateFilter, statusFilter]
    )

    const handleSelectChange = async (id: string, value: SharedSelection, booking: Booking) => {
        if (id && value.currentKey && booking.booking_state !== value.currentKey) {
            try {
                if (BookingState.CONFIRMED === BookingState[value.currentKey]) {
                    if (booking.booking_from !== '' && booking.booking_to !== '') {
                        setStateError({id: '', message: ''})
                        await updateBookingState(id, BookingState[value.currentKey]).then()
                        setStateBooking(booking)
                        // onEmailOpen()
                    } else {
                        setStateError({id: booking.id, message: 'Daten Invalid'})
                    }
                } else {
                    setStateError({id: '', message: ''})
                    await updateBookingState(id, BookingState[value.currentKey]).then()
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

    const handleCreateContract = (booking: Booking) => {
        setContractBooking(booking)
        console.log('create-contract', booking)
        onContractOpen()
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

    useEffect(() => {
        (async () => {
            setIsVerified(false)
            await verifySession()
            setIsVerified(true)
        })()
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-1">
                    <Input
                        name="searchInput"
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
                                color="primary"
                                variant="solid"
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
                                color="primary"
                                variant="solid"
                                id="statusDropdown"
                                disallowEmptySelection
                                aria-label="Buchung Status"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}>
                                {Object.entries(BookingState).map(([key, value]) => (
                                    <DropdownItem key={key} id={`${key}-${value}`} className="capitalize">
                                        {value}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </ButtonGroup>
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

    const renderCell = (booking: Booking, columnKey: any) => {
        let user = booking.user
        if (user === null) {
            user = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                street: '',
                postalCode: '',
                city: '',
            } as BookingUser
        }
        switch (columnKey) {
            case 'user':
                const fullName = user.firstName + ' ' + user.lastName
                const address = user.postalCode + ' ' + user.city
                return (
                    <Popover size="sm">
                        <PopoverTrigger>
                            <Badge
                                title="Bemerkungen"
                                isInvisible={booking.remarks === undefined || booking.remarks === ''}
                                content={<CommentIcon fontSize="small"/>}
                                color="danger"
                                size="sm"
                                placement="top-left">
                                <Popover showArrow>
                                    <PopoverTrigger>
                                        <User
                                            title="Anfrage von"
                                            name={fullName}
                                            description={user.id}
                                            avatarProps={{
                                                fallback: <AlternateEmailIcon/>,
                                                color: getColorByValue(booking.booking_state),
                                            }}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div>
                                            <span className="font-medium">{booking.id}</span><br/>
                                            {fullName}<br/>
                                            {user.phoneNumber}<br/>
                                            <Link
                                                color="foreground"
                                                className="text-sm"
                                                isExternal
                                                href={`mailto:${user.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {user.id}
                                            </Link><br/>
                                            {user.street}<br/>
                                            {address}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-md">
                            {booking.remarks}
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
                        isInvalid={booking.id === stateError.id && stateError.message !== ''}
                        errorMessage={stateError.message}
                        name="bookingStatus"
                        aria-label="Buchungsstatus wählen"
                        className={"min-w-44 max-w-min"}
                        items={Object.entries(BookingState)}
                        size="sm"
                        radius="full"
                        selectedKeys={booking ? [getKeyByValue(booking.booking_state)] : []}
                        onSelectionChange={selection => {
                            if (selection.currentKey !== undefined) {
                                setSelectedState(selection)
                                handleSelectChange(booking.id, selection, booking).then()
                            }
                        }}
                        renderValue={(items) => {
                            return (
                                <>
                                    {items.map((item) => (
                                        <Chip
                                            id={`chip-${item.key}`}
                                            className={"min-w-32 max-w-min text-center"}
                                            color={item.textValue ? getColorByValue(item.textValue) : 'default'}
                                            key={item.key}>
                                            {item.textValue}
                                        </Chip>
                                    ))}
                                </>
                            )
                        }}
                    >
                        {Object.entries(BookingState).map(([key, value]) => (
                            <SelectItem id={key} key={key}>
                                {value}
                            </SelectItem>
                        ))}
                    </Select>
                )
            case 'booking_date':
                return (ConvertToChDate(booking.booking_date, 'sd-full'))
            case 'edit':
                return (
                    <div className="relative flex items-center gap-0">
                        <Tooltip content="Anfrage Bearbeiten">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onPress={() => handleEditModal(booking)}
                            >
                                <EditIcon fontSize="small"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Mietvertrag erstellen">
                            <Button
                                title={booking.booking_from === '' || booking.booking_to === '' ? 'Daten ungültig' : undefined}
                                isDisabled={booking.booking_from === '' || booking.booking_to === ''}
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onPress={() => {
                                    handleCreateContract(booking)
                                }}>
                                <AttachFileIcon color="info" fontSize="small"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Anfrage löschen">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onPress={() => {
                                    handleDeleteModal(booking)
                                }}>
                                <DeleteForeverIcon color="error" fontSize="small"/>
                            </Button>
                        </Tooltip>
                    </div>
                )
            default:
                return <></>
        }
    }

    return (
        <Loading>
            {!isVerified ? <LoadingAnimation/> :
                <Table
                    className="mt-5"
                    aria-label="Buchungstabelle"
                    topContent={topContent}
                    bottomContent={!loading && bottomContent}
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
                        isLoading={loading}
                        loadingContent={<LoadingAnimation/>}
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
            }
            {editBooking &&
                <EditBookingModal
                    isOpen={isEditOpen}
                    onOpenChange={onEditOpenChange}
                    booking={editBooking}
                    bookingList={list.items}
                    handleEditReload={handleEditReload}
                />
            }
            <ModalComponent
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                modalContent={modalContent}/>
            <ContractBookingModal
                isOpen={isContractOpen}
                onOpenChange={onContractOpenChange}
                booking={contractBooking}/>
        </Loading>
    )
}

export default DashboardComponent
