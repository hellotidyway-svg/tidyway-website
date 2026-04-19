import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'TidyWay Cleaner Application — London, ON',
  description: 'Apply to join the TidyWay cleaner network in London. Flexible schedules, reliable work opportunities, and competitive pay.',
  robots: 'noindex, nofollow',
};

export default function JobsLondonPage() {
  return (
    <>
      <Header hideCTA />

      <main className="bg-white pt-16 min-h-screen">

        {/* Page header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-4">
            TidyWay Application — London
          </h1>
          <p className="text-gray-500 leading-relaxed text-base md:text-lg max-w-xl mx-auto">
            Apply below to join the TidyWay cleaner network in London. We connect experienced
            residential cleaners with homeowners in the area, offering flexible schedules,
            reliable work opportunities, and competitive pay.
          </p>
        </div>

        {/* BookingKoala hiring form embed */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              BOOKINGKOALA HIRING FORM EMBED
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <iframe
            src="https://tidyway.bookingkoala.com/hiring/form/69bb0abb77ed7cb7689d03ef?embed=true"
            style={{ border: 'none', height: '1000px', display: 'block' }}
            width="100%"
            scrolling="no"
            title="TidyWay Cleaner Application Form"
          />
          <Script
            src="https://tidyway.bookingkoala.com/resources/embed.js"
            strategy="lazyOnload"
          />
        </div>

        {/* Logo centered below form */}
        <div className="flex justify-center pb-16">
          <div className="relative" style={{ width: '160px', height: '60px' }}>
            <Image
              src="/TidyWay Logo Horizontal.png"
              alt="TidyWay"
              fill
              className="object-contain"
            />
          </div>
        </div>

      </main>
    </>
  );
}
