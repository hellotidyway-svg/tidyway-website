'use client';

import { useState } from 'react';
import Link from 'next/link';

type BookingStatus = 'unassigned' | 'assigned' | 'completed' | 'cancelled';

export interface AdminBooking {
  id: string;
  service_date: string;
  service_time: string;
  first_name: string;
  last_name: string;
  email: string;
  address_line1: string;
  city: string;
  service_type: string;
  status: BookingStatus;
  cleaner_name: string | null;
}

const STATUS_FILTERS = ['All', 'Unassigned', 'Assigned', 'Completed', 'Cancelled'] as const;
type FilterOption = (typeof STATUS_FILTERS)[number];

const STATUS_BADGE: Record<BookingStatus, { label: string; classes: string }> = {
  unassigned: { label: 'Unassigned', classes: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: 'Assigned', classes: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-600' },
};

function formatDate(date: string, time: string) {
  try {
    const d = new Date(`${date}T00:00:00`);
    const datePart = d.toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return `${datePart} · ${time}`;
  } catch {
    return `${date} · ${time}`;
  }
}

export default function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const [filter, setFilter] = useState<FilterOption>('All');

  const filtered =
    filter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === filter.toLowerCase());

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((f) => {
          const isActive = filter === f;
          const count =
            f === 'All'
              ? bookings.length
              : bookings.filter((b) => b.status === f.toLowerCase()).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                isActive
                  ? 'bg-[#0F1C3F] text-white border-[#0F1C3F]'
                  : 'bg-white text-[#0F1C3F] border-gray-200 hover:border-[#0F1C3F]'
              }`}
            >
              {f}
              <span
                className={`ml-1.5 text-xs font-normal ${isActive ? 'text-white/70' : 'text-gray-400'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">
          No bookings match this filter.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date / Time
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cleaner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((booking) => {
                  const badge = STATUS_BADGE[booking.status] ?? {
                    label: booking.status,
                    classes: 'bg-gray-100 text-gray-600',
                  };
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-[#0F1C3F]">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="hover:text-[#2DD4A7] transition-colors"
                        >
                          {formatDate(booking.service_date, booking.service_time)}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-semibold text-[#0F1C3F] hover:text-[#2DD4A7] transition-colors block"
                        >
                          {booking.first_name} {booking.last_name}
                        </Link>
                        <span className="text-gray-400 text-xs">{booking.email}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        <span className="block">{booking.address_line1}</span>
                        <span className="text-gray-400 text-xs">{booking.city}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 capitalize">
                        {booking.service_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {booking.cleaner_name ?? (
                          <span className="text-gray-300 italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
