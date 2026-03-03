import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TemplateForm } from './TemplateForm'
import { TemplateList } from './TemplateList'

export default async function TemplatesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return redirect('/login')
    }

    const { data: templates, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, is_default, created_at')
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching templates:", error)
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* DHL Style Header */}
            <div className="bg-[#FFCC00] border-b-4 border-[#D40511] sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <a href="/admin" className="flex items-center">
                                <img src="/dhllogonobg.svg" alt="DHL Express Logo" className="object-contain h-8 sm:h-10 w-auto" />
                            </a>
                            <h1 className="text-xl font-bold text-gray-900 border-l-2 border-red-900/20 pl-4">Email Templates Engine</h1>
                        </div>
                        <a href="/admin" className="text-sm font-bold text-gray-900 hover:text-black transition-colors uppercase tracking-wider">
                            &larr; Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <TemplateForm />
                    </div>
                    <div className="lg:col-span-3">
                        <TemplateList templates={templates || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
