const pricing = [
  { size: 'Studio / Bachelor', price: 'From $140' },
  { size: '1 Bed / 1 Bath', price: '$150' },
  { size: '2 Bed / 1 Bath', price: '$180' },
  { size: '3 Bed / 2 Bath', price: '$230' },
  { size: '4 Bed / 3 Bath', price: '$290' },
];

export default function Pricing() {
  return (
    <section className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            Simple, Transparent Pricing
          </h2>
        </div>
        <p className="text-center text-gray-500 mb-10">
          Flat-rate pricing based on your home size. Price locked before we arrive.
          All prices before HST.
        </p>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-[#0F1C3F] px-6 py-4">
            <span className="text-white font-bold text-sm uppercase tracking-wide">Home Size</span>
            <span className="text-white font-bold text-sm uppercase tracking-wide text-right">
              Starting Price
            </span>
          </div>

          {pricing.map((row, i) => (
            <div
              key={row.size}
              className={`grid grid-cols-2 px-6 py-4 items-center ${
                i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-[#f0fdf9] transition-colors`}
            >
              <span className="font-semibold text-[#0F1C3F]">{row.size}</span>
              <span className="text-right font-extrabold text-[#2DD4A7] text-lg">{row.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm bg-gray-50 rounded-xl px-6 py-4 inline-block border border-gray-100">
            💰 Save 10–20% with a recurring booking. Discount applied automatically.
          </p>
        </div>

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
