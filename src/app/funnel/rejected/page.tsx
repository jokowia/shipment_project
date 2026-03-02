import { getLanguage, useTranslation } from '@/utils/i18n'
import { ShipmentSummary } from '@/components/ShipmentSummary'

export default async function RejectedPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Rejection Message */}
            <div className="lg:col-span-8 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                <div className="bg-[#D40511] h-2 w-full"></div>
                <div className="p-10 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6 border-4 border-white shadow-sm ring-1 ring-red-200">
                        <svg className="h-10 w-10 text-[#D40511]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t('verification_failed')}</h2>
                    <p className="text-gray-600 font-medium leading-relaxed max-w-md">
                        {t('unable_verify')}
                    </p>
                    <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center w-full max-w-sm">
                        <span className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">{t('customer_service_default')}</span>
                        <p className="text-xl font-black text-[#D40511]">1-800-CALL-DHL</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Persistent Shipment Summary */}
            <div className="lg:col-span-4 self-stretch">
                <ShipmentSummary status="failed" />
            </div>

        </div>
    )
}
