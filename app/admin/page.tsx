import { supabase } from '@/lib/supabase';
import BookingsTable, { type AdminBooking } from '@/components/admin/BookingsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(
      'id, service_date, service_time, first_name, last_name, email, address_line1, city, service_type, status, claimed_by'
    )
    .order('service_date', { ascending: true });

  if (bookingsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
        Failed to load bookings: {bookingsError.message}
      </div>
    );
  }

  // Fetch cleaners for all claimed bookings
  const cleanerIds = [
    ...new Set((bookings ?? []).map((b) => b.claimed_by).filter(Boolean) as string[]),
  ];

  const cleanerMap: Record<string, string> = {};
  if (cleanerIds.length > 0) {
    const { data: cleaners } = await supabase
      .from('cleaners')
      .select('id, first_name, last_name')
      .in('id', cleanerIds);

    for (const c of cleaners ?? []) {
      cleanerMap[c.id] = `${c.first_name} ${c.last_name}`;
    }
  }

  const rows: AdminBooking[] = (bookings ?? []).map((b) => ({
    id: b.id,
    service_date: b.service_date,
    service_time: b.service_time,
    first_name: b.first_name,
    last_name: b.last_name,
    email: b.email,
    address_line1: b.address_line1,
    city: b.city,
    service_type: b.service_type,
    status: b.status,
    cleaner_name: b.claimed_by ? (cleanerMap[b.claimed_by] ?? null) : null,
  }));

  const counts = {
    total: rows.length,
    unassigned: rows.filter((b) => b.status === 'unassigned').length,
    assigned: rows.filter((b) => b.status === 'assigned').length,
    completed: rows.filter((b) => b.status === 'completed').length,
    cancelled: rows.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F1C3F]">Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">All bookings sorted by appointment date</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: counts.total, color: 'text-[#0F1C3F]' },
          { label: 'Unassigned', value: counts.unassigned, color: 'text-yellow-600' },
          { label: 'Assigned', value: counts.assigned, color: 'text-blue-600' },
          { label: 'Completed', value: counts.completed, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <BookingsTable bookings={rows} />
    </div>
  );
}
