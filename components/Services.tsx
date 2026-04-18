const services = [
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'Regular House Cleaning',
    description:
      'Weekly, bi-weekly, or monthly visits tailored to your home — whether you\'re in a Masonville two-storey, a Byron bungalow, or a South London semi-detached. Recurring clients save up to 20% and get the same trusted cleaner every visit.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: 'Deep Cleaning',
    description:
      'A full top-to-bottom reset that goes far beyond the surface — inside appliances, behind furniture, baseboards, vents, and grout lines. Perfect as a first-time clean or a seasonal refresh for any London home, large or small.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: 'Move In / Move Out',
    description:
      'Landlord-ready cleaning that meets London\'s lease-end standards. We tackle every inch so you get your full deposit back. Whether you\'re leaving a rental near Western, Fanshawe, or anywhere across the city, we\'ve got it covered.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: 'Apartment & Condo Cleaning',
    description:
      'From studio suites in Old East Village to high-rise condos downtown, we handle all unit types and building access requirements. No elevator hassles — just a spotless home waiting when you get back.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: 'Eco-Friendly Cleaning',
    description:
      'Plant-based, non-toxic products that are safe for kids, pets, and London\'s waterways. No harsh chemical smell, no residue — just a genuinely clean home you can feel good about. Available as an add-on for any booking.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Student Move-Out',
    description:
      'Western University and Fanshawe College lease ends on a deadline? We know the pressure. Our move-out cleans are thorough, fast, and priced for student budgets — book early, spots around April and August fill up quickly.',
  },
];

export default function Services() {
  return (
    <section className="bg-gray-50" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#0F1C3F] text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-4">
            Everything We Clean in London, Ontario
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            One-time or recurring, we cover every corner of your home with the same insured,
            background-checked team.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.title}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:border-[#2DD4A7]/30 transition-all duration-200 group flex flex-col"
            >
              {/* Navy icon container */}
              <div className="w-10 h-10 rounded-xl bg-[#0F1C3F] flex items-center justify-center mb-4 flex-shrink-0">
                {service.icon}
              </div>

              <h3 className="text-lg font-extrabold text-[#0F1C3F] mb-2 group-hover:text-[#2DD4A7] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{service.description}</p>

              {/* Learn more link */}
              <a
                href="#lead-form"
                className="inline-block mt-4 text-[#2DD4A7] hover:text-[#22c497] text-sm font-bold transition-colors"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
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
