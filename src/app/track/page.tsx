import { Package, Search, ChevronRight, AlertCircle } from 'lucide-react';

export default function TrackingPage() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50">
            {/* DHL Branded Hero Section */}
            <section className="relative w-full bg-[#FFCC00] py-16 px-6 border-b-4 border-[#D40511] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D40511] transform origin-bottom-left -skew-x-12 opacity-10 hidden md:block"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Track Your Shipment
                    </h1>
                    <p className="text-gray-800 text-lg md:text-xl font-medium max-w-2xl">
                        Enter your DHL Express 10-digit Waybill number to get real-time tracking updates and delivery status.
                    </p>
                </div>
            </section>

            {/* Tracking Input Container */}
            <section className="max-w-4xl mx-auto w-full px-6 -mt-8 relative z-20 mb-16">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-100">
                    <label className="block text-gray-900 font-bold text-lg mb-4">
                        Waybill Tracking Number
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                placeholder="e.g. 1234567890"
                                className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D40511] focus:ring-2 focus:ring-[#D40511]/20 transition bg-gray-50 font-mono text-black font-semibold"
                            />
                        </div>
                        <button disabled className="bg-gray-300 text-gray-500 font-bold text-lg px-8 py-4 rounded-lg cursor-not-allowed transition flex items-center justify-center gap-2 md:w-auto w-full">
                            <Search size={20} /> Track Now
                        </button>
                    </div>

                    <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-red-900 leading-relaxed font-medium">
                            <strong className="text-red-700 block mb-1">Security Notice: Restricted Access</strong>
                            Manual public tracking is temporarily disabled for standard shipments. If your shipment requires security verification, identity clearance, or duty payment, please use the secure encrypted link sent directly to your registered email or phone number.
                        </div>
                    </div>
                </div>

                {/* FAQ / Help Section Below Tracking Box */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            Where is my tracking number? <ChevronRight size={16} className="text-[#D40511]" />
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Your 10-digit tracking number (Waybill) can be found in your shipping confirmation email, or on the receipt provided by the sender.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            Link expired or missing? <ChevronRight size={16} className="text-[#D40511]" />
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            If your secure tracking link has expired or you cannot locate your clearance email, our support team can assist you.
                        </p>
                        <a href="/contact" className="text-[#D40511] font-bold text-sm hover:underline flex items-center gap-1">
                            Contact Customer Support <ChevronRight size={14} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
