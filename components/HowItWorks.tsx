// Chevron notch depth in px — controls the arrow size
const N = 28;

const steps = [
  {
    title: 'Get Your Price',
    description:
      'Fill out the quick form above. Instant pricing based on your home size — no phone calls required.',
    color: '#2DD4A7',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V9.75zm0 3h.008v.008H12V12zm0 3h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: 'We Handle the Rest',
    description:
      'Your background-checked, insured cleaner shows up fully equipped. You come home to a spotless house.',
    color: '#0F1C3F',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-10">
          <span className="text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            Booking a Clean is Simple
          </h2>
        </div>

        {/* ── Desktop: chevron timeline ── */}
        <div className="hidden md:flex mb-10">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex-1 flex flex-col"
              style={{ marginLeft: i > 0 ? `-${N}px` : 0 }}
            >
              {/* Chevron banner */}
              <div
                className="flex flex-col items-center justify-center py-8 text-white"
                style={{
                  background: step.color,
                  clipPath:
                    i === 0
                      ? `polygon(0 0, calc(100% - ${N}px) 0, 100% 50%, calc(100% - ${N}px) 100%, 0 100%)`
                      : `polygon(${N}px 0, calc(100% - ${N}px) 0, 100% 50%, calc(100% - ${N}px) 100%, 0 100%, ${N}px 50%)`,
                  paddingLeft:  i > 0 ? `${N * 2 + 4}px` : `${N + 4}px`,
                  paddingRight: `${N * 2 + 4}px`,
                }}
              >
                {/* Icon circle */}
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  {step.icon}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-75">
                  Step {i + 1}
                </span>
              </div>

              {/* Content below banner */}
              <div
                className="flex-1 text-center pt-6"
                style={{
                  paddingLeft:  i > 0 ? `${N}px` : '4px',
                  paddingRight: `${N}px`,
                }}
              >
                {/* Accent dot */}
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-3"
                  style={{ background: step.color }}
                />
                <h3 className="text-lg font-extrabold text-[#0F1C3F] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="md:hidden relative mb-10">
          {/* Connector line */}
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

          <div className="space-y-8 pl-2">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4 relative">
                {/* Step circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md"
                  style={{ background: step.color }}
                >
                  {step.icon}
                </div>
                {/* Text */}
                <div className="pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">
                    Step {i + 1}
                  </span>
                  <h3 className="font-extrabold text-[#0F1C3F] mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
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
