'use client'

import { setDefaultTemplate, deleteTemplate } from './actions'
import { useState } from 'react'

type Template = {
    id: string
    name: string
    subject: string
    is_default: boolean
    created_at: string
}

export function TemplateList({ templates }: { templates: Template[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleSetDefault = async (id: string) => {
        setLoadingId(id)
        try {
            await setDefaultTemplate(id)
        } catch (e) {
            alert('Failed to set default')
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return
        setLoadingId(id)
        try {
            await deleteTemplate(id)
        } catch (e) {
            alert('Failed to delete')
        } finally {
            setLoadingId(null)
        }
    }

    if (templates.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                No templates created yet.
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 border-b p-6 bg-gray-50">Manage Existing Templates</h2>
            <ul className="divide-y divide-gray-200">
                {templates.map(t => (
                    <li key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{t.name}</h3>
                                {t.is_default && (
                                    <span className="bg-dhl-yellow text-gray-900 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">Default</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600"><strong>Subject:</strong> {t.subject}</p>
                            <p className="text-xs text-gray-400 mt-1">Created: {new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {!t.is_default && (
                                <button
                                    onClick={() => handleSetDefault(t.id)}
                                    disabled={loadingId === t.id}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                    Set as Default
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(t.id)}
                                disabled={loadingId === t.id}
                                className="text-sm font-semibold text-dhl-red hover:text-red-800 disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
