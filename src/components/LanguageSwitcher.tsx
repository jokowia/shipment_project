'use client'

import { useRouter } from 'next/navigation'
import { Locale } from '@/utils/i18n'

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
    const router = useRouter()

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`
        router.refresh()
    }

    return (
        <select
            value={currentLang}
            onChange={changeLanguage}
            className="bg-transparent border-none text-gray-600 font-bold text-xs cursor-pointer outline-none hover:text-[#d40511] uppercase tracking-wider"
        >
            <option value="EN">EN</option>
            <option value="AR">AR</option>
            <option value="FR">FR</option>
            <option value="ES">ES</option>
            <option value="AL">AL</option>
            <option value="NL">NL</option>
        </select>
    )
}
