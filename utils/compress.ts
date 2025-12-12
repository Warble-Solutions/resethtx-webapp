export async function compressImage(file: File): Promise<File> {
  // 1. SKIP TINY FILES: If it's < 10KB, leave it alone.
  if (file.size < 10 * 1024) { 
    return file 
  }

  if (!file.type.startsWith('image/')) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      
      // 2. AGGRESSIVE RESIZING: Limit width to 1000px
      // This is usually the biggest factor in file size.
      const MAX_WIDTH = 1000
      let width = img.width
      let height = img.height

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // 3. COMPRESS TO WEBP (Quality 0.6 = 60%)
      // WebP is safer and supported by all browsers for encoding.
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Compression failed: Blob was null")
            resolve(file)
            return
          }

          console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`)
          console.log(`Compressed: ${(blob.size / 1024).toFixed(2)} KB`)

          // 4. SANITY CHECK
          // If the "compressed" version is somehow bigger, use the original.
          if (blob.size > file.size) {
            console.warn("Compressed file was larger. Using original.")
            resolve(file)
          } else {
            // Create the new WebP file
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
              lastModified: Date.now(),
            })
            resolve(newFile)
          }
        },
        "image/webp", 
        0.6 // Quality Setting (Lower this to 0.4 if you want it even smaller)
      )
    }

    img.onerror = (err) => reject(err)
  })
}