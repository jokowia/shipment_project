import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AddClientForm } from './AddClientForm'
import { BulkUploadForm } from './BulkUploadForm'
import { ClientTrackerTable } from './ClientTrackerTable'
import { getLanguage, useTranslation } from '@/utils/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NotificationCenter } from '@/components/NotificationCenter'

export default async function AdminDashboard() {
    const lang = await getLanguage()
    const t = useTranslation(lang)

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch Clients for this Admin
    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching clients:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
            {/* DHL Global Admin Header */}
            <header className="bg-[#FFCC00] text-gray-900 p-4 shadow-md sticky top-0 z-10 border-b-4 border-[#D40511]">
                <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <a href="/" className="flex items-center">
                            <img src="/dhllogonobg.svg" alt="DHL Express Logo" className="object-contain h-8 sm:h-10 w-auto" />
                        </a>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 border-l-2 border-red-900/20 pl-4 sm:pl-6 ml-1 sm:ml-2">{t('admin_command_center')}</h1>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <LanguageSwitcher currentLang={lang} />
                        <NotificationCenter />
                        <a href="/admin/settings" className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold text-white bg-gray-900 rounded hover:bg-black transition-colors uppercase tracking-wide">
                            Settings
                        </a>
                        <form action="/auth/signout" method="post">
                            <button className="text-[10px] sm:text-sm font-semibold bg-[#D40511] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded shadow-sm hover:bg-red-800 transition-colors uppercase tracking-wider">
                                {t('sign_out')}
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Client Management Panel */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col mb-6">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-semibold">{t('managed_clients')}</h2>
                                <a href="/admin/templates" className="text-sm text-blue-600 hover:underline">{t('manage_templates')}</a>
                            </div>
                            <div className="space-x-4">
                                <BulkUploadForm />
                            </div>
                        </div>
                        <AddClientForm />
                    </div>

                    {/* Real-Time Clients Table */}
                    <ClientTrackerTable initialClients={clients || []} />

                </div>
            </div>
        </div>
    )
}
