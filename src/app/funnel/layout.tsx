import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getLanguage, useTranslation } from '@/utils/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function FunnelLayout({ children }: { children: ReactNode }) {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="flex flex-col bg-[#f4f4f4] font-sans" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
            {/* DHL Navbar Header */}
            <header className="w-full shadow-md z-10 sticky top-0 bg-[#FFCC00] border-b-4 border-[#D40511]">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center">
                            <Image src="/dhllogonobg.svg" alt="DHL Express Logo" width={140} height={40} className="object-contain h-8 sm:h-10 w-auto" priority />
                        </Link>
                    </div>
                    {/* Optional Right Side (E.g. Help / Language) */}
                    <div className="hidden sm:flex items-center text-sm font-semibold text-gray-900 gap-6">
                        <Link href="/tracking" className="hover:text-[#d40511] transition-colors">{t('track')}</Link>
                        <span className="hover:text-[#d40511] cursor-pointer transition-colors">{t('help')}</span>
                        <div className="h-4 w-px bg-gray-900/20 mx-1"></div>
                        <LanguageSwitcher currentLang={lang} />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                {children}
            </main>

            {/* DHL Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-sm mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-semibold text-gray-300">{t('rights')}</p>
                    <div className="flex gap-4 sm:gap-6">
                        <Link href="/terms" className="hover:text-white transition-colors">{t('terms') || 'Terms of Use'}</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy') || 'Privacy Notice'}</Link>
                        <Link href="/fraud" className="hover:text-white transition-colors">{t('fraud') || 'Fraud Awareness'}</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
