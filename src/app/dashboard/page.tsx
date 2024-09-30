import {Loading} from "@/components/base/Loading"
import DashboardComponent from "@/app/dashboard/DashboardComponent"
import {verifySession} from "@/app/lib/dal"

export default async function DashboardPage() {
    await verifySession()
    return <Loading><DashboardComponent/></Loading>
}
