'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadImage(formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'No file provided' }
    }

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return { success: false, error: 'Failed to upload image: ' + uploadError.message }
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

    // 3. Insert into Table
    const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
            image_url: publicUrl
        })

    if (dbError) {
        console.error('DB Insert Error:', dbError)
        return { success: false, error: 'Failed to save image record' }
    }

    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')

    return { success: true }
}

export async function deleteImage(id: string, imageUrl: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' }
    }

    // 1. Delete from DB
    const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

    if (dbError) {
        return { success: false, error: 'Failed to delete record' }
    }

    // 2. Delete from Storage (Bonus)
    // Extract filename from URL: .../gallery/filename.jpg
    try {
        const urlParts = imageUrl.split('/gallery/')
        if (urlParts.length > 1) {
            const fileName = urlParts[1]
            await supabase.storage.from('gallery').remove([fileName])
        }
    } catch (e) {
        console.warn('Failed to cleanup storage file:', e)
    }

    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')

    return { success: true }
}

export async function getGalleryImages() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch Gallery Error:', error)
        return []
    }

    return data
}
