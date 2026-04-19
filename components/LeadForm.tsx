'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4A7] focus:border-transparent bg-white transition-shadow hover:shadow-md hover:shadow-[#2DD4A7]/20 hover:border-[#2DD4A7]/50';

export default function LeadForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    bedrooms: '',
    bathrooms: '',
    firstName: '',
    email: '',
    phone: '',
  });

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  // Redirect to /booking after form submission
  useEffect(() => {
    if (submitted) {
      // Send webhook to GHL
      const sendWebhook = async () => {
        try {
          const response = await fetch(
            'https://services.leadconnectorhq.com/hooks/OFtHKPjNBLxDyUbUKHKF/webhook-trigger/7cc910b6-3d58-4383-a978-b33bec26bd44',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firstName: form.firstName,
                email: form.email,
                phone: form.phone,
                bedrooms: form.bedrooms,
                bathrooms: form.bathrooms,
              }),
            }
          );

          if (response.ok) {
            console.log('Webhook sent successfully');
          }
        } catch (error) {
          // Silently handle errors — always redirect
          console.log('Webhook error (silently handled)');
        }
      };

      sendWebhook();

      // Fire Google Ads conversion event before redirect
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-17983524327/XqPACJvx454cEOebm_9C',
            'event_callback': () => {
              router.push('/booking');
            }
          });
        } else {
          // Fallback if gtag not available
          router.push('/booking');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [submitted, router, form]);

  if (submitted) {
    return (
      <div
        id="lead-form"
        className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-extrabold text-[#0F1C3F] mb-2">
          Thanks, {form.firstName || 'friend'}!
        </h3>
        <p className="text-gray-500 text-base">
          We&apos;ll be in touch shortly with your quote.
        </p>
      </div>
    );
  }

  return (
    <div
      id="lead-form"
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
    >
      <h3 className="text-xl font-extrabold text-[#0F1C3F] mb-2 text-center">Get Your Instant Price</h3>
      <p className="text-gray-500 text-sm mb-5 text-center">Tell us about your home to see your price instantly</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <select
            required
            value={form.bedrooms}
            onChange={e => set('bedrooms', e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>Bedrooms</option>
            {['1', '2', '3', '4', '5+'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select
            required
            value={form.bathrooms}
            onChange={e => set('bathrooms', e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>Bathrooms</option>
            {['1', '1.5', '2', '2.5', '3', '3+'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={e => set('firstName', e.target.value)}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className={inputClass}
          />
        </div>

        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          className={inputClass}
        />

        <button
          type="submit"
          className="w-full bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold py-4 rounded-xl text-lg transition-colors mt-1"
        >
          Get My Free Quote →
        </button>

        <p className="text-center text-gray-400 text-xs pt-1">
          No obligation. Takes less than 60 seconds.
        </p>
      </form>
    </div>
  );
}
