import GalleryContent from './gallery-content'

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#C59D24] selection:text-black pt-32 pb-20">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59D24] to-[#F0DEAA]">Gallery</span>
        </h1>
        <div className="h-1 w-24 bg-[#C59D24] mx-auto rounded-full"></div>
      </div>

      {/* CLIENT GALLERY COMPONENT */}
      <GalleryContent />

    </main>
  )
}