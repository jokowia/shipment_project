import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const rawToken = searchParams.get('token')

    if (!rawToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(rawToken)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Service role access effectively bypassing RLS to view state
    const { data: client, error } = await supabase
        .from('clients')
        .select('state')
        .eq('token_hash', tokenHash)
        .single()

    if (error || !client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({ state: client.state })
}
