import {DateFormatter} from "@internationalized/date";

const ConvertToChDate = (date: string, precise = false) => {
    const formatter =
        (precise) ?
            new DateFormatter(
                "de-CH", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }
            )
            :
            new DateFormatter(
                "de-CH", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            )


    return formatter.format(new Date(date))
}

export default ConvertToChDate
