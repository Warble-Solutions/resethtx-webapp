/**
 * Compresses an image file/blob on the client side using Canvas.
 * - Resizes to fit within maxWidth/maxHeight while maintaining aspect ratio
 * - Converts to JPEG with configurable quality (0-1)
 * - Returns a compressed Blob
 */

const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const DEFAULT_QUALITY = 0.75

export async function compressImage(
    input: File | Blob,
    options?: {
        maxWidth?: number
        maxHeight?: number
        quality?: number
    }
): Promise<Blob> {
    const maxWidth = options?.maxWidth ?? MAX_WIDTH
    const maxHeight = options?.maxHeight ?? MAX_HEIGHT
    const quality = options?.quality ?? DEFAULT_QUALITY

    // Create an image element from the input
    const imageBitmap = await createImageBitmap(input)

    // Calculate new dimensions maintaining aspect ratio
    let { width, height } = imageBitmap

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
    }

    // Draw onto a canvas at the target size
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        // Fallback: return original if canvas context fails
        return input instanceof Blob ? input : new Blob([input])
    }

    ctx.drawImage(imageBitmap, 0, 0, width, height)
    imageBitmap.close()

    // Export as compressed JPEG
    const compressedBlob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: quality
    })

    console.log(
        `🖼️ Compressed: ${(input.size / 1024).toFixed(0)}KB → ${(compressedBlob.size / 1024).toFixed(0)}KB ` +
        `(${Math.round((1 - compressedBlob.size / input.size) * 100)}% reduction)`
    )

    return compressedBlob
}

/**
 * Compress a File and return a new File object (preserves filename for upload)
 */
export async function compressImageFile(
    file: File,
    options?: {
        maxWidth?: number
        maxHeight?: number
        quality?: number
    }
): Promise<File> {
    const compressed = await compressImage(file, options)
    // Return as a File object with .jpg extension
    const baseName = file.name.replace(/\.[^.]+$/, '')
    return new File([compressed], `${baseName}.jpg`, { type: 'image/jpeg' })
}
