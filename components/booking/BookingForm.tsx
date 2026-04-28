'use client';

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import {
  ADD_ONS,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  FREQUENCIES,
  FREQUENCY_LABELS,
  FREQUENCY_DISCOUNTS,
  calculatePrice,
  calculateDuration,
  type Frequency,
  type Bedrooms,
  type Bathrooms,
} from '@/lib/pricing';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeSlot = '9:00 AM' | '12:00 PM' | '3:00 PM';
type HomeAccess = 'home' | 'lockbox' | 'key-hidden' | 'other';

interface FormState {
  frequency: Frequency;
  bedrooms: Bedrooms | '';
  bathrooms: Bathrooms | '';
  addOnIds: string[];
  date: string;
  timeSlot: TimeSlot | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  homeAccess: HomeAccess | '';
  accessNotes: string;
  specialInstructions: string;
  smsOptIn: boolean;
}

type FormErrors = Partial<Record<keyof FormState | 'card' | 'submit', string>>;

// Item 5: Pre-select defaults — bedrooms=2, bathrooms=1
const INITIAL_FORM: FormState = {
  frequency: 'one-time',
  bedrooms: '2',
  bathrooms: '1',
  addOnIds: [],
  date: '',
  timeSlot: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: 'London',
  province: 'ON',
  postalCode: '',
  homeAccess: '',
  accessNotes: '',
  specialInstructions: '',
  smsOptIn: true,
};

const TIME_SLOTS: TimeSlot[] = ['9:00 AM', '12:00 PM', '3:00 PM'];

const HOME_ACCESS_OPTIONS: { value: HomeAccess; label: string }[] = [
  { value: 'home', label: "I'll be home" },
  { value: 'lockbox', label: 'Lockbox' },
  { value: 'key-hidden', label: 'Key hidden' },
  { value: 'other', label: 'Other' },
];

const CA_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

// ─── Add-on Icons ─────────────────────────────────────────────────────────────

const ADDON_ICONS: Record<string, JSX.Element> = {
  'deep-cleaning': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.64 3.64l1.42 1.42M10.94 10.94l1.42 1.42M3.64 12.36l1.42-1.42M10.94 5.06l1.42-1.42" stroke="#2DD4A7" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="2" fill="#2DD4A7"/>
    </svg>
  ),
  'oven': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.5C5.5 13.5 3.5 11.8 3.5 9.5c0-1.4.7-2.4 1.4-3 0 1 .5 1.5 1 1.5-.5-2 1-4 3.6-5.5-.5 2 .5 3 1 3.5.5-1 .5-2 0-3C12 4.3 12.5 6.5 12.5 9.5c0 2.3-2 4-4.5 4z" fill="#2DD4A7" fillOpacity="0.25" stroke="#2DD4A7" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  'fridge': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12M5.17 5.17l5.66 5.66M10.83 5.17l-5.66 5.66" stroke="#2DD4A7" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="1.5" fill="#2DD4A7"/>
    </svg>
  ),
  'cabinets': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="#2DD4A7" strokeWidth="1.5"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="#2DD4A7" strokeWidth="1.5"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="#2DD4A7" strokeWidth="1.5"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="#2DD4A7" strokeWidth="1.5"/>
    </svg>
  ),
  'windows': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#2DD4A7" strokeWidth="1.5"/>
      <path d="M8 2v12M2 8h12" stroke="#2DD4A7" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  'pet-hair': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="5.5" cy="4" rx="1.3" ry="1.8" fill="#2DD4A7"/>
      <ellipse cx="10.5" cy="4" rx="1.3" ry="1.8" fill="#2DD4A7"/>
      <ellipse cx="3" cy="7.5" rx="1" ry="1.6" fill="#2DD4A7"/>
      <ellipse cx="13" cy="7.5" rx="1" ry="1.6" fill="#2DD4A7"/>
      <path d="M8 7c-2 0-4 1.5-4 3.5 0 2 1.5 3.5 4 3.5s4-1.5 4-3.5C12 8.5 10 7 8 7z" fill="#2DD4A7" fillOpacity="0.8"/>
    </svg>
  ),
  'balcony': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8.5C2 5.46 4.69 3 8 3s6 2.46 6 5.5H2z" fill="#2DD4A7" fillOpacity="0.25" stroke="#2DD4A7" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 8.5v4c0 .55.45 1 1 1" stroke="#2DD4A7" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'move': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="7" width="12" height="7" rx="1" stroke="#2DD4A7" strokeWidth="1.5"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="#2DD4A7" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5.5 11h5" stroke="#2DD4A7" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputBase =
  'w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4A7] focus:border-transparent bg-white transition-all hover:border-[#2DD4A7]/50';
