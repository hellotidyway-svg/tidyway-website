'use server';

import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function reassignCleaner(
  bookingId: string,
  cleanerId: string,
): Promise<{ success?: boolean; error?: string }> {
  const { error } = await supabase
    .from('bookings')
    .update({ claimed_by: cleanerId, status: 'assigned' })
    .eq('id', bookingId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function cancelBooking(bookingId: string): Promise<void> {
  // Stripe invoice voiding is handled manually in the Stripe dashboard
  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  redirect('/admin');
}
