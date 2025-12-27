'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(formData: FormData) {
    // TEMPORARY: Use direct client to bypass potential cookie/headers deadlock
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

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

        // Revalidate admin inbox (Disabled to prevent hanging)
        // revalidatePath('/admin/inbox')

        return { success: true }

    } catch (error: any) {
        console.error('Contact Form Error:', error)
        return { success: false, error: 'Failed to send message. Please try again.' }
    }
}

export async function updateMessageRemark(id: string, remark: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
        const { error } = await supabase
            .from('contact_messages')
            .update({ remarks: remark })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/inbox')

        return { success: true }
    } catch (error: any) {
        console.error('Update Remark Error:', error)
        return { success: false, error: 'Failed to update remark.' }
    }
}
