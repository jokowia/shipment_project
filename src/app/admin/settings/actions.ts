'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTelegramChatId(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Admin Context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    const chatId = formData.get('chatId') as string

    // 2. Update Admins Table
    const { error } = await supabase
        .from('admins')
        .update({
            telegram_chat_id: chatId ? chatId.trim() : null,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error("Failed to update telegram chat ID:", error)
        throw new Error("Failed to save Settings.")
    }

    revalidatePath('/admin/settings')

    return { success: true }
}
