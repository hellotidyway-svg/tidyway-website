import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Booking creation and customer/cleaner emails are handled synchronously in
  // /api/booking/create immediately after the card setup confirms, so no action
  // is needed here for setup_intent.succeeded. This handler exists for future
  // payment capture events (e.g. payment_intent.succeeded).
  console.log('Stripe event received:', event.type);

  return new Response('OK', { status: 200 });
}
