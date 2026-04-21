import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | TidyWay',
  description: 'TidyWay respects your privacy and is committed to protecting your personal information. Read our full privacy policy.',
  alternates: {
    canonical: 'https://tidyway.ca/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-16">

        {/* Page header */}
        <div className="bg-gray-50 border-b border-gray-100 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">Privacy Policy</h1>
            <p className="text-gray-400 text-sm mt-2">Last Updated: April 6th, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

            <p>
              TidyWay respects your privacy and is committed to protecting your personal information.
            </p>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">1. Information We Collect</h2>
              <p>
                Personal data gathered includes names, email addresses, phone numbers, and service addresses when you submit a form or book a service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">2. How We Use Your Information</h2>
              <p>The company utilizes collected data to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide quotes and schedule services</li>
                <li>Communicate about bookings and updates</li>
                <li>Send service-related messages via email and SMS</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">3. SMS &amp; Communication Consent</h2>
              <p>
                By sharing your phone number, you agree to receive text messages from TidyWay regarding bookings, service updates, and customer support. Message and data rates may apply, with varying frequency. You may opt out anytime by replying STOP. We do not send unsolicited marketing messages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">4. Sharing of Information</h2>
              <p>
                TidyWay does not sell or rent personal data and only shares information with trusted service providers only as necessary to operate our business.
              </p>
              <p>
                No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">5. Data Security</h2>
              <p>
                We take reasonable measures to protect your information from unauthorized access or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">6. Cookies &amp; Tracking</h2>
              <p>
                The website may employ cookies or tracking tools for improving user experience and performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">7. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal information by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">8. Updates to This Policy</h2>
              <p>
                We may update this policy at any time. Changes will be posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#0F1C3F] mb-3">9. Contact Us</h2>
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
