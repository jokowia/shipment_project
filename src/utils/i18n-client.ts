import { Locale, dictionaries } from './i18n-dictionaries'

export function useClientTranslation() {
    let loc: Locale = 'EN'
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/)
        if (match && dictionaries[match[2] as Locale]) {
            loc = match[2] as Locale
        }
    }

    const dict = dictionaries[loc] || dictionaries['EN']
    return (key: keyof typeof dictionaries['EN']) => {
        return dict[key] || dictionaries['EN'][key] || key
    }
}
