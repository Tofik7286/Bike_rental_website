import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bike, Smartphone, Navigation, ShieldCheck, BadgeCheck, Sparkles, CalendarDays, Clock, MapPin, Star } from 'lucide-react';
import { useRental } from '../context/RentalContext';

// ─── Helper: generate time slots 6:00 AM → 12:00 AM (midnight) ───
function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h <= 23; h++) {
    const period = h >= 12 ? 'PM' : 'AM';
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    slots.push({ value: `${String(h).padStart(2, '0')}:00`, label: `${display}:00 ${period}` });
    slots.push({ value: `${String(h).padStart(2, '0')}:30`, label: `${display}:30 ${period}` });
  }
  // 12:00 AM (midnight)
  slots.push({ value: '00:00', label: '12:00 AM' });
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

// ─── Helper: get next 30-min slot from current time ───
function getSmartDefaults() {
  const now = new Date();

  // Round up to next 30-min boundary
  const mins = now.getMinutes();
  let pickupHour = now.getHours();
  let pickupMin;

  if (mins < 30) {
    pickupMin = 30;
  } else {
    pickupMin = 0;
    pickupHour += 1;
  }

  // Handle midnight/day rollover if pickupHour becomes 24
  let dayOffset = 0;
  if (pickupHour >= 24) {
    pickupHour = 6; // Reset to 6:00 AM next day
    pickupMin = 0;
    dayOffset = 1;
  }

  const pickupTime = new Date(now);
  pickupTime.setDate(now.getDate() + dayOffset);
  pickupTime.setHours(pickupHour, pickupMin, 0, 0);

  // If before 6 AM, set to 6 AM today
  if (pickupTime.getHours() < 6 && dayOffset === 0) {
    pickupTime.setHours(6, 0, 0, 0);
  }

  // Drop-off = exactly 24 hours after pickup
  const dropoffTime = new Date(pickupTime.getTime() + 24 * 60 * 60 * 1000);

  // Helpers to get local ISO string and time string
  const getLocalDateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = (d) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const todayStr = getLocalDateString(now);
  const pickupDateStr = getLocalDateString(pickupTime);
  const pickupTimeStr = getLocalTimeString(pickupTime);
  const dropoffDateStr = getLocalDateString(dropoffTime);
  const dropoffTimeStr = getLocalTimeString(dropoffTime);

  return { pickupDateStr, pickupTimeStr, dropoffDateStr, dropoffTimeStr, todayStr };
}

