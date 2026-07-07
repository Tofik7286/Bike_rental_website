import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
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

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

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

        {/* Desktop Right Side — Auth-aware */}
        {!isLoginPage && (
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {/* My Bookings */}
                <Link
                  to="/customer/dashboard"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-['Manrope'] font-semibold text-[14px] transition-all cursor-pointer ${useDarkText ? 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <Calendar size={16} />
                  My Bookings
                </Link>

                {/* Profile Avatar */}
                <Link
                  to="/profile"
                  id="nav-profile-btn"
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1C1917] text-[#FBBF24] flex items-center justify-center font-['Space_Grotesk'] font-bold text-[13px] ring-2 ring-[#FBBF24]/30 group-hover:ring-[#FBBF24]/60 transition-all">
                    {getInitials(user.name)}
                  </div>
                  <span className={`font-['Manrope'] font-semibold text-[14px] transition-colors ${useDarkText ? 'text-[#1C1917]' : 'text-white'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
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
        className={`lg:hidden absolute left-0 right-0 top-[76px] h-[calc(100vh-76px)] overflow-y-auto bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center pt-14 pb-28 gap-8 min-h-max">
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

          {/* Mobile Auth Section */}
          {!isLoginPage && (
            <>
              {user ? (
                <div className="flex flex-col items-center gap-4 w-[220px] mt-6">
                  {/* Profile link */}
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-3 bg-[#1C1917] text-[#FBBF24] py-3.5 rounded-full font-['Manrope'] font-semibold text-[15px] transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FBBF24] text-[#1C1917] flex items-center justify-center font-['Space_Grotesk'] font-bold text-[11px]">
                      {getInitials(user.name)}
                    </div>
                    My Profile
                  </Link>
                  {/* My Bookings link */}
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center bg-transparent text-[#1C1917] border-2 border-[#E7E5E4] hover:bg-[#F5F5F4] py-3 rounded-full font-['Manrope'] font-semibold text-[15px] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} />
                    My Bookings
                  </Link>
                </div>
              ) : (
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
