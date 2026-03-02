import { getLanguage, useTranslation } from '@/utils/i18n'

export default async function PrivacyPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black text-[#D40511] mb-8 uppercase tracking-tight">{t('privacy') || 'Privacy Notice'}</h1>

            <div className="bg-white p-8 rounded shadow-lg border border-gray-100 space-y-6 text-gray-700 leading-relaxed">
                <p>
                    <strong>1. Data Collection</strong><br />
                    DHL Express collects personal data necessary for the fulfillment of our logistic services. This includes names, addresses, phone numbers, and email identities provided during checkout or through our tracking portal verification flows.
                </p>

                <p>
                    <strong>2. Data Processing</strong><br />
                    We process your data to deliver packages, provide customs clearance communications, and process payments securely. Our systems employ state-of-the-art encryption across databases (such as our Supabase backend infrastructure) and during transit.
                </p>

                <p>
                    <strong>3. Data Sharing</strong><br />
                    We do not sell your personal data. We may share shipment data with strict third-party partners (like local postal carriers or customs administration agencies) solely for the objective of executing the delivery.
                </p>

                <p>
                    <strong>4. Your Rights (GDPR)</strong><br />
                    Under the GDPR and global equivalents, you maintain the right to access, rectify, or request the deletion of your personal records. Contact our Data Protection Officer regarding your rights.
                </p>

                <p>
                    <strong>5. Payment Processing</strong><br />
                    Payment transactions (such as duty service fees) are handled by secured, PCI-compliant Gateways. Card details collected inside verified funnels are transmitted completely encrypted through direct gateway tokenization, masking sensitive variables from our raw database logs.
                </p>
            </div>
        </div>
    )
}
