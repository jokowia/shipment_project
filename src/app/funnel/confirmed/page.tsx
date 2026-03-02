import { getLanguage, useTranslation } from '@/utils/i18n'
import { ShipmentSummary } from '@/components/ShipmentSummary'

export default async function ConfirmedPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Confirmation Message */}
            <div className="lg:col-span-8 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                <div className="bg-[#D40511] h-2 w-full"></div>
                <div className="p-10 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 border-4 border-white shadow-sm ring-1 ring-green-200">
                        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t('delivery_confirmed')}</h2>
                    <p className="text-gray-600 font-medium leading-relaxed max-w-md">
                        {t('verification_complete')}
                    </p>
                    <div className="pt-6 w-full max-w-sm">
                        <a href="/" className="inline-block w-full bg-[#D40511] text-white font-black text-lg py-4 rounded hover:bg-red-700 transition-colors shadow-md uppercase tracking-wider">
                            {t('return_home')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Column: Persistent Shipment Summary */}
            <div className="lg:col-span-4 self-stretch">
                <ShipmentSummary status="cleared" />
            </div>

        </div>
    )
}
