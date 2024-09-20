type BookingStateColors = 'default' | 'success' | 'warning' | 'danger'

const BookingState: Record<string, 'AUSSTEHEND' | 'BESTÄTIGT' | 'ABGELEHNT' | 'UNBEKANNT'> = {
    PENDING: 'AUSSTEHEND',
    CONFIRMED: 'BESTÄTIGT',
    CANCELLED: 'ABGELEHNT',
    UNKNOWN: 'UNBEKANNT',
}

const BookingStateColor: Record<string, 'danger' | 'success' | 'warning' | 'default'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
    UNKNOWN: 'default',
}

const BookingStateStatus: Record<string, string> = {
    PENDING: 'Anfrage wird geprüft',
    CONFIRMED: 'Anfrage wurde bestätigt',
    CANCELLED: 'Anfrage wurde abgelehnt',
    UNKNOWN: 'Staus der Anfrage unbekannt',
}

function getColorByValue(value: string): BookingStateColors {
    switch (value) {
        case BookingState.PENDING:
            return 'warning'
        case BookingState.CONFIRMED:
            return 'success'
        case BookingState.CANCELLED:
            return 'danger'
        default:
            return 'default'
    }
}

function getKeyByValue(value: 'AUSSTEHEND' | 'BESTÄTIGT' | 'ABGELEHNT' | 'UNBEKANNT' | string): string {
    const key = Object.keys(BookingState).find((key) => BookingState[key] === value)
    if (key)
        return key
    return BookingState.UNKNOWN
}

const BookingDateFilter: Record<string, 'ALTE EINTRÄGE' | 'NEUE EINTRÄGE' | 'OHNE DATUM'>  = {
    OLD_ENTRIES: 'ALTE EINTRÄGE',
    NEW_ENTRIES: 'NEUE EINTRÄGE',
    WITHOUT_DATE: 'OHNE DATUM',
}

function getDateFilterKey(value: 'ALTE EINTRÄGE' | 'NEUE EINTRÄGE' | 'OHNE DATUM' | string): string {
    const key = Object.keys(BookingDateFilter).find((key) => BookingDateFilter[key] === value)
    if (key)
        return key
    return 'all'
}

export {BookingState, BookingStateColor, BookingStateStatus, getColorByValue, getKeyByValue, BookingDateFilter, getDateFilterKey}
