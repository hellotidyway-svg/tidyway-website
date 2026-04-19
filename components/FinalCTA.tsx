const badges = [
  { icon: '✓', text: 'Background Checked' },
  { icon: '🛡', text: '$2M Insured' },
  { icon: '💚', text: 'Happiness Guarantee' },
];

export default function FinalCTA() {
  return (
    <section className="bg-[#0F1C3F]" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Ready for a Cleaner Home?
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of London homeowners who trust TidyWay. Get your instant price in
          under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="#lead-form"
            className="bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-9 py-4 rounded-xl text-lg transition-colors w-full sm:w-auto text-center"
          >
            Get My Free Quote →
          </a>
          <a
            href="tel:+12262429012"
            className="border-2 border-white/40 hover:border-white text-white font-extrabold px-9 py-4 rounded-xl text-lg hover:bg-white hover:text-[#0F1C3F] transition-all w-full sm:w-auto text-center"
          >
            Call Us: (226) 242-9012
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {badges.map(badge => (
            <div key={badge.text} className="flex items-center gap-2 text-[#2DD4A7]">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
