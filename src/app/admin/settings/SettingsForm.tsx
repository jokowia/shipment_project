'use client'

import { useState } from 'react'
import { updateTelegramChatId } from './actions'

export function SettingsForm({ initialChatId }: { initialChatId: string | null }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        setErrorMsg('')
        try {
            const res = await updateTelegramChatId(formData)
            if (res.success) {
                setMessage('Settings saved successfully!')
            }
        } catch (e: any) {
            setErrorMsg(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
                    Telegram Chat ID
                </label>
                <div className="flex max-w-lg shadow-sm border border-gray-300 rounded overflow-hidden">
                    <span className="inline-flex items-center px-4 rounded-l border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        ID:
                    </span>
                    <input
                        type="text"
                        name="chatId"
                        defaultValue={initialChatId || ''}
                        placeholder="e.g. 123456789"
                        className="flex-1 block w-full focus:ring-dhl-yellow focus:border-dhl-yellow min-w-0 rounded-none rounded-r sm:text-sm border-gray-300 p-2.5 outline-none font-mono"
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500 max-w-lg">
                    Message your Telegram Bot (e.g. <span className="font-mono text-gray-700">@BotFather</span> for setup) and get your account's specific chat ID via the getUpdates API to receive direct notifications when clients submit data.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white font-bold uppercase tracking-wide px-8 py-2.5 rounded shadow-sm hover:bg-black disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
                {message && <span className="text-sm font-medium text-green-700">{message}</span>}
                {errorMsg && <span className="text-sm font-medium text-dhl-red">{errorMsg}</span>}
            </div>
        </form>
    )
}
