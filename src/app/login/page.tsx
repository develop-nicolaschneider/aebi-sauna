'use client'

import {Button, Input, Checkbox, Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react"
import {useState} from 'react'
import {LoginFormSchema} from "@/utils/LoginFormSchema"
import {signIn} from "@/utils/firebaseAuth"
import {createSession} from "@/utils/session"

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
        try {
            const userUid = await signIn(result.data)
            if (userUid !== undefined) {
                const token = userUid.uid
                await createSession(token, result.data.rememberMe)
            }
        } catch (error: any) {
            console.error(error.message);
        }
        setErrors({})
        setSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="grid justify-items-center">
            <Card className="grid grid-cols-1 justify-items-center my-12 pt-3 w-full max-w-sm">
                <CardHeader>
                    <p className="text-lg">Login</p>
                </CardHeader>
                <CardBody className="grid grid-cols-1 gap-y-2">
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
                            variant="underlined"
                            size="sm"
                        />
                    ))}
                </CardBody>
                <CardFooter className="flex flex-row justify-between">
                    <Checkbox
                        name="rememberMe"
                        className="w-fit"
                        size="sm">
                        Login merken
                    </Checkbox>
                    <Button
                        className="w-fit"
                        type="submit"
                        variant="solid"
                        color="primary"
                        disabled={submitting}
                        size="md"
                    >
                        {submitting ? 'Login...' : 'Login'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default Login
