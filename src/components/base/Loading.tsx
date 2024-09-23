import React, {ReactNode, Suspense} from "react"
import {Spinner} from "@nextui-org/spinner"
import {Progress} from "@nextui-org/react"

interface LoadingProps {
    children: ReactNode
    label?: string
    className?: string
}

const Loading = ({children, label, className}: LoadingProps) => (
    <Suspense fallback={
        <LoadingAnimation label={label} className={className}/>
    }>
        {children}
    </Suspense>
)

interface LoadingAnimationProps {
    label?: string
    className?: string
}

const LoadingAnimation = ({label, className}: LoadingAnimationProps) => (
    <Spinner
        size="lg"
        color="primary"
        label={label}
        className={`w-full h-full justify-items-center ${className}`}
        classNames={{
            label: 'text-xs sm:text-xs md:text-sm lg:text-base'
        }}
    />
)

interface LoadingProcessAnimationProps {
    label?: string
    className?: string
}

const LoadingProgressAnimation = ({label, className}: LoadingProcessAnimationProps) => (
    <div className="grid w-full h-full place-content-center">
        <Progress
            size="sm"
            isIndeterminate
            label={label}
            aria-label="Ladeanimation"
            className={`max-w-48 w-48 ${className}`}
            classNames={{
                label: 'max-w-48 w-48 text-center',
                base: 'flex-col-reverse'
            }}
        />
    </div>
)

export {Loading, LoadingAnimation, LoadingProgressAnimation}
