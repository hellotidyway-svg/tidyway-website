import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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

function parseDurationMinutes(duration: string): number {
  const hrMatch = duration.match(/(\d+)\s*hr/);
  const minMatch = duration.match(/(\d+)\s*min/);
  const hours = hrMatch ? parseInt(hrMatch[1], 10) : 0;
  const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
  return hours * 60 + mins;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    const fullAddress = [body.address.line1, body.address.line2]
      .filter(Boolean)
      .join(', ');

    // Upsert customer — update if email already exists
    const { data: existingCustomers, error: lookupError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', body.email)
      .limit(1);

    if (lookupError) throw new Error(`Customer lookup failed: ${lookupError.message}`);

    let customerId: string;

    if (existingCustomers && existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: body.firstName,
          last_name: body.lastName,
          phone: body.phone,
          address: fullAddress,
          city: body.address.city,
          postal_code: body.address.postalCode,
          stripe_customer_id: body.customerId,
        })
        .eq('id', customerId);

      if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
    } else {
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          phone: body.phone,
          address: fullAddress,
          city: body.address.city,
          postal_code: body.address.postalCode,
          stripe_customer_id: body.customerId,
        })
        .select('id')
        .single();

      if (insertError) throw new Error(`Customer insert failed: ${insertError.message}`);
      customerId = newCustomer.id;
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customerId,
        service_type: body.frequency,
        scheduled_date: body.serviceDate,
        scheduled_time: body.serviceTime,
        status: 'pending',
        price_cents: Math.round(body.totalPrice * 100),
        address: fullAddress,
        notes: body.specialInstructions ?? null,
        payment_method_id: body.paymentMethodId,
        frequency: body.frequency,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        add_ons: body.addOns,
        estimated_duration_minutes: parseDurationMinutes(body.estimatedDuration),
        access_type: body.accessType,
        access_notes: body.accessNotes ?? null,
        sms_opt_in: body.smsOptIn,
      })
      .select('id')
      .single();

    if (bookingError) throw new Error(`Booking insert failed: ${bookingError.message}`);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
