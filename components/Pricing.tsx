import type { ReactNode } from 'react';

const rows: { label: ReactNode }[] = [
  { label: '$2M Liability Insurance' },
  { label: 'Background-Checked Cleaners' },
  { label: <>Satisfaction Guarantee <em>(or free re-clean)</em></> },
  { label: 'Easy Online Booking & Instant Confirmation' },
  { label: 'No Contracts' },
  { label: 'Same Cleaner Every Visit' },
  { label: 'Vetted Professionals' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#0F1C3F] text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-3">
            Cleaners You Can Trust In Your Home
          </h2>
          <p className="text-gray-500 text-sm">
            See how we stack up against independent cleaners.
          </p>
        </div>

        {/* Comparison table — TidyWay header elevated above the grid */}
        <div className="relative pt-10">

          {/* Floating TidyWay column header */}
          <div
            className="absolute top-0 bg-[#0F1C3F] rounded-t-2xl text-center px-4 pt-4 pb-3 shadow-xl z-10"
            style={{ left: '33.333%', width: '33.333%' }}
          >
            <span className="inline-block bg-[#2DD4A7] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1.5">
              ✦ Best Value
            </span>
            <p className="text-white font-extrabold text-base leading-tight">TidyWay</p>
            <p className="text-gray-400 text-[11px]">London, ON</p>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-md">

            {/* Column headers row */}
            <div className="grid grid-cols-3">
              <div className="bg-gray-100 px-4 py-4 flex items-center">
                <span className="text-gray-500 text-xs font-extrabold uppercase tracking-wide">Feature</span>
              </div>
              {/* TidyWay header cell — navy, bleeds into elevated header */}
              <div className="bg-[#0F1C3F] px-4 py-4" />
              <div className="bg-gray-100 px-4 py-4 flex flex-col items-center justify-center text-center border-l border-gray-200">
                <span className="text-gray-500 text-xs font-extrabold uppercase tracking-wide">Independent Cleaner</span>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {/* Feature label */}
                <div className="px-4 py-5 flex items-center">
                  <span className="font-semibold text-[#0F1C3F] text-sm leading-snug">{row.label}</span>
                </div>

                {/* TidyWay — checkmark */}
                <div className="px-4 py-5 bg-[#f0fdf9] border-x-2 border-[#2DD4A7]/40 flex items-center justify-center">
                  <span className="text-[#2DD4A7] font-extrabold text-xl">✓</span>
                </div>

                {/* Independent — red X */}
                <div className="px-4 py-5 flex items-center justify-center border-l border-gray-100">
                  <span className="text-red-400 font-bold text-xl">✗</span>
                </div>
              </div>
            ))}

            {/* Bottom closure for TidyWay column border */}
            <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50">
              <div className="px-4 py-3" />
              <div className="bg-[#f0fdf9] border-x-2 border-b-2 border-[#2DD4A7]/40 rounded-b-xl py-3" />
              <div className="py-3" />
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-5 text-center">
          <p className="text-gray-500 text-sm bg-gray-50 rounded-xl px-6 py-4 inline-block border border-gray-100">
            🛡️ Every TidyWay clean is backed by <strong>$2M liability insurance</strong> and our <strong>satisfaction guarantee</strong> — your home is in safe hands.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="#lead-form"
            className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Get My Free Quote →
          </a>
        </div>

      </div>
    </section>
  );
}
