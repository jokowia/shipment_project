export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0AE00] font-sans">

      {/* DHL Header */}
      <header className="bg-[#D40511] text-white p-6 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-black italic tracking-wide">DHL EXPRESS</h1>
        <a href="/login" className="text-sm font-semibold hover:underline bg-[#F0AE00] text-black px-4 py-2 rounded">
          Admin Portal
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-white/95">
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">
            Track & Manage Your Shipments
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            For security reasons, DHL Express shipments pending verification require an encrypted authorization link. Please check your email inbox for your unique Tracking Notification to proceed.
          </p>

          <div className="mt-12 bg-gray-50 border p-6 rounded-lg shadow-sm">
            <input
              disabled
              type="text"
              placeholder="Enter 10-digit Tracking Number..."
              className="w-full text-lg p-4 border border-gray-300 rounded cursor-not-allowed bg-gray-100"
            />
            <button disabled className="mt-4 w-full bg-[#D40511] text-white font-bold text-lg py-4 rounded opacity-50 cursor-not-allowed">
              Track
            </button>
            <p className="text-xs text-gray-400 mt-4">
              *Manual tracking is currently restricted as your shipment requires active authorization via email.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 p-6 text-center text-sm">
        <p>© 2024 DHL International GmbH. All rights reserved.</p>
      </footer>

    </div>
  )
}
