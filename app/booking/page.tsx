import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Book Your Home Cleaning in London, ON | TidyWay',
  description:
    'Complete your booking in under 2 minutes. Professional, insured, and background-checked cleaners serving London, Ontario. Instant online scheduling.',
  alternates: {
    canonical: 'https://tidyway.ca/booking',
  },
};

const trustPoints = [
  'Background-checked cleaners',
  '$2M liability insurance',
  'Happiness guarantee',
  'Same cleaner every visit',
  '24hr cancellation policy',
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <Header />

      {/* Trust bar */}
      <div className="bg-[#2DD4A7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <p className="text-white text-sm font-semibold text-center tracking-wide">
            ✓ Background Checked &nbsp;·&nbsp; ✓ $2M Insured &nbsp;·&nbsp; ✓ Happiness Guarantee &nbsp;·&nbsp; ✓ Serving London Since 2023
          </p>
        </div>
      </div>

      <main>

        {/* Hero */}
        <section className="bg-white pt-14 pb-10 text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-3">
              Complete Your Booking
            </h1>
            <p className="text-gray-500 leading-relaxed text-lg">
              You&apos;re one step away from a cleaner home. Fill out the form below to confirm your appointment.
            </p>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="bg-gray-50 pt-6 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── Left column: BookingKoala embed (60%) ── */}
              <div className="w-full lg:w-[60%]">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      BOOKINGKOALA EMBED — paste your embed code here
                      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <iframe
                    src="https://tidyway.bookingkoala.com/booknow/home_cleaning?embed=true&bar=false&banner=false"
                    style={{ border: 'none', height: '1000px', display: 'block' }}
                    width="100%"
                    scrolling="no"
                    title="TidyWay Booking Form"
                  />
                  {/* BookingKoala resize script */}
                  <Script
                    src="https://tidyway.bookingkoala.com/resources/embed.js"
                    strategy="lazyOnload"
                  />

                </div>
              </div>

              {/* ── Right column: Trust sidebar (40%) ── */}
              <div className="w-full lg:w-[40%] flex flex-col gap-5 lg:sticky lg:top-24">

                {/* Review card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <Stars />
                  <p className="text-gray-600 text-sm leading-relaxed my-3">
                    &ldquo;TidyWay did an incredible job on our home. The team was professional,
                    on time, and the house looked spotless. Will definitely be booking again!&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F1C3F] text-[#2DD4A7] font-extrabold text-xs flex items-center justify-center shrink-0">
                      S
                    </div>
                    <span className="font-bold text-[#0F1C3F] text-sm">Sarah M.</span>
                    <span className="text-xs text-gray-400 ml-auto">Verified Google Review</span>
                  </div>
                </div>

                {/* Trust points */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-extrabold text-[#0F1C3F] text-sm uppercase tracking-wider mb-4">
                    Why TidyWay?
                  </h3>
                  <ul className="space-y-3">
                    {trustPoints.map(point => (
                      <li key={point} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-[#2DD4A7]/15 text-[#2DD4A7] font-bold flex items-center justify-center text-xs shrink-0">
                          ✓
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact card */}
                <div className="bg-[#0F1C3F] rounded-2xl p-6">
                  <p className="font-extrabold text-xs uppercase tracking-wider text-[#2DD4A7] mb-1">
                    Questions?
                  </p>
                  <p className="font-extrabold text-lg text-white mb-2">Call us</p>
                  <a
                    href="tel:+12260000000"
                    className="text-white/80 hover:text-[#2DD4A7] transition-colors text-sm font-semibold"
                  >
                    (226) XXX-XXXX
                  </a>
                  <p className="text-white/40 text-xs mt-2">Mon–Sat, 8am–6pm EST</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Reassurance strip */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 py-8 text-center">
              <p className="text-gray-400 text-sm leading-relaxed">
                🔒&nbsp; Secure booking. No payment taken until after your clean is complete.
                Cancel or reschedule free with 24 hours notice.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
