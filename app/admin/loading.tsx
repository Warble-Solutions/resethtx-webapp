import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <LoadingSpinner />
    </div>
  )
}