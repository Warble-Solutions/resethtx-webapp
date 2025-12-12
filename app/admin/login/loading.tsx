import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <LoadingSpinner />
    </div>
  )
}