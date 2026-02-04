import Sidebar from './sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar handles its own responsive visibility */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full w-full relative">


        <div className="p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}