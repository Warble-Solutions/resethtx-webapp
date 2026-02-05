import Image from 'next/image'
import Link from 'next/link'
import { formatEventTime } from '../utils/format'

interface EventCardProps {
  title: string
  date: string
  time: string
  endTime?: string | null
  description: string
  imageUrl: string
  price: string
  tag: string
  link: string
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  endTime,
  description,
  imageUrl,
  price,
  tag,
  link,
}) => {
  return (
    <div className="bg-[#1E293B] rounded-2xl overflow-hidden flex flex-col h-full group border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        {/* Tag */}
        <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {tag}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
          {date} • {formatEventTime(time, endTime)}
        </div>
        <h3 className="text-2xl font-heading font-bold text-white leading-tight mb-3 group-hover:text-[#D4AF37] transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 grow">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
          <span className="text-white font-bold text-lg">{price}</span>
          <Link
            href={link}
            className="text-[#D4AF37] hover:text-white font-bold text-sm uppercase tracking-wide transition-colors flex items-center gap-1"
          >
            DETAILS
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard