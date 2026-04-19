import Image from 'next/image';

const links = ['About', 'Services', 'Pricing', 'Contact'];

export default function Footer() {
  return (
    <footer className="bg-white text-[#0F1C3F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="relative w-40 mb-3" style={{ height: '60px' }}>
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
          <div>
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
          <div>
            <h4 className="text-[#0F1C3F] font-bold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+12260000000" className="hover:text-white transition-colors">
                  (226) XXX-XXXX
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

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 TidyWay. All rights reserved.</p>
          <p>Professional Home Cleaning — London, Ontario</p>
        </div>
      </div>
    </footer>
  );
}
