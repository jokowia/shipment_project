import { Package, Search } from 'lucide-react';

export default function TrackingPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Track Your Shipment</h1>
                <p className="text-gray-600 text-lg">Enter your DHL Express tracking number to see the latest updates.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="10-digit tracking number"
                            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D40511] focus:ring-1 focus:ring-[#D40511] transition bg-gray-50 font-mono text-black"
                        />
                    </div>
                    <button disabled className="bg-gray-300 text-gray-500 font-bold text-lg px-8 py-4 rounded-lg cursor-not-allowed transition flex items-center justify-center gap-2 md:w-auto w-full">
                        <Search size={20} /> Track
                    </button>
                </div>
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 text-sm text-red-800 leading-relaxed text-left">
                    <strong>Security Notice:</strong> Manual tracking is temporarily restricted. If your shipment is pending verification, please refer to the secure encrypted link sent to your email to track the exact location of your parcel.
                </div>
            </div>

            {/* Help section */}
            <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-2">Need help tracking?</h3>
                <p className="text-gray-600 text-sm mb-4">If you cannot find your email or the tracking link has expired, please contact our support team.</p>
                <a href="/contact" className="text-[#D40511] font-semibold hover:underline">Contact Customer Support &rarr;</a>
            </div>
        </div>
    );
}
