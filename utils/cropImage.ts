export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        // image.setAttribute('crossOrigin', 'anonymous') // Removed to prevent issues with Data URLs
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the Readme of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // Cap dimensions to max 1920x1080 while maintaining aspect ratio
    const MAX_WIDTH = 1920
    const MAX_HEIGHT = 1080
    let finalWidth = pixelCrop.width
    let finalHeight = pixelCrop.height

    if (finalWidth > MAX_WIDTH || finalHeight > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / finalWidth, MAX_HEIGHT / finalHeight)
        finalWidth = Math.round(finalWidth * ratio)
        finalHeight = Math.round(finalHeight * ratio)
    }

    // Create a temp canvas with original crop dimensions to hold the pixel data
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = pixelCrop.width
    tempCanvas.height = pixelCrop.height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return null
    tempCtx.putImageData(data, 0, 0)

    // set canvas width to final (potentially resized) dimensions
    canvas.width = finalWidth
    canvas.height = finalHeight

    // Draw the temp canvas onto the final canvas (this handles the resize)
    ctx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight)

    // As compressed JPEG Blob (0.75 quality = good balance of quality vs size)
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/jpeg', 0.75)
    })
}
