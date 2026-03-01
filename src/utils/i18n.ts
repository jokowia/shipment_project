import { cookies } from 'next/headers'
import { Locale, dictionaries } from './i18n-dictionaries'

export { type Locale, dictionaries }

// Utility to fetch language async on the server
export async function getLanguage(): Promise<Locale> {
    const defaultLang = 'EN'
    try {
        const c = await cookies()
        const loc = c.get('NEXT_LOCALE')?.value as Locale
        if (loc && dictionaries[loc]) {
            return loc
        }
    } catch {
        // cookies() throws in static pages/builds
    }
    return defaultLang
}

export function useTranslation(locale: Locale) {
    const dict = dictionaries[locale] || dictionaries['EN']
    return (key: keyof typeof dictionaries['EN']) => {
        return dict[key] || dictionaries['EN'][key] || key
    }
}
