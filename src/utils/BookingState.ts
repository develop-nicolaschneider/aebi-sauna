const BookingState: Record<string, 'AUSSTEHEND' | "BESTÄTIGT" | "ABGELEHNT"> = {
    PENDING: 'AUSSTEHEND',
    CONFIRMED: 'BESTÄTIGT',
    CANCELLED: 'ABGELEHNT',
}
export default BookingState
