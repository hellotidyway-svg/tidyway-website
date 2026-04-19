import Image from 'next/image';

const links = ['About', 'Services', 'Pricing', 'Contact'];

export default function Footer() {
  return (
    <footer className="bg-white text-[#0F1C3F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 md:text-left text-center">
          {/* Brand */}
          <div className="md:block flex flex-col items-center">
            <div className="relative w-40 mb-3 md:ml-0 mx-auto" style={{ height: '60px' }}>
              <Image
                src="/TidyWay Logo Horizontal.png"
                alt="TidyWay Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              We make professional home cleaning in London, Ontario simple, reliable, and stress-free. From deep cleans to recurring maintenance, our team is committed to delivering spotless results every time.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Fully insured. Background-checked. Satisfaction guaranteed.
            </p>
          </div>

          {/* Links */}
          <div className="md:block flex flex-col items-center">
            <h4 className="text-[#0F1C3F] font-bold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm hover:text-[#2DD4A7] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:block flex flex-col items-center">
            <h4 className="text-[#0F1C3F] font-bold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm md:text-left text-center">
              <li>
                <a href="tel:+12262429012" className="hover:text-white transition-colors">
                  (226) 242-9012
                </a>
              </li>
              <li>
                <a href="mailto:hello@tidyway.ca" className="hover:text-white transition-colors">
                  hello@tidyway.ca
                </a>
              </li>
              <li>London, Ontario</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-xs text-center sm:text-left">
          <p>© 2026 TidyWay. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="text-gray-400 hover:text-[#2DD4A7] transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-[#2DD4A7] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
