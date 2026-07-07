import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'],
  Locations: ['Mumbai', 'Bangalore', 'Ahmedabad', 'Delhi'],
};

/* Inline SVG social icons since lucide-react doesn't export brand icons */
function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="locations" className="bg-[#1C1917] text-white pt-[80px] pb-[30px]">
      <div className="max-w-[1320px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[40px] lg:gap-[30px]">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <a href="#home" className="flex items-baseline gap-0 select-none w-fit">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] tracking-tight text-white">
                RIDE
              </span>
              <span className="w-[8px] h-[8px] rounded-full bg-[#FBBF24] inline-block mb-[3px] ml-[2px]" />
            </a>
            <p className="font-['Manrope'] text-[14px] leading-[1.7] text-[#A8A29E] max-w-[300px]">
              Premium motorcycle and scooter rentals. Experience the freedom of
              the open road with our meticulously maintained fleet.
            </p>
            {/* Contact Info */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#FBBF24] shrink-0" />
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E]">
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#FBBF24] shrink-0" />
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E]">
                  hello@ride.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-[#FBBF24] shrink-0" />
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E]">
                  Mumbai, Maharashtra, India
                </span>
              </div>
            </div>
            {/* Staff & Admin Portal Links */}
            <div className="mt-4 pt-4 border-t border-[#292524] flex flex-col gap-2">
              <Link to="/staff/return" className="font-['Manrope'] text-[13px] text-[#A8A29E] hover:text-[#FBBF24] transition-colors duration-200 inline-flex items-center gap-1.5">
                🛡️ Staff Return Portal
              </Link>
              <Link to="/admin/dashboard" className="font-['Manrope'] text-[13px] text-[#A8A29E] hover:text-[#FBBF24] transition-colors duration-200 inline-flex items-center gap-1.5">
                ⚙️ Super Admin Panel
              </Link>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h4 className="font-['Space_Grotesk'] font-semibold text-[15px] text-white uppercase tracking-[0.08em]">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-['Manrope'] text-[13px] text-[#A8A29E] hover:text-[#FBBF24] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#292524] mt-[60px] mb-[24px]" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['Manrope'] text-[12px] text-[#78716C]">
            © {new Date().getFullYear()} RIDE. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              { Icon: InstagramIcon, label: 'Instagram' },
              { Icon: TwitterIcon, label: 'Twitter' },
              { Icon: YoutubeIcon, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-[38px] h-[38px] rounded-full border border-[#292524] flex items-center justify-center text-[#78716C] hover:border-[#FBBF24] hover:text-[#FBBF24] transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
