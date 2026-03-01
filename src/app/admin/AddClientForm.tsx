'use client'

import { addSingleClient } from './actions'
import { useState } from 'react'

export function AddClientForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        try {
            const res = await addSingleClient(formData)
            if (res.success) {
                setMessage(`Client added securely. Tracking: ${res.tracking_number}`)
            }
        } catch (e: any) {
            setMessage(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="flex gap-4 items-end mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
            <div className="flex-1">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Client Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    className="block w-full rounded border-gray-300 shadow-sm focus:border-dhl-red focus:ring-dhl-red sm:text-sm border p-2.5 transition-colors"
                />
            </div>
            <div className="flex-1">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Tracking Number</label>
                <input
                    type="text"
                    name="trackingNumber"
                    required
                    pattern="[A-Z0-9]+"
                    placeholder="e.g. DHL123456789"
                    className="block w-full rounded border-gray-300 shadow-sm focus:border-dhl-red focus:ring-dhl-red sm:text-sm border p-2.5 transition-colors font-mono"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-dhl-red text-white font-black uppercase tracking-wide px-8 py-2.5 rounded shadow-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
                {loading ? 'Adding...' : 'Add Securely'}
            </button>
            {message && <span className="text-sm font-medium text-green-700 w-full col-span-full">{message}</span>}
        </form>
    )
}
