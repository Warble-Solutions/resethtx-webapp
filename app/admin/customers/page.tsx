import { getAggregatedCustomers } from './actions'
import CustomerTable from '../components/CustomerTable'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
    const customers = await getAggregatedCustomers()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-10">
                <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white mb-2">
                    Customer <span className="text-[#D4AF37]">Database</span>
                </h1>
                <p className="text-slate-400">Identify top spenders and manage your marketing lists.</p>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CustomerTable customers={customers} />
            </div>
        </div>
    )
}
