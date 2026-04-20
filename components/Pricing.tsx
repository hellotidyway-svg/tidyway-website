const rows = [
  { size: '1 Bed / 1 Bath',   ours: '$150',      theirs: '$200', save: '$50' },
  { size: '2 Bed / 1 Bath',   ours: '$180',      theirs: '$230', save: '$50' },
  { size: '3 Bed / 2 Bath',   ours: '$230',      theirs: '$290', save: '$60' },
  { size: '4 Bed / 3 Bath',   ours: '$290',      theirs: '$360', save: '$70' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#0F1C3F] text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            See how TidyWay stacks up against other London cleaning services — same quality, better price.
          </p>
        </div>

        {/* Comparison table — TidyWay header elevated above the grid */}
        <div className="relative pt-10">

          {/* Floating TidyWay column header — sits above the table */}
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
              <div className="bg-gray-100 px-6 py-4 flex items-center">
                <span className="text-gray-500 text-xs font-extrabold uppercase tracking-wide">Home Size</span>
              </div>
              {/* TidyWay header cell — navy, taller, bleeds into elevated header */}
              <div className="bg-[#0F1C3F] px-4 py-4" />
              <div className="bg-gray-100 px-4 py-4 flex flex-col items-center justify-center text-center border-l border-gray-200">
                <span className="text-gray-500 text-xs font-extrabold uppercase tracking-wide">Other Cleaners</span>
                <span className="text-gray-400 text-[11px] mt-0.5">London avg.</span>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={row.size}
                className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {/* Home size label */}
                <div className="px-6 py-5 flex items-center">
                  <span className="font-semibold text-[#0F1C3F] text-sm">{row.size}</span>
                </div>

                {/* TidyWay price */}
                <div className="px-4 py-5 bg-[#f0fdf9] border-x-2 border-[#2DD4A7]/40 flex flex-col items-center justify-center gap-1.5 text-center">
                  <span className="text-[#2DD4A7] font-extrabold text-2xl leading-none">{row.ours}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    Save {row.save}
                  </span>
                </div>

                {/* Competitor price */}
                <div className="px-4 py-5 flex items-center justify-center border-l border-gray-100">
                  <span className="text-gray-400 font-semibold text-xl line-through decoration-red-400 decoration-2">
                    {row.theirs}
                  </span>
                </div>
              </div>
            ))}

            {/* Bottom closure for TidyWay column border */}
            <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50">
              <div className="px-6 py-3" />
              <div className="bg-[#f0fdf9] border-x-2 border-b-2 border-[#2DD4A7]/40 rounded-b-xl py-3" />
              <div className="py-3" />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-400 text-xs mt-4">
          All prices in CAD before HST. Competitor prices based on publicly listed London, ON cleaning rates.
        </p>

        {/* Savings note */}
        <div className="mt-5 text-center">
          <p className="text-gray-500 text-sm font-bold bg-gray-50 rounded-xl px-6 py-4 inline-block border border-gray-100">
            💰 Save an additional 10–20% with a recurring booking. Discount applied automatically.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="#lead-form"
            className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            See My Exact Price →
          </a>
        </div>

      </div>
    </section>
  );
}
