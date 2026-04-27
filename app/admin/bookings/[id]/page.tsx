import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ReassignCleanerForm from '@/components/admin/ReassignCleanerForm';
import CancelBookingButton from '@/components/admin/CancelBookingButton';

export const dynamic = 'force-dynamic';

type BookingStatus = 'unassigned' | 'assigned' | 'completed' | 'cancelled';

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${datePart} at ${time}`;
  } catch {
    return `${date} at ${time}`;
  }
}

function formatCurrency(amount: number | null) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-40 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-[#0F1C3F] font-medium">{value ?? <span className="text-gray-300 italic font-normal">—</span>}</dd>
    </div>
  );
}

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [{ data: booking, error }, { data: activecleaners }] = await Promise.all([
    supabase
      .from('bookings')
      .select(
        'id, service_type, service_date, service_time, frequency, bedrooms, bathrooms, estimated_duration, first_name, last_name, email, phone, address_line1, address_line2, city, province, postal_code, access_type, access_notes, special_instructions, add_ons, total_price, status, claimed_by, created_at'
      )
      .eq('id', params.id)
      .single(),
    supabase
      .from('cleaners')
      .select('id, first_name, last_name')
      .eq('is_active', true)
      .order('first_name', { ascending: true }),
  ]);

  if (error || !booking) notFound();

  // Fetch the name of the currently assigned cleaner (may be inactive)
  let assignedCleanerName: string | null = null;
  if (booking.claimed_by) {
    const { data: assigned } = await supabase
      .from('cleaners')
      .select('first_name, last_name')
      .eq('id', booking.claimed_by)
      .single();
    if (assigned) assignedCleanerName = `${assigned.first_name} ${assigned.last_name}`;
  }

  const status = (booking.status ?? 'unassigned') as BookingStatus;
  const badge = STATUS_BADGE[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
  const isCancelled = status === 'cancelled';

  const fullAddress = [
    booking.address_line1,
    booking.address_line2,
    booking.city,
    booking.province,
    booking.postal_code,
  ]
    .filter(Boolean)
    .join(', ');

  const addOns = Array.isArray(booking.add_ons) ? booking.add_ons as { label: string; price: number }[] : [];

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2DD4A7] hover:text-[#0F1C3F] transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Schedule
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1C3F]">
            {booking.first_name} {booking.last_name}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Booking ID: <span className="font-mono text-xs">{booking.id}</span>
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.classes}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Customer info */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Customer
        </h2>
        <dl>
          <DetailRow label="Name" value={`${booking.first_name} ${booking.last_name}`} />
          <DetailRow label="Email" value={<a href={`mailto:${booking.email}`} className="text-[#2DD4A7] hover:underline">{booking.email}</a>} />
          <DetailRow label="Phone" value={booking.phone ? <a href={`tel:${booking.phone}`} className="text-[#2DD4A7] hover:underline">{booking.phone}</a> : null} />
        </dl>
      </section>

      {/* Service details */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Service Details
        </h2>
        <dl>
          <DetailRow label="Service Type" value={booking.service_type?.replace(/_/g, ' ')} />
          <DetailRow label="Date & Time" value={formatDate(booking.service_date, booking.service_time)} />
          <DetailRow label="Frequency" value={booking.frequency ? booking.frequency.charAt(0).toUpperCase() + booking.frequency.slice(1) : null} />
          <DetailRow label="Bedrooms" value={booking.bedrooms} />
          <DetailRow label="Bathrooms" value={booking.bathrooms} />
          <DetailRow label="Est. Duration" value={booking.estimated_duration} />
          <DetailRow label="Cleaner" value={assignedCleanerName} />
        </dl>
      </section>

      {/* Address */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Address
        </h2>
        <dl>
          <DetailRow label="Street" value={[booking.address_line1, booking.address_line2].filter(Boolean).join(', ')} />
          <DetailRow label="City" value={booking.city} />
          <DetailRow label="Province" value={booking.province} />
          <DetailRow label="Postal Code" value={booking.postal_code} />
          <DetailRow label="Full Address" value={fullAddress} />
        </dl>
      </section>

      {/* Access & instructions */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Access & Instructions
        </h2>
        <dl>
          <DetailRow label="Home Access" value={booking.access_type} />
          <DetailRow label="Access Notes" value={booking.access_notes} />
          <DetailRow label="Special Instructions" value={booking.special_instructions} />
        </dl>
      </section>

      {/* Pricing */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Pricing
        </h2>
        <dl>
          {addOns.length > 0 && (
            <DetailRow
              label="Add-ons"
              value={
                <ul className="space-y-0.5">
                  {addOns.map((a, i) => (
                    <li key={i}>
                      {a.label}{' '}
                      <span className="text-gray-400 font-normal">
                        ({formatCurrency(a.price)})
                      </span>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          <DetailRow
            label="Total Price"
            value={
              <span className="text-lg font-extrabold text-[#0F1C3F]">
                {formatCurrency(booking.total_price)}
              </span>
            }
          />
        </dl>
      </section>

      {/* Reassign cleaner */}
      <div className="mb-4">
        <ReassignCleanerForm
          bookingId={booking.id}
          cleaners={activecleaners ?? []}
          currentCleanerId={booking.claimed_by ?? null}
        />
      </div>

      {/* Cancel booking */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-extrabold text-[#0F1C3F] mb-1">Cancel Booking</h2>
        <p className="text-xs text-gray-400 mb-4">
          This will mark the booking as cancelled. Payment refunds and Stripe invoice voiding are handled manually in the Stripe dashboard.
        </p>
        <CancelBookingButton bookingId={booking.id} disabled={isCancelled} />
        {isCancelled && (
          <p className="mt-3 text-xs text-gray-400 italic">This booking is already cancelled.</p>
        )}
      </div>
    </div>
  );
}
