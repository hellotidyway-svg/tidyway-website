import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = formData.get('token') as string | null;
  const cleanerId = formData.get('cleanerId') as string | null;

  const origin = new URL(req.url).origin;

  if (!token) {
    return NextResponse.redirect(new URL('/accept-job', origin));
  }

  // Look up cleaner details using the ID from the URL
  let cleanerEmail = '';
  let cleanerName = 'Unknown';
  if (cleanerId) {
    const { data: cleaner, error: cleanerError } = await supabase
      .from('cleaners')
      .select('email, first_name, last_name')
      .eq('id', cleanerId)
      .single();
    if (cleanerError) {
      console.error('[accept-job/confirm] Cleaner lookup failed:', cleanerError);
    }
    if (cleaner) {
      cleanerEmail = cleaner.email;
      cleanerName = `${cleaner.first_name} ${cleaner.last_name}`;
    }
  }

  // Atomic claim: only succeeds if the booking is still unassigned
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({ status: 'assigned', claimed_by: cleanerId ?? null })
    .eq('notification_token', token)
    .eq('status', 'unassigned')
    .select()
    .returns<Record<string, string | null>[]>();

  const redirectBase = `/accept-job?token=${encodeURIComponent(token)}${cleanerId ? `&cleaner=${encodeURIComponent(cleanerId)}` : ''}`;

  if (error || !updated || updated.length === 0) {
    // Race condition: another cleaner claimed it first
    return NextResponse.redirect(new URL(`${redirectBase}&taken=1`, origin));
  }

  const booking = updated[0];
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

  // Send confirmation email to the cleaner who accepted
  if (cleanerEmail) {
    await resend.emails.send({
      from: 'noreply@mail.tidyway.ca',
      to: cleanerEmail,
      subject: `Job Confirmed – ${booking.service_date} at ${booking.service_time}`,
      html: buildCleanerConfirmEmail({
        cleanerName,
        serviceDescription,
        date: booking.service_date as string,
        time: booking.service_time as string,
        address: fullAddress,
        duration: booking.estimated_duration as string,
        accessType: booking.access_type as string,
        accessNotes: booking.access_notes as string | null,
        specialInstructions: booking.special_instructions as string | null,
        customerFirstName: booking.first_name as string,
      }),
    });
  }

  // Send admin notification to TidyWay
  await resend.emails.send({
    from: 'noreply@mail.tidyway.ca',
    to: 'hello@tidyway.ca',
    subject: `Job Claimed – ${booking.service_date} at ${booking.service_time}`,
    html: buildAdminNotificationEmail({
      cleanerName,
      cleanerEmail,
      serviceDescription,
      date: booking.service_date as string,
      time: booking.service_time as string,
      fullAddress,
      duration: booking.estimated_duration as string,
      customerName: `${booking.first_name} ${booking.last_name}`,
      customerEmail: booking.email as string,
      customerPhone: booking.phone as string,
      accessType: booking.access_type as string,
      accessNotes: booking.access_notes as string | null,
      specialInstructions: booking.special_instructions as string | null,
      totalPrice: booking.total_price as string,
    }),
  });

  return NextResponse.redirect(new URL(`${redirectBase}&accepted=1`, origin));
}

function buildCleanerConfirmEmail(data: {
  cleanerName: string;
  serviceDescription: string;
  date: string;
  time: string;
  address: string;
  duration: string;
  accessType: string;
  accessNotes: string | null;
  specialInstructions: string | null;
  customerFirstName: string;
}) {
  const accessInfo = data.accessNotes
    ? `${data.accessType} — ${data.accessNotes}`
    : data.accessType;

  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#0F1C3F;max-width:600px;margin:0 auto;padding:32px 24px;background:#f9fafb;">
  <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="font-size:22px;font-weight:800;margin:0 0 4px;">You got the job! 🎉</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;">Hi ${data.cleanerName}, here are your confirmed job details.</p>

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Service</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.serviceDescription}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.time}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Est. Duration</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.duration}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Customer</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.customerFirstName}</td></tr>
    </table>

    <div style="background:#f0fdf9;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:700;font-size:14px;">Service Address</p>
      <p style="margin:0;font-size:14px;color:#0F1C3F;">${data.address}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Home Access</td><td style="padding:10px 16px;font-size:14px;">${accessInfo}</td></tr>
      ${data.specialInstructions ? `<tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Special Instructions</td><td style="padding:10px 16px;font-size:14px;">${data.specialInstructions}</td></tr>` : ''}
    </table>

    <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center;">Questions? Email <a href="mailto:hello@tidyway.ca" style="color:#2DD4A7;">hello@tidyway.ca</a></p>
  </div>
</body>
</html>`;
}

function buildAdminNotificationEmail(data: {
  cleanerName: string;
  cleanerEmail: string;
  serviceDescription: string;
  date: string;
  time: string;
  fullAddress: string;
  duration: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  accessType: string;
  accessNotes: string | null;
  specialInstructions: string | null;
  totalPrice: string;
}) {
  const accessInfo = data.accessNotes
    ? `${data.accessType} — ${data.accessNotes}`
    : data.accessType;

  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#0F1C3F;max-width:600px;margin:0 auto;padding:32px 24px;background:#f9fafb;">
  <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="font-size:22px;font-weight:800;margin:0 0 4px;">Job Claimed</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;"><strong>${data.cleanerName}</strong>${data.cleanerEmail ? ` (${data.cleanerEmail})` : ''} has accepted a job.</p>

    <h3 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin:0 0 12px;">Job Details</h3>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Service</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.serviceDescription}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.time}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Address</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.fullAddress}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Duration</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.duration}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Total Price</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">$${data.totalPrice}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Home Access</td><td style="padding:10px 16px;font-size:14px;">${accessInfo}</td></tr>
      ${data.specialInstructions ? `<tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Instructions</td><td style="padding:10px 16px;font-size:14px;">${data.specialInstructions}</td></tr>` : ''}
    </table>

    <h3 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin:0 0 12px;">Customer</h3>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Name</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.customerName}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Email</td><td style="padding:10px 16px;font-size:14px;">${data.customerEmail}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Phone</td><td style="padding:10px 16px;font-size:14px;">${data.customerPhone}</td></tr>
    </table>
  </div>
</body>
</html>`;
}
