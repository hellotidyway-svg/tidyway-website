const reasons = [
  {
    title: 'Background-Checked Cleaners',
    description:
      'Every TidyWay cleaner passes a thorough criminal background check before they ever step into a London home. Peace of mind isn\'t a bonus feature — it\'s the starting point.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: '$2M Liability Insurance',
    description:
      'Every booking is backed by $2 million in liability insurance. Whether you\'re in a Masonville townhome or a South London semi, your property is fully protected from the moment we arrive.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Flat-Rate Online Pricing',
    description:
      'See your exact price before you hit confirm — no bait-and-switch, no add-ons at the door, no awkward surprises on invoice day. What you see online is exactly what you pay.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Same Cleaner Every Visit',
    description:
      'Recurring clients get matched with the same trusted cleaner each time — someone who learns your preferences, knows your home, and shows up ready to meet your standard.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: '24-Hour Cancellation Policy',
    description:
      'Life in London doesn\'t always go to plan. Cancel or reschedule for free with at least 24 hours\' notice — no penalty, no phone call required, no guilt.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Happiness Guarantee',
    description:
      'Not fully satisfied? Let us know within 24 hours and we\'ll return to make it right — completely free. No runaround, no debate. We don\'t consider the job done until you do.',
    icon: (
      <svg className="w-5 h-5 text-[#0F1C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const badges = [
  { icon: '✓', text: 'Background Checked' },
  { icon: '🛡', text: '$2M Insured' },
  { icon: '✓', text: 'Happiness Guarantee' },
  { icon: '⏰', text: '24hr Cancellation Policy' },
];

export default function WhyTidyway() {
  return (
    <section className="bg-[#0F1C3F]" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Two-column header */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-10">

          {/* Left — eyebrow + headline */}
          <div>
            <div className="inline-block bg-[#2DD4A7] text-[#0F1C3F] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-3">
              Why TidyWay
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              <span className="text-white">
                Professional cleaners you can trust,<br />built for London homes.
              </span>
              <br />
              <span className="text-[#2DD4A7]">Insured, background-checked, and committed to excellence.</span>
            </h2>
          </div>

          {/* Right — paragraph */}
          <div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              TidyWay was built for London homes — from heritage Victorians in Old East Village to
              new builds in Lambeth and Summerside. We know trust takes time to earn, so we start
              with a team that&apos;s background-checked, fully insured, and trained to care for
              your home the way you would. Book once and see why London homeowners keep coming back.
            </p>
          </div>
        </div>

        {/* 3×2 Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {reasons.map(reason => (
            <div
              key={reason.title}
              className="rounded-2xl p-6 border border-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4">
                {reason.icon}
              </div>
              <h3 className="text-white font-extrabold text-base mb-2">{reason.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom pill badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map(badge => (
            <div
              key={badge.text}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-gray-300 font-semibold border border-white/15"
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
