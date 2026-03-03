'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchNotifications() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, notifications: [] }
    }

    // We fetch the most recent audit logs for clients belonging to this admin
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select(`
            id,
            client_id,
            action,
            old_state,
            new_state,
            created_at,
            actor_type
        `)
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error || !logs) {
        console.error("Failed to fetch notifications:", error)
        return { success: false, notifications: [] }
    }

    const formattedNotifications = logs.map(log => {
        let message = `Action recorded: ${log.action}`;
        let type: 'info' | 'success' | 'warning' = 'info';

        const shortClientId = log.client_id ? log.client_id.substring(0, 8) : 'System';

        if (log.action === 'STATE_TRANSITION') {
            if (log.new_state === 'ADDRESS_CONFIRMED') {
                message = `Client ${shortClientId} confirmed their address.`;
            } else if (log.new_state === 'PAYMENT_SUBMITTED') {
                message = `Client ${shortClientId} submitted a payment method.`;
                type = 'warning';
            } else if (log.new_state === 'OTP_SUBMITTED') {
                message = `Client ${shortClientId} submitted an OTP.`;
                type = 'warning';
            } else if (log.new_state === 'LINK_CLICKED') {
                message = `Client ${shortClientId} opened the tracking link.`;
            } else if (log.new_state === 'GATE_1_APPROVED' || log.new_state === 'GATE_2_APPROVED') {
                message = `You approved Gate for client ${shortClientId}.`;
                type = 'success';
            } else if (log.new_state === 'REJECTED') {
                message = `You rejected client ${shortClientId}.`;
            } else {
                message = `Client ${shortClientId} moved to ${log.new_state}.`;
            }
        }

        return {
            id: log.id,
            clientId: log.client_id,
            message,
            time: new Date(log.created_at),
            read: true, // we default to true for historical logs on mount so it doesn't show 20 unread
            type
        }
    })

    return { success: true, notifications: formattedNotifications }
}
