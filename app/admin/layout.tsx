import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TidyWay Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav className="bg-[#0F1C3F] px-6 py-4 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-white font-extrabold text-lg tracking-tight hover:text-[#2DD4A7] transition-colors"
        >
          Tidyway Admin
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-[#2DD4A7] text-sm font-semibold hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </form>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
