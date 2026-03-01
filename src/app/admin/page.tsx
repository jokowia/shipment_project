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
            {/* DHL Style Header */}
            <div className="bg-dhl-yellow border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            {/* Simple text logo if no SVG present */}
                            <span className="text-dhl-red font-black text-2xl tracking-tighter">DHL</span>
                            <h1 className="text-xl font-bold text-gray-900 border-x-2 border-gray-300 px-4 mx-2">{t('admin_command_center')}</h1>
                            <LanguageSwitcher currentLang={lang} />
                            <NotificationCenter />
                            <a href="/admin/settings" className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors uppercase tracking-wide">
                                Settings
                            </a>
                        </div>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm font-semibold bg-white text-gray-900 px-4 py-2 rounded shadow-sm hover:bg-gray-100 border border-gray-200 transition-colors uppercase tracking-wider">
                                {t('sign_out')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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
