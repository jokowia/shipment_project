import Link from 'next/link';
import { Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-[#FFCC00] overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D40511] transform origin-bottom-left -skew-x-12 opacity-10 hidden md:block"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Excellence. <br /> Simply Delivered.
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-xl font-medium leading-relaxed">
              Global logistics and international shipping. Fast, reliable, and secure delivery to over 220 countries and territories worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link href="/tracking" className="inline-flex items-center justify-center gap-2 bg-[#D40511] text-white font-bold text-lg px-8 py-4 rounded hover:bg-red-700 transition shadow-lg w-full sm:w-auto">
                Track Shipment <ArrowRight size={20} />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded hover:bg-gray-100 transition shadow border border-gray-200 w-full sm:w-auto">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100 relative mt-8 md:mt-0">
            <div className="absolute -top-5 -right-5 bg-green-500 text-white p-3 rounded-full shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Track Your Parcel</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your 10-digit tracking number to get real-time status updates.</p>

            <div className="space-y-4">
              <div className="relative">
                <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="e.g. 1234567890"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D40511] focus:ring-1 focus:ring-[#D40511] transition bg-gray-50 font-mono text-black"
                />
              </div>
              <button disabled className="w-full bg-gray-300 text-gray-500 font-bold text-lg py-4 rounded-lg cursor-not-allowed transition flex items-center justify-center gap-2">
                Track Status
              </button>
              <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-xs text-red-800 leading-relaxed text-left">
                <strong>Security Notice:</strong> Manual tracking on the homepage is temporarily restricted. If your shipment is pending verification, please refer to the secure encrypted link sent to your email.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-[#D40511]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900">Global Reach</h3>
            <p className="text-gray-600 text-sm">We connect people and businesses securely and reliably in over 220 countries.</p>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-[#D40511]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900">Express Delivery</h3>
            <p className="text-gray-600 text-sm">Time-definite international express delivery to keep your business moving.</p>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-[#D40511]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900">Secure & Trustworthy</h3>
            <p className="text-gray-600 text-sm">Advanced encryption and secure clearance funnels ensure your package arrives safely.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
