const stats = [
  { number: '1,000+', label: 'London Homes Cleaned' },
  { number: '4.9 ⭐', label: 'Google Rating' },
  { number: '2023', label: 'Serving London Since' },
  { number: '$2M', label: 'Liability Insurance' },
];

export default function SocialProofBar() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] tracking-tight">
                {stat.number}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
