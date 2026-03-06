import { getLanguage, useTranslation } from '@/utils/i18n'
import { AlertCircle } from 'lucide-react'

export default async function FraudPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-8">
                <AlertCircle className="w-10 h-10 text-[#D40511]" />
                <h1 className="text-4xl font-black text-[#D40511] uppercase tracking-tight">{t('fraud') || 'Fraud Awareness'}</h1>
            </div>

            <div className="bg-white p-8 rounded shadow-lg border border-gray-100 space-y-6 text-gray-700 leading-relaxed">
                <div className="bg-yellow-50 border-l-4 border-[#FFCC00] p-4 text-gray-800 font-medium mb-6">
                    DHL assumes no responsibility for costs or charges incurred as a result of fraudulent activity. Please stay vigilant.
                </div>

                <p>
                    <strong>1. Phishing Scams</strong><br />
                    Criminals often use the DHL brand in fraudulent emails or SMS messages indicating that a package could not be delivered in an attempt to steal sensitive information. DHL will never ask you to provide immediate payment bypassing our secure `dhl.com` domains.
                </p>

                <p>
                    <strong>2. Identifying Legitimate Communications</strong><br />
                    Watch out for poor grammar, aggressive deadlines ("Pay in 24 hours or package will be destroyed"), and spoofed email addresses. Legitimate tracking URLs will route you securely through our authorized portal environments.
                </p>

                <p>
                    <strong>3. Advance Fee Frauds</strong><br />
                    Do not transmit money via unverified wire transfer networks (like Western Union or MoneyGram) or Cryptocurrency for DHL services. Official duty fees are calculated clearly inside our Tracking or Custom Management environments.
                </p>

                <p>
                    <strong>4. Reporting Fraud</strong><br />
                    If you believe you have received a fraudulent communication claiming to be DHL, please forward the email or screenshot to <strong className="text-red-700">phishing-dpdhl@dhl.com</strong> for internal investigation.
                </p>
            </div>
        </div>
    )
}
