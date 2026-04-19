import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | TidyWay',
  description: 'Read the TidyWay Terms of Service. Understand your rights and responsibilities when booking professional home cleaning in London, Ontario.',
  alternates: {
    canonical: 'https://tidyway.ca/terms-of-service',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* Page header */}
        <div className="bg-gray-50 border-b border-gray-100 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">Terms of Service</h1>
            <p className="text-gray-400 text-sm mt-2">Last Updated: April 6th, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">1. Services</h2>
              <p>
                TidyWay provides residential cleaning services. Customers must provide accurate and complete information when submitting booking requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">2. Quotes &amp; Bookings</h2>
              <p>
                Initial quotes depend on booking details provided. The final cost may change based on the actual state of the property.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">3. Payments</h2>
              <p>
                Payment is required according to the terms provided at booking. We may charge the registered payment method for completed work, cancellations, or applicable fees.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">4. Cancellations &amp; Rescheduling</h2>
              <p>
                Changes must follow the timeframe given during booking. Late cancellations may be subject to a fee.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">5. Satisfaction Guarantee</h2>
              <p>
                Unhappy customers should contact TidyWay within 24 hours of their clean for resolution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">6. Communication Consent</h2>
              <p>
                By submitting your information through our website forms, you agree to be contacted by TidyWay via phone, email, or SMS. Standard message rates apply. You may opt out by replying STOP.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">7. Limitation of Liability</h2>
              <p>
                TidyWay is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our services following any changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">9. Contact</h2>
              <ul className="space-y-1">
                <li>
                  Email:{' '}
                  <a href="mailto:hello@tidyway.ca" className="text-[#2DD4A7] hover:underline">
                    hello@tidyway.ca
                  </a>
                </li>
                <li>
                  Phone:{' '}
                  <a href="tel:+12262429012" className="text-[#2DD4A7] hover:underline">
                    (226) 242-9012
                  </a>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
