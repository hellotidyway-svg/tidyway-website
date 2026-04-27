import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | TidyWay',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === '1';

  return (
    <main
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0F1C3F] rounded-full mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#2DD4A7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F1C3F]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">TidyWay Dashboard</p>
        </div>

        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm text-red-700 text-center">
            Incorrect password. Please try again.
          </div>
        )}

        <form action="/api/admin/login" method="POST" className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#0F1C3F] mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F1C3F] focus:outline-none focus:ring-2 focus:ring-[#2DD4A7] focus:border-transparent placeholder:text-gray-400"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2DD4A7] hover:bg-[#22c497] text-[#0F1C3F] font-extrabold py-3 rounded-xl text-sm transition-colors"
          >
            Sign In →
          </button>
        </form>
      </div>
    </main>
  );
}
