import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { ArrowLeft, Calendar, FileText, CheckCircle2, ShieldCheck, Upload, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { bikeId } = useParams();
  const navigate = useNavigate();
  const { fleet, createBooking } = useRental();

  // Find the bike
  const bike = fleet.find((b) => b.id === bikeId);

  // Form State
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);

  // T&C states
  const [tcAge, setTcAge] = useState(false);
  const [tcPolicy, setTcPolicy] = useState(false);
  const [tcChallans, setTcChallans] = useState(false);

  // Validation & Booking Process States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Auto-fill dates for convenience
  useEffect(() => {
    window.scrollTo(0, 0);
    const now = new Date();
    // Default pickup: tomorrow at 10:00 AM
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    // Default dropoff: day after tomorrow at 10:00 AM
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);
    dayAfter.setHours(10, 0, 0, 0);

    const formatToLocalISO = (date) => {
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    };

    setPickupDate(formatToLocalISO(tomorrow));
    setDropoffDate(formatToLocalISO(dayAfter));
  }, []);

  if (!bike) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-[140px] text-center">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1C1917]">Bike Not Found</h2>
        <p className="font-['Manrope'] text-sm text-[#57534E] mt-2">The requested bike model does not exist in our active fleet database.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 font-['Manrope'] font-semibold text-[#F59E0B]">
          <ArrowLeft size={16} /> Return to Fleet
        </Link>
      </div>
    );
  }

  // Calculate rental period details
  const getDurationInDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const p = new Date(pickupDate);
    const d = new Date(dropoffDate);
    const ms = d - p;
    if (ms <= 0) return 0;
    // Calculate total hours to handle fractional days gracefully, rounded up
    const hours = ms / (1000 * 60 * 60);
    return Math.ceil(hours / 24);
  };

  const days = getDurationInDays();
  const baseRent = days * bike.daily_rate;
  const gst = Math.round(baseRent * 0.18);
  const totalAmount = baseRent + gst;

  // Validate Booking Details
  const validateForm = () => {
    if (!pickupDate || !dropoffDate) {
      return 'Please specify both pickup and drop-off dates.';
    }

    const p = new Date(pickupDate);
    const d = new Date(dropoffDate);

    // Business Rule 1: Time selection must be between 10:00 AM and 12:00 AM (Midnight)
    const pHours = p.getHours();
    const dHours = d.getHours();

    if (pHours < 10 || pHours >= 24) {
      return 'Pickup time must be scheduled between 10:00 AM and 12:00 AM (Midnight).';
    }
    if (dHours < 10 || dHours >= 24) {
      return 'Drop-off time must be scheduled between 10:00 AM and 12:00 AM (Midnight).';
    }

    // Business Rule 2: Minimum 24-hour rental duration
    const minDurationMs = 24 * 60 * 60 * 1000;
    if (d - p < minDurationMs) {
      return 'Drop-off date must enforce a minimum 24-hour rental duration.';
    }

    if (!tcAge || !tcPolicy || !tcChallans) {
      return 'Please accept all terms and conditions to proceed.';
    }

    return '';
  };

  const validationError = validateForm();

  const handlePay = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError('');
    setLoading(true);

    // Simulate payment loading for 1.5 seconds
    setTimeout(() => {
      try {
        const result = createBooking(
          bike.id,
          { start: pickupDate, end: dropoffDate },
          totalAmount
        );
        setBookingId(result.id);
        setSuccess(true);
      } catch (err) {
        setError('Booking failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // Success view
  if (success) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-[140px] flex flex-col items-center justify-center text-center">
        <div className="w-[80px] h-[80px] rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#FBBF24] mb-8 animate-[scaleIn_0.3s_ease-out]">
          <CheckCircle2 size={48} className="fill-[#1C1917] stroke-[#FBBF24]" />
        </div>
        <h2 className="font-['Space_Grotesk'] text-[36px] font-bold text-[#1C1917] tracking-tight">
          Booking Confirmed!
        </h2>
        <p className="font-['Manrope'] text-[16px] text-[#57534E] max-w-[480px] mt-4">
          Your premium ride has been reserved successfully. Please show your driving license and booking ID during pickup.
        </p>

        {/* Details Card */}
        <div className="bg-[#F5F5F4] p-[30px] rounded-[18px] w-full max-w-[500px] mt-8 flex flex-col gap-4 text-left">
          <div className="flex justify-between">
            <span className="font-['Manrope'] text-[14px] text-[#A8A29E]">Booking ID</span>
            <span className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-['Manrope'] text-[14px] text-[#A8A29E]">Machine</span>
            <span className="font-['Manrope'] font-semibold text-[15px] text-[#1C1917]">
              {bike.make} {bike.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-['Manrope'] text-[14px] text-[#A8A29E]">Registration</span>
            <span className="font-['Manrope'] font-medium text-[15px] text-[#1C1917] uppercase">
              {bike.number_plate}
            </span>
          </div>
          <hr className="border-[#E7E5E4]" />
          <div className="flex justify-between">
            <span className="font-['Manrope'] text-[14px] text-[#A8A29E]">Total Amount Paid</span>
            <span className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917]">
              ₹{totalAmount}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-10 bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] px-8 py-4 rounded-full font-['Manrope'] font-semibold flex items-center gap-2 transition-all shadow-[0_6px_20px_rgba(251,191,36,0.35)]"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF8] min-h-screen pt-[100px]">
      <div className="max-w-[1320px] mx-auto px-6 py-[60px] lg:py-[110px] w-full">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-['Manrope'] font-semibold text-[15px] text-[#57534E] hover:text-[#1C1917] transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to fleet list
        </Link>

        {/* Title */}
        <h1 className="font-['Space_Grotesk'] font-bold text-[36px] md:text-[44px] tracking-tight text-[#1C1917] mb-12">
          Secure Checkout
        </h1>

        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[50px] items-start">
          {/* Left Column - Booking Inputs & Details (Colspan 7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Section 1: Dates & Duration */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <Calendar size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  Rental Dates & Timing
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="pickup-date" className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="pickup-date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917] text-[15px]"
                    required
                  />
                </div>

                {/* Dropoff Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="dropoff-date" className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Drop-off Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="dropoff-date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="font-['Manrope'] px-4 py-3 rounded-[14px] border border-[#E7E5E4] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] focus:outline-none bg-white text-[#1C1917] text-[15px]"
                    required
                  />
                </div>
              </div>

              {/* Timing constraints alerts */}
              <div className="bg-[#F5F5F4] p-4 rounded-[14px] text-[13px] text-[#57534E] font-['Manrope'] flex flex-col gap-1.5">
                <p>📍 Time slots: 10:00 AM - 12:00 AM (Midnight) for both pickup and return.</p>
                <p>📍 Minimum booking duration is 24 hours.</p>
              </div>
            </div>

            {/* Section 2: KYC Details */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <ShieldCheck size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  KYC Verification
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Licence Front */}
                <div className="flex flex-col gap-2">
                  <span className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Driving Licence (Front)
                  </span>
                  <label
                    className={`border-2 border-dashed rounded-[14px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      kycFront ? 'border-[#FBBF24] bg-[#FEF3C7]/20' : 'border-[#E7E5E4] hover:border-[#1C1917]'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setKycFront(e.target.files[0]?.name || 'front.jpg')}
                    />
                    <Upload size={20} className="text-[#A8A29E]" />
                    <span className="font-['Manrope'] text-[13px] font-medium text-[#1C1917]">
                      {kycFront ? kycFront : 'Upload Licence Front'}
                    </span>
                  </label>
                </div>

                {/* Licence Back */}
                <div className="flex flex-col gap-2">
                  <span className="font-['Manrope'] font-semibold text-[14px] text-[#57534E]">
                    Driving Licence (Back)
                  </span>
                  <label
                    className={`border-2 border-dashed rounded-[14px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      kycBack ? 'border-[#FBBF24] bg-[#FEF3C7]/20' : 'border-[#E7E5E4] hover:border-[#1C1917]'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setKycBack(e.target.files[0]?.name || 'back.jpg')}
                    />
                    <Upload size={20} className="text-[#A8A29E]" />
                    <span className="font-['Manrope'] text-[13px] font-medium text-[#1C1917]">
                      {kycBack ? kycBack : 'Upload Licence Back'}
                    </span>
                  </label>
                </div>
              </div>
              <span className="font-['Manrope'] text-[12px] text-[#A8A29E]">
                * Required for physical verification at pickup. Only PNG, JPG, or PDF formats are accepted.
              </span>
            </div>

            {/* Section 3: Terms & Conditions Checkboxes */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E5E4]">
                <FileText size={20} className="text-[#FBBF24]" />
                <h2 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917]">
                  Declarations
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* Term 1 */}
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

                {/* Term 2 */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tcPolicy}
                    onChange={(e) => setTcPolicy(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                  />
                  <span className="font-['Manrope'] text-[14px] text-[#57534E] leading-relaxed">
                    I agree to the Cancellation Policy (30% penalty after booking, 60% penalty within 24 hours of pickup).
                  </span>
                </label>

                {/* Term 3 */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tcChallans}
                    onChange={(e) => setTcChallans(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-[6px] border-[#E7E5E4] text-[#FBBF24] focus:ring-[#FBBF24] cursor-pointer accent-[#FBBF24]"
                  />
                  <span className="font-['Manrope'] text-[14px] text-[#57534E] leading-relaxed">
                    I accept full responsibility and liability for any Traffic Challans generated during my rental period.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Billing Summary (Colspan 5, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[100px]">
            <div className="bg-[#F5F5F4] p-[26px] rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#E7E5E4]/40 flex flex-col gap-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#1C1917]">
                Billing Summary
              </h3>

              {/* Bike details */}
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

              {/* Booking breakdown */}
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

              {/* Error messages from validation / submission */}
              {(error || (validationError && (tcAge || tcPolicy || tcChallans))) && (
                <div className="p-4 bg-red-50 text-red-600 rounded-[14px] text-[13px] font-['Manrope'] leading-relaxed">
                  ⚠️ {error || validationError}
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={!!validationError || loading}
                className={`w-full py-4 rounded-full font-['Manrope'] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  validationError
                    ? 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] shadow-[0_6px_20px_rgba(251,191,36,0.35)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Payment...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
