const reasons = [
  {
    icon: '✅',
    title: 'Background-Checked Cleaners',
    description: 'Every cleaner passes a criminal background check before their first job.',
  },
  {
    icon: '🛡',
    title: '$2M Liability Insurance',
    description: 'Every booking is fully insured. Your home is protected.',
  },
  {
    icon: '💰',
    title: 'Flat-Rate Online Pricing',
    description: 'No surprises. The price you see is the price you pay.',
  },
  {
    icon: '🔄',
    title: 'Same Cleaner Every Visit',
    description:
      'For recurring bookings, we assign you a consistent cleaner who knows your home.',
  },
  {
    icon: '⏰',
    title: '24-Hour Cancellation Policy',
    description: 'Life happens. Reschedule free with 24 hours notice.',
  },
  {
    icon: '💚',
    title: 'Happiness Guarantee',
    description:
      "If we miss a spot, let us know within 24 hours and we'll come back for free.",
  },
];

export default function WhyTidyway() {
  return (
    <section className="bg-gray-50" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            Why London Homeowners Choose TidyWay
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map(reason => (
            <div
              key={reason.title}
              className="flex gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl flex-shrink-0 mt-0.5">{reason.icon}</div>
              <div>
                <h3 className="font-extrabold text-[#0F1C3F] mb-1">{reason.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
