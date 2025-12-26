'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient()

    // Extract data
    const data = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        inquiry_type: formData.get('inquiryType') as string,
        message: formData.get('message') as string,
    }

    // Simple validation
    if (!data.first_name || !data.email || !data.message) {
        return { success: false, error: 'Please fill in all required fields.' }
    }

    try {
        const { error } = await supabase.from('contact_messages').insert(data)

        if (error) throw error

        // Revalidate admin inbox so new messages appear immediately
        revalidatePath('/admin/inbox')
        return { success: true }

    } catch (error: any) {
        console.error('Contact Form Error:', error)
        return { success: false, error: 'Failed to send message. Please try again.' }
    }
}
