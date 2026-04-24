'use client';

import { useState } from 'react';
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
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  frequency: 'one-time',
  bedrooms: '',
  bathrooms: '',
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
};

const TIME_SLOTS: TimeSlot[] = ['9:00 AM', '12:00 PM', '3:00 PM'];

const HOME_ACCESS_OPTIONS: { value: HomeAccess; label: string }[] = [
  { value: 'home', label: "I'll be home" },
  { value: 'lockbox', label: 'Lockbox' },
  { value: 'key-hidden', label: 'Key hidden' },
  { value: 'other', label: 'Other' },
];

const CA_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputBase =
  'w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4A7] focus:border-transparent bg-white transition-all hover:border-[#2DD4A7]/50';
const inputNormal = `${inputBase} border-gray-200`;
const inputError = `${inputBase} border-red-400 focus:ring-red-400`;
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';

// ─── Calendar Picker ──────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const earliestMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = viewMonth.getTime() > earliestMonth.getTime();

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    return date <= today || date > maxDate || date.getDay() === 0;
  };

  const toDateString = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg text-gray-400 hover:text-[#0F1C3F] hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="font-bold text-[#0F1C3F] text-sm">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg text-gray-400 hover:text-[#0F1C3F] hover:bg-gray-100 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
          const ds = toDateString(day);
          const disabled = isDisabled(day);
          const selected = value === ds;
          return (
            <button
              key={ds}
              type="button"
              disabled={disabled}
              onClick={() => onChange(ds)}
              className={`
                aspect-square rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                ${selected
                  ? 'bg-[#2DD4A7] text-[#0F1C3F]'
                  : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-[#0F1C3F] hover:bg-[#2DD4A7]/20'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-3">Sundays unavailable · Next 60 days only</p>
    </div>
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
          'Happiness guarantee',
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

// ─── Main Form Component ──────────────────────────────────────────────────────

export default function BookingForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isVisible, setIsVisible] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const priceInput = {
    bedrooms: form.bedrooms,
    bathrooms: form.bathrooms,
    frequency: form.frequency,
    addOnIds: form.addOnIds,
  };
  const price = calculatePrice(priceInput);
  const duration = calculateDuration(priceInput);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleAddOn = (id: string) => {
    setForm(prev => ({
      ...prev,
      addOnIds: prev.addOnIds.includes(id)
        ? prev.addOnIds.filter(a => a !== id)
        : [...prev.addOnIds, id],
    }));
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

  const handleSubmit = () => {
    if (!validate()) return;

    const selectedAddOns = ADD_ONS.filter(a => form.addOnIds.includes(a.id));

    console.log('TidyWay Booking Submission:', {
      frequency: form.frequency,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      addOns: selectedAddOns.map(a => ({ id: a.id, label: a.label, price: a.price })),
      estimatedPrice: price,
      estimatedDuration: duration,
      date: form.date,
      timeSlot: form.timeSlot,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      address: {
        line1: form.address1,
        line2: form.address2,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
      },
      homeAccess: {
        type: form.homeAccess,
        notes: form.accessNotes,
      },
      specialInstructions: form.specialInstructions,
    });
  };

  // ─── Step 1: Configure Your Clean ─────────────────────────────────────────

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-36">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1C3F] mb-1">
        Configure Your Clean
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Select your home details — your price updates instantly below.
      </p>

      {/* Frequency */}
      <section className="mb-8">
        <p className={labelClass}>Cleaning Frequency</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FREQUENCIES.map(freq => (
            <button
              key={freq}
              type="button"
              onClick={() => set('frequency', freq)}
              className={`
                py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all text-center
                ${form.frequency === freq
                  ? 'border-[#2DD4A7] bg-[#2DD4A7]/10 text-[#0F1C3F]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-[#2DD4A7]/50'
                }
              `}
            >
              {FREQUENCY_LABELS[freq]}
              {FREQUENCY_DISCOUNTS[freq] !== null && (
                <span className="block text-[10px] font-semibold text-[#2DD4A7] mt-0.5">
                  Save {FREQUENCY_DISCOUNTS[freq]}%
                </span>
              )}
            </button>
          ))}
        </div>
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

      {/* Add-ons */}
      <section>
        <p className={labelClass}>
          Add-ons{' '}
          <span className="normal-case text-gray-400 font-normal tracking-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ADD_ONS.map(addon => {
            const selected = form.addOnIds.includes(addon.id);
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
                    <p className="font-bold text-[#0F1C3F] text-sm">{addon.label}</p>
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
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => set('timeSlot', slot)}
                  className={`
                    py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all text-center
                    ${form.timeSlot === slot
                      ? 'border-[#2DD4A7] bg-[#2DD4A7]/10 text-[#0F1C3F]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#2DD4A7]/50'
                    }
                  `}
                >
                  {slot}
                </button>
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

          {/* Stripe placeholder */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Secure Your Booking
              </p>
              <div className="border border-gray-200 rounded-lg px-4 py-3.5 bg-gray-50 min-h-[44px] flex items-center">
                <p className="text-gray-400 text-sm">Card details will load here</p>
              </div>
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
                Your card is saved securely. No charge until after your clean is complete.
              </p>
            </div>
          </section>

          {/* Submit */}
          <div className="pb-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold py-4 rounded-xl text-lg transition-colors flex flex-col items-center gap-0.5"
            >
              <span>Book My Clean →</span>
              <span className="text-xs font-normal italic text-white/80">
                ✓ No charge until after your clean
              </span>
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

        {/* ── Right: Order summary ── */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8">
          <OrderSummary form={form} price={price} duration={duration} />
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
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              {price ? (
                <>
                  <p className="text-2xl font-extrabold text-[#0F1C3F] leading-tight">${price}</p>
                  {duration && (
                    <p className="text-xs text-gray-500 mt-0.5">Est. {duration}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold text-gray-400">
                  Select bedrooms &amp; bathrooms to see price
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={!form.bedrooms || !form.bathrooms}
              onClick={() => transitionTo(2)}
              className={`
                shrink-0 px-5 py-3 rounded-xl font-extrabold text-sm transition-all
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
      )}
    </>
  );
}
