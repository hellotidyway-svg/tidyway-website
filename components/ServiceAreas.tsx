const neighbourhoods = [
  'Byron',
  'Masonville',
  'Old North',
  'Wortley Village',
  'Hyde Park',
  'Sunningdale',
  'White Oaks',
  'Old East Village',
  'Downtown London',
];

export default function ServiceAreas() {
  return (
    <section className="bg-gray-50" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-5">
          Proudly Serving London, Ontario
        </h2>
        <p className="text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
          We clean homes across all London neighbourhoods including Byron, Masonville, Old North,
          Wortley Village, Hyde Park, Sunningdale, White Oaks, Old East Village, and Downtown London.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {neighbourhoods.map(hood => (
            <span
              key={hood}
              className="bg-[#2DD4A7]/10 text-[#0F1C3F] border border-[#2DD4A7]/30 font-semibold text-sm px-4 py-2 rounded-full"
            >
              {hood}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-sm font-medium mb-8">
          Also serving St. Thomas and surrounding areas.
        </p>

        <a
          href="#lead-form"
          className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors"
        >
          Book Your Clean Today →
        </a>
      </div>
    </section>
  );
}
