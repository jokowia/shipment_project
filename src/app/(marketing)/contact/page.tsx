import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 text-center">Contact DHL Express</h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">We are here to help. Reach out to us for any questions about your shipments, our services, or technical support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Contact info cards */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-red-50 text-[#D40511] rounded-full flex items-center justify-center mb-4">
                        <Phone size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Customer Service</h3>
                    <p className="text-gray-600 mb-4">Available 24/7 for urgent inquiries.</p>
                    <span className="font-semibold text-[#D40511] text-lg">1-800-CALL-DHL</span>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-red-50 text-[#D40511] rounded-full flex items-center justify-center mb-4">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4">Get help with your tracking or account.</p>
                    <span className="font-semibold text-[#D40511] text-lg">support@dhl.com</span>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-red-50 text-[#D40511] rounded-full flex items-center justify-center mb-4">
                        <MapPin size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Global Headquarters</h3>
                    <p className="text-gray-600 mb-4">Bonn, Germany</p>
                    <a href="#" className="font-semibold text-[#D40511] hover:underline">Find a local office</a>
                </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8">Send us a message</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] text-black" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] text-black" placeholder="john@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking Number (Optional)</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] font-mono text-black" placeholder="10-digit code" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                        <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] text-black" placeholder="How can we help you today?"></textarea>
                    </div>
                    <button type="button" className="bg-[#D40511] text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-red-700 transition w-full md:w-auto">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
