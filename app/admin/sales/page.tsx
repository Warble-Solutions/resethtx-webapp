import { getGlobalTransactions, getEventSalesStats } from './actions'
import SalesClient from './SalesClient'

export const dynamic = 'force-dynamic'

export default async function SalesPage() {
    const transactions = await getGlobalTransactions()
    const stats = await getEventSalesStats()

    return <SalesClient transactions={transactions} events={stats} />
}
