'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveTemplate(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Admin Context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const body_html = formData.get('bodyHtml') as string
    const is_default = formData.get('isDefault') === 'on'

    // If setting default, unset other defaults first (Service Role / direct update is best, but we'll handle at application level for brevity pending real trigger)
    if (is_default) {
        await supabase.from('email_templates').update({ is_default: false }).eq('admin_id', user.id)
    }

    const { error } = await supabase
        .from('email_templates')
        .insert({
            admin_id: user.id,
            name,
            subject,
            body_html,
            is_default
        })

    if (error) {
        console.error(error)
        throw new Error("Failed to save template.")
    }

    revalidatePath('/admin/templates')
    return { success: true }
}
