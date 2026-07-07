import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#fleet' },
  { label: 'Locations', href: '#locations' },
  { label: 'Contact', href: '#why-us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  // On homepage, navbar starts transparent with white text (dark hero behind it).
  // On all other pages, navbar always uses dark text (light background).
  const useDarkText = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 w-full flex items-center justify-between h-[76px]">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-0 select-none">
          <span className={`font-['Space_Grotesk'] font-bold text-[28px] tracking-tight transition-colors duration-300 ${useDarkText ? 'text-[#1C1917]' : 'text-white'}`}>
            RIDE
          </span>
          <span className="w-[8px] h-[8px] rounded-full bg-[#FBBF24] inline-block mb-[3px] ml-[2px]" />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-[28px]">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`relative font-['Manrope'] font-medium text-[15px] transition-colors duration-200 group py-2 ${useDarkText ? 'text-[#57534E] hover:text-[#1C1917]' : 'text-[#A8A29E] hover:text-white'}`}
              >
                {link.label}
                <span className="absolute -bottom-[2px] left-0 w-0 h-[2px] bg-[#FBBF24] group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons — hidden on login page */}
        {!isLoginPage && (
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              id="nav-login-btn"
              className={`bg-transparent border-2 px-6 py-3 rounded-full font-['Manrope'] font-semibold text-[14px] transition-all cursor-pointer flex items-center justify-center ${useDarkText ? 'text-[#1C1917] border-[#1C1917] hover:bg-[#F5F5F4]' : 'text-white border-white/40 hover:bg-white/10'}`}
            >
              Login
            </Link>
            <Link
              to="/login"
              id="nav-signup-btn"
              className="bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] px-8 py-3 rounded-full font-['Manrope'] font-semibold text-[14px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)] flex items-center justify-center"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          className={`lg:hidden p-2 cursor-pointer transition-colors duration-300 ${useDarkText ? 'text-[#1C1917]' : 'text-white'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-[76px] bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center pt-14 gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-['Manrope'] font-medium text-[20px] text-[#1C1917] hover:text-[#F59E0B] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          {!isLoginPage && (
            <div className="flex flex-col gap-4 w-[220px] mt-6">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-transparent text-[#1C1917] border-2 border-[#1C1917] hover:bg-[#F5F5F4] py-3 rounded-full font-['Manrope'] font-semibold text-[15px] transition-all cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] py-3 rounded-full font-['Manrope'] font-semibold text-[15px] transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
