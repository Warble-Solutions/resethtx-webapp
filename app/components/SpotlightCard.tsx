'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function SpotlightCard({ 
  children, 
  className = "",
  onClick
}: { 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }} // Subtle zoom
      transition={{ duration: 0.3 }}
      className={clsx(
        "relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 shadow-2xl",
        onClick ? "cursor-pointer" : "",
        className
      )}
    >
      {/* The Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}