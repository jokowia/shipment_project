'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveTemplate(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const body_html = formData.get('bodyHtml') as string
    const is_default = formData.get('isDefault') === 'on'

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

export async function setDefaultTemplate(templateId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Remove default from all
    await supabase.from('email_templates').update({ is_default: false }).eq('admin_id', user.id)

    // Set new default
    const { error } = await supabase
        .from('email_templates')
        .update({ is_default: true })
        .eq('id', templateId)
        .eq('admin_id', user.id)

    if (error) {
        throw new Error("Failed to set default template.")
    }

    revalidatePath('/admin/templates')
    return { success: true }
}

export async function deleteTemplate(templateId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Disallow deleting if it is the only one or if it is default? 
    // Just delete it.
    const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId)
        .eq('admin_id', user.id)

    if (error) {
        throw new Error("Failed to delete template.")
    }

    revalidatePath('/admin/templates')
    return { success: true }
}
