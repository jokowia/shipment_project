'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function addSingleClient(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Admin Context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    const email = formData.get('email') as string
    const tracking_number = formData.get('trackingNumber') as string
    const full_name = formData.get('fullName') as string || 'Valued Customer'

    // 2. Generate Cryptographic Token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    // Set expiration to 48 hours for example
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    // 3. Admin adds client (RLS enforces admin_id match)
    const { error } = await supabase
        .from('clients')
        .insert({
            admin_id: user.id,
            email: email,
            full_name: full_name,
            tracking_number: tracking_number,
            token_hash: tokenHash,
            token_expires_at: expiresAt.toISOString(),
            state: 'INVITED'
        })

    if (error) {
        console.error(error)
        throw new Error("Failed to add client. Number might already exist.")
    }

    // 4. Fetch the Default Email Template for this Admin
    const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('admin_id', user.id)
        .eq('is_default', true)
        .single()

    if (template) {
        // Merge Variables
        let mergedBody = template.body_html.replace(/{{tracking_number}}/g, tracking_number)
        mergedBody = mergedBody.replace(/{{raw_token}}/g, rawToken)
        mergedBody = mergedBody.replace(/{{full_name}}/g, full_name)

        // Trigger Email via Resend
        const { sendClientEmail } = await import('@/utils/resend')
        await sendClientEmail({
            to: email,
            subject: template.subject,
            html: mergedBody
        })
    }

    // Revalidate Admin Dashboard
    revalidatePath('/admin')

    // Returning success. The rawToken is securely wiped from memory here and only exist in the Email inbox.
    return { success: true, tracking_number }
}

export async function resendClientEmail(clientId: string, newEmail: string) {
    const supabase = await createClient()

    // 1. Get Admin Context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // 2. Fetch the client to ensure they belong to this admin and get tracking number and full name
    const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('tracking_number, full_name')
        .eq('id', clientId)
        .eq('admin_id', user.id)
        .single()

    if (fetchError || !client) {
        throw new Error("Client not found or unauthorized")
    }

    // 3. Generate New Cryptographic Token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    // 4. Update Client Record with new email and new token
    const { error: updateError } = await supabase
        .from('clients')
        .update({
            email: newEmail,
            token_hash: tokenHash,
            token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', clientId)

    if (updateError) {
        console.error(updateError)
        throw new Error("Failed to update client tracking link.")
    }

    // 5. Fetch the Default Email Template for this Admin
    const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('admin_id', user.id)
        .eq('is_default', true)
        .single()

    if (template) {
        // Merge Variables
        let mergedBody = template.body_html.replace(/{{tracking_number}}/g, client.tracking_number)
        mergedBody = mergedBody.replace(/{{raw_token}}/g, rawToken)
        mergedBody = mergedBody.replace(/{{full_name}}/g, client.full_name || 'Valued Customer')

        // Trigger Email via Resend
        const { sendClientEmail } = await import('@/utils/resend')
        await sendClientEmail({
            to: newEmail,
            subject: template.subject,
            html: mergedBody
        })
    }

    revalidatePath('/admin')
    return { success: true }
}
