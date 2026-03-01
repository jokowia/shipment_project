'use client'

import { saveTemplate } from './actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TemplatesPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        try {
            await saveTemplate(formData)
            setMessage('Template saved securely.')
            router.refresh()
        } catch (e: any) {
            setMessage(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* DHL Style Header */}
            <div className="bg-dhl-yellow border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <span className="text-dhl-red font-black text-2xl tracking-tighter">DHL</span>
                            <h1 className="text-xl font-bold text-gray-900 border-l-2 border-dhl-red pl-4">Email Templates Engine</h1>
                        </div>
                        <button onClick={() => router.push('/admin')} className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                            &larr; Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Create New Template</h2>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Template Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g. Initial Invitation"
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-dhl-yellow focus:ring-dhl-yellow sm:text-sm border p-2 py-2.5 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Subject Line</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                placeholder="Your package is waiting for verification"
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-dhl-yellow focus:ring-dhl-yellow sm:text-sm border p-2 py-2.5 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">HTML Body</label>
                            <p className="text-xs text-gray-500 mb-2">Available variables: <code className="bg-gray-100 text-dhl-red px-1 rounded">{'{{tracking_number}}'}</code>, <code className="bg-gray-100 text-dhl-red px-1 rounded">{'{{raw_token}}'}</code></p>
                            <textarea
                                name="bodyHtml"
                                required
                                rows={8}
                                placeholder="<p>Dear client, track here: https://dhl.com/verify?token={{raw_token}}</p>"
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-dhl-yellow focus:ring-dhl-yellow sm:text-sm font-mono border p-2 py-2.5 outline-none transition"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="isDefault"
                                name="isDefault"
                                type="checkbox"
                                className="h-4 w-4 bg-white border-gray-300 rounded text-gray-900 focus:ring-dhl-yellow accent-gray-900"
                            />
                            <label htmlFor="isDefault" className="ml-2 block text-sm font-semibold text-gray-900">
                                Set as Default Template
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-dhl-red text-white font-bold px-6 py-2.5 rounded hover:bg-red-700 disabled:opacity-50 transition shadow-sm w-full sm:w-auto"
                        >
                            {loading ? 'Saving Template...' : 'Save Template'}
                        </button>
                        {message && <p className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm font-semibold text-green-800">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}
