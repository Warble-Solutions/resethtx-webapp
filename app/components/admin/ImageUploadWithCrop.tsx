/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'

interface ImageUploadWithCropProps {
    onImageSelected: (blob: Blob) => void
    aspectRatio?: number
    currentImage?: string
    name?: string
    required?: boolean
    onRemove?: () => void
}

export default function ImageUploadWithCrop({
    onImageSelected,
    aspectRatio = 1,
    currentImage,
    name = 'image',
    required = false,
    onRemove
}: ImageUploadWithCropProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)

    const [fileName, setFileName] = useState<string>('')

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFileName(file.name)
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string)
                setIsCropping(true)
            })
            reader.readAsDataURL(file)
            // Reset input value so same file can be selected again
            e.target.value = ''
        }
    }

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!imageSrc || !croppedAreaPixels) return

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedBlob) {
                onImageSelected(croppedBlob)
                setPreviewUrl(URL.createObjectURL(croppedBlob))
                setIsCropping(false)
            } else {
                console.error('getCroppedImg returned null')
            }
        } catch (e) {
            console.error('Error in showCroppedImage:', e)
        }
    }, [imageSrc, croppedAreaPixels, onImageSelected])

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsCropping(false)
        setImageSrc(null)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setPreviewUrl(null)
        setImageSrc(null)
        setFileName('')
        if (onRemove) onRemove()
    }

    return (
        <div className="w-full">
            {/* Hidden File Input for form submission wrapping if needed, though usually we handle this via state */}
            <input type="hidden" name={name} required={required && !previewUrl} />

            {!isCropping ? (
                <div className="space-y-4">
                    {previewUrl ? (
                        <div className="relative group rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-slate-900/50 aspect-video md:aspect-[3/1] max-h-[300px] flex items-center justify-center">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label className="cursor-pointer bg-[#D4AF37] hover:bg-white text-black font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
                                    Change
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
                                        title="Remove Image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-700 hover:border-[#D4AF37] rounded-lg bg-slate-900/50 transition-colors">
                            <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                                <div className="p-4 bg-slate-800 rounded-full mb-3 text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </div>
                                <p className="text-slate-300 font-bold mb-1">Click to Upload Image</p>
                                <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>
            ) : (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[80vh]">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h3 className="font-bold text-white text-lg">Crop Image</h3>
                            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                        </div>

                        <div className="relative flex-1 bg-black">
                            <Cropper
                                image={imageSrc!}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
                                    <span>Zoom</span>
                                    <span>{zoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={showCroppedImage}
                                    className="flex-[2] py-3 bg-[#D4AF37] hover:bg-white text-black font-bold rounded-lg transition-colors shadow-lg shadow-[#D4AF37]/20"
                                >
                                    Confirm Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