const inputNormal = `${inputBase} border-gray-200`;
const inputError = `${inputBase} border-red-400 focus:ring-red-400`;
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';

// ─── Date Strip ───────────────────────────────────────────────────────────────

const SHORT_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toYMD(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

function buildAvailableDates(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);
  const dates: string[] = [];
  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);
  while (cursor <= maxDate) {
    if (cursor.getDay() !== 0) dates.push(toYMD(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function CalendarPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const allDates = buildAvailableDates();
  const PAGE = 7;
  const [offset, setOffset] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayStr = toYMD(today);
  const tomorrowStr = toYMD(tomorrow);

  const visibleDates = allDates.slice(offset, offset + PAGE);
  const canGoPrev = offset > 0;
  const canGoNext = offset + PAGE < allDates.length;

  const dayLabel = (ds: string, dayIndex: number) => {
    if (ds === todayStr) return 'Today';
    if (ds === tomorrowStr) return 'Tomorrow';
    return SHORT_DAY[dayIndex].toUpperCase();
  };

  return (
    <div className="select-none w-full">
      <div className="flex items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => setOffset(o => Math.max(0, o - PAGE))}
          disabled={!canGoPrev}
          className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-lg text-gray-400 hover:text-[#0F1C3F] hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>

        <div style={{ flex: 1, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            {visibleDates.map(ds => {
              const [y, m, d] = ds.split('-').map(Number);
              const date = new Date(y, m - 1, d);
              const selected = value === ds;
              const label = dayLabel(ds, date.getDay());
              const isSpecial = label === 'Today' || label === 'Tomorrow';
              return (
                <DateChip
                  key={ds}
                  ds={ds}
                  d={d}
                  m={m}
                  label={label}
                  isSpecial={isSpecial}
                  selected={selected}
                  onClick={() => onChange(ds)}
                />
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOffset(o => o + PAGE)}
          disabled={!canGoNext}
          className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-lg text-gray-400 hover:text-[#0F1C3F] hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-2">Next 60 days only</p>
    </div>
  );
}

function DateChip({
  d, m, label, isSpecial, selected, onClick,
}: {
  ds: string; d: number; m: number; label: string; isSpecial: boolean; selected: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const chipStyle: React.CSSProperties = selected
    ? { background: 'rgba(45,212,167,0.12)', color: '#0F1C3F', border: '2px solid #2DD4A7', flex: 1, minWidth: 0 }
    : hovered
      ? { background: 'rgba(45,212,167,0.12)', color: '#0F1C3F', border: '1px solid #2DD4A7', flex: 1, minWidth: 0 }
      : { background: '#ffffff', color: '#0F1C3F', border: '1px solid #e5e7eb', flex: 1, minWidth: 0 };

  const mutedColor = selected ? 'rgba(15,28,63,0.6)' : hovered ? '#0F1C3F' : '#9ca3af';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={chipStyle}
      className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 px-1 transition-all"
    >
      <span style={{ fontSize: isSpecial ? '8px' : '10px', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1, color: mutedColor }}>
        {label}
      </span>
      <span style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1, color: selected ? '#0F1C3F' : '#0F1C3F' }}>
        {d}
      </span>
      <span style={{ fontSize: '10px', fontWeight: 600, color: mutedColor }}>
        {SHORT_MONTH[m - 1]}
      </span>
    </button>
  );
}

// ─── Time Slot Button ─────────────────────────────────────────────────────────

function TimeSlotButton({
  label, time, selected, onClick,
}: {
  slot: TimeSlot; label: string; time: string; selected: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const btnStyle: React.CSSProperties = selected
    ? { background: 'rgba(45,212,167,0.12)', color: '#0F1C3F', border: '2px solid #2DD4A7', flex: 1 }
    : hovered
      ? { background: 'rgba(45,212,167,0.06)', color: '#0F1C3F', border: '1px solid #2DD4A7', flex: 1 }
      : { background: '#ffffff', color: '#4b5563', border: '1px solid #e5e7eb', flex: 1 };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={btnStyle}
      className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl transition-all text-center"
    >
      <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1, color: '#0F1C3F' }}>
        {label}
      </span>
      <span style={{ fontSize: '11px', lineHeight: 1, marginTop: '2px', color: selected ? '#0F1C3F' : '#9ca3af' }}>
        {time}
      </span>
    </button>
  );
}

// ─── Trust Sidebar (Item 1) ───────────────────────────────────────────────────

function TrustSidebar() {
  return (
    <div className="space-y-4">
      {/* Block 1: Review card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          &ldquo;TidyWay did an incredible job on our home. The team was professional, on time, and the house looked spotless. Will definitely be booking again!&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0F1C3F] text-white text-xs font-bold flex items-center justify-center shrink-0">
            S
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F1C3F]">Sarah M.</p>
            <p className="text-[10px] text-[#2DD4A7] font-semibold">Verified Review</p>
          </div>
        </div>
      </div>

      {/* Block 2: Why TidyWay */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-extrabold text-[#0F1C3F] uppercase tracking-wider mb-3">Why TidyWay?</p>
        {[
          'Background-checked cleaners',
          '$2M liability insurance',
          'Happiness Guarantee or Free Reclean',
          'Same cleaner every visit',
          '24hr cancellation policy',
        ].map(point => (
          <div key={point} className="flex items-center gap-2.5 py-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2DD4A7]/20 text-[#2DD4A7] text-[10px] font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-gray-700 text-xs">{point}</span>
          </div>
        ))}
      </div>

      {/* Block 3: Questions */}
      <div className="bg-[#0F1C3F] rounded-2xl p-5">
        <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">Questions?</p>
        <p className="text-white/60 text-xs mb-2">Email us</p>
        <a
          href="mailto:hello@tidyway.ca"
          className="text-[#2DD4A7] text-sm font-semibold hover:underline"
        >
          hello@tidyway.ca
        </a>
        <p className="text-white/50 text-xs mt-2">We normally reply within just a few hours!</p>
      </div>
    </div>
  );
}

// ─── FAQ Accordion (Item 2) ───────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does booking work?',
    a: 'Select your home details, pick a date and time, and enter your payment info. We hold your card 48 hours before your appointment and only charge it once the clean is completed.',
  },
  {
    q: 'When will I get a confirmation?',
    a: 'You will receive a booking confirmation by email immediately after completing your booking.',
  },
  {
    q: 'Do I need to be home during the cleaning?',
    a: 'Not at all. You can provide lockbox details, a hidden key location, or any other access instructions during booking.',
  },
  {
    q: 'Can I reschedule my booking?',
    a: 'Yes. You can reschedule at no charge up to 24 hours before your appointment.',
  },
  {
    q: 'Are your cleaners background-checked?',
    a: 'Yes. Every TidyWay cleaner goes through a thorough background check and is fully insured before their first job.',
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="mt-8">
      <p className={labelClass}>Frequently Asked Questions</p>
      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-[#0F1C3F] pr-4">{item.q}</span>
              <span className="text-[#2DD4A7] font-bold text-lg shrink-0 leading-none">
                {openIndex === i ? '−' : '+'}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 bg-white">
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────

function OrderSummary({ form, price, duration }: {
  form: FormState;
  price: number | null;
  duration: string | null;
}) {
  const selectedAddOns = ADD_ONS.filter(a => form.addOnIds.includes(a.id));

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('en-CA', {
      weekday: 'short', month: 'short', day: 'numeric',
    });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-extrabold text-[#0F1C3F] text-sm uppercase tracking-wider mb-4">
          Order Summary
        </h3>

        <div className="space-y-2.5 text-sm">
          <Row label="Frequency" value={FREQUENCY_LABELS[form.frequency]} />
          <Row label="Bedrooms" value={form.bedrooms || '—'} />
          <Row label="Bathrooms" value={form.bathrooms || '—'} />

          {selectedAddOns.length > 0 && (
            <div>
              <p className="text-gray-500 mb-1.5">Add-ons</p>
              {selectedAddOns.map(a => (
                <div key={a.id} className="flex justify-between pl-3 py-0.5">
                  <span className="text-gray-600 text-xs">{a.label}</span>
                  <span className="text-xs font-semibold text-[#0F1C3F]">+${a.price}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-2.5 space-y-2.5">
            <Row label="Date" value={form.date ? formatDate(form.date) : '—'} />
            <Row label="Arrival" value={form.timeSlot || '—'} />
          </div>

          <div className="border-t border-gray-100 pt-2.5 space-y-2.5">
            <Row label="Est. Duration" value={duration || '—'} />
            <div className="flex justify-between items-baseline">
              <span className="font-extrabold text-[#0F1C3F]">Total</span>
              <span className="font-extrabold text-xl text-[#0F1C3F]">
                {price ? `$${price}` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0F1C3F] rounded-2xl p-5">
        {[
          'Background-checked cleaners',
          '$2M liability insurance',
          'Happiness Guarantee or Free Reclean',
          '24hr cancellation policy',
        ].map(point => (
          <div key={point} className="flex items-center gap-2.5 py-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2DD4A7]/20 text-[#2DD4A7] text-[10px] font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-white/80 text-xs">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#0F1C3F]">{value}</span>
    </div>
  );
}

// ─── Card Brand Logos (Item 4) ────────────────────────────────────────────────

function CardBrandLogos() {
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-black text-blue-900 tracking-tight">
        VISA
      </span>
      <span className="inline-flex items-center gap-0 px-1 py-0.5 bg-gray-100 border border-gray-200 rounded">
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <circle cx="8" cy="7" r="6" fill="#EB001B" fillOpacity="0.85" />
          <circle cx="14" cy="7" r="6" fill="#F79E1B" fillOpacity="0.85" />
          <path d="M11 2.5a6 6 0 0 1 0 9A6 6 0 0 1 11 2.5z" fill="#FF5F00" fillOpacity="0.9" />
        </svg>
      </span>
      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-black text-blue-700 tracking-tight">
        AMEX
      </span>
    </div>
  );
}

// ─── Inner Form (uses Stripe hooks) ──────────────────────────────────────────

function BookingFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [isVisible, setIsVisible] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includedOpen, setIncludedOpen] = useState(false);

  const priceInput = {
    bedrooms: form.bedrooms,
    bathrooms: form.bathrooms,
    frequency: form.frequency,
    addOnIds: form.addOnIds,
  };
  const price = calculatePrice(priceInput);
  const duration = calculateDuration(priceInput);

  // Item 7: savings vs one-time
  const oneTimePrice =
    form.frequency !== 'one-time'
      ? calculatePrice({ ...priceInput, frequency: 'one-time' })
      : null;
  const savings = oneTimePrice && price ? oneTimePrice - price : null;

  const set = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const toggleAddOn = (id: string) => {
    setForm(prev => {
      const comboActive = prev.addOnIds.includes('combo-oven-fridge');
      if (comboActive && (id === 'oven' || id === 'fridge')) {
        // Break combo: keep the other individual add-on, remove this one
        const other = id === 'oven' ? 'fridge' : 'oven';
        return {
          ...prev,
          addOnIds: [...prev.addOnIds.filter(a => a !== 'combo-oven-fridge' && a !== 'oven' && a !== 'fridge'), other],
        };
      }
      return {
        ...prev,
        addOnIds: prev.addOnIds.includes(id)
          ? prev.addOnIds.filter(a => a !== id)
          : [...prev.addOnIds, id],
      };
    });
  };

  const toggleCombo = () => {
    setForm(prev => {
      const comboActive = prev.addOnIds.includes('combo-oven-fridge');
      if (comboActive) {
        return { ...prev, addOnIds: prev.addOnIds.filter(a => a !== 'combo-oven-fridge') };
      }
      return {
        ...prev,
        addOnIds: [...prev.addOnIds.filter(a => a !== 'oven' && a !== 'fridge'), 'combo-oven-fridge'],
      };
    });
  };

  const transitionTo = (nextStep: 1 | 2) => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setIsVisible(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.date) e.date = 'Please select a date';
    if (!form.timeSlot) e.timeSlot = 'Please select a time slot';
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email address is required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
      e.phone = 'A valid 10-digit phone number is required';
    if (!form.address1.trim()) e.address1 = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.province) e.province = 'Province is required';
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (!form.homeAccess) e.homeAccess = 'Please select a home access method';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrors(prev => ({ ...prev, card: 'Card details are required' }));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Create Stripe customer + setup intent
      const siRes = await fetch('/api/booking/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const siData = await siRes.json();
      if (!siRes.ok) throw new Error(siData.error ?? 'Could not initialise payment');

      const { clientSecret, customerId } = siData;

      // 2. Confirm card setup (tokenises the card)
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setErrors(prev => ({ ...prev, card: stripeError.message ?? 'Card verification failed' }));
        setIsSubmitting(false);
        return;
      }

      const paymentMethodId =
        typeof setupIntent.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent.payment_method?.id ?? '';

      // 3. Write booking to Supabase
      const selectedAddOns = ADD_ONS.filter(a => form.addOnIds.includes(a.id));

      const createRes = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          paymentMethodId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.address1,
            line2: form.address2 || undefined,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
          },
          serviceDate: form.date,
          serviceTime: form.timeSlot,
          frequency: form.frequency,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          addOns: selectedAddOns.map(a => ({ id: a.id, label: a.label, price: a.price })),
          totalPrice: price ?? 0,
          estimatedDuration: duration ?? '',
          accessType: form.homeAccess,
          accessNotes: form.accessNotes || undefined,
          specialInstructions: form.specialInstructions || undefined,
          smsOptIn: form.smsOptIn,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? 'Could not save booking');

      // 4. Redirect to confirmation
      router.push(`/booking-confirmed?id=${createData.bookingId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrors(prev => ({ ...prev, submit: message }));
      setIsSubmitting(false);
    }
  };

  // ─── Step 1: Configure Your Clean ─────────────────────────────────────────

  const renderStep1 = () => (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-36">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Left: form content ── */}
        <div className="w-full lg:w-[60%]">
          {/* Progress bar */}
          <div className="flex gap-1.5 mb-4">
            <div className="h-1.5 flex-1 rounded-full bg-[#2DD4A7]" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1C3F] mb-1">
            Book Your Clean in Under 2 Minutes
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            No calls, no back-and-forth — pick your details, see your price, and you&apos;re done.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              '1000+ cleans completed',
              '$2M liability insured',
              'Background-checked cleaners',
            ].map(chip => (
              <span
                key={chip}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f0fdf9] border border-[#2DD4A7]/30 text-[11px] font-semibold text-[#0F1C3F]"
              >
                <span className="text-[#2DD4A7]">✓</span>
                {chip}
              </span>
            ))}
          </div>

          {/* Frequency */}
          <section className="mb-8">
            <p className={labelClass}>Cleaning Frequency</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FREQUENCIES.map(freq => (
                <div key={freq} className="relative">
                  {freq === 'biweekly' && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-[#2DD4A7] text-[#0F1C3F] text-[9px] font-extrabold uppercase tracking-wide whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => set('frequency', freq)}
                    className={`
                      w-full py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all text-center
                      ${form.frequency === freq
                        ? 'border-[#2DD4A7] bg-[#2DD4A7]/10 text-[#0F1C3F]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#2DD4A7]/50'
                      }
                    `}
                  >
                    {FREQUENCY_LABELS[freq]}
                    {FREQUENCY_DISCOUNTS[freq] !== null ? (
                      <span className="block text-[10px] font-semibold text-[#2DD4A7] mt-0.5">
                        Save {FREQUENCY_DISCOUNTS[freq]}%
                      </span>
                    ) : (
                      <span className="block text-[10px] mt-0.5 invisible" aria-hidden="true">Save 0%</span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Annualized savings line */}
            {form.frequency !== 'one-time' && (() => {
              const base = calculatePrice({ bedrooms: form.bedrooms, bathrooms: form.bathrooms, frequency: 'one-time', addOnIds: [] });
              if (!base) return null;
              const annualSavings =
                form.frequency === 'weekly'    ? Math.round(base * 0.20 * 52) :
                form.frequency === 'biweekly'  ? Math.round(base * 0.15 * 26) :
                                                 Math.round(base * 0.10 * 12);
              return (
                <p className="text-[#2DD4A7] text-xs font-semibold mt-2.5 text-center">
                  You save ~${annualSavings}/year vs. one-time
                </p>
              );
            })()}
          </section>

          {/* Bedrooms */}
          <section className="mb-8">
            <p className={labelClass}>Bedrooms</p>
            <div className="flex flex-wrap gap-2">
              {BEDROOM_OPTIONS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set('bedrooms', b)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-semibold transition-colors
                    ${form.bedrooms === b
                      ? 'bg-[#2DD4A7] text-[#0F1C3F]'
                      : 'bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] hover:bg-gray-200'
                    }
                  `}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          {/* Bathrooms */}
          <section className="mb-8">
            <p className={labelClass}>Bathrooms</p>
            <div className="flex flex-wrap gap-2">
              {BATHROOM_OPTIONS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set('bathrooms', b)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-semibold transition-colors
                    ${form.bathrooms === b
                      ? 'bg-[#2DD4A7] text-[#0F1C3F]'
                      : 'bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] hover:bg-gray-200'
                    }
                  `}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          {/* What's included expandable */}
          <section className="mb-8">
            <button
              type="button"
              onClick={() => setIncludedOpen(o => !o)}
              className="text-sm text-gray-500 hover:text-[#0F1C3F] transition-colors font-medium"
            >
              What&apos;s included in every clean {includedOpen ? '▴' : '▾'}
            </button>
            {includedOpen && (
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  'Kitchen surfaces wiped',
                  'Stovetop exterior cleaned',
                  'Vacuum all floors',
                  'Mop hard floors',
                  'Dusting throughout',
                  'Bathroom scrubbed & toilet sanitized',
                  'Shower & tub scrubbed',
                  'Mirrors cleaned',
                  'Sinks & fixtures polished',
                  'Trash emptied',
                ].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="text-[#2DD4A7] font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Add-ons */}
          <section>
            <p className={labelClass}>
              Add-ons{' '}
              <span className="normal-case text-gray-400 font-normal tracking-normal">(optional)</span>
            </p>

            {/* Popular Combo Card */}
            {(() => {
              const comboSelected = form.addOnIds.includes('combo-oven-fridge');
              return (
                <button
                  type="button"
                  onClick={toggleCombo}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 mb-3 transition-all
                    ${comboSelected
                      ? 'border-[#2DD4A7] bg-[#2DD4A7]/10'
                      : 'border-[#2DD4A7]/40 bg-white hover:border-[#2DD4A7]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#2DD4A7] text-[#0F1C3F] text-[9px] font-extrabold uppercase tracking-wide">
                          Popular Combo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 13.5C5.5 13.5 3.5 11.8 3.5 9.5c0-1.4.7-2.4 1.4-3 0 1 .5 1.5 1 1.5-.5-2 1-4 3.6-5.5-.5 2 .5 3 1 3.5.5-1 .5-2 0-3 1.6 1.2 2.5 3 2.5 5 0 2.3-2 4-4.5 4z" fill="#2DD4A7" fillOpacity="0.3" stroke="#2DD4A7" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                        <p className="font-bold text-[#0F1C3F] text-sm">Oven + Fridge</p>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">Most requested add-on pair</p>
                      <p className="text-gray-400 text-xs mt-1">+1 hr</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-[#0F1C3F] text-sm">+$55</p>
                      <p className="text-[#2DD4A7] text-xs font-semibold">Save $5</p>
                      {comboSelected && (
                        <span className="text-[#2DD4A7] text-xs font-bold">✓ Added</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADD_ONS.filter(a => a.id !== 'combo-oven-fridge').map(addon => {
                const comboSelected = form.addOnIds.includes('combo-oven-fridge');
                const selected =
                  form.addOnIds.includes(addon.id) ||
                  (comboSelected && (addon.id === 'oven' || addon.id === 'fridge'));
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddOn(addon.id)}
                    className={`
                      text-left p-4 rounded-xl border-2 transition-all
                      ${selected
                        ? 'border-[#2DD4A7] bg-[#2DD4A7]/10'
                        : 'border-gray-200 bg-white hover:border-[#2DD4A7]/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="shrink-0">{ADDON_ICONS[addon.id]}</span>
                          <p className="font-bold text-[#0F1C3F] text-sm">{addon.label}</p>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{addon.description}</p>
                        {addon.durationMinutes > 0 && (
                          <p className="text-gray-400 text-xs mt-1">+{addon.durationMinutes} min</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-[#0F1C3F] text-sm">+${addon.price}</p>
                        {selected && (
                          <span className="text-[#2DD4A7] text-xs font-bold">✓ Added</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Item 2: FAQ Accordion — between add-ons and sticky footer */}
          <FAQAccordion />
        </div>

        {/* ── Right: Trust Sidebar ── */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8">
          <TrustSidebar />
        </div>
      </div>
    </div>
  );

  // ─── Step 2: Schedule & Confirm ───────────────────────────────────────────

  const renderStep2 = () => (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => transitionTo(1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#0F1C3F] transition-colors mb-6"
      >
        ← Back to Configure Your Clean
      </button>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Left: Form fields ── */}
        <div className="w-full lg:w-[60%] space-y-7">
          <div>
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-4">
              <div className="h-1.5 flex-1 rounded-full bg-[#2DD4A7]" />
              <div className="h-1.5 flex-1 rounded-full bg-[#2DD4A7]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F1C3F] mb-1">Schedule & Confirm</h2>
            <p className="text-gray-500 text-sm">Fill in your details to complete your booking.</p>
          </div>

          {/* Date */}
          <section>
            <p className={labelClass}>Preferred Date</p>
            <CalendarPicker value={form.date} onChange={d => set('date', d)} />
            {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date}</p>}
          </section>

          {/* Time slot */}
          <section>
            <p className={labelClass}>Arrival Window</p>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              {([
                { slot: '9:00 AM',  label: 'Morning',   time: '9:00 AM'  },
                { slot: '12:00 PM', label: 'Midday',    time: '12:00 PM' },
                { slot: '3:00 PM',  label: 'Afternoon', time: '3:00 PM'  },
              ] as { slot: TimeSlot; label: string; time: string }[]).map(({ slot, label, time }) => (
                <TimeSlotButton
                  key={slot}
                  slot={slot}
                  label={label}
                  time={time}
                  selected={form.timeSlot === slot}
                  onClick={() => set('timeSlot', slot)}
                />
              ))}
            </div>
            {errors.timeSlot && <p className="text-red-500 text-xs mt-1.5">{errors.timeSlot}</p>}
          </section>

          {/* Name */}
          <section>
            <p className={labelClass}>Your Name</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  className={errors.firstName ? inputError : inputNormal}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  className={errors.lastName ? inputError : inputNormal}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <p className={labelClass}>Contact Details</p>
            <div className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={errors.email ? inputError : inputNormal}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={errors.phone ? inputError : inputNormal}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <p className={labelClass}>Service Address</p>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Street address"
                  value={form.address1}
                  onChange={e => set('address1', e.target.value)}
                  className={errors.address1 ? inputError : inputNormal}
                />
                {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
              </div>
              <input
                type="text"
                placeholder="Apt, unit, or suite (optional)"
                value={form.address2}
                onChange={e => set('address2', e.target.value)}
                className={inputNormal}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    className={errors.city ? inputError : inputNormal}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <select
                    value={form.province}
                    onChange={e => set('province', e.target.value)}
                    className={errors.province ? inputError : inputNormal}
                  >
                    <option value="">Province</option>
                    {CA_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={e => set('postalCode', e.target.value.toUpperCase())}
                    className={errors.postalCode ? inputError : inputNormal}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Home access */}
          <section>
            <p className={labelClass}>Home Access</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HOME_ACCESS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('homeAccess', opt.value)}
                  className={`
                    py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all text-center
                    ${form.homeAccess === opt.value
                      ? 'border-[#2DD4A7] bg-[#2DD4A7]/10 text-[#0F1C3F]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#2DD4A7]/50'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.homeAccess && (
              <p className="text-red-500 text-xs mt-1.5">{errors.homeAccess}</p>
            )}
            {form.homeAccess && form.homeAccess !== 'home' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder={
                    form.homeAccess === 'lockbox'
                      ? 'Lockbox code or location'
                      : form.homeAccess === 'key-hidden'
                        ? 'Where is the key hidden?'
                        : 'Describe how to access your home'
                  }
                  value={form.accessNotes}
                  onChange={e => set('accessNotes', e.target.value)}
                  className={inputNormal}
                />
              </div>
            )}
          </section>

          {/* Special instructions */}
          <section>
            <p className={labelClass}>
              Special Instructions{' '}
              <span className="normal-case text-gray-400 font-normal tracking-normal">(optional)</span>
            </p>
            <textarea
              rows={3}
              placeholder="Areas to focus on, things to avoid, pet info, entry codes, etc."
              value={form.specialInstructions}
              onChange={e => set('specialInstructions', e.target.value)}
              className={`${inputNormal} resize-none`}
            />
          </section>

          {/* Stripe card element — Items 3 & 4 */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Secure Your Booking
              </p>
              <div
                className={`border rounded-lg px-4 py-3.5 bg-white transition-colors ${
                  errors.card ? 'border-red-400' : 'border-gray-200'
                }`}
                style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
              >
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#0F1C3F',
                        fontFamily: 'Inter, sans-serif',
                        '::placeholder': { color: '#9ca3af' },
                      },
                      invalid: { color: '#ef4444' },
                    },
                  }}
                  onChange={() => setErrors(prev => ({ ...prev, card: undefined }))}
                />
              </div>
              {errors.card && (
                <p className="text-red-500 text-xs mt-1.5">{errors.card}</p>
              )}
              {/* Item 3: updated payment timing copy */}
              <p className="text-gray-400 text-xs mt-3 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Your card is held 48 hours before your appointment and only charged once your clean is completed. You can cancel for free up to 24 hours before.
              </p>
              {/* Item 4: card brand logos */}
              <CardBrandLogos />
            </div>
          </section>

          {/* SMS opt-in */}
          <section>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.smsOptIn}
                onChange={e => set('smsOptIn', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#2DD4A7] shrink-0"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to receive SMS updates from TidyWay about my booking. Message & data rates may apply. Reply STOP to opt out.
              </span>
            </label>
          </section>

          {/* Submit error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit */}
          <div className="pb-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !stripe}
              className={`
                w-full font-extrabold py-4 rounded-xl text-lg transition-colors flex flex-col items-center gap-0.5
                ${isSubmitting || !stripe
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2DD4A7] hover:bg-[#22c497] text-white'
                }
              `}
            >
              <span>{isSubmitting ? 'Processing…' : 'Book My Clean →'}</span>
              {!isSubmitting && (
                <span className="text-xs font-normal italic text-white/80">
                  ✓ No charge until after your clean
                </span>
              )}
            </button>

            <p className="text-center text-gray-400 text-[10px] mt-3">
              By booking, you agree to TidyWay&apos;s{' '}
              <a href="/terms-of-service" className="underline hover:text-gray-600 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="underline hover:text-gray-600 transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* ── Right: Order summary + Trust Sidebar ── */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8 space-y-6">
          <OrderSummary form={form} price={price} duration={duration} />
          <TrustSidebar />
        </div>
      </div>
    </div>
  );

  // ─── Root ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className={`transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {step === 1 ? renderStep1() : renderStep2()}
      </div>

      {/* Sticky price footer — Step 1 only */}
      {step === 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              {price ? (
                <>
                  <p className="text-2xl font-extrabold text-[#0F1C3F] leading-tight">${price}</p>
                  {duration && (
                    <p className="text-xs text-gray-500 mt-0.5">Est. {duration}</p>
                  )}
                  {/* Item 7: savings callout */}
                  {savings !== null && savings > 0 && (
                    <p className="text-xs text-[#2DD4A7] font-semibold mt-0.5">
                      You save ${savings} vs one-time
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold text-gray-400">
                  Select bedrooms &amp; bathrooms to see price
                </p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              {/* Item 8: urgency line */}
              <p className="text-xs text-[#2DD4A7] font-medium">
                Next available: Tomorrow · Slots filling fast
              </p>
              <button
                type="button"
                disabled={!form.bedrooms || !form.bathrooms}
                onClick={() => transitionTo(2)}
                className={`
                  px-5 py-3 rounded-xl font-extrabold text-sm transition-all
                  ${form.bedrooms && form.bathrooms
                    ? 'bg-[#2DD4A7] hover:bg-[#22c497] text-white shadow-md shadow-[#2DD4A7]/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Select Date &amp; Time →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Exported wrapper — provides Stripe Elements context ──────────────────────

export default function BookingForm() {
  return (
    <Elements stripe={stripePromise}>
      <BookingFormInner />
    </Elements>
  );
}
