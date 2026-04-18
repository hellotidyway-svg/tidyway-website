const steps = [
  {
    number: '1',
    title: 'Get Your Price',
    description:
      'Fill out the quick form above. Instant pricing based on your home size — no phone calls required.',
  },
  {
    number: '2',
    title: 'Pick Your Date',
    description:
      'Choose a time that works for you. We have morning and afternoon availability across London.',
  },
  {
    number: '3',
    title: 'We Handle the Rest',
    description:
      'Your background-checked, insured cleaner shows up fully equipped. You come home to a spotless house.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white" style={{ paddingTop: 10, paddingBottom: 10 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            Booking a Clean is Simple
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gray-100 z-0" />

          {steps.map(step => (
            <div
              key={step.number}
              className="relative z-10 text-center bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-[#0F1C3F] text-[#2DD4A7] font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-extrabold text-[#0F1C3F] mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#lead-form"
            className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Book My Clean Now →
          </a>
        </div>
      </div>
    </section>
  );
}