export default function HomePage() {
  const { fleet } = useRental();
  const navigate = useNavigate();
  const availableBikes = fleet.filter((b) => b.status === 'Available').slice(0, 3);

  // Smart booking defaults
  const defaults = getSmartDefaults();
  const today = defaults.todayStr;
  const [pickupDate, setPickupDate] = useState(defaults.pickupDateStr);
  const [dropoffDate, setDropoffDate] = useState(defaults.dropoffDateStr);
  const [pickupTime, setPickupTime] = useState(defaults.pickupTimeStr);
  const [dropoffTime, setDropoffTime] = useState(defaults.dropoffTimeStr);

  const handleSearch = () => {
    const params = new URLSearchParams({
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    });
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — DARK PREMIUM HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative min-h-[80vh] md:min-h-[90vh] bg-[#1C1917] flex flex-col justify-between overflow-hidden"
      >
        {/* Background cinematic image */}
        <div className="absolute inset-0 z-0">
          {/* Motorcycle photo */}
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1920"
            alt="Premium motorcycle on open road"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/80 via-[#1C1917]/70 to-[#1C1917]/90" />
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
          {/* Decorative blurred amber glow */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FBBF24] opacity-[0.06] rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#FBBF24] opacity-[0.04] rounded-full blur-[140px]" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1320px] mx-auto w-full px-5 md:px-6 pt-[110px] md:pt-[140px] lg:pt-[160px] pb-8 md:pb-12">
          {/* Micro label */}
          <span className="font-['Manrope'] font-medium text-[11px] md:text-[13px] text-[#A8A29E] uppercase tracking-[0.2em] mb-4 md:mb-6">
            Premium Bike Rentals
          </span>

          {/* Main heading — massive scale */}
          <h1 className="font-['Space_Grotesk'] font-bold text-[42px] md:text-[72px] lg:text-[88px] xl:text-[96px] leading-tight md:leading-[1.05] tracking-tight text-white max-w-[900px]">
            Born To
            <br />
            <span className="text-[#FBBF24]">Ride</span> The City
            <span className="text-[#FBBF24]">.</span>
          </h1>

          {/* Sub copy */}
          <p className="font-['Manrope'] text-[15px] md:text-[17px] lg:text-[19px] leading-[1.65] text-[#A8A29E] max-w-[520px] mt-5 md:mt-8">
            Hand-picked motorcycles and scooters, delivered with a fully digital
            experience. No queues, no paperwork — just pure riding pleasure.
          </p>

          {/* Trust metrics */}
          <div className="flex items-center gap-6 md:gap-12 mt-8 md:mt-12">
            {[
              { value: '50K+', label: 'Happy Riders' },
              { value: '200+', label: 'Premium Bikes' },
              { value: '15+', label: 'Cities' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-[24px] md:text-[36px] text-white leading-none">
                  {stat.value}
                </span>
                <span className="font-['Manrope'] text-[12px] md:text-[13px] text-[#78716C] mt-1 tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Floating Booking Widget ── */}
        <div className="relative z-20 max-w-[1320px] mx-auto w-full px-4 md:px-6 pb-8 md:pb-14 -mb-[40px] md:-mb-[60px]">
          <div
            id="booking-widget"
            className="bg-white rounded-[16px] md:rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-5 md:p-8"
          >
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 items-stretch md:items-end">
              {/* Pickup Date */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Manrope'] font-semibold text-[12px] text-[#A8A29E] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-[#FBBF24]" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="font-['Space_Grotesk'] font-medium text-[15px] text-[#1C1917] bg-[#F5F5F4] rounded-[12px] px-4 py-3 min-h-[48px] border border-[#E7E5E4] focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all w-full"
                />
              </div>

              {/* Pickup Time */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Manrope'] font-semibold text-[12px] text-[#A8A29E] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FBBF24]" />
                  Pickup Time
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="font-['Space_Grotesk'] font-medium text-[15px] text-[#1C1917] bg-[#F5F5F4] rounded-[12px] px-4 py-3 min-h-[48px] border border-[#E7E5E4] focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all appearance-none cursor-pointer w-full"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Drop-off Date */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Manrope'] font-semibold text-[12px] text-[#A8A29E] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-[#FBBF24]" />
                  Drop-off Date
                </label>
                <input
                  type="date"
                  value={dropoffDate}
                  min={pickupDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="font-['Space_Grotesk'] font-medium text-[15px] text-[#1C1917] bg-[#F5F5F4] rounded-[12px] px-4 py-3 min-h-[48px] border border-[#E7E5E4] focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all w-full"
                />
              </div>

              {/* Drop-off Time */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Manrope'] font-semibold text-[12px] text-[#A8A29E] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FBBF24]" />
                  Drop-off Time
                </label>
                <select
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="font-['Space_Grotesk'] font-medium text-[15px] text-[#1C1917] bg-[#F5F5F4] rounded-[12px] px-4 py-3 min-h-[48px] border border-[#E7E5E4] focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all appearance-none cursor-pointer w-full"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Search CTA */}
              <button
                onClick={handleSearch}
                id="booking-search-cta"
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] font-['Manrope'] font-bold text-[15px] rounded-full px-8 py-3.5 min-h-[48px] flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(251,191,36,0.35)] hover:shadow-[0_10px_30px_rgba(251,191,36,0.5)] cursor-pointer w-full md:w-auto mt-1 md:mt-0"
              >
                Search Bikes
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — THE EXPERIENCE (HOW IT WORKS)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#FFFDF8] py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-6 w-full">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-16 lg:mb-20">
            <span className="font-['Manrope'] font-medium text-[13px] text-[#A8A29E] uppercase tracking-[0.2em]">
              The Experience
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-[30px] md:text-[48px] lg:text-[64px] leading-tight md:leading-[1.1] tracking-tight text-[#1C1917] mt-3 md:mt-4">
              Three Steps to
              <br />
              <span className="text-[#FBBF24]">Freedom</span>
            </h2>
            <p className="font-['Manrope'] text-[14px] md:text-[16px] lg:text-[18px] leading-[1.65] text-[#57534E] mt-4 md:mt-5 max-w-[540px] mx-auto">
              We've stripped the rental experience down to the essentials.
              No friction, no paperwork — just you and the open road.
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: Bike,
                title: 'Select Your Ride',
                desc: 'Browse our curated fleet of premium motorcycles and scooters. Filter by style, city, and budget to find your perfect match.',
              },
              {
                step: '02',
                icon: Smartphone,
                title: 'Digital Handover',
                desc: 'Complete your booking online. Our staff brings the bike to you with a fully digital check-in — no paper, no queues.',
              },
              {
                step: '03',
                icon: Navigation,
                title: 'Hit The Road',
                desc: 'Helmet on, engine on, city yours. Return the bike when you\'re done with an equally seamless digital check-out.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative bg-white rounded-[16px] md:rounded-[20px] p-6 md:p-8 lg:p-10 border border-[#E7E5E4] hover:border-[#FBBF24]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* Step number */}
                <span className="font-['Space_Grotesk'] font-bold text-[48px] md:text-[64px] leading-none text-[#F5F5F4] group-hover:text-[#FEF3C7] transition-colors duration-300 absolute top-4 right-6 md:top-6 md:right-8 select-none">
                  {item.step}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-[12px] md:rounded-[14px] bg-[#FEF3C7] flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#FBBF24] transition-colors duration-300">
                  <item.icon size={22} className="text-[#1C1917] md:w-[26px] md:h-[26px]" />
                </div>

                {/* Content */}
                <h3 className="font-['Space_Grotesk'] font-semibold text-[20px] md:text-[22px] lg:text-[24px] text-[#1C1917] leading-tight mb-2 md:mb-3">
                  {item.title}
                </h3>
                <p className="font-['Manrope'] text-[14px] md:text-[15px] leading-[1.65] text-[#57534E]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — FEATURED COLLECTION (THE FLEET)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="fleet" className="bg-[#F5F5F4] py-16 md:py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-5 md:px-6 w-full">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-14 lg:mb-20">
            <div>
              <span className="font-['Manrope'] font-medium text-[13px] text-[#A8A29E] uppercase tracking-[0.2em]">
                Featured Collection
              </span>
              <h2 className="font-['Space_Grotesk'] font-bold text-[30px] md:text-[48px] lg:text-[64px] leading-tight md:leading-[1.1] tracking-tight text-[#1C1917] mt-3 md:mt-4">
                The Fleet
              </h2>
            </div>
            <Link
              to="/fleet"
              className="font-['Manrope'] font-semibold text-[15px] text-[#1C1917] border-b-2 border-[#FBBF24] pb-1 hover:text-[#F59E0B] transition-colors duration-200 flex items-center gap-2 self-start md:self-auto"
            >
              View All Bikes
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Fleet Cards — large premium layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {availableBikes.map((bike) => (
              <Link
                to={`/book/${bike.id}`}
                key={bike.id}
                className="group bg-white rounded-[16px] md:rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={bike.image_url}
                    alt={`${bike.make} ${bike.model}`}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tag */}
                  {bike.tag && (
                    <span className="absolute top-5 left-5 bg-[#FBBF24] text-[#1C1917] font-['Manrope'] font-semibold text-[11px] uppercase tracking-[0.1em] px-4 py-1.5 rounded-full">
                      {bike.tag}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 md:p-7 lg:p-8 flex flex-col gap-3 md:gap-4 flex-1">
                  {/* Make / Model */}
                  <div>
                    <p className="font-['Manrope'] text-[12px] text-[#A8A29E] uppercase tracking-[0.14em] mb-1">
                      {bike.make}
                    </p>
                    <h3 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] lg:text-[28px] text-[#1C1917] leading-tight">
                      {bike.model}
                    </h3>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-5 text-[#57534E]">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#A8A29E]" />
                      <span className="font-['Manrope'] text-[13px]">{bike.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-[#FBBF24] fill-[#FBBF24]" />
                      <span className="font-['Manrope'] text-[13px]">{bike.rating}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[#E7E5E4]" />

                  {/* Price + CTA */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-baseline">
                      <span className="font-['Space_Grotesk'] font-bold text-[26px] md:text-[32px] text-[#1C1917]">
                        ₹{bike.daily_rate}
                      </span>
                      <span className="font-['Manrope'] text-[14px] text-[#A8A29E] ml-1">/day</span>
                    </div>
                    <span className="bg-[#1C1917] group-hover:bg-[#FBBF24] text-white group-hover:text-[#1C1917] font-['Manrope'] font-semibold text-[12px] md:text-[13px] px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5">
                      Book Now
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — THE STANDARD (WHY US?)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="bg-[#1C1917] py-16 md:py-24 lg:py-32 pb-28 md:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-5 md:px-6 w-full">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-16 lg:mb-24">
            <span className="font-['Manrope'] font-medium text-[13px] text-[#78716C] uppercase tracking-[0.2em]">
              The Standard
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-[30px] md:text-[48px] lg:text-[72px] leading-tight md:leading-[1.05] tracking-tight text-white mt-3 md:mt-4">
              Why Riders
              <br />
              <span className="text-[#FBBF24]">Choose Us</span>
            </h2>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#292524] rounded-[16px] md:rounded-[20px] overflow-hidden">
            {[
              {
                icon: Smartphone,
                title: '100% Digital Handover',
                desc: 'From booking to return, every step happens on your phone. ID verification, damage logs, payment — all digital, all instant.',
              },
              {
                icon: BadgeCheck,
                title: 'Transparent Pricing',
                desc: 'What you see is what you pay. No hidden charges, no fuel deposits, no surprise fees. The price is the price — always.',
              },
              {
                icon: Sparkles,
                title: 'Pristine Condition',
                desc: 'Every bike goes through a 42-point inspection between rides. Freshly cleaned, fully serviced, and road-ready.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="group bg-[#1C1917] p-7 md:p-10 lg:p-14 flex flex-col gap-4 md:gap-6 hover:bg-[#292524] transition-colors duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#FBBF24]/30 flex items-center justify-center group-hover:border-[#FBBF24] group-hover:bg-[#FBBF24]/10 transition-all duration-300">
                  <pillar.icon size={24} className="text-[#FBBF24]" />
                </div>

                {/* Title */}
                <h3 className="font-['Space_Grotesk'] font-bold text-[20px] md:text-[24px] lg:text-[28px] text-white leading-tight">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="font-['Manrope'] text-[14px] md:text-[15px] leading-[1.7] text-[#A8A29E]">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-10 md:mt-16 lg:mt-20">
            <a
              href="#home"
              className="inline-flex items-center gap-2.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] font-['Manrope'] font-bold text-[15px] rounded-full px-10 py-4 transition-all shadow-[0_6px_24px_rgba(251,191,36,0.3)] hover:shadow-[0_10px_36px_rgba(251,191,36,0.45)]"
            >
              Start Your Ride
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
