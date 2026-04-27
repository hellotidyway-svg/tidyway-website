'use client';

import { useState } from 'react';
import Link from 'next/link';

type BookingStatus = 'unassigned' | 'assigned' | 'completed' | 'cancelled';
type ViewMode = 'list' | 'month' | 'week';

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

const STATUS_PILL: Record<BookingStatus, string> = {
  unassigned: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  assigned: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK_HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM – 8 PM

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

function parseTimeToHour(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minutes / 60;
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const [view, setView] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterOption>('All');

  const now = new Date();
  const todayStr = toDateStr(now);

  const [monthYear, setMonthYear] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [weekStart, setWeekStart] = useState(() => getWeekStart(now));

  const filtered =
    filter === 'All' ? bookings : bookings.filter((b) => b.status === filter.toLowerCase());

  // ——— Month view ———
  const monthGrid = getMonthGrid(monthYear.year, monthYear.month);

  function getBookingsForDay(date: Date): AdminBooking[] {
    const s = toDateStr(date);
    return filtered.filter((b) => b.service_date === s);
  }

  function prevMonth() {
    setMonthYear((p) =>
      p.month === 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: p.month - 1 }
    );
  }

  function nextMonth() {
    setMonthYear((p) =>
      p.month === 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: p.month + 1 }
    );
  }

  // ——— Week view ———
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekLabel = `${weekStart.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const weekBookings = filtered.filter((b) => {
    return b.service_date >= toDateStr(weekStart) && b.service_date <= toDateStr(weekEnd);
  });

  function getBookingsForDayHour(day: Date, hour: number): AdminBooking[] {
    const s = toDateStr(day);
    return weekBookings.filter((b) => {
      if (b.service_date !== s) return false;
      return Math.floor(parseTimeToHour(b.service_time)) === hour;
    });
  }

  function prevWeek() {
    setWeekStart((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function nextWeek() {
    setWeekStart((p) => {
      const d = new Date(p);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  function isToday(date: Date): boolean {
    return toDateStr(date) === todayStr;
  }

  // ——— Chevron SVG ———
  function ChevronLeft() {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    );
  }

  function ChevronRight() {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {(['list', 'month', 'week'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
              view === v
                ? 'bg-white text-[#0F1C3F] shadow-sm'
                : 'text-gray-500 hover:text-[#0F1C3F]'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Status filter bar */}
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

      {/* ——— LIST VIEW ——— */}
      {view === 'list' && (
        <>
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
                      {['Date / Time', 'Customer', 'Address', 'Service', 'Status', 'Cleaner'].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((booking) => {
                      const badge = STATUS_BADGE[booking.status] ?? {
                        label: booking.status,
                        classes: 'bg-gray-100 text-gray-600',
                      };
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
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
        </>
      )}

      {/* ——— MONTH VIEW ——— */}
      {view === 'month' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#0F1C3F]"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>
            <span className="text-base font-bold text-[#0F1C3F]">
              {MONTHS[monthYear.month]} {monthYear.year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#0F1C3F]"
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className="px-2 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7">
              {monthGrid.map((date, i) => {
                const dayBookings = date ? getBookingsForDay(date) : [];
                const todayCell = date ? isToday(date) : false;
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] p-1.5 border-b border-r border-gray-50 ${
                      i % 7 === 6 ? 'border-r-0' : ''
                    } ${!date ? 'bg-gray-50/50' : ''}`}
                  >
                    {date && (
                      <>
                        <div
                          className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                            todayCell
                              ? 'bg-[#2DD4A7] text-[#0F1C3F]'
                              : 'text-gray-500'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-0.5">
                          {dayBookings.map((b) => (
                            <Link
                              key={b.id}
                              href={`/admin/bookings/${b.id}`}
                              className={`block rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight hover:opacity-75 transition-opacity truncate border ${STATUS_PILL[b.status]}`}
                            >
                              {b.first_name} {b.last_name.charAt(0)}. — {b.service_time}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ——— WEEK VIEW ——— */}
      {view === 'week' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#0F1C3F]"
              aria-label="Previous week"
            >
              <ChevronLeft />
            </button>
            <span className="text-base font-bold text-[#0F1C3F]">{weekLabel}</span>
            <button
              onClick={nextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#0F1C3F]"
              aria-label="Next week"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-16 px-2 py-3 border-r border-gray-100" />
                    {weekDays.map((day) => (
                      <th
                        key={toDateStr(day)}
                        className={`px-2 py-3 text-center border-r border-gray-100 last:border-r-0 ${
                          isToday(day) ? 'bg-[#f0fdf9]' : ''
                        }`}
                      >
                        <div className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                          {DAYS_OF_WEEK[day.getDay()]}
                        </div>
                        <div
                          className={`text-lg font-bold mt-0.5 ${
                            isToday(day) ? 'text-[#2DD4A7]' : 'text-[#0F1C3F]'
                          }`}
                        >
                          {day.getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WEEK_HOURS.map((hour) => (
                    <tr key={hour} className="border-b border-gray-50">
                      <td className="w-16 px-2 py-2 text-[10px] text-gray-400 font-medium border-r border-gray-100 text-right align-top whitespace-nowrap">
                        {formatHour(hour)}
                      </td>
                      {weekDays.map((day) => {
                        const slots = getBookingsForDayHour(day, hour);
                        return (
                          <td
                            key={toDateStr(day)}
                            className={`px-1 py-1 align-top border-r border-gray-50 last:border-r-0 min-h-[44px] ${
                              isToday(day) ? 'bg-[#f0fdf9]/40' : ''
                            }`}
                          >
                            {slots.map((b) => (
                              <Link
                                key={b.id}
                                href={`/admin/bookings/${b.id}`}
                                className={`block rounded px-1.5 py-1 mb-0.5 text-[10px] leading-tight hover:opacity-80 transition-opacity border ${STATUS_PILL[b.status]}`}
                              >
                                <div className="font-semibold truncate">
                                  {b.first_name} {b.last_name}
                                </div>
                                <div className="truncate opacity-70 capitalize">
                                  {b.service_type.replace(/_/g, ' ')}
                                </div>
                              </Link>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
