import { createClient } from '@supabase/supabase-js'

export async function sendTelegramAlert(
    adminId: string,
    message: string,
    replyMarkup?: any
) {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.warn("Telegram alerts are disabled: TELEGRAM_BOT_TOKEN missing in environment.");
        return;
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: admin, error } = await supabase
            .from('admins')
            .select('telegram_chat_id')
            .eq('id', adminId)
            .single()

        if (error || !admin || !admin.telegram_chat_id) {
            console.warn(`No Telegram Chat ID configured for admin ${adminId}`);
            return;
        }

        const chatId = admin.telegram_chat_id;

        const bodyPayload: any = {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
        };

        if (replyMarkup) {
            bodyPayload.reply_markup = replyMarkup;
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send Telegram alert:", errorData);
        }
    } catch (error) {
        console.error("Error sending Telegram alert:", error);
    }
}
