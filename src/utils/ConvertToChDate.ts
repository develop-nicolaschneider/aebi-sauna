import {DateFormatter} from "@internationalized/date"

const ConvertToChDate = (date: string, precise: 'sd' | 'sd-full' | 'md' | 'md-full' | 'ld' | 'ld-full' = 'md') => {
    let formatter
    switch (precise) {
        // short date
        case 'sd':
            formatter = new DateFormatter(
                'de-CH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                })
            break
        case 'sd-full':
            formatter = new DateFormatter(
                'de-CH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }
            )
            break
        case 'md':
            formatter = new DateFormatter(
                'de-CH', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })
            break
        case 'md-full':
            formatter = new DateFormatter(
                'de-CH', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            break
        case 'ld':
            formatter = new DateFormatter(
                'de-CH', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })
            break
        case 'ld-full':
            formatter = new DateFormatter(
                'de-CH', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            break
        default:
            formatter = undefined
    }
    try {
        if (formatter)
            return formatter.format(new Date(date))
    } catch (e: any) {
        return ""
    }
}

export default ConvertToChDate
