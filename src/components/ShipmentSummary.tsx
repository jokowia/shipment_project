'use client'

import { Package, Truck, ShieldCheck, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type ShipmentStatus = 'action_required' | 'pending' | 'cleared' | 'failed'

type ShipmentSummaryProps = {
    trackingNumber?: string;
    showPricing?: boolean;
    serviceFee?: string;
    status?: ShipmentStatus;
}

export function ShipmentSummary({
    trackingNumber = "XA-9021-DE",
    showPricing = false,
    serviceFee = "$2.99 USD",
    status = 'action_required'
}: ShipmentSummaryProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'cleared':
                return {
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-500',
                    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
                    title: 'Shipment Cleared',
                    desc: 'Verification successful. Your package is scheduled for final delivery.'
                }
            case 'pending':
                return {
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-500',
                    icon: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />,
                    title: 'Processing Verification',
                    desc: 'We are currently verifying your details. This usually takes a few minutes.'
                }
            case 'failed':
                return {
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-500',
                    icon: <AlertCircle className="w-4 h-4 text-red-600" />,
                    title: 'Action Failed',
                    desc: 'We were unable to verify your information. Please contact support or retry.'
                }
            default:
                return {
                    color: 'text-gray-900',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-[#FFCC00]',
                    icon: <AlertCircle className="w-4 h-4 text-[#D40511]" />,
                    title: 'Action Required',
                    desc: 'Please complete the verification steps to release your package for final delivery.'
                }
        }
    }

    const config = getStatusConfig()

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center gap-3 text-gray-900 mb-2">
                    <Package className="w-6 h-6 text-[#D40511]" />
                    <h2 className="text-lg font-black tracking-tight uppercase">Shipment Summary</h2>
                </div>
                <p className="text-sm font-mono text-gray-600 bg-white p-2 rounded border border-gray-200 mt-3 flex justify-between items-center">
                    <span>Tracking ID:</span>
                    <span className="font-bold text-gray-900">{trackingNumber}</span>
                </p>
            </div>

            <div className="p-6 space-y-6 flex-1">
                {/* Timeline / Status */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="w-px h-10 bg-gray-200 my-1"></div>
                        </div>
                        <div className="pt-1">
                            <p className="font-bold text-sm text-gray-900">Dispatched</p>
                            <p className="text-xs text-gray-500">International Sorting Center</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'cleared' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="pt-1">
                            <p className="font-bold text-sm text-gray-900">{status === 'cleared' ? 'Delivery Scheduled' : 'In Transit'}</p>
                            <p className="text-xs text-gray-500">{status === 'cleared' ? 'Cleared for local distribution' : 'Pending final delivery clearance'}</p>
                        </div>
                    </div>
                </div>

                {/* Status Notice */}
                <div className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-r-md`}>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5">{config.icon}</div>
                        <p className="text-xs text-gray-700">
                            <span className={`font-bold ${config.color} block mb-1 uppercase tracking-tight`}>{config.title}</span>
                            {config.desc}
                        </p>
                    </div>
                </div>

                {/* Optional Pricing Section for Payment Stage */}
                {showPricing && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Charges Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Customs Clearance</span>
                                <span className="text-sm font-medium text-gray-900">Included</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Service Fee</span>
                                <span className="text-sm font-black text-[#D40511]">{serviceFee}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-center gap-2 text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium">Secure DHL Verification Process</span>
            </div>
        </div>
    )
}
