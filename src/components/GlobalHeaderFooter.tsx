'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export function GlobalHeader() {
    const pathname = usePathname()

    // Admin and Funnel have their own specialized headers
    if (pathname.startsWith('/admin') || pathname.startsWith('/funnel') || pathname === '/track') {
        return null
    }

    const isLogin = pathname.startsWith('/login');
    if (isLogin) {
        return null
    }

    return (
        <header className="bg-[#FFCC00] text-gray-900 p-4 shadow-md sticky top-0 z-50 border-b-4 border-[#D40511]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/dhllogonobg.svg" alt="DHL Express Logo" width={140} height={40} className="object-contain h-10 w-auto" priority />
                </Link>
                <nav className="flex gap-4 md:gap-6 font-semibold items-center text-sm md:text-base">
                    <Link href="/" className="hover:text-[#D40511] transition hidden sm:block">Home</Link>
                    <Link href="/tracking" className="hover:text-[#D40511] transition">Track</Link>
                    <Link href="/contact" className="hover:text-[#D40511] transition hidden sm:block">Contact</Link>
                    <Link href="/login" className="bg-[#D40511] text-white px-4 py-2 rounded hover:bg-red-800 transition shadow-sm border border-red-900">Admin Portal</Link>
                </nav>
            </div>
        </header>
    )
}

export function GlobalFooter() {
    const pathname = usePathname()

    // Hide global elements on the admin portal, login, and funnel routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/funnel') || pathname === '/track') {
        return null
    }

    return (
        <footer className="bg-gray-900 text-gray-400 p-6 text-center text-sm mt-auto border-t-4 border-[#FFCC00]">
            <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
                <p>© {new Date().getFullYear()} DHL International GmbH. All rights reserved.</p>
                <div className="flex gap-4 sm:gap-6 font-semibold">
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link>
                    <Link href="/fraud" className="hover:text-white transition-colors">Fraud Awareness</Link>
                </div>
            </div>
        </footer>
    )
}
