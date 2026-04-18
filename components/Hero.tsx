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
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-br from-white via-white to-[#f0fdf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content + Form */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f0fdf9] border border-[#2DD4A7]/30 text-[#0F1C3F] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2DD4A7] inline-block" />
              Now Booking in London, ON
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F1C3F] leading-[1.1] mb-5">
              London&apos;s Most Trusted{' '}
              <span className="text-[#2DD4A7]">Home Cleaning</span> Service
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Professional, insured, and background-checked cleaners serving London, ON.
              Instant online pricing. Book in under 2 minutes.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {trustBadges.map(badge => (
                <div
                  key={badge.text}
                  className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm text-sm font-medium text-[#0F1C3F]"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            <LeadForm />
          </div>

          {/* Right: Image (desktop only) */}
          <div className="hidden lg:block">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
                alt="Clean, bright modern home interior"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 50vw, 0px"
              />
            </div>

            {/* Floating badge on image */}
            <div className="mt-6 flex items-center gap-4 bg-white rounded-xl shadow-lg p-4 border border-gray-50">
              <div className="flex -space-x-2">
                {['S', 'J', 'L'].map(initial => (
                  <div
                    key={initial}
                    className="w-9 h-9 rounded-full bg-[#0F1C3F] text-white font-bold text-sm flex items-center justify-center ring-2 ring-white"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F1C3F]">
                  1,000+ happy London homeowners
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.9 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
