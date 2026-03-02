import { login } from '@/app/login/actions'

export default function LoginPage() {
    return (
        <div className="flex-1 w-full flex items-center justify-center bg-gray-50 py-12 px-6">
            <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-2xl border-t-8 border-[#D40511]">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-900">Admin Login</h1>
                    <p className="text-sm text-gray-500">Secure authorization for DHL personnel.</p>
                </div>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">
                            Authorized Email
                        </label>
                        <input
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D40511] focus:ring-1 focus:ring-[#D40511] transition text-black bg-gray-50"
                            id="email"
                            name="email"
                            type="email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D40511] focus:ring-1 focus:ring-[#D40511] transition text-black bg-gray-50"
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                    <button
                        className="w-full px-4 py-4 text-white font-bold text-lg bg-[#D40511] rounded-lg hover:bg-opacity-90 transition shadow-md"
                        formAction={login}
                    >
                        Sign in
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4">
                        By logging in, you agree to DHL Express security protocols and monitoring.
                    </p>
                </form>
            </div>
        </div>
    )
}
