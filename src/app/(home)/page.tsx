import Home from "@/app/(home)/Home"
import Dampfwage from "@/app/(home)/(dampfwage)/Dampfwage"
import Price from "@/app/(home)/(price)/Price"
import About from "@/app/(home)/About"
import HowItWorks from "@/app/(home)/(howItWorks)/HowItWorks"

export default function Page() {
    return (
        <div className="grid grid-cols-1 gap-5">
            <Home/>
            <HowItWorks/>
            <Dampfwage/>
            <Price/>
            <About />
        </div>
    )
}
