import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'unassigned')
    .lt('created_at', thirtyMinutesAgo);

  if (error) {
    console.error('check-unassigned query failed:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!bookings || bookings.length === 0) {
    return new Response(JSON.stringify({ alerted: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await Promise.all(
    bookings.map((booking: Record<string, string | null>) => {
      const fullAddress = [
        booking.address_line1,
        booking.address_line2,
        booking.city,
        booking.province,
        booking.postal_code,
      ]
        .filter(Boolean)
        .join(', ');

      const freq = booking.frequency
        ? booking.frequency.charAt(0).toUpperCase() + booking.frequency.slice(1)
        : '';
      const serviceDescription = `${freq} Home Cleaning — ${booking.bedrooms} bed / ${booking.bathrooms} bath`;

      return resend.emails.send({
        from: 'noreply@mail.tidyway.ca',
        to: 'hello@tidyway.ca',
        subject: `⚠️ Unassigned Job Alert – ${booking.service_date} at ${booking.service_time}`,
        html: buildAlertEmail({ booking, serviceDescription, fullAddress }),
      });
    })
  );

  return new Response(JSON.stringify({ alerted: bookings.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildAlertEmail(data: {
  booking: Record<string, string | null>;
  serviceDescription: string;
  fullAddress: string;
}) {
  const { booking, serviceDescription, fullAddress } = data;
  const createdAt = booking.created_at
    ? new Date(booking.created_at).toLocaleString('en-CA', { timeZone: 'America/Toronto' })
    : 'Unknown';

  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#0F1C3F;max-width:600px;margin:0 auto;padding:32px 24px;background:#f9fafb;">
  <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="background:#fef3c7;border-radius:10px;padding:12px 16px;margin-bottom:24px;">
      <p style="margin:0;font-weight:700;font-size:14px;color:#92400e;">⚠️ No cleaner has accepted this job yet — it was created over 30 minutes ago.</p>
    </div>

    <h2 style="font-size:22px;font-weight:800;margin:0 0 4px;">Unassigned Job Alert</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;">Booking created: ${createdAt}</p>

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Service</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${serviceDescription}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${booking.service_date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${booking.service_time}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Address</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${fullAddress}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Customer</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${booking.first_name} ${booking.last_name}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Email</td><td style="padding:10px 16px;font-size:14px;">${booking.email}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Phone</td><td style="padding:10px 16px;font-size:14px;">${booking.phone}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Total Price</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">$${booking.total_price}</td></tr>
    </table>

    <p style="color:#9ca3af;font-size:12px;text-align:center;">You may need to manually assign a cleaner to this job.</p>
  </div>
</body>
</html>`;
}
