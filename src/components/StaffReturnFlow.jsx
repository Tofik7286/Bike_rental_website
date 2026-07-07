import { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle2, Navigation, AlertTriangle, Hammer, Check } from 'lucide-react';

export default function StaffReturnFlow() {
  const { bookings, fleet, completeBooking, updateBikeStatus } = useRental();

  // Mock an active booking if none exists in the state for demo purposes
  const getActiveBooking = () => {
    const active = bookings.find((b) => b.status === 'Upcoming');
    if (active) return active;

    // Fallback Mock Active Booking (Overdue for testing late fee calculation)
    const scheduledEnd = new Date();
    scheduledEnd.setHours(scheduledEnd.getHours() - 3); // 3 hours ago (overdue)

    const scheduledStart = new Date();
    scheduledStart.setDate(scheduledStart.getDate() - 1);

    return {
      id: 'BK-MOCK-99',
      bikeId: 'B-002', // Triumph Speed Twin
      dates: {
        start: scheduledStart.toISOString(),
        end: scheduledEnd.toISOString(),
      },
      totalAmount: 2949,
      userDetails: {
        name: 'Devendra Patel',
        email: 'devendra@patel.com',
      },
      status: 'Upcoming',
    };
  };

  const booking = getActiveBooking();
  const bike = fleet.find((b) => b.id === booking.bikeId) || {
    id: 'B-002',
    make: 'Triumph',
    model: 'Speed Twin',
    number_plate: 'GJ-01-XY-9876',
    daily_rate: 2499,
    status: 'On Rent',
    location: 'Ahmedabad Hub',
    rating: 4.8,
    image_url: '/images/bike-triumph.png',
  };

  // State variables for odometer and damages
  const [initialOdo] = useState(12450); // initial odometer when rented
  const [finalOdo, setFinalOdo] = useState(12580);
  const [damageMemo, setDamageMemo] = useState('');
  const [damageCost, setDamageCost] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  // Late calculation states
  const [returnTime, setReturnTime] = useState(new Date());
  const [lateHours, setLateHours] = useState(0);
  const [lateFee, setLateFee] = useState(0);
  const [isBufferActive, setIsBufferActive] = useState(false);
  const [bufferEndTime, setBufferEndTime] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const LATE_FEE_PER_HOUR = 250; // Predefined per-hour late fee penalty

  // Recalculate late fees based on selected return date/time
  useEffect(() => {
    const scheduledEnd = new Date(booking.dates.end);
    const diffMs = returnTime - scheduledEnd;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 1) {
      // Returned after the 1-hour grace period
      const chargeableHours = Math.ceil(diffHours);
      setLateHours(chargeableHours);
      setLateFee(chargeableHours * LATE_FEE_PER_HOUR);
    } else {
      setLateHours(0);
      setLateFee(0);
    }
  }, [returnTime, booking.dates.end]);

  const totalOutstanding = lateFee + Number(damageCost);

  // Helper to adjust return time for demo purposes (to test on-time vs overdue)
  const adjustReturnTime = (hoursOffset) => {
    const adjusted = new Date();
    adjusted.setHours(adjusted.getHours() + hoursOffset);
    setReturnTime(adjusted);
  };

  // Auto-Buffer Trigger: Locks the vehicle for cleaning/maintenance for the next 2 hours
  const triggerAutoBuffer = (bikeId) => {
    updateBikeStatus(bikeId, 'In Maintenance'); // Set bike to maintenance during buffer
    setIsBufferActive(true);

    const bufferEnd = new Date();
    bufferEnd.setHours(bufferEnd.getHours() + 2);
    setBufferEndTime(
      bufferEnd.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();

    if (finalOdo < initialOdo) {
      alert('Final odometer reading cannot be less than initial reading.');
      return;
    }

    if (totalOutstanding > 0 && !isPaid) {
      alert('Pending payments must be settled before closing the booking.');
      return;
    }

    // Call context completion
    completeBooking(booking.id, lateFee, damageMemo || 'None');
    
    // Trigger the Auto-Buffer system
    triggerAutoBuffer(bike.id);
    
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="bg-[#FFFDF8] min-h-screen pt-[120px] pb-12 flex items-center justify-center">
        <div className="max-w-[600px] w-full mx-6 bg-white border border-[#E7E5E4] rounded-[18px] p-8 text-center">
          <div className="w-[80px] h-[80px] rounded-full bg-green-50 text-[#22C55E] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="fill-[#FFFDF8]" />
          </div>

          <h2 className="font-['Space_Grotesk'] text-[30px] font-bold text-[#1C1917] tracking-tight">
            Booking Closed Successfully
          </h2>
          <p className="font-['Manrope'] text-[15px] text-[#57534E] mt-3">
            Booking <strong>{booking.id}</strong> has been finalized. All receipts and logs are locked.
          </p>

          {/* Auto-Buffer Indicator Box */}
          {isBufferActive && (
            <div className="bg-[#FEF3C7] border border-[#FBBF24]/30 rounded-[14px] p-6 text-left my-8 flex items-start gap-4">
              <Clock className="text-[#F59E0B] shrink-0 mt-0.5" size={20} />
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">
                  Auto-Cleaning Buffer Activated
                </span>
                <span className="font-['Manrope'] text-[13px] text-[#57534E] mt-1">
                  Machine <strong>{bike.make} {bike.model} ({bike.number_plate})</strong> is locked for the next 2 hours for inspection and detailing. Available at <strong>{bufferEndTime}</strong>.
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="bg-[#1C1917] text-white hover:bg-[#37312F] py-3.5 rounded-full font-['Manrope'] font-semibold text-[14px] transition-all cursor-pointer block"
            >
              Go to Homepage
            </Link>
            <button
              onClick={() => {
                // Reset flow
                setIsCompleted(false);
                setIsBufferActive(false);
                setIsPaid(false);
                setDamageCost(0);
                setDamageMemo('');
              }}
              className="bg-transparent text-[#57534E] hover:text-[#1C1917] font-['Manrope'] font-semibold text-[14px] py-2 transition-all cursor-pointer"
            >
              Process Another Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-[100px] pb-12 font-['Manrope']">
      <div className="max-w-[1000px] mx-auto px-6 py-[40px] md:py-[60px] w-full">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-[15px] text-[#57534E] hover:text-[#1C1917] transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-['Space_Grotesk'] font-bold text-[32px] tracking-tight text-[#1C1917]">
            Return Inspection & Closing
          </h1>
          <p className="text-[14px] text-[#57534E] mt-1">
            Fill in odometer, audit inspection logs, calculate penalties, and collect pending dues to complete return.
          </p>
        </div>

        {/* Customer Details banner */}
        <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[12px] text-[#A8A29E] font-semibold uppercase tracking-wider">
              Active Booking
            </span>
            <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#1C1917] mt-0.5">
              {bike.make} {bike.model} ({bike.number_plate})
            </h3>
            <p className="text-[14px] text-[#57534E] mt-1">
              Rented by: <strong>{booking.userDetails.name}</strong> ({booking.userDetails.email})
            </p>
          </div>
          <div className="bg-[#F5F5F4] px-4 py-2.5 rounded-[12px] text-[13px] text-[#57534E]">
            🗓️ Scheduled Return:{' '}
            <strong>{new Date(booking.dates.end).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}</strong>
          </div>
        </div>

        {/* Main Return Form */}
        <form onSubmit={handleReturnSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Fields (Col-Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Form Section 1: Odometer & Inspection */}
            <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 flex flex-col gap-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917]">
                1. Odometer & Condition Report
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#57534E]">
                    Initial Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={initialOdo}
                    disabled
                    className="px-4 py-3 rounded-[14px] border border-[#E7E5E4] bg-[#F5F5F4] text-[#A8A29E] cursor-not-allowed text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#57534E]">
                    Final Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={finalOdo}
                    onChange={(e) => setFinalOdo(Number(e.target.value))}
                    min={initialOdo}
                    className="px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none text-[15px]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#57534E]">
                  Damage / Maintenance Memo
                </label>
                <textarea
                  placeholder="Describe scratches, issues or structural damages if any..."
                  value={damageMemo}
                  onChange={(e) => setDamageMemo(e.target.value)}
                  className="px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none text-[15px] h-[90px] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#57534E]">
                  Estimated Damage Penalty Cost (₹)
                </label>
                <input
                  type="number"
                  value={damageCost}
                  onChange={(e) => setDamageCost(Math.max(0, Number(e.target.value)))}
                  className="px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none text-[15px]"
                />
              </div>
            </div>

            {/* Time Adjustments Area (For testing late calculations easily in prototype) */}
            <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 flex flex-col gap-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] flex items-center gap-2">
                <Navigation size={18} className="text-[#FBBF24]" />
                Prototype Time-Travel Controls
              </h3>
              <p className="text-[13px] text-[#57534E]">
                Use these buttons to adjust return timestamps to test late fee billing and grace period triggers:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => adjustReturnTime(-4)} // 4 hours earlier (should be on-time)
                  className="bg-[#F5F5F4] hover:bg-[#E7E5E4] px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#1C1917] transition-all cursor-pointer"
                >
                  On-Time (4h earlier)
                </button>
                <button
                  type="button"
                  onClick={() => adjustReturnTime(0)} // Current Time
                  className="bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 border border-[#FBBF24]/30 px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#1C1917] transition-all cursor-pointer"
                >
                  Current Time
                </button>
                <button
                  type="button"
                  onClick={() => adjustReturnTime(3)} // 3 hours late
                  className="bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2.5 rounded-full text-[13px] font-semibold text-red-700 transition-all cursor-pointer"
                >
                  Make 3 Hours Late
                </button>
              </div>
              <span className="text-[12px] text-[#A8A29E] mt-1">
                📍 Active Return Timestamp:{' '}
                <strong>{returnTime.toLocaleString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Calculations & Collections (Col-Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#F5F5F4] p-6 rounded-[18px] border border-[#E7E5E4]/50 flex flex-col gap-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#1C1917]">
                Pending Accounts
              </h3>

              {/* Overdue/Late Status Alert */}
              {lateHours > 0 ? (
                <div className="bg-red-50 border border-red-100 rounded-[14px] p-4 flex gap-3 text-red-700 text-[13px] leading-relaxed">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong>Overdue Return:</strong> Returned late by <strong>{lateHours} {lateHours === 1 ? 'hour' : 'hours'}</strong>. Per-hour late fee penalty is active.
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-[14px] p-4 flex gap-3 text-green-700 text-[13px] leading-relaxed">
                  <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong>Within Time limits:</strong> Returned on-time (includes 1-hour grace window).
                  </div>
                </div>
              )}

              {/* Calculation Summary details */}
              <div className="flex flex-col gap-3 text-[14px] text-[#57534E]">
                <div className="flex justify-between">
                  <span>Scheduled Time</span>
                  <span className="font-medium text-[#1C1917]">
                    {new Date(booking.dates.end).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Actual Time</span>
                  <span className="font-medium text-[#1C1917]">
                    {returnTime.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Late Fee Penalty</span>
                  <span className={`font-semibold ${lateFee > 0 ? 'text-red-600' : 'text-[#1C1917]'}`}>
                    ₹{lateFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Damage Penalty</span>
                  <span className={`font-semibold ${damageCost > 0 ? 'text-red-600' : 'text-[#1C1917]'}`}>
                    ₹{damageCost}
                  </span>
                </div>

                <hr className="border-[#E7E5E4] my-2" />

                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-[#1C1917]">Total Dues</span>
                  <span className="font-['Space_Grotesk'] text-[30px] font-bold text-[#1C1917]">
                    ₹{totalOutstanding}
                  </span>
                </div>
              </div>

              {/* Payment Settlement triggers */}
              {totalOutstanding > 0 && (
                <div className="bg-white p-4 rounded-[14px] border border-[#E7E5E4] flex flex-col gap-3">
                  <span className="text-[13px] font-semibold text-[#57534E]">
                    Collect Settlement
                  </span>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      className="w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                    />
                    <span className="text-[13px] text-[#1C1917] font-medium">
                      Confirm cash/online payment collected
                    </span>
                  </label>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={totalOutstanding > 0 && !isPaid}
                className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  totalOutstanding > 0 && !isPaid
                    ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] shadow-[0_6px_20px_rgba(251,191,36,0.2)]'
                }`}
              >
                <Check size={18} />
                Complete Booking Return
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
