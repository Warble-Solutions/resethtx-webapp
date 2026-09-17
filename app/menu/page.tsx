import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import MenuContent from './menu-content'
import JsonLd from '@/app/components/JsonLd'
import { getMenuSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: "Rooftop Dining & Craft Cocktails Menu | Reset HTX Houston",
  description: "Explore the food and cocktail menu at Reset HTX. Savor chef-curated small plates, shareable bar bites, signature craft cocktails, and premium bottle service in Midtown Houston.",
  alternates: {
    canonical: '/menu',
  },
}

// Refresh the menu every hour automatically
export const revalidate = 3600 

export default async function MenuPage() {
  const supabase = await createClient()
  
  // Fetch ALL available menu items
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true) // Only show active items
    .order('name', { ascending: true })

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 selection:bg-[#D4AF37] selection:text-black">
      <JsonLd schema={getMenuSchema(items || [])} />
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
            Midtown Rooftop Kitchen & Bar
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-4 leading-tight tracking-tight">
            Dine Above <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]">The City</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Elevated rooftop dining, shareable bar bites, artisan craft cocktails, and premier bottle service overlooking Midtown Houston.
          </p>
        </div>

        {/* CONTENT SECTION */}
        <MenuContent items={items || []} />

      </div>
    </main>
  )
}