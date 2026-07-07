import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import {
  QrCode,
  Plus,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  Wrench,
  Bike,
  Clock,
  User,
  ChevronRight,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// ── Self-contained mock schedule for "Today" ──────────────────────────
const todaySchedule = [
  {
    id: 'BK-041',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 98765 43210',
    bikeId: 'B-001',
    bikeName: 'Royal Enfield Continental GT 650',
    bikePlate: 'GJ-01-AB-1234',
    slot: '10:00 AM — Pickup',
    type: 'upcoming', // needs Verify & Handover
    amount: 1499,
    duration: '1 Day',
  },
  {
    id: 'BK-038',
    customerName: 'Priya Nair',
    customerPhone: '+91 87654 32109',
    bikeId: 'B-002',
    bikeName: 'Triumph Speed Twin',
    bikePlate: 'GJ-01-XY-9876',
    slot: '11:30 AM — Pickup',
    type: 'upcoming',
    amount: 4998,
    duration: '2 Days',
  },
  {
    id: 'BK-035',
    customerName: 'Aravind Sharma',
    customerPhone: '+91 76543 21098',
    bikeId: 'B-003',
    bikeName: 'Honda CB350',
    bikePlate: 'GJ-01-PQ-4567',
    slot: '02:00 PM — Drop-off due',
    type: 'active', // needs Process Return
    amount: 2997,
    duration: '3 Days',
  },
  {
    id: 'BK-032',
    customerName: 'Sneha Kulkarni',
    customerPhone: '+91 65432 10987',
    bikeId: 'S-001',
    bikeName: 'Ather 450X',
    bikePlate: 'GJ-01-EV-5555',
    slot: '04:30 PM — Drop-off due',
    type: 'active',
    amount: 1598,
    duration: '2 Days',
  },
  {
    id: 'BK-029',
    customerName: 'Karan Desai',
    customerPhone: '+91 54321 09876',
    bikeId: 'B-001',
    bikeName: 'Royal Enfield Continental GT 650',
    bikePlate: 'GJ-01-AB-1234',
    slot: '06:00 PM — Pickup',
    type: 'upcoming',
    amount: 2998,
    duration: '2 Days',
  },
];

export default function StaffDashboard() {
  const { fleet } = useRental();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'upcoming' | 'active'

  // ── Derived metrics ──
  const arrivalsToday = todaySchedule.filter((s) => s.type === 'upcoming').length;
  const departuresToday = todaySchedule.filter((s) => s.type === 'active').length;
  const maintenanceCount = fleet.filter((b) => b.status === 'In Maintenance').length;

  // ── Filtered schedule ──
  const filteredSchedule = todaySchedule.filter((entry) => {
    const matchesFilter = activeFilter === 'all' || entry.type === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      entry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.bikeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleVerifyHandover = (bookingId) => {
    navigate('/staff/pickup', { state: { bookingId } });
  };

  const handleProcessReturn = (bookingId) => {
    navigate('/staff/return');
  };

  const handleWalkinBooking = () => {
    navigate('/staff/walk-in');
  };

  const handleScanQR = () => {
    const input = prompt('Enter Booking ID (e.g. BK-041):');
    if (input) {
      const found = todaySchedule.find(
        (s) => s.id.toLowerCase() === input.trim().toLowerCase()
      );
      if (found) {
        alert(`✅ Booking found: ${found.id} — ${found.customerName} (${found.bikeName})`);
      } else {
        alert(`❌ No booking found for ID: ${input}`);
      }
    }
  };

  // ── Time greeting ──
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-8 font-['Manrope'] text-[#1C1917]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 w-full">

        {/* ════════════════════════════════════════════════════════ */}
        {/*  HEADER                                                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="pt-6 pb-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-green-600">
                Branch Live — Ahmedabad Hub
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[32px] tracking-tight leading-tight">
              {greeting}, Staff<span className="text-[#FBBF24]">.</span>
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#57534E] font-medium mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Notification bell */}
          <button className="relative w-11 h-11 rounded-full border border-[#E7E5E4] bg-white flex items-center justify-center text-[#57534E] hover:border-[#FBBF24] hover:text-[#1C1917] transition-all cursor-pointer self-start sm:self-auto shrink-0">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  METRICS STRIP                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
          {/* Arrivals Today */}
          <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-4 sm:p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
              <CalendarCheck size={20} />
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-[26px] sm:text-[30px] font-bold leading-none">
                {arrivalsToday}
              </span>
              <p className="text-[11px] sm:text-[12px] text-[#A8A29E] font-bold uppercase tracking-wider mt-1">
                Arrivals today
              </p>
            </div>
          </div>

          {/* Departures Today */}
          <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-4 sm:p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-blue-50 flex items-center justify-center text-blue-600">
              <CalendarClock size={20} />
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-[26px] sm:text-[30px] font-bold leading-none">
                {departuresToday}
              </span>
              <p className="text-[11px] sm:text-[12px] text-[#A8A29E] font-bold uppercase tracking-wider mt-1">
                Returns due
              </p>
            </div>
          </div>

          {/* In Maintenance */}
          <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-4 sm:p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-amber-50 flex items-center justify-center text-[#F59E0B]">
              <Wrench size={20} />
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-[26px] sm:text-[30px] font-bold leading-none">
                {maintenanceCount}
              </span>
              <p className="text-[11px] sm:text-[12px] text-[#A8A29E] font-bold uppercase tracking-wider mt-1">
                In maintenance
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  QUICK ACTIONS                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
          <button
            onClick={handleWalkinBooking}
            className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] rounded-full py-4 sm:py-5 px-5 font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] active:scale-[0.97]"
          >
            <Plus size={20} strokeWidth={2.5} />
            Walk-in Booking
          </button>

          <button
            onClick={handleScanQR}
            className="bg-[#1C1917] hover:bg-[#37312F] text-white rounded-full py-4 sm:py-5 px-5 font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(28,25,23,0.15)] active:scale-[0.97]"
          >
            <QrCode size={20} strokeWidth={2.5} />
            Scan QR / Enter ID
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  TODAY'S SCHEDULE                                        */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="mt-8">
          {/* Section header + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-['Space_Grotesk'] font-bold text-[20px] sm:text-[22px] tracking-tight">
              Today's Schedule
            </h2>

            {/* Search bar */}
            <div className="relative w-full sm:w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Search by name, ID, bike…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E7E5E4] rounded-full pl-10 pr-4 py-2.5 text-[13px] font-medium text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 transition-all"
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5">
            {[
              { key: 'all', label: 'All', count: todaySchedule.length },
              { key: 'upcoming', label: 'Arrivals', count: arrivalsToday },
              { key: 'active', label: 'Returns', count: departuresToday },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === tab.key
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#1C1917]/30'
                }`}
              >
                {tab.label}
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeFilter === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F5F5F4] text-[#A8A29E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Schedule cards */}
          <div className="flex flex-col gap-3">
            {filteredSchedule.length === 0 ? (
              <div className="bg-white rounded-[18px] border border-[#E7E5E4] p-10 text-center">
                <Search size={36} className="text-[#A8A29E] mx-auto mb-3" />
                <h3 className="font-['Space_Grotesk'] font-semibold text-[17px] text-[#1C1917]">
                  No matching bookings
                </h3>
                <p className="text-[13px] text-[#57534E] mt-1">
                  Try a different filter or search term.
                </p>
              </div>
            ) : (
              filteredSchedule.map((entry) => {
                const isUpcoming = entry.type === 'upcoming';

                return (
                  <div
                    key={entry.id}
                    className="bg-white border border-[#E7E5E4] rounded-[18px] p-4 sm:p-5 transition-all hover:border-[#FBBF24]/40"
                  >
                    {/* Top row: Status badge + Booking ID */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-wider ${
                          isUpcoming
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isUpcoming ? 'bg-[#F59E0B]' : 'bg-blue-500'
                          }`}
                        />
                        {isUpcoming ? 'Pickup' : 'Active Rental'}
                      </span>
                      <span className="text-[12px] font-mono font-semibold text-[#A8A29E]">
                        {entry.id}
                      </span>
                    </div>

                    {/* Middle: Customer + Bike details */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      {/* Customer */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F4] border border-[#E7E5E4] flex items-center justify-center text-[#57534E] shrink-0">
                          <User size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[14px] sm:text-[15px] text-[#1C1917] truncate">
                            {entry.customerName}
                          </p>
                          <p className="text-[12px] text-[#A8A29E] font-medium">
                            {entry.customerPhone}
                          </p>
                        </div>
                      </div>

                      {/* Bike */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[#57534E] shrink-0">
                          <Bike size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[14px] text-[#1C1917] truncate">
                            {entry.bikeName}
                          </p>
                          <p className="text-[12px] text-[#A8A29E] font-mono font-medium uppercase">
                            {entry.bikePlate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: Slot time + Duration + Amount + Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3.5 border-t border-[#E7E5E4]/70">
                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#57534E] bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-1.5 rounded-full">
                          <Clock size={13} />
                          {entry.slot}
                        </span>
                        <span className="text-[12px] font-semibold text-[#57534E] bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-1.5 rounded-full">
                          {entry.duration}
                        </span>
                        <span className="text-[12px] font-bold text-[#1C1917] bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-1.5 rounded-full">
                          ₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* CTA */}
                      {isUpcoming ? (
                        <button
                          onClick={() => handleVerifyHandover(entry.id)}
                          className="w-full sm:w-auto bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] px-5 py-2.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97] shadow-[0_2px_10px_rgba(251,191,36,0.2)]"
                        >
                          <CheckCircle2 size={16} />
                          Verify & Handover
                        </button>
                      ) : (
                        <Link
                          to="/staff/return"
                          className="w-full sm:w-auto bg-[#1C1917] hover:bg-[#37312F] text-white px-5 py-2.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97]"
                        >
                          <ArrowRight size={16} />
                          Process Return
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  BOTTOM NAV (Mobile-first quick access)                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="mt-8 pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
          <Link
            to="/"
            className="text-[13px] font-semibold text-[#A8A29E] hover:text-[#1C1917] transition-colors flex items-center gap-1.5"
          >
            ← Back to Home
          </Link>
          <Link
            to="/admin/dashboard"
            className="text-[13px] font-semibold text-[#A8A29E] hover:text-[#1C1917] transition-colors flex items-center gap-1.5"
          >
            Admin Panel
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
