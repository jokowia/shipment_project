import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getLanguage, useTranslation } from '@/utils/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NotificationCenter } from '@/components/NotificationCenter'
import { SettingsForm } from './SettingsForm'
import Image from 'next/image'

export default async function SettingsPage() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch Admin Profile Data
    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching admin data:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
            {/* DHL Style Header */}
            <div className="bg-dhl-yellow border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <a href="/admin" className="flex items-center group">
                                <Image src="/dhllogonobg.svg" alt="DHL Express Logo" width={110} height={30} className="object-contain h-6 sm:h-8 w-auto group-hover:opacity-80 transition-opacity" priority />
                            </a>
                            <h1 className="text-xl font-bold text-gray-900 border-l-2 border-red-900/20 pl-4 mx-2">
                                <a href="/admin" className="hover:underline">Dashboard</a> / Settings
                            </h1>
                            <LanguageSwitcher currentLang={lang} />
                            <NotificationCenter />
                        </div>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm font-semibold bg-white text-gray-900 px-4 py-2 rounded shadow-sm hover:bg-gray-100 border border-gray-200 transition-colors uppercase tracking-wider">
                                {t('sign_out')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Administrator Profile Context</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-8">
                            <div className="block text-sm font-black text-gray-600 uppercase tracking-wider mb-1">Registered Email Account</div>
                            <div className="text-gray-900 font-medium bg-gray-50 px-3 py-2 border border-gray-200 rounded max-w-lg cursor-not-allowed text-sm">
                                {admin?.email || user.email}
                            </div>
                        </div>

                        <hr className="my-8 border-gray-200" />

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                Notification Integrations
                                <span className="bg-dhl-yellow text-gray-900 text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase">Beta</span>
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                                Configure external systems to alert you automatically when shipping funnel parameters are updated by users tracking their payloads.
                            </p>
                        </div>

                        <SettingsForm initialChatId={admin?.telegram_chat_id || null} />
                    </div>
                </div>

            </div>
        </div>
    )
}
