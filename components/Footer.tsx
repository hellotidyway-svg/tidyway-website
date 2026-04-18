const links = ['About', 'Services', 'Pricing', 'Contact'];

export default function Footer() {
  return (
    <footer className="bg-[#0a1530] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="text-2xl font-extrabold text-white mb-2 tracking-tight">Tidyway</div>
            <p className="text-sm leading-relaxed">
              Professional Home Cleaning in London, ON
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
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

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Tidyway. All rights reserved.</p>
          <p>Professional Home Cleaning — London, Ontario</p>
        </div>
      </div>
    </footer>
  );
}
