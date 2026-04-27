'use client';

import { useState, useTransition } from 'react';
import { reassignCleaner } from '@/app/admin/bookings/[id]/actions';

type Cleaner = { id: string; first_name: string; last_name: string };

export default function ReassignCleanerForm({
  bookingId,
  cleaners,
  currentCleanerId,
}: {
  bookingId: string;
  cleaners: Cleaner[];
  currentCleanerId: string | null;
}) {
  const [selected, setSelected] = useState(currentCleanerId ?? '');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setResult(null);
    startTransition(async () => {
      const res = await reassignCleaner(bookingId, selected);
      setResult(res);
    });
  }

  const unchanged = selected === (currentCleanerId ?? '');

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-extrabold text-[#0F1C3F] mb-4">Reassign Cleaner</h2>

      {result?.success && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 font-semibold">
          Cleaner reassigned successfully.
        </div>
      )}
      {result?.error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          Error: {result.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setResult(null);
          }}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#0F1C3F] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#2DD4A7] focus:border-transparent"
        >
          <option value="">— select a cleaner —</option>
          {cleaners.map((c) => (
            <option key={c.id} value={c.id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending || !selected || unchanged}
          className="px-6 py-2.5 rounded-xl bg-[#0F1C3F] text-white text-sm font-semibold transition-colors hover:bg-[#1a2f5e] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isPending ? 'Saving…' : 'Reassign'}
        </button>
      </form>

      {cleaners.length === 0 && (
        <p className="mt-3 text-xs text-gray-400 italic">No active cleaners available.</p>
      )}
    </div>
  );
}
