export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* The Animated Spinner */}
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        {/* Spinning Inner Ring */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>
      
      {/* Text */}
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading Reset HTX...</p>
    </div>
  )
}