import {z} from 'zod'

const invalid_type_error = 'Ungültige Eingabe für dieses Feld. '
const required_error = 'Das Feld darf nicht leer sein. '

export const AnfrageFormSchema = z.object({
    firstName: z.string({invalid_type_error, required_error})
        .min(2, 'Wert verlangt mind. 2 Zeichen. '),
    lastName: z.string({invalid_type_error, required_error})
        .min(2, 'Wert verlangt mind. 2 Zeichen. '),
    email: z.string({invalid_type_error, required_error})
        .email('Die eingegebene Email ist ungültig. ')
        .min(2, 'Wert verlangt mind. 2 Zeichen. '),
    phoneNumber: z.coerce.number({invalid_type_error, required_error})
        .gte(100000000, 'Die Nummer ist ungültig. ')
        .lte(999999999, 'Die Nummer ist ungültig. '),
    street: z.string({invalid_type_error, required_error})
        .min(2, 'Wert verlangt mind. 2 Zeichen. '),
    postalCode: z.coerce.number({invalid_type_error, required_error})
        .gte(1000, 'Wert verlangt 4 Ziffern. ')
        .lte(9999, 'Wert verlangt 4 Ziffern. '),
    city: z.string({invalid_type_error, required_error})
        .min(2, 'Wert verlangt mind. 2 Zeichen. '),
    booking_from:
        z.string().refine((val) => val === '', {
            message: 'Datum nicht verfügbar',
        }).or(z.coerce.date({
            errorMap: (issue, {defaultError}) => ({
                message: issue.code === "invalid_date" ? "Datum nicht verfügbar" : defaultError,
            })
        })),
    booking_to:
        z.string().refine((val) => val === '', {
            message: 'Datum nicht verfügbar',
        }).or(z.coerce.date({
            errorMap: (issue, {defaultError}) => ({
                message: issue.code === "invalid_date" ? "Datum nicht verfügbar" : defaultError,
            })
        })),
    remarks: z.optional(z.string()),
    regulations: z.string({invalid_type_error, required_error})
})
