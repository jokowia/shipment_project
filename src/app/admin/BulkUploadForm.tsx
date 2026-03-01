'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { addSingleClient } from './actions'

export function BulkUploadForm() {
    const [loading, setLoading] = useState(false)
    const [statusText, setStatusText] = useState('')

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        setStatusText('Parsing CSV...')

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[]

                let successCount = 0
                let failCount = 0

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i]
                    // Expected CSV shape: email, tracking_number
                    if (row.email && row.tracking_number) {
                        try {
                            const formData = new FormData()
                            formData.append('email', row.email)
                            formData.append('trackingNumber', row.tracking_number)

                            await addSingleClient(formData)
                            successCount++
                            setStatusText(`Processing: ${successCount}/${rows.length}`)
                        } catch (err) {
                            failCount++
                        }
                    } else {
                        failCount++
                    }
                }

                setStatusText(`Upload complete! Success: ${successCount}, Failed/Skipped: ${failCount}.`)
                setLoading(false)
            },
            error: (error) => {
                setStatusText(`Parsing error: ${error.message}`)
                setLoading(false)
            }
        })
    }

    return (
        <div className="mt-4 flex items-center justify-end gap-3 bg-white border border-gray-200 p-2 pl-4 rounded pr-2 shadow-sm">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mr-2">BATCH UPLOAD</label>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                className="w-48 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#FFCC00] file:text-gray-900 hover:file:bg-yellow-500 hover:file:text-white transition cursor-pointer"
            />
            {statusText && <span className="text-xs text-dhl-red font-semibold animate-pulse">{statusText}</span>}
        </div>
    )
}
