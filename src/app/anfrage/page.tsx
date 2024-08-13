import {getLocalTimeZone, today} from "@internationalized/date";
import Calendar from "@/app/calendar/page";

export default function Anfrage() {
    const minValue = today(getLocalTimeZone());
    const maxValue = today(getLocalTimeZone()).add({years: 1});

    return (
        <div>
            Anfrage
            {maxValue.toString()}
            <Calendar minValue={minValue.toString()} maxValue={maxValue.toString()}/>
        </div>
    );
}
