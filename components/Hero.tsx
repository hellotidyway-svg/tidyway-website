import Image from 'next/image';
import LeadForm from './LeadForm';

const trustBadges = [
  { icon: '⭐', text: '4.9 Google Rating' },
  { icon: '✓', text: 'Background Checked' },
  { icon: '🛡', text: '$2M Insured' },
  { icon: '💚', text: 'Happiness Guarantee' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[700px] flex items-center pt-16">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
        alt="Clean, bright modern home interior"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0F1C3F]/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Headline + trust badges */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2DD4A7] inline-block" />
              Now Booking in London, ON
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-5">
              London&apos;s Most Trusted{' '}
              <span className="text-[#2DD4A7]">Home Cleaning</span> Service
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Professional, insured, and background-checked cleaners serving London, ON.
              Instant online pricing. Book in under 2 minutes.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.map(badge => (
                <div
                  key={badge.text}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Lead form */}
          <div>
            <LeadForm />
          </div>

        </div>
      </div>
    </section>
  );
}
