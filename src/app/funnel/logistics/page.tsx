import { submitLogistics } from './actions'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { redirect } from 'next/navigation'
import { getLanguage, useTranslation } from '@/utils/i18n'

export default async function LogisticsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { token } = await searchParams
    const lang = await getLanguage()
    const t = useTranslation(lang)

    if (!token) {
        redirect('/unauthorized')
    }

    // Server-side fetch for the client's email based on the tracking token.
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const { data: client } = await supabase
        .from('clients')
        .select('email')
        .eq('token_hash', tokenHash)
        .single()

    if (!client) {
        redirect('/unauthorized')
    }

    return (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
            {/* DHL Top Accent */}
            <div className="bg-[#D40511] h-2 w-full"></div>

            <div className="p-8 space-y-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('delivery_details')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('dispatch_ready')}</p>
                </div>

                <form action={submitLogistics} className="space-y-5">
                    <input type="hidden" name="token" value={token} />

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('email_address')}</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={client.email}
                            readOnly
                            className="w-full rounded bg-gray-100 text-gray-500 border-gray-200 p-3 border focus:outline-none cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">{t('email_linked')}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('full_name')}</label>
                        <input type="text" name="name" required className="w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-3 border transition-colors text-black bg-white" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('phone_number')}</label>
                        <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" className="w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-3 border transition-colors text-black bg-white" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('street_address')}</label>
                        <input type="text" name="street" required className="w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-3 border transition-colors text-black bg-white" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('city')}</label>
                            <input type="text" name="city" required className="w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-3 border transition-colors text-black bg-white" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('zip')}</label>
                            <input type="text" name="zip" required className="w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-3 border transition-colors text-black bg-white" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-[#D40511] text-white font-black text-lg py-4 rounded hover:bg-red-700 transition-colors shadow-md uppercase">
                            {t('confirm_details')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
