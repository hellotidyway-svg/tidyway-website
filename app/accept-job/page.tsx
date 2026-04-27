import { supabase } from '@/lib/supabase';

interface Props {
  searchParams: {
    token?: string;
    cleaner?: string;
    accepted?: string;
    taken?: string;
  };
}

export default async function AcceptJobPage({ searchParams }: Props) {
  const { token, cleaner: cleanerId, accepted, taken } = searchParams;

  if (accepted === '1') {
    return (
      <Shell>
        <div className="text-5xl text-center mb-4">✅</div>
        <h1 className="text-2xl font-extrabold text-[#0F1C3F] text-center mb-2">Job Confirmed!</h1>
        <p className="text-gray-500 text-sm text-center leading-relaxed">
          You&apos;ve successfully claimed this job. Check your email for full details and the service address.
        </p>
      </Shell>
    );
  }

  if (!token) {
    return (
      <Shell>
        <h1 className="text-2xl font-extrabold text-[#0F1C3F] text-center mb-2">Invalid Link</h1>
        <p className="text-gray-500 text-sm text-center">
          This link is missing required information. Please check your email for the correct link.
        </p>
      </Shell>
    );
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('notification_token', token)
    .single();

  if (!booking) {
    return (
      <Shell>
        <h1 className="text-2xl font-extrabold text-[#0F1C3F] text-center mb-2">Link Not Found</h1>
        <p className="text-gray-500 text-sm text-center">
          This job link is no longer valid. Contact{' '}
          <a href="mailto:hello@tidyway.ca" className="text-[#2DD4A7] underline">
            hello@tidyway.ca
          </a>{' '}
          if you need assistance.
        </p>
      </Shell>
    );
  }

  if (booking.status === 'assigned' || taken === '1') {
    return (
      <Shell>
        <div className="text-5xl text-center mb-4">⚡</div>
        <h1 className="text-2xl font-extrabold text-[#0F1C3F] text-center mb-2">
          This job has already been claimed.
        </h1>
        <p className="text-gray-500 text-sm text-center leading-relaxed">
          Another cleaner accepted this job first. Watch your inbox for the next available job.
        </p>
      </Shell>
    );
  }

  const freq = booking.frequency
    ? booking.frequency.charAt(0).toUpperCase() + booking.frequency.slice(1)
    : '';
  const serviceDescription = `${freq} Home Cleaning — ${booking.bedrooms} bed / ${booking.bathrooms} bath`;
  const fullAddress = [
    booking.address_line1,
    booking.address_line2,
    booking.city,
    booking.province,
    booking.postal_code,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Shell>
      <h1 className="text-2xl font-extrabold text-[#0F1C3F] text-center mb-1">New Job Available</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Review the details below and confirm to claim this job.
      </p>

      <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
        <DetailRow label="Service" value={serviceDescription} />
        <DetailRow label="Date" value={booking.service_date} />
        <DetailRow label="Time" value={booking.service_time} />
        <DetailRow label="Address" value={fullAddress} />
        <DetailRow label="Customer" value={booking.first_name} />
        <DetailRow label="Est. Duration" value={booking.estimated_duration} />
      </div>

      <form action="/accept-job/confirm" method="POST">
        <input type="hidden" name="token" value={token} />
        {cleanerId && <input type="hidden" name="cleanerId" value={cleanerId} />}
        <button
          type="submit"
          className="w-full bg-[#2DD4A7] hover:bg-[#22c497] text-[#0F1C3F] font-extrabold py-4 rounded-xl text-lg transition-colors"
        >
          Confirm Accept →
        </button>
      </form>

      <p className="text-center text-gray-400 text-xs mt-4">
        First come, first served. Only confirm if you&apos;re available for this job.
      </p>
    </Shell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 text-sm shrink-0">{label}</span>
      <span className="font-semibold text-sm text-[#0F1C3F] text-right">{value}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-sm">
        {children}
      </div>
    </main>
  );
}
