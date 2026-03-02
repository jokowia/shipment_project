import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getLanguage, useTranslation } from '@/utils/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function FunnelLayout({ children }: { children: ReactNode }) {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    return (
        <div className="flex min-h-screen flex-col bg-[#f4f4f4] font-sans" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
            {/* DHL Dual Navbar Header */}
            <header className="w-full shadow-md z-10 sticky top-0">
                {/* Top Utility Bar (Yellow) */}
                <div className="bg-[#FFCC00] h-4 w-full"></div>
                {/* Main Nav Bar (White) */}
                <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center">
                            <Image src="/dhllogonobg.svg" alt="DHL Express Logo" width={140} height={40} className="object-contain h-8 sm:h-10 w-auto" priority />
                        </Link>
                    </div>
                    {/* Optional Right Side (E.g. Help / Language) */}
                    <div className="hidden sm:flex items-center text-sm font-semibold text-gray-600 gap-6">
                        <span className="hover:text-[#d40511] cursor-pointer transition-colors">{t('track')}</span>
                        <span className="hover:text-[#d40511] cursor-pointer transition-colors">{t('ship')}</span>
                        <span className="hover:text-[#d40511] cursor-pointer transition-colors">{t('help')}</span>
                        <div className="h-4 w-px bg-gray-300 mx-1"></div>
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
                        <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('fraud')}</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
