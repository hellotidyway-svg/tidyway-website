import Link from 'next/link';
import { Suspense } from 'react';
import BookingConfirmedContent from './BookingConfirmedContent';

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#f0fdf9] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Checkmark */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#2DD4A7] flex items-center justify-center shadow-lg shadow-[#2DD4A7]/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-3">
          Your Booking is Confirmed
        </h1>
        <p className="text-gray-500 text-base mb-8">
          We&apos;ll see you soon. A confirmation has been sent to your email.
        </p>

        {/* Booking reference */}
        <Suspense fallback={null}>
          <BookingConfirmedContent />
        </Suspense>

        {/* Trust points */}
        <div className="bg-[#0F1C3F] rounded-2xl p-5 mb-8 text-left">
          {[
            'Background-checked cleaners',
            '$2M liability insurance',
            'Happiness guarantee — if it\'s not right, we\'ll come back',
            'No charge until after your clean is complete',
          ].map(point => (
            <div key={point} className="flex items-center gap-2.5 py-1.5">
              <span className="w-4 h-4 rounded-full bg-[#2DD4A7]/20 text-[#2DD4A7] text-[10px] font-bold flex items-center justify-center shrink-0">
                ✓
              </span>
              <span className="text-white/80 text-xs">{point}</span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-[#0F1C3F] font-extrabold px-8 py-3.5 rounded-xl transition-colors text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
