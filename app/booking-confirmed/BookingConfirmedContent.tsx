'use client';

import { useSearchParams } from 'next/navigation';

export default function BookingConfirmedContent() {
  const params = useSearchParams();
  const bookingId = params.get('id');

  if (!bookingId) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 mb-8 inline-block">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        Booking Reference
      </p>
      <p className="font-mono text-sm font-bold text-[#0F1C3F] break-all">{bookingId}</p>
    </div>
  );
}
