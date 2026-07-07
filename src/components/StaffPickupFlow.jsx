import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle,
  CheckCircle2,
  FileText,
  ArrowLeft,
  ShieldCheck,
  Gauge,
  Bike,
  User,
  Calendar,
  Clock,
  Play,
  Upload,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';

// ── Mock booking data for this handover session ───────────────────────
const handoverBooking = {
  id: 'BK-048',
  customerName: 'Rohan Mehta',
  customerPhone: '+91 98765 43210',
  customerDL: 'GJ-DL-2024-0091827',
  bikeName: 'Royal Enfield Continental GT 650',
  bikePlate: 'GJ-01-AB-1234',
  bikeImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
  pickupDate: '2026-07-09T10:00:00',
  dropoffDate: '2026-07-11T10:00:00',
  duration: '2 Days',
  totalPaid: 2998,
  dlImageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400',
};

const photoSlots = [
  { key: 'front', label: 'Front View' },
  { key: 'back', label: 'Rear View' },
  { key: 'left', label: 'Left Side' },
  { key: 'right', label: 'Right Side' },
  { key: 'odometer', label: 'Odometer' },
];

export default function StaffPickupFlow() {
  // ── Step state ──
  const [dlVerified, setDlVerified] = useState(false);
  const [photos, setPhotos] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
    odometer: false,
  });
  const [odometerReading, setOdometerReading] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // ── Derived state ──
  const allPhotosUploaded = Object.values(photos).every(Boolean);
  const odometerValid = odometerReading.trim().length > 0 && !isNaN(Number(odometerReading));
  const canStartTrip = dlVerified && allPhotosUploaded && odometerValid;
  const photosUploadedCount = Object.values(photos).filter(Boolean).length;

  const handlePhotoUpload = (key) => {
    setPhotos((prev) => ({ ...prev, [key]: true }));
  };

  const handleStartTrip = () => {
    if (!canStartTrip) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 1500);
  };

  // ── Success state ──
  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-24 font-['Manrope'] text-[#1C1917] flex items-center justify-center px-4">
        <div className="w-full max-w-[440px] text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.4s_ease-out]">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="font-['Space_Grotesk'] font-bold text-[28px] tracking-tight">
            Trip Started<span className="text-[#FBBF24]">!</span>
          </h1>
          <p className="text-[14px] text-[#57534E] mt-2 max-w-[340px] mx-auto">
            Booking <strong className="font-mono">{handoverBooking.id}</strong> is now active.
            The {handoverBooking.bikeName} has been handed over to {handoverBooking.customerName}.
          </p>

          <div className="mt-8 bg-white rounded-[18px] border border-[#E7E5E4] p-5 text-left">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#A8A29E] font-semibold">Odometer Start</span>
              <span className="font-['Space_Grotesk'] font-bold text-[#1C1917]">{odometerReading} km</span>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-3">
              <span className="text-[#A8A29E] font-semibold">Photos Captured</span>
              <span className="font-semibold text-green-600">5 / 5 ✓</span>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-3">
              <span className="text-[#A8A29E] font-semibold">DL Verified</span>
              <span className="font-semibold text-green-600">Confirmed ✓</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/staff"
              className="w-full py-3.5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] font-semibold text-[14px] transition-all flex items-center justify-center gap-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.7); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-24 font-['Manrope'] text-[#1C1917]">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 w-full">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <div className="pt-6 pb-2">
          <Link
            to="/staff"
            className="inline-flex items-center gap-2 font-semibold text-[14px] text-[#57534E] hover:text-[#1C1917] transition-colors mb-5 group"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Staff Dashboard
          </Link>

          <h1 className="font-['Space_Grotesk'] font-bold text-[26px] sm:text-[30px] tracking-tight leading-tight">
            Vehicle Handover<span className="text-[#FBBF24]">.</span>
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#57534E] font-medium mt-1">
            Complete all verification steps before releasing the vehicle.
          </p>
        </div>

        {/* ── BOOKING SUMMARY CARD ────────────────────────────── */}
        <div className="mt-5 bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col sm:flex-row">
          <div className="sm:w-[140px] h-[120px] sm:h-auto shrink-0 bg-[#F5F5F4]">
            <img
              src={handoverBooking.bikeImage}
              alt={handoverBooking.bikeName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-mono font-semibold text-[#A8A29E]">{handoverBooking.id}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded-full">
                Pickup
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] leading-tight">
              {handoverBooking.bikeName}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#57534E] font-medium">
              <span className="flex items-center gap-1"><User size={12} className="text-[#A8A29E]" /> {handoverBooking.customerName}</span>
              <span className="flex items-center gap-1"><Bike size={12} className="text-[#A8A29E]" /> {handoverBooking.bikePlate}</span>
              <span className="flex items-center gap-1"><Calendar size={12} className="text-[#A8A29E]" /> {handoverBooking.duration}</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-[#A8A29E]" /> ₹{handoverBooking.totalPaid.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* ── PROGRESS INDICATOR ──────────────────────────────── */}
        <div className="mt-6 flex items-center gap-2 text-[12px] font-semibold">
          <StepDot done={dlVerified} label="1" />
          <div className={`flex-1 h-[2px] rounded-full transition-colors duration-300 ${dlVerified ? 'bg-green-400' : 'bg-[#E7E5E4]'}`} />
          <StepDot done={allPhotosUploaded && odometerValid} label="2" />
          <div className={`flex-1 h-[2px] rounded-full transition-colors duration-300 ${allPhotosUploaded && odometerValid ? 'bg-green-400' : 'bg-[#E7E5E4]'}`} />
          <StepDot done={canStartTrip} label="3" />
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  STEP 1 — DL VERIFICATION                             */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="mt-6 bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dlVerified ? 'bg-green-50 text-green-500' : 'bg-[#FEF3C7] text-[#F59E0B]'}`}>
                {dlVerified ? <CheckCircle size={18} /> : <FileText size={18} />}
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">
                  Step 1: DL Verification
                </h3>
                <p className="text-[12px] text-[#A8A29E] font-medium">
                  Verify the customer's original Driving Licence
                </p>
              </div>
            </div>
            {dlVerified && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>

          <div className="p-5">
            {/* DL Image preview */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-[180px] h-[120px] rounded-[12px] bg-[#F5F5F4] border border-[#E7E5E4] overflow-hidden shrink-0">
                <img
                  src={handoverBooking.dlImageUrl}
                  alt="Customer DL"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-[13px]">
                  <span className="text-[#A8A29E] font-medium">Customer:</span>
                  <span className="ml-2 font-semibold text-[#1C1917]">{handoverBooking.customerName}</span>
                </div>
                <div className="text-[13px]">
                  <span className="text-[#A8A29E] font-medium">DL Number:</span>
                  <span className="ml-2 font-mono font-semibold text-[#1C1917]">{handoverBooking.customerDL}</span>
                </div>
                <div className="text-[13px]">
                  <span className="text-[#A8A29E] font-medium">Phone:</span>
                  <span className="ml-2 font-semibold text-[#1C1917]">{handoverBooking.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Verify checkbox */}
            <label className={`mt-5 flex items-center gap-3 p-3.5 rounded-[12px] border-2 cursor-pointer transition-all duration-200 select-none ${
              dlVerified
                ? 'border-green-300 bg-green-50'
                : 'border-[#E7E5E4] bg-[#FAFAF9] hover:border-[#FBBF24]'
            }`}>
              <input
                type="checkbox"
                checked={dlVerified}
                onChange={(e) => setDlVerified(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-6 h-6 rounded-[8px] border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                dlVerified
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-[#A8A29E] bg-white'
              }`}>
                {dlVerified && <CheckCircle size={14} />}
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#1C1917]">
                  I have manually verified the original Driving Licence
                </span>
                <p className="text-[12px] text-[#A8A29E] font-medium mt-0.5">
                  Physical document matches the uploaded copy and customer identity
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  STEP 2 — CONDITION CAPTURE                           */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="mt-4 bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${allPhotosUploaded && odometerValid ? 'bg-green-50 text-green-500' : 'bg-[#FEF3C7] text-[#F59E0B]'}`}>
                {allPhotosUploaded && odometerValid ? <CheckCircle size={18} /> : <Camera size={18} />}
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">
                  Step 2: Condition Capture
                </h3>
                <p className="text-[12px] text-[#A8A29E] font-medium">
                  Capture vehicle photos and odometer reading
                </p>
              </div>
            </div>
            <span className="text-[12px] font-bold text-[#57534E] bg-[#F5F5F4] px-2.5 py-1 rounded-full">
              {photosUploadedCount}/5
            </span>
          </div>

          <div className="p-5">
            {/* Photo upload grid */}
            <p className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider mb-3">
              Vehicle Photos
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photoSlots.map((slot) => {
                const uploaded = photos[slot.key];
                return (
                  <button
                    key={slot.key}
                    onClick={() => handlePhotoUpload(slot.key)}
                    disabled={uploaded}
                    className={`relative flex flex-col items-center justify-center gap-2 h-[120px] rounded-[14px] transition-all duration-200 cursor-pointer ${
                      uploaded
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'bg-[#F5F5F4] border-2 border-dashed border-[#E7E5E4] hover:border-[#FBBF24] hover:bg-[#FEF3C7]/20 active:scale-[0.97]'
                    }`}
                  >
                    {uploaded ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 size={22} className="text-green-500" />
                        </div>
                        <span className="text-[12px] font-semibold text-green-700">{slot.label} ✓</span>
                      </>
                    ) : (
                      <>
                        {slot.key === 'odometer' ? (
                          <Gauge size={24} className="text-[#A8A29E]" />
                        ) : (
                          <Camera size={24} className="text-[#A8A29E]" />
                        )}
                        <span className="text-[12px] font-semibold text-[#57534E]">{slot.label}</span>
                        <span className="text-[10px] text-[#A8A29E] font-medium">Tap to capture</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Odometer reading input */}
            <div className="mt-5 pt-5 border-t border-[#E7E5E4]">
              <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider flex items-center gap-2 mb-2">
                <Gauge size={14} className="text-[#A8A29E]" />
                Starting Odometer Reading (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 12450"
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-4 py-3.5 text-[15px] font-['Space_Grotesk'] font-bold text-[#1C1917] placeholder:text-[#A8A29E] placeholder:font-['Manrope'] placeholder:font-medium outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10"
                />
                {odometerValid && (
                  <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <p className="text-[11px] text-[#A8A29E] font-medium mt-1.5">
                Record the exact odometer value shown in the photo above
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*  STEP 3 — START TRIP CTA                              */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="mt-4 bg-white rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${canStartTrip ? 'bg-green-50 text-green-500' : 'bg-[#F5F5F4] text-[#A8A29E]'}`}>
              {canStartTrip ? <CheckCircle size={18} /> : <ShieldCheck size={18} />}
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">
                Step 3: Activate Rental
              </h3>
              <p className="text-[12px] text-[#A8A29E] font-medium">
                All checks must pass before starting the trip
              </p>
            </div>
          </div>

          <div className="p-5">
            {/* Checklist summary */}
            <div className="flex flex-col gap-2.5 mb-5">
              <CheckItem done={dlVerified} label="Driving Licence verified" />
              <CheckItem done={allPhotosUploaded} label={`All 5 photos captured (${photosUploadedCount}/5)`} />
              <CheckItem done={odometerValid} label="Starting odometer reading entered" />
            </div>

            {/* Warning if not ready */}
            {!canStartTrip && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-[12px] p-3.5 mb-4">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-800 font-medium">
                  Complete all verification steps above before activating the rental. Missing items are marked in red.
                </p>
              </div>
            )}

            {/* Final CTA */}
            <button
              onClick={handleStartTrip}
              disabled={!canStartTrip || isSubmitting}
              className={`w-full py-4 rounded-full font-semibold text-[15px] transition-all duration-200 flex items-center justify-center gap-2.5 ${
                canStartTrip
                  ? 'bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.45)] active:scale-[0.98]'
                  : 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Activating Rental…
                </span>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  Start Trip — Mark as Active
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function StepDot({ done, label }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
      done
        ? 'bg-green-500 text-white'
        : 'bg-[#E7E5E4] text-[#A8A29E]'
    }`}>
      {done ? <CheckCircle size={14} /> : label}
    </div>
  );
}

function CheckItem({ done, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
        done ? 'bg-green-500 text-white' : 'bg-[#F5F5F4] border border-[#E7E5E4]'
      }`}>
        {done && <CheckCircle size={12} />}
      </div>
      <span className={`text-[13px] font-medium ${done ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
        {label}
      </span>
    </div>
  );
}
