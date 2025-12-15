import { createClient } from '@/utils/supabase/server'
import MenuContent from './menu-content'

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
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-6 leading-none tracking-tight">
            Taste The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]">Vibe</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] text-white uppercase border-b border-[#D4AF37] inline-block pb-2 px-8">
            Drink & Dine
          </p>
        </div>

        {/* CONTENT SECTION */}
        <MenuContent items={items || []} />

      </div>
    </main>
  )
}