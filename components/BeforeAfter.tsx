import Image from 'next/image';

export default function BeforeAfter() {
  return (
    <section className="bg-gray-50 pt-7 md:pt-11 pb-5 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT — text */}
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-block bg-[#2DD4A7] text-[#0F1C3F] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Real Results
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F1C3F] leading-tight mb-4">
              See the TidyWay difference
            </h2>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              From grimy to gleaming — our London clients share what professional cleaning actually looks like.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-[#f0fdf9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2DD4A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                <span className="text-[#0F1C3F] font-semibold text-sm md:text-base">
                  Insured &amp; background-checked cleaners
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-[#f0fdf9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2DD4A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span className="text-[#0F1C3F] font-semibold text-sm md:text-base">
                  Happiness guarantee — we return if you&apos;re not satisfied
                </span>
              </li>
            </ul>

            {/* Testimonial */}
            <blockquote className="border-l-2 border-[#2DD4A7] pl-4 mb-8 max-w-md">
              <p className="text-gray-500 italic text-sm md:text-base leading-relaxed mb-2">
                &ldquo;I honestly couldn&apos;t believe it was the same kitchen. Worth every penny.&rdquo;
              </p>
              <cite className="text-gray-400 text-xs font-semibold not-italic">
                — Sarah M., Old North London
              </cite>
            </blockquote>

            {/* CTA */}
            <a
              href="#lead-form"
              className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-[#0F1C3F] font-extrabold px-8 py-3 rounded-xl text-base transition-colors"
            >
              Get My Free Quote →
            </a>
          </div>

          {/* RIGHT — static image */}
          <div className="order-1 md:order-2">
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/3', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18)' }}
            >
              <Image
                src="/before-after.png"
                alt="Before and after professional cleaning by TidyWay"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
