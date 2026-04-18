const steps = [
  {
    title: 'Get Your Price',
    description:
      'Fill out the quick form above. Instant pricing based on your home size — no phone calls required.',
    color: '#2DD4A7',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Pick Your Date',
    description:
      'Choose a time that works for you. We have morning and afternoon availability across London.',
    color: '#0b5980',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
    ),
  },
  {
    title: 'We Handle the Rest',
    description:
      'Your background-checked, insured cleaner shows up fully equipped. You come home to a spotless house.',
    color: '#0F1C3F',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            Booking a Clean is Simple
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">

              {/* Icon circle with step number */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md"
                style={{ background: step.color }}
              >
                {step.icon}
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[10px] font-extrabold"
                  style={{ color: step.color, borderColor: step.color }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Connector arrow — desktop only, between steps */}
              <h3 className="text-base font-extrabold text-[#0F1C3F] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Connector line — desktop only */}
        <style>{`
          @media (min-width: 768px) {
            .how-steps { position: relative; }
            .how-steps::before {
              content: '';
              position: absolute;
              top: 32px;
              left: calc(16.67% + 8px);
              right: calc(16.67% + 8px);
              height: 2px;
              background: linear-gradient(to right, #2DD4A7, #0b5980, #0F1C3F);
              z-index: 0;
            }
          }
        `}</style>

        {/* CTA */}
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
