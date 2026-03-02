import { PaymentCheckout } from './PaymentCheckout'
import { getLanguage, useTranslation } from '@/utils/i18n'
import { ShipmentSummary } from '@/components/ShipmentSummary'

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { token } = await searchParams
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Payment Form */}
            <div className="lg:col-span-8 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                {/* DHL Top Accent */}
                <div className="bg-[#D40511] h-2 w-full"></div>

                <div className="p-8 space-y-6 flex-1">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{t('customs_clearance')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('processing_fee')} Secure checkout.</p>
                    </div>

                    <PaymentCheckout token={token!}
                        dict={{
                            cardholder: t('cardholder_name'),
                            cardNumber: t('card_number'),
                            expiry: t('expiry'),
                            cvc: t('cvc'),
                            paySecurely: t('pay_securely')
                        }}
                    />
                </div>
            </div>

            {/* Right Column: Persistent Shipment Summary with Pricing */}
            <div className="lg:col-span-4 self-stretch">
                <ShipmentSummary showPricing={true} />
            </div>

        </div>
    )
}
