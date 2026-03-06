import { getLanguage, useTranslation } from '@/utils/i18n'

export default async function TermsPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black text-[#D40511] mb-8 uppercase tracking-tight">{t('terms') || 'Terms of Use'}</h1>

            <div className="bg-white p-8 rounded shadow-lg border border-gray-100 space-y-6 text-gray-700 leading-relaxed">
                <p>
                    <strong>1. Application Setting</strong><br />
                    These Terms & Conditions apply to all services offered by DHL Express relative to your shipment. By utilizing our tracking and management portals, you formally accept these conditions.
                </p>

                <p>
                    <strong>2. Service Provision</strong><br />
                    DHL promises to provide standard or express delivery logistics in accordance with the service requested during checkout. Timelines are estimations and may be subject to external delays inclusive of customs clearance queues and extreme weather.
                </p>

                <p>
                    <strong>3. Acceptable Use</strong><br />
                    You agree not to use DHL tracking and administration systems for malicious, fraudulent, or illegal operations. Intercepting or redirecting parcels that do not belong to you via tracking API manipulation is strictly prohibited.
                </p>

                <p>
                    <strong>4. Customs, Duties & Taxes</strong><br />
                    The receiver assumes responsibility for all import duties, taxes, and service fees requested by local customs authorities unless otherwise stated by the shipper in a DDP agreement.
                </p>

                <p>
                    <strong>5. Liability Limitations</strong><br />
                    DHL's liability for shipment damages, delays, or losses is strictly governed by the Montreal Convention, Warsaw Convention, or standard statutory contract, limiting value claims unless supplemental shipment insurance was explicitly declared and paid for.
                </p>
            </div>
        </div>
    )
}
