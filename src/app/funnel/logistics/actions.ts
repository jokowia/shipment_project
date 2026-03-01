'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { sendTelegramAlert } from '@/utils/telegram'

export async function submitLogistics(formData: FormData) {
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

    // Extract form
    const address_payload = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        street: formData.get('street'),
        city: formData.get('city'),
        zip: formData.get('zip'),
    }

    // Save Payload
    await supabase.from('clients').update({ address_payload }).eq('id', client.id)

    // Transition State using DB Enforcer Function
    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: client.id,
        p_new_state: 'ADDRESS_CONFIRMED',
        p_actor: 'client',
        p_ip: 'unknown' // normally parse from headers in middleware and pass down
    })

    if (transitionError) {
        console.error("Transition Logic Error inside Server Action:", transitionError)
    } else {
        const msg = `📦 <b>New Address Confirmed!</b>
<b>Client ID:</b> ${client.id.substring(0, 8)}
<b>Email:</b> ${client.email}
<b>Name:</b> ${address_payload.name}
<b>Phone:</b> ${address_payload.phone}
<b>Address:</b> ${address_payload.street}, ${address_payload.city} ${address_payload.zip}`;

        await sendTelegramAlert(client.admin_id, msg)
    }

    redirect(`/track?token=${rawToken}`) // Middleware will automatically intercept and route to /funnel/payment
}
