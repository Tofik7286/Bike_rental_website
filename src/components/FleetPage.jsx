import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  ArrowRight,
  Bike,
  Zap,
  SlidersHorizontal,
  Search,
  Wrench,
  CalendarDays,
  Clock,
  X,
} from 'lucide-react';
import { useRental } from '../context/RentalContext';

const filters = [
  { key: 'all', label: 'All Rides' },
  { key: 'Motorcycle', label: 'Motorcycles' },
  { key: 'Scooter', label: 'Scooters' },
];

// Format "2026-07-07" → "07 Jul 2026"
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Format "18:00" → "6:00 PM"
function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
}

export default function FleetPage() {
  const { fleet } = useRental();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Read booking params from URL
  const pickupDate = searchParams.get('pickupDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '';
  const dropoffDate = searchParams.get('dropoffDate') || '';
  const dropoffTime = searchParams.get('dropoffTime') || '';
  const hasBookingParams = pickupDate && dropoffDate;

  // Calculate rental duration in days
  let rentalDays = 1;
  if (hasBookingParams) {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    rentalDays = diff < 1 ? 1 : diff;
  }

  // Clear booking filters
  const clearBookingParams = () => {
    setSearchParams({});
  };

  // Build booking query string for Book Now links
  const bookingQuery = hasBookingParams
    ? `?pickupDate=${pickupDate}&pickupTime=${pickupTime}&dropoffDate=${dropoffDate}&dropoffTime=${dropoffTime}`
    : '';

  // Filter logic
  const filteredFleet = fleet.filter((bike) => {
    const matchesCategory =
      activeFilter === 'all' || bike.category === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      `${bike.make} ${bike.model}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableCount = filteredFleet.filter(
    (b) => b.status === 'Available'
  ).length;

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-28 md:pb-10 font-['Manrope']">
      {/* ────────────────────────────────────────────── */}
      {/*  Hero Header                                   */}
      {/* ────────────────────────────────────────────── */}
      <div className="bg-[#1C1917] relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FBBF24]/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#FBBF24]/5 blur-3xl" />

        <div className="max-w-[1320px] mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
            <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-[#FBBF24]">
              Explore Our Collection
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] font-bold text-[36px] md:text-[52px] text-white leading-[1.1] tracking-tight">
            Choose Your Ride<span className="text-[#FBBF24]">.</span>
          </h1>
          <p className="mt-4 text-[15px] md:text-[16px] text-white/50 font-medium max-w-[520px] leading-relaxed">
            From city scooters to highway beasts — hand-picked, meticulously
            maintained, ready for your next adventure.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex items-center gap-6 md:gap-10">
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
                {fleet.length}
              </span>
              <span className="text-[11px] text-white/35 font-semibold uppercase tracking-wider">
                Total Fleet
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[26px] font-bold text-[#FBBF24]">
                {fleet.filter((b) => b.status === 'Available').length}
              </span>
              <span className="text-[11px] text-white/35 font-semibold uppercase tracking-wider">
                Available Now
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[26px] font-bold text-white">
                ₹349
              </span>
              <span className="text-[11px] text-white/35 font-semibold uppercase tracking-wider">
                Starting At
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────── */}
      {/*  Booking Summary Strip (when dates selected)   */}
      {/* ────────────────────────────────────────────── */}
      {hasBookingParams && (
        <div className="bg-[#FEF3C7] border-b border-[#FBBF24]/30">
          <div className="max-w-[1320px] mx-auto px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#1C1917]">
              {/* Pickup */}
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[#92400E]" />
                <span className="text-[13px] font-semibold">
                  {formatDate(pickupDate)}
                </span>
                {pickupTime && (
                  <span className="text-[12px] text-[#92400E] font-medium flex items-center gap-1">
                    <Clock size={11} />
                    {formatTime(pickupTime)}
                  </span>
                )}
              </div>

              <ArrowRight size={14} className="text-[#92400E]" />

              {/* Dropoff */}
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[#92400E]" />
                <span className="text-[13px] font-semibold">
                  {formatDate(dropoffDate)}
                </span>
                {dropoffTime && (
                  <span className="text-[12px] text-[#92400E] font-medium flex items-center gap-1">
                    <Clock size={11} />
                    {formatTime(dropoffTime)}
                  </span>
                )}
              </div>

              {/* Duration badge */}
              <span className="bg-[#1C1917] text-[#FBBF24] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            {/* Clear button */}
            <button
              onClick={clearBookingParams}
              className="flex items-center gap-1 text-[12px] font-semibold text-[#92400E] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <X size={13} />
              Clear dates
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/*  Search & Filter Bar                           */}
      {/* ────────────────────────────────────────────── */}
      <div className="max-w-[1320px] mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-6 -mt-6 md:-mt-8 relative z-20">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
            />
            <input
              type="text"
              placeholder="Search bikes… e.g. Royal Enfield, Activa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E7E5E4] rounded-full pl-11 pr-4 py-3 text-[14px] font-['Manrope'] font-medium text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#A8A29E] mr-1" />
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === f.key
                    ? 'bg-[#1C1917] text-white shadow-md'
                    : 'bg-white text-[#57534E] border border-[#E7E5E4] hover:border-[#1C1917] hover:text-[#1C1917]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[13px] text-[#A8A29E] font-medium">
            Showing{' '}
            <span className="text-[#1C1917] font-semibold">
              {availableCount}
            </span>{' '}
            available of{' '}
            <span className="text-[#1C1917] font-semibold">
              {filteredFleet.length}
            </span>{' '}
            vehicles
          </span>
        </div>

        {/* ────────────────────────────────────────────── */}
        {/*  Fleet Grid                                    */}
        {/* ────────────────────────────────────────────── */}
        {filteredFleet.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-[#E7E5E4] mb-4" />
            <h3 className="font-['Space_Grotesk'] font-bold text-[22px] text-[#1C1917]">
              No rides found
            </h3>
            <p className="text-[14px] text-[#A8A29E] mt-2">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {filteredFleet.map((bike) => {
              const isAvailable = bike.status === 'Available';

              return (
                <div
                  key={bike.id}
                  className={`bg-white rounded-[18px] border border-[#E7E5E4] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-300 group overflow-hidden flex flex-col ${
                    !isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F5F5F4]">
                    <img
                      src={bike.image_url}
                      alt={`${bike.make} ${bike.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag Badge */}
                    {bike.tag && (
                      <span
                        className={`absolute top-4 left-4 font-['Manrope'] font-bold text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-full ${
                          bike.tag === 'Electric'
                            ? 'bg-emerald-500 text-white'
                            : bike.tag === 'Premium'
                              ? 'bg-[#1C1917] text-[#FBBF24]'
                              : 'bg-[#FBBF24] text-[#1C1917]'
                        }`}
                      >
                        {bike.tag === 'Electric' && (
                          <Zap
                            size={10}
                            className="inline mr-1 -mt-[1px]"
                          />
                        )}
                        {bike.tag}
                      </span>
                    )}

                    {/* Category Badge */}
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#57534E] font-['Manrope'] font-semibold text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Bike size={11} />
                      {bike.category}
                    </span>

                    {/* Maintenance Overlay */}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-[#1C1917]/50 flex items-center justify-center">
                        <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-[12px] font-bold text-[#57534E] flex items-center gap-1.5">
                          <Wrench size={13} />
                          {bike.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                    {/* Title */}
                    <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#1C1917] leading-tight">
                      {bike.make}{' '}
                      <span className="font-semibold">{bike.model}</span>
                    </h3>

                    {/* Meta Row */}
                    <div className="flex items-center gap-4 text-[#57534E]">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#A8A29E]" />
                        <span className="text-[12px] font-medium">
                          {bike.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="text-[#FBBF24] fill-[#FBBF24]"
                        />
                        <span className="text-[12px] font-semibold">
                          {bike.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A8A29E] font-medium">
                        {bike.number_plate}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-[#E7E5E4] my-1" />

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-['Space_Grotesk'] font-bold text-[26px] text-[#1C1917]">
                            ₹{bike.daily_rate.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[13px] text-[#A8A29E] font-medium ml-1">
                            /day
                          </span>
                        </div>
                        {hasBookingParams && (
                          <span className="text-[12px] text-[#57534E] font-semibold">
                            Est. total:{' '}
                            <span className="text-[#1C1917]">
                              ₹{(bike.daily_rate * rentalDays).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[#A8A29E] font-medium"> for {rentalDays}d</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book Now Button */}
                    {isAvailable ? (
                      <Link
                        to={`/book/${bike.id}${bookingQuery}`}
                        className="mt-1 w-full bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] py-3 rounded-full font-semibold text-[14px] transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.45)] flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        Book Now
                        <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="mt-1 w-full bg-[#F5F5F4] text-[#A8A29E] py-3 rounded-full font-semibold text-[14px] cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Wrench size={14} />
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
