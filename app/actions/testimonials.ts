'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Task 1: Submit Review
export async function submitReview(data: { name: string; rating: number; message: string }) {
    const supabase = await createClient()

    // Validate input
    if (!data.name || !data.message || !data.rating) {
        return { success: false, error: 'All fields are required' }
    }

    const { error } = await supabase
        .from('testimonials')
        .insert({
            author_name: data.name,
            rating: data.rating,
            quote: data.message,
            status: 'pending',
            is_active: false // For backward compatibility, kept hidden by default
        })

    if (error) {
        console.error('Submit Review Error:', error)
        return { success: false, error: error.message || 'Failed to submit review' }
    }

    // Revalidate admin reviews page so the new review shows up immediately
    revalidatePath('/admin/reviews')

    return { success: true }
}

// Task 1: Get Approved Testimonials (Public)
export async function getApprovedTestimonials() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    if (error) {
        // Deep log the error since it appears as {} in the console
        console.error('Fetch Public Reviews Error:', JSON.stringify(error, Object.getOwnPropertyNames(error || {})))
        // In Next.js sometimes error is an empty object {} but data is successfully populated
        if (!data) {
            return []
        }
    }

    return data || []
}

// Task 1: Admin Get All Reviews
export async function adminGetReviews() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Admin Fetch Reviews Error:', error)
        throw new Error(error.message || 'Failed to fetch reviews')
    }

    return data
}

// Task 1: Update Review Status
export async function updateReviewStatus(id: string, newStatus: 'approved' | 'rejected' | 'pending') {
    const supabase = await createClient()

    // We also update is_active for legacy support: approved -> true, others -> false
    const isActive = newStatus === 'approved'

    const { error } = await supabase
        .from('testimonials')
        .update({
            status: newStatus,
            is_active: isActive
        })
        .eq('id', id)

    if (error) {
        console.error('Update Status Error:', error)
        return { success: false, error: error.message || 'Failed to update status' }
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/') // Update homepage

    return { success: true }
}

// Task 2: Admin Create Review (Auto-Approved)
export async function adminCreateReview(formData: FormData) {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'Unauthorized: You must be logged in.' }
    }

    const name = formData.get('author_name') as string
    const role = formData.get('author_role') as string
    const message = formData.get('quote') as string
    const rating = parseInt(formData.get('rating') as string || '5')

    if (!name || !message) {
        return { success: false, error: 'Name and Message are required' }
    }

    const { error } = await supabase
        .from('testimonials')
        .insert({
            author_name: name,
            author_role: role,
            quote: message,
            rating: rating,
            status: 'approved',
            is_active: true
        })

    if (error) {
        console.error('Admin Create Review Error:', error)
        return { success: false, error: error.message || 'Failed to create review' }
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/testimonials')
    revalidatePath('/')

    return { success: true }
}
