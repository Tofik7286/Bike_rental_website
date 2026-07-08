import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { Calendar, Clock, ArrowRight, ArrowLeft, Shield, Upload, FileText } from 'lucide-react';

export default function BikeCheckout() {
  const { bikeId } = useParams();
  const navigate = useNavigate();
  const { fleet, createBooking } = useRental();

  // Find the bike from Context
  const bike = fleet.find((b) => b.id === bikeId);

  // Form input states
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  
  // Licence Upload state (dummy names)
  const [licenceFront, setLicenceFront] = useState('');
  const [licenceBack, setLicenceBack] = useState('');

  // T&C Checkbox states
  const [tcAge, setTcAge] = useState(false);
  const [tcPolicy, setTcPolicy] = useState(false);
  const [tcChallans, setTcChallans] = useState(false);

  // Error & Loader state
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-set default dates (tomorrow and day after tomorrow)
  useEffect(() => {
    window.scrollTo(0, 0);
    const today = new Date();
    
    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Day after tomorrow
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    setPickupDate(tomorrowStr);
    setDropoffDate(dayAfterStr);
  }, []);

  if (!bike) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-[110px] text-center">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1C1917]">Machine Not Found</h2>
        <p className="font-['Manrope'] text-sm text-[#57534E] mt-2">The selected vehicle could not be loaded.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 font-['Manrope'] font-semibold text-[#F59E0B]">
          <ArrowLeft size={16} /> Return to Fleet
        </Link>
      </div>
    );
  }

  // Business Logic Calculations
  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
    
    const diffMs = dropoffDateTime - pickupDateTime;
    if (diffMs <= 0) return 0;
    
    const diffHours = diffMs / (1000 * 60 * 60);
    // Enforce 24-hour billing cycle (always round up to nearest day)
    return Math.max(1, Math.ceil(diffHours / 24));
  };

  const days = calculateDays();
  const baseRent = days * bike.daily_rate;
  const gst = Math.round(baseRent * 0.18);
  const totalAmount = baseRent + gst;

  // Enforce timing logic & duration rules
  const validateBooking = () => {
    if (!pickupDate || !dropoffDate) return 'Please select pickup and drop-off dates.';

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);

    if (dropoffDateTime <= pickupDateTime) {
      return 'Drop-off date and time must be after pickup date and time.';
    }

    // Branch operates strictly from 10:00 AM to 12:00 AM (24:00 hours)
    const [pValHour] = pickupTime.split(':').map(Number);
    const [dValHour] = dropoffTime.split(':').map(Number);

    if (pValHour < 10 || pValHour > 23) {
      return 'Pickup timing must be scheduled between 10:00 AM and 12:00 AM (Midnight).';
    }
    if (dValHour < 10 || dValHour > 23) {
      return 'Drop-off timing must be scheduled between 10:00 AM and 12:00 AM (Midnight).';
    }

    // Enforce minimum 24-hour cycle
    const diffHours = (dropoffDateTime - pickupDateTime) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return 'Drop-off date must enforce a minimum 24-hour rental duration.';
    }

    if (!tcAge || !tcPolicy || !tcChallans) {
      return 'You must accept all mandatory declarations to proceed.';
    }

    return '';
  };

  const currentError = validateBooking();

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateBooking();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    // Simulate Payment and context creation
    setTimeout(() => {
      try {
        createBooking(
          bike.id,
          { start: `${pickupDate}T${pickupTime}`, end: `${dropoffDate}T${dropoffTime}` },
          totalAmount
        );
        alert('Booking successfully created! Redirecting to dashboard...');
        navigate('/customer/dashboard');
      } catch (err) {
        setValidationError('Failed to complete booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-[100px]">
      <div className="max-w-[1320px] mx-auto px-6 py-[60px] lg:py-[110px] w-full">
        {/* Back navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-['Manrope'] font-semibold text-[15px] text-[#57534E] hover:text-[#1C1917] transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to fleet list
        </Link>

        {/* Page Title */}
        <h1 className="font-['Space_Grotesk'] font-bold text-[36px] md:text-[44px] tracking-tight text-[#1C1917] mb-12">
          Secure Checkout
        </h1>

        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[50px] items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Timings Selector */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <Calendar size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  Rental Dates & Timing
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup selectors */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                      Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917]"
                    >
                      {Array.from({ length: 14 }).map((_, i) => {
                        const hour = 10 + i; // 10:00 to 23:00 (11:00 PM)
                        const hourStr = String(hour).padStart(2, '0');
                        return (
                          <option key={hourStr} value={`${hourStr}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Dropoff selectors */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                      Drop-off Date
                    </label>
                    <input
                      type="date"
                      value={dropoffDate}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                      Drop-off Time
                    </label>
                    <select
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917]"
                    >
                      {Array.from({ length: 14 }).map((_, i) => {
                        const hour = 10 + i;
                        const hourStr = String(hour).padStart(2, '0');
                        return (
                          <option key={hourStr} value={`${hourStr}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F5F4] p-4 rounded-[14px] text-[13px] text-[#57534E] font-['Manrope'] leading-relaxed">
                ℹ️ Branch operates between <strong>10:00 AM</strong> and <strong>12:00 AM (Midnight)</strong>.
                Rentals strictly follow a 24-hour cycle (Minimum 1 day billing).
              </div>
            </div>

            {/* KYC Upload */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <Shield size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  KYC Verification Documents
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Upload */}
                <div className="flex flex-col gap-2">
                  <span className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Driving Licence (Front)
                  </span>
                  <label className={`border-2 border-dashed rounded-[14px] p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    licenceFront ? 'border-[#FBBF24] bg-[#FEF3C7]/20' : 'border-[#E7E5E4] hover:border-[#1C1917]'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLicenceFront(e.target.files[0]?.name || 'licence_front.jpg')}
                      className="hidden"
                    />
                    <Upload size={18} className="text-[#A8A29E]" />
                    <span className="font-['Manrope'] text-[13px] text-[#1C1917] font-medium">
                      {licenceFront || 'Upload Driving Licence (Front)'}
                    </span>
                  </label>
                </div>

                {/* Back Upload */}
                <div className="flex flex-col gap-2">
                  <span className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Driving Licence (Back)
                  </span>
                  <label className={`border-2 border-dashed rounded-[14px] p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    licenceBack ? 'border-[#FBBF24] bg-[#FEF3C7]/20' : 'border-[#E7E5E4] hover:border-[#1C1917]'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLicenceBack(e.target.files[0]?.name || 'licence_back.jpg')}
                      className="hidden"
                    />
                    <Upload size={18} className="text-[#A8A29E]" />
                    <span className="font-['Manrope'] text-[13px] text-[#1C1917] font-medium">
                      {licenceBack || 'Upload Driving Licence (Back)'}
                    </span>
                  </label>
                </div>
              </div>
              <span className="font-['Manrope'] text-[12px] text-[#A8A29E]">
                * Required for physical verification at pickup.
              </span>
            </div>

            {/* Declarations (T&C) */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <FileText size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  Mandatory Declarations
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tcAge}
                    onChange={(e) => setTcAge(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                  />
                  <span className="font-['Manrope'] text-[14px] text-[#57534E] leading-relaxed">
                    I confirm I am 18+ years of age and hold a valid Driving Licence.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tcPolicy}
                    onChange={(e) => setTcPolicy(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                  />
                  <span className="font-['Manrope'] text-[14px] text-[#57534E] leading-relaxed">
                    I agree to the 30% standard / 60% (within 24 hrs) cancellation penalty slabs.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tcChallans}
                    onChange={(e) => setTcChallans(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                  />
                  <span className="font-['Manrope'] text-[14px] text-[#57534E] leading-relaxed">
                    I accept full responsibility for any Traffic Challans generated during my rental period.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-[100px]">
            <div className="bg-[#F5F5F4] p-[26px] rounded-[18px] flex flex-col gap-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#1C1917]">
                Billing Summary
              </h3>

              {/* Bike Preview */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-[14px] border border-[#E7E5E4]/50">
                <img
                  src={bike.image_url}
                  alt={`${bike.make} ${bike.model}`}
                  className="w-20 h-20 object-contain p-2 rounded-[10px] bg-white border border-[#E7E5E4]/50"
                />
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917]">
                    {bike.make} {bike.model}
                  </span>
                  <span className="font-['Manrope'] text-[12px] text-[#A8A29E] uppercase tracking-wider mt-0.5">
                    Plate: {bike.number_plate}
                  </span>
                  <span className="font-['Manrope'] text-[13px] font-semibold text-[#57534E] mt-1">
                    ₹{bike.daily_rate}/day
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="flex flex-col gap-3 font-['Manrope'] text-[14px] text-[#57534E]">
                <div className="flex justify-between">
                  <span>Rental Duration</span>
                  <span className="font-semibold text-[#1C1917]">
                    {days} {days === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Base Rent</span>
                  <span className="font-semibold text-[#1C1917]">₹{baseRent}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[#1C1917]">₹{gst}</span>
                </div>

                <hr className="border-[#E7E5E4] my-2" />

                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-[#1C1917]">Total Payable</span>
                  <span className="font-['Space_Grotesk'] text-[30px] font-bold text-[#1C1917]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Errors container */}
              {(validationError || (currentError && (tcAge || tcPolicy || tcChallans))) && (
                <div className="p-3 bg-red-50 text-red-600 rounded-[14px] text-[13px] font-['Manrope']">
                  ⚠️ {validationError || currentError}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={!!currentError || isSubmitting}
                className={`w-full py-4 rounded-full font-['Manrope'] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  currentError
                    ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] shadow-[0_6px_20px_rgba(251,191,36,0.35)]'
                }`}
              >
                {isSubmitting ? 'Processing Payment...' : 'Pay & Book Now'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
