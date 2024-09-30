import {z} from 'zod'

const invalid_type_error = 'Email oder Passwort ungültig. '
const required_error = 'Das Feld darf nicht leer sein. '

export const LoginFormSchema = z.object({
    email: z.string({invalid_type_error, required_error})
        .min(2, 'Eingabe ungültig')
        .email('Email ungültig'),
    password: z.string({invalid_type_error, required_error})
        .min(2, 'Eingabe ungültig'),
    rememberMe: z.optional(z.string())
})
