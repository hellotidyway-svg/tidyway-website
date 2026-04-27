'use client';

import { useState, useTransition } from 'react';
import { cancelBooking } from '@/app/admin/bookings/[id]/actions';

export default function CancelBookingButton({
  bookingId,
  disabled,
}: {
  bookingId: string;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await cancelBooking(bookingId);
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        disabled={disabled}
        className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm font-semibold transition-colors hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Cancel Booking
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <p className="text-sm font-semibold text-red-800 mb-1">Cancel this booking?</p>
      <p className="text-xs text-red-600 mb-4">This cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Cancelling…' : 'Confirm Cancel'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-[#0F1C3F] text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
