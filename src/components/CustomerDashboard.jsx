import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Award,
  X,
  AlertTriangle,
  CheckCircle2,
  Timer,
  MapPin,
  Bike,
  ChevronRight,
  ShieldAlert,
  CalendarPlus,
  Ban,
} from 'lucide-react';

// ── Self-contained mock schedule data ──────────────────────────────────
const mockUpcoming = [
  {
    id: 'BK-048',
    bikeName: 'Royal Enfield Continental GT 650',
    bikePlate: 'GJ-01-AB-1234',
    bikeImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-07-09T10:00:00',
    dropoffDate: '2026-07-11T10:00:00',
    location: 'Ahmedabad Hub',
    totalPaid: 2998,
    duration: '2 Days',
  },
  {
    id: 'BK-052',
    bikeName: 'Honda CB350',
    bikePlate: 'GJ-01-PQ-4567',
    bikeImage: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-07-14T11:00:00',
    dropoffDate: '2026-07-15T11:00:00',
    location: 'Bangalore Hub',
    totalPaid: 999,
    duration: '1 Day',
  },
];

const mockActive = [
  {
    id: 'BK-044',
    bikeName: 'Triumph Speed Twin',
    bikePlate: 'GJ-01-XY-9876',
    bikeImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-07-05T10:00:00',
    dropoffDate: '2026-07-08T10:00:00',
    location: 'Mumbai Hub',
    totalPaid: 7497,
    duration: '3 Days',
    odometerStart: 12450,
  },
];

const mockPast = [
  {
    id: 'BK-031',
    bikeName: 'Ather 450X',
    bikePlate: 'GJ-01-EV-5555',
    bikeImage: 'https://images.unsplash.com/photo-1621008011210-e5dbdf91f2cc?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-06-28T10:00:00',
    dropoffDate: '2026-06-30T10:00:00',
    location: 'Ahmedabad Hub',
    totalPaid: 1598,
    duration: '2 Days',
    rating: 5,
  },
  {
    id: 'BK-025',
    bikeName: 'Royal Enfield Continental GT 650',
    bikePlate: 'GJ-01-AB-1234',
    bikeImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-06-20T14:00:00',
    dropoffDate: '2026-06-22T14:00:00',
    location: 'Ahmedabad Hub',
    totalPaid: 2998,
    duration: '2 Days',
    rating: 4,
  },
  {
    id: 'BK-018',
    bikeName: 'Honda CB350',
    bikePlate: 'GJ-01-PQ-4567',
    bikeImage: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=800',
    pickupDate: '2026-06-12T10:00:00',
    dropoffDate: '2026-06-13T10:00:00',
    location: 'Bangalore Hub',
    totalPaid: 999,
    duration: '1 Day',
    rating: 5,
  },
];

