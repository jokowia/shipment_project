'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePayment(clientId: string) {
    const supabase = await createClient()

    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: clientId,
        p_new_state: 'GATE_1_APPROVED',
        p_actor: 'admin',
        p_ip: 'admin_dashboard'
    })

    if (transitionError) throw new Error(transitionError.message)
    revalidatePath('/admin')
}

export async function approveOtp(clientId: string) {
    const supabase = await createClient()

    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: clientId,
        p_new_state: 'GATE_2_APPROVED',
        p_actor: 'admin',
        p_ip: 'admin_dashboard'
    })

    if (transitionError) throw new Error(transitionError.message)
    revalidatePath('/admin')
}

export async function rejectClient(clientId: string) {
    const supabase = await createClient()

    // 1. Fetch current client state to know where they are
    const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('state')
        .eq('id', clientId)
        .single()

    if (fetchError || !client) throw new Error("Client not found")

    // 2. Determine target rejection state
    let targetState = 'REJECTED' // Default fallback

    if (client.state === 'PAYMENT_SUBMITTED') {
        targetState = 'ADDRESS_CONFIRMED'
    } else if (client.state === 'OTP_SUBMITTED') {
        targetState = 'GATE_1_APPROVED'
    }

    // 3. Perform transition
    const { error: transitionError } = await supabase.rpc('transition_client_state', {
        p_client_id: clientId,
        p_new_state: targetState,
        p_actor: 'admin',
        p_ip: 'admin_dashboard'
    })

    if (transitionError) throw new Error(transitionError.message)
    revalidatePath('/admin')
}

export async function deleteClient(clientId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('clients').delete().eq('id', clientId)
    if (error) throw new Error(error.message)
    revalidatePath('/admin')
}

export async function updateClientData(clientId: string, updates: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('clients').update(updates).eq('id', clientId)
    if (error) throw new Error(error.message)
    revalidatePath('/admin')
}
