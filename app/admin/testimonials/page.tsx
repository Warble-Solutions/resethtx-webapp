import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { deleteTestimonial, toggleTestimonialStatus } from './actions'

export default async function TestimonialsAdminPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Testimonials</h1>
          <p className="text-slate-400">Manage what people are saying about Reset HTX.</p>
        </div>
        <Link 
          href="/admin/testimonials/create" 
          className="bg-[#D4AF37] hover:bg-white text-black font-bold py-3 px-6 rounded-lg transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          + Add Review
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials?.map((t) => (
          <div key={t.id} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-colors">
            <div>
              {/* Quote Icon */}
              <div className="text-[#D4AF37] text-4xl font-serif leading-none mb-4 opacity-50">&quot;</div>
              
              <p className="text-slate-300 italic mb-6 font-sans text-lg">
                {t.quote}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#D4AF37] font-bold border border-white/10">
                    {t.author_name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-white font-bold">{t.author_name}</h4>
                    <p className="text-[#D4AF37] text-xs uppercase tracking-wider">{t.author_role}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <form action={toggleTestimonialStatus.bind(null, t.id, t.is_active)}>
                    <button className={`text-xs font-bold px-3 py-1 rounded-full border ${t.is_active ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                        {t.is_active ? '● Active' : '○ Hidden'}
                    </button>
                </form>
                
                <form action={deleteTestimonial.bind(null, t.id)}>
                    <button className="text-slate-500 hover:text-red-500 transition-colors text-sm font-bold">
                        Delete
                    </button>
                </form>
            </div>
          </div>
        ))}

        {(!testimonials || testimonials.length === 0) && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl text-slate-500">
                No testimonials yet. Add one to get started.
            </div>
        )}
      </div>
    </div>
  )
}