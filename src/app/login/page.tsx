'use client'

import {Button, Input} from "@nextui-org/react"
import {useState} from 'react'
import {LoginFormSchema} from "@/utils/LoginFormSchema"
import {login} from "@/utils/firebase";

const Login = () => {
    const [errors, setErrors] = useState<any>({})
    const [submitting, setSubmitting] = useState(false)
    const loginFields = [
        {
            name: 'email',
            label: 'Email',
            placeholder: 'Email eingeben',
            title: 'Email',
            type: 'email',
            autoComplete: 'email'
        },
        {
            name: 'password',
            label: 'Passwort',
            placeholder: 'Passwort eingeben',
            title: 'Passwort',
            type: 'password',
            autoComplete: 'password'
        }
    ]

    const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault()
        setSubmitting(true)
        const data = Object.fromEntries(new FormData(e.currentTarget))
        let result = LoginFormSchema.safeParse(data)
        if (!result.success) {
            setErrors(result.error.flatten())
            setSubmitting(false)
            return
        }
        const response = await login(data)
        if (response) {
            result = LoginFormSchema.safeParse({email: 0, password: 0})
            if (!result.success) {
                setErrors(result.error.flatten())
                setSubmitting(false)
                return
            }
        }
        setErrors({})
        setSubmitting(false)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {loginFields.map(({name, label, placeholder, title, type, autoComplete}) => (
                    <Input
                        name={name}
                        id={name}
                        key={name}
                        label={label}
                        placeholder={placeholder}
                        title={title}
                        type={type}
                        autoComplete={autoComplete}
                        isInvalid={!!errors?.fieldErrors?.[name]}
                        errorMessage={errors?.fieldErrors?.[name]}
                        variant="flat"
                        size="sm"
                    />
                ))}
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    disabled={submitting}
                >{submitting ? 'Login...' : 'Login'}</Button>
            </form>
        </div>
    )
}

export default Login