// ── Date formatter utility ─────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return 'TBD';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Star renderer ──────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-[14px] ${i <= count ? 'text-[#FBBF24]' : 'text-[#E7E5E4]'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState(null); // booking object or null
  const [cancelConfirmed, setCancelConfirmed] = useState([]);

  // Also pull real bookings from context and merge
  const { bookings, fleet } = useRental();

  // Build combined lists — context bookings first, then mock fallbacks
  const contextUpcoming = bookings
    .filter((b) => b.status === 'Upcoming')
    .map((b) => {
      const bike = fleet.find((f) => f.id === b.bikeId);
      return {
        id: b.id,
        bikeName: bike ? `${bike.make} ${bike.model}` : 'Unknown Bike',
        bikePlate: bike?.number_plate || '—',
        bikeImage: bike?.image_url || '',
        pickupDate: b.dates?.start || '',
        dropoffDate: b.dates?.end || '',
        location: bike?.location || 'Branch',
        totalPaid: b.totalAmount,
        duration: '—',
      };
    });

  const allUpcoming = [...contextUpcoming, ...mockUpcoming].filter(
    (b) => !cancelConfirmed.includes(b.id)
  );

  const contextActive = bookings
    .filter((b) => b.status === 'Active')
    .map((b) => {
      const bike = fleet.find((f) => f.id === b.bikeId);
      return {
        id: b.id,
        bikeName: bike ? `${bike.make} ${bike.model}` : 'Unknown Bike',
        bikePlate: bike?.number_plate || '—',
        bikeImage: bike?.image_url || '',
        pickupDate: b.dates?.start || '',
        dropoffDate: b.dates?.end || '',
        location: bike?.location || 'Branch',
        totalPaid: b.totalAmount,
        duration: '—',
      };
    });

  const allActive = [...contextActive, ...mockActive];

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: allUpcoming.length },
    { key: 'active', label: 'Active', count: allActive.length },
    { key: 'past', label: 'Past', count: mockPast.length },
  ];

  const handleCancelClick = (booking) => {
    setCancelModal(booking);
  };

  const handleConfirmCancel = () => {
    if (cancelModal) {
      setCancelConfirmed((prev) => [...prev, cancelModal.id]);
      setCancelModal(null);
      alert(`Booking ${cancelModal.id} has been cancelled. Refund will be processed per cancellation policy.`);
    }
  };

  const handleExtendTrip = (bookingId) => {
    alert(`🔍 Checking availability for extension on booking ${bookingId}… Please contact the branch for confirmation.`);
  };

  // Check if pickup is within 24 hours
  const isWithin24Hours = (pickupDate) => {
    if (!pickupDate) return false;
    const diff = new Date(pickupDate).getTime() - Date.now();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-24 font-['Manrope'] text-[#1C1917]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 w-full">

        {/* ── HEADER ────────────────────────────────────────────── */}
        <div className="pt-6 sm:pt-10 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-[14px] text-[#57534E] hover:text-[#1C1917] transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to fleet
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[36px] tracking-tight leading-tight">
                My Bookings<span className="text-[#FBBF24]">.</span>
              </h1>
              <p className="text-[14px] text-[#57534E] font-medium mt-1">
                Manage reservations, track active rides, and review past trips.
              </p>
            </div>

            {/* Loyalty badge */}
            <div className="flex items-center gap-2.5 bg-[#FEF3C7] px-4 py-2.5 rounded-full border border-[#FBBF24]/25 w-fit shrink-0">
              <Award size={18} className="text-[#F59E0B]" />
              <span className="text-[12px] font-bold text-[#92400E] uppercase tracking-wider">
                Gold Rider
              </span>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────── */}
        <div className="mt-6 flex gap-1 bg-[#F5F5F4] p-1 rounded-full w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-white text-[#1C1917] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#A8A29E] hover:text-[#57534E]'
              }`}
            >
              {tab.label}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  activeTab === tab.key
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-[#E7E5E4] text-[#A8A29E]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/*  UPCOMING TAB                                             */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'upcoming' && (
          <div className="mt-6 flex flex-col gap-4">
            {allUpcoming.length === 0 ? (
              <EmptyState
                icon={<Calendar size={40} />}
                title="No upcoming bookings"
                subtitle="Browse our fleet and book your next adventure."
              />
            ) : (
              allUpcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative md:w-[260px] shrink-0 h-[200px] md:h-auto bg-[#F5F5F4]">
                    <img
                      src={booking.bikeImage}
                      alt={booking.bikeName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Upcoming
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="text-[12px] font-mono font-semibold text-[#A8A29E]">
                          {booking.id}
                        </span>
                        <h3 className="font-['Space_Grotesk'] font-bold text-[20px] sm:text-[22px] text-[#1C1917] mt-0.5 leading-tight">
                          {booking.bikeName}
                        </h3>
                        <p className="text-[12px] text-[#A8A29E] font-mono font-medium uppercase mt-0.5">
                          {booking.bikePlate}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[12px] text-[#A8A29E] font-medium">Total Paid</span>
                        <p className="font-['Space_Grotesk'] text-[22px] font-bold text-[#1C1917]">
                          ₹{(booking.totalPaid || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2">
                      <MetaChip icon={<Calendar size={13} />} label={`Pickup: ${formatDate(booking.pickupDate)}`} />
                      <MetaChip icon={<Clock size={13} />} label={`Return: ${formatDate(booking.dropoffDate)}`} />
                      <MetaChip icon={<Timer size={13} />} label={booking.duration} />
                      <MetaChip icon={<MapPin size={13} />} label={booking.location} />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E7E5E4]/70">
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                      >
                        <Ban size={15} />
                        Cancel Booking
                      </button>
                      <Link
                        to={`/book/${booking.id}`}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] text-white hover:bg-[#37312F] text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                      >
                        View Details
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/*  ACTIVE TAB                                               */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'active' && (
          <div className="mt-6 flex flex-col gap-4">
            {allActive.length === 0 ? (
              <EmptyState
                icon={<Bike size={40} />}
                title="No active rentals"
                subtitle="You don't have any bikes out on the road right now."
              />
            ) : (
              allActive.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative md:w-[260px] shrink-0 h-[200px] md:h-auto bg-[#F5F5F4]">
                    <img
                      src={booking.bikeImage}
                      alt={booking.bikeName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      On Ride
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="text-[12px] font-mono font-semibold text-[#A8A29E]">
                          {booking.id}
                        </span>
                        <h3 className="font-['Space_Grotesk'] font-bold text-[20px] sm:text-[22px] text-[#1C1917] mt-0.5 leading-tight">
                          {booking.bikeName}
                        </h3>
                        <p className="text-[12px] text-[#A8A29E] font-mono font-medium uppercase mt-0.5">
                          {booking.bikePlate}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[12px] text-[#A8A29E] font-medium">Total Paid</span>
                        <p className="font-['Space_Grotesk'] text-[22px] font-bold text-[#1C1917]">
                          ₹{(booking.totalPaid || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2">
                      <MetaChip icon={<Calendar size={13} />} label={`Pickup: ${formatDate(booking.pickupDate)}`} />
                      <MetaChip icon={<Clock size={13} />} label={`Due: ${formatDate(booking.dropoffDate)}`} />
                      <MetaChip icon={<Timer size={13} />} label={booking.duration} />
                      <MetaChip icon={<MapPin size={13} />} label={booking.location} />
                    </div>

                    {/* Active ride progress bar (visual indicator) */}
                    <div className="bg-[#FAFAF9] rounded-[12px] border border-[#E7E5E4] p-3.5">
                      <div className="flex items-center justify-between text-[12px] font-semibold text-[#57534E] mb-2">
                        <span>Trip progress</span>
                        <span className="text-[#1C1917]">Day 2 of 3</span>
                      </div>
                      <div className="w-full h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] rounded-full transition-all duration-700" style={{ width: '66%' }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-[#E7E5E4]/70">
                      <button
                        onClick={() => handleExtendTrip(booking.id)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1C1917] text-[#1C1917] hover:bg-[#F5F5F4] text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                      >
                        <CalendarPlus size={15} />
                        Extend Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/*  PAST TAB                                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'past' && (
          <div className="mt-6 flex flex-col gap-4">
            {mockPast.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 size={40} />}
                title="No ride history"
                subtitle="Your completed trips will appear here."
              />
            ) : (
              mockPast.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative md:w-[260px] shrink-0 h-[200px] md:h-auto bg-[#F5F5F4]">
                    <img
                      src={booking.bikeImage}
                      alt={booking.bikeName}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute top-3 left-3 bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="text-[12px] font-mono font-semibold text-[#A8A29E]">
                          {booking.id}
                        </span>
                        <h3 className="font-['Space_Grotesk'] font-bold text-[20px] sm:text-[22px] text-[#1C1917] mt-0.5 leading-tight">
                          {booking.bikeName}
                        </h3>
                        <p className="text-[12px] text-[#A8A29E] font-mono font-medium uppercase mt-0.5">
                          {booking.bikePlate}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[12px] text-[#A8A29E] font-medium">Total Paid</span>
                        <p className="font-['Space_Grotesk'] text-[22px] font-bold text-[#1C1917]">
                          ₹{(booking.totalPaid || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Meta + Rating */}
                    <div className="flex flex-wrap items-center gap-2">
                      <MetaChip icon={<Calendar size={13} />} label={`${formatDate(booking.pickupDate)} → ${formatDate(booking.dropoffDate)}`} />
                      <MetaChip icon={<Timer size={13} />} label={booking.duration} />
                      <MetaChip icon={<MapPin size={13} />} label={booking.location} />
                    </div>

                    {/* Rating & Rebook */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#E7E5E4]/70">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#57534E] font-semibold">Your rating:</span>
                        <Stars count={booking.rating} />
                      </div>
                      <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] text-[13px] font-semibold transition-all duration-200 cursor-pointer shadow-[0_2px_10px_rgba(251,191,36,0.2)]"
                      >
                        Book Again
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  CANCELLATION POLICY MODAL                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {cancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCancelModal(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-[22px] w-full max-w-[440px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-[modalIn_0.3s_ease-out]">
            {/* Close button */}
            <button
              onClick={() => setCancelModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#E7E5E4] flex items-center justify-center text-[#57534E] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={26} className="text-red-500" />
            </div>

            <h3 className="font-['Space_Grotesk'] font-bold text-[22px] text-center text-[#1C1917] leading-tight">
              Cancel this booking?
            </h3>
            <p className="text-center text-[14px] text-[#57534E] mt-2 mb-6">
              Booking <strong className="font-mono">{cancelModal.id}</strong> — {cancelModal.bikeName}
            </p>

            {/* Policy card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[14px] p-4 mb-6">
              <h4 className="font-semibold text-[13px] text-[#92400E] uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert size={15} />
                Cancellation Policy
              </h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-[#78350F]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                  <span>
                    <strong>Standard cancellation:</strong> 30% of the total booking amount will be deducted as a penalty.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Within 24 hours of pickup:</strong> 60% penalty applies due to last-minute inventory loss.
                  </span>
                </li>
              </ul>

              {/* Dynamic penalty display */}
              {isWithin24Hours(cancelModal.pickupDate) ? (
                <div className="mt-3 pt-3 border-t border-[#FDE68A] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-red-600 uppercase tracking-wider">
                    ⚠ 24-Hour Penalty Applies
                  </span>
                  <span className="font-['Space_Grotesk'] font-bold text-[18px] text-red-600">
                    −₹{Math.round((cancelModal.totalPaid || 0) * 0.6).toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-[#FDE68A] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#92400E] uppercase tracking-wider">
                    Standard Penalty
                  </span>
                  <span className="font-['Space_Grotesk'] font-bold text-[18px] text-[#92400E]">
                    −₹{Math.round((cancelModal.totalPaid || 0) * 0.3).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCancel}
                className="w-full py-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-[14px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Ban size={16} />
                Confirm Cancellation
              </button>
              <button
                onClick={() => setCancelModal(null)}
                className="w-full py-3.5 rounded-full bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#1C1917] font-semibold text-[14px] transition-all duration-200 cursor-pointer"
              >
                Keep My Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animation keyframe */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Reusable sub-components ───────────────────────────────────────────

function MetaChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#57534E] bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-1.5 rounded-full">
      {icon}
      {label}
    </span>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-[18px] border border-[#E7E5E4] p-12 text-center">
      <div className="text-[#A8A29E] mx-auto mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="font-['Space_Grotesk'] font-semibold text-[18px] text-[#1C1917]">
        {title}
      </h3>
      <p className="text-[13px] text-[#57534E] mt-1.5 max-w-[320px] mx-auto">
        {subtitle}
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center gap-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] px-6 py-2.5 rounded-full font-semibold text-[13px] transition-all"
      >
        Browse Fleet
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}
