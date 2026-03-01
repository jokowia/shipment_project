import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Telegram sends callback queries when inline buttons are clicked
        if (body.callback_query) {
            const callbackQuery = body.callback_query
            const data = callbackQuery.data // e.g. "approve_gate_1:CLIENT_ID"
            const messageId = callbackQuery.message.message_id
            const chatId = callbackQuery.message.chat.id

            if (!data) return new Response('OK')

            const [action, clientId] = data.split(':')

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )

            let newState = ''
            let statusEmoji = ''
            let statusText = ''

            // Determine action to take based on the button clicked
            if (action === 'approve_gate_1') {
                newState = 'GATE_1_APPROVED'
                statusEmoji = '✅'
                statusText = 'Gate 1 Approved'
            } else if (action === 'reject_gate_1') {
                newState = 'GATE_1_REJECTED'
                statusEmoji = '❌'
                statusText = 'Gate 1 Rejected'
            } else if (action === 'approve_gate_2') {
                newState = 'GATE_2_APPROVED'
                statusEmoji = '✅'
                statusText = 'Gate 2 Approved'
            } else if (action === 'reject_gate_2') {
                newState = 'GATE_2_REJECTED'
                statusEmoji = '❌'
                statusText = 'Gate 2 Rejected'
            }

            if (newState) {
                // Execute the state transition
                const { error: transitionError } = await supabase.rpc('transition_client_state', {
                    p_client_id: clientId,
                    p_new_state: newState,
                    p_actor: 'admin_bot',
                    p_ip: 'telegram_api'
                })

                if (transitionError) {
                    console.error("Webhook state transition failed:", transitionError)
                }

                // Edit the original Telegram message to remove the buttons and show the result
                const token = process.env.TELEGRAM_BOT_TOKEN
                if (token) {
                    const originalText = callbackQuery.message.text || ""
                    // We re-format the original text visually to append the status
                    const updatedText = `<b>${originalText}</b>\n\n${statusEmoji} <i>Status: ${statusText} via Telegram Bot</i>`

                    const editUrl = `https://api.telegram.org/bot${token}/editMessageText`

                    fetch(editUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: messageId,
                            text: updatedText,
                            parse_mode: 'HTML',
                            // Sending empty reply_markup removes the inline keyboard
                            reply_markup: { inline_keyboard: [] }
                        })
                    }).catch(console.error)
                }
            }

            // Always answer the callback query so the loading icon disappears on the user's Telegram app
            if (process.env.TELEGRAM_BOT_TOKEN) {
                const answerUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`
                fetch(answerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: callbackQuery.id,
                        text: `Action Processed: ${statusText}`
                    })
                }).catch(console.error)
            }
        }

        return new Response('OK')
    } catch (e) {
        console.error("Telegram Webhook Error:", e)
        return new Response('Error', { status: 500 })
    }
}
