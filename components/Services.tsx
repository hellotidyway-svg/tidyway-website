const services = [
  {
    icon: '🏠',
    title: 'Regular House Cleaning',
    description: 'Weekly, bi-weekly, or monthly. Save up to 20% on recurring bookings.',
  },
  {
    icon: '✨',
    title: 'Deep Cleaning',
    description: 'First-time clean or a full reset. We go beyond the surface.',
  },
  {
    icon: '📦',
    title: 'Move In / Move Out',
    description: 'Landlord-ready cleaning for lease ends and new beginnings.',
  },
  {
    icon: '🏢',
    title: 'Apartment & Condo Cleaning',
    description: 'Studio to large units across London. All building types.',
  },
  {
    icon: '🌿',
    title: 'Eco-Friendly Cleaning',
    description: 'Pet and child safe products. No harsh chemicals.',
  },
  {
    icon: '🎓',
    title: 'Student Move-Out',
    description:
      'Western University and Fanshawe lease ends. Book early — spots fill fast.',
  },
];

export default function Services() {
  return (
    <section className="bg-gray-50" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">What We Clean</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.title}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:border-[#2DD4A7]/30 transition-all duration-200 group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-extrabold text-[#0F1C3F] mb-2 group-hover:text-[#2DD4A7] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
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
