import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingPayload {
  customerId: string;
  paymentMethodId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  serviceDate: string;
  serviceTime: string;
  frequency: string;
  bedrooms: string;
  bathrooms: string;
  addOns: { id: string; label: string; price: number }[];
  totalPrice: number;
  estimatedDuration: string;
  accessType: string;
  accessNotes?: string;
  specialInstructions?: string;
  smsOptIn: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();
    const notificationToken = randomBytes(32).toString('hex');

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        service_type: 'home_cleaning',
        stripe_customer_id: body.customerId,
        payment_method_id: body.paymentMethodId,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        address_line1: body.address.line1,
        address_line2: body.address.line2 ?? null,
        city: body.address.city,
        province: body.address.province,
        postal_code: body.address.postalCode,
        service_date: body.serviceDate,
        service_time: body.serviceTime,
        frequency: body.frequency,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        add_ons: body.addOns,
        total_price: body.totalPrice,
        estimated_duration: body.estimatedDuration,
        access_type: body.accessType,
        access_notes: body.accessNotes ?? null,
        special_instructions: body.specialInstructions ?? null,
        sms_opt_in: body.smsOptIn,
        status: 'unassigned',
        notification_token: notificationToken,
      })
      .select('id')
      .single();

    if (bookingError || !booking) {
      throw new Error(bookingError?.message ?? 'Failed to create booking');
    }

    const fullAddress = [
      body.address.line1,
      body.address.line2,
      body.address.city,
      body.address.province,
      body.address.postalCode,
    ]
      .filter(Boolean)
      .join(', ');

    const freq = body.frequency.charAt(0).toUpperCase() + body.frequency.slice(1);
    const serviceDescription = `${freq} Home Cleaning — ${body.bedrooms} bed / ${body.bathrooms} bath`;

    // Customer confirmation email
    await resend.emails.send({
      from: 'noreply@mail.tidyway.ca',
      to: body.email,
      subject: 'Your TidyWay Booking is Confirmed',
      html: buildCustomerConfirmEmail({
        firstName: body.firstName,
        serviceDescription,
        date: body.serviceDate,
        time: body.serviceTime,
        address: fullAddress,
        duration: body.estimatedDuration,
        totalPrice: body.totalPrice,
      }),
    });

    // Cleaner job notification emails
    const { data: cleaners, error: cleanersError } = await supabase
      .from('cleaners')
      .select('id, first_name, last_name, email')
      .eq('is_active', true);

    if (cleanersError) {
      console.error('[booking/create] Failed to fetch cleaners:', cleanersError);
    }

    if (cleaners && cleaners.length > 0) {
      const results = await Promise.allSettled(
        cleaners.map((cleaner) =>
          resend.emails.send({
            from: 'noreply@mail.tidyway.ca',
            to: cleaner.email,
            subject: `New Job Available – ${body.serviceDate} at ${body.serviceTime}`,
            html: buildCleanerNotificationEmail({
              cleanerName: `${cleaner.first_name} ${cleaner.last_name}`,
              serviceDescription,
              date: body.serviceDate,
              time: body.serviceTime,
              address: fullAddress,
              duration: body.estimatedDuration,
              acceptUrl: `https://tidyway.ca/accept-job?token=${notificationToken}&cleaner=${cleaner.id}`,
            }),
          })
        )
      );

      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          console.error(`[booking/create] Failed to notify cleaner ${cleaners[i].id} (${cleaners[i].first_name}):`, result.reason);
        }
      });
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildCustomerConfirmEmail(data: {
  firstName: string;
  serviceDescription: string;
  date: string;
  time: string;
  address: string;
  duration: string;
  totalPrice: number;
}) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#0F1C3F;max-width:600px;margin:0 auto;padding:32px 24px;background:#f9fafb;">
  <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#2DD4A7;border-radius:50%;margin-bottom:16px;">
        <span style="color:#0F1C3F;font-size:28px;font-weight:900;">✓</span>
      </div>
      <h1 style="font-size:24px;font-weight:800;margin:0 0 4px;">Booking Confirmed!</h1>
      <p style="color:#6b7280;font-size:14px;margin:0;">Hi ${data.firstName}, you're all set. Here are your booking details.</p>
    </div>

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:160px;">Service</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.serviceDescription}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.time}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Address</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.address}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Est. Duration</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.duration}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Total</td><td style="padding:10px 16px;font-weight:700;font-size:14px;color:#2DD4A7;">$${data.totalPrice.toFixed(2)}</td></tr>
    </table>

    <div style="background:#f0fdf9;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:700;font-size:13px;color:#0F1C3F;">What to expect</p>
      <ul style="margin:0;padding-left:16px;color:#374151;font-size:13px;line-height:1.8;">
        <li>Your card will only be charged after the clean is complete</li>
        <li>You'll receive a reminder the day before your appointment</li>
        <li>Cancel or reschedule free of charge up to 24 hours before</li>
      </ul>
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:12px;">Questions? Reply to this email or call <a href="tel:+12262429012" style="color:#2DD4A7;">(226) 242-9012</a></p>
  </div>
</body>
</html>`;
}

function buildCleanerNotificationEmail(data: {
  cleanerName: string;
  serviceDescription: string;
  date: string;
  time: string;
  address: string;
  duration: string;
  acceptUrl: string;
}) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#0F1C3F;max-width:600px;margin:0 auto;padding:32px 24px;background:#f9fafb;">
  <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="font-size:22px;font-weight:800;margin:0 0 4px;">New Job Available</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px;">Hi ${data.cleanerName}, a new cleaning job is available to claim.</p>

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;width:140px;">Service</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.serviceDescription}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.time}</td></tr>
      <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Address</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.address}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Est. Duration</td><td style="padding:10px 16px;font-weight:600;font-size:14px;">${data.duration}</td></tr>
    </table>

    <div style="text-align:center;">
      <a href="${data.acceptUrl}" style="display:inline-block;background:#2DD4A7;color:#0F1C3F;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;">Accept Job →</a>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">First come, first served — accept quickly to claim this job.</p>
  </div>
</body>
</html>`;
}
