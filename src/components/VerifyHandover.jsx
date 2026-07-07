import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import {
  ChevronLeft,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  KeyRound
} from 'lucide-react';

export default function VerifyHandover() {
  const navigate = useNavigate();
  const { activateBooking } = useRental();

  // Mock booking data (normally passed via route state or fetched via ID)
  const booking = {
    id: 'BK-041',
    customerName: 'Rohan Mehta',
    dlNumber: 'GJ01-2015-1234567',
    bikeName: 'Royal Enfield Continental GT 650',
    bikePlate: 'GJ-01-AB-1234'
  };

  const [dlVerified, setDlVerified] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [photos, setPhotos] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
    odometer: false
  });

  const handlePhotoUpload = (view) => {
    setPhotos(prev => ({ ...prev, [view]: true }));
  };

  const handleStartTrip = (e) => {
    e.preventDefault();
    if (!dlVerified || !odometer) return;
    
    // Mark as Active in context
    activateBooking(booking.id);
    
    alert(`✅ Verification Complete. Keys handed over. Trip for ${booking.id} is now ACTIVE.`);
    navigate('/staff/dashboard');
  };

  const isFormValid = dlVerified && odometer.trim() !== '';

  const PhotoUploadBox = ({ view, label }) => (
    <button
      type="button"
      onClick={() => handlePhotoUpload(view)}
      className={`flex flex-col items-center justify-center gap-2 h-[120px] rounded-[14px] border-2 border-dashed transition-all cursor-pointer ${
        photos[view]
          ? 'border-green-300 bg-green-50 text-green-700'
          : 'border-[#E7E5E4] bg-[#F5F5F4] text-[#A8A29E] hover:border-[#FBBF24] hover:bg-[#FEF3C7]/30'
      }`}
    >
      {photos[view] ? (
        <>
          <CheckCircle2 size={24} className="text-green-500" />
          <span className="text-[12px] font-bold text-green-700">Uploaded</span>
        </>
      ) : (
        <>
          <Camera size={24} className="text-[#57534E]" />
          <span className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">{label}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] pb-24 font-['Manrope']">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 w-full pt-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/staff/dashboard"
            className="w-10 h-10 rounded-full border border-[#E7E5E4] bg-white flex items-center justify-center text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917] transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-['Space_Grotesk'] font-bold text-[28px] tracking-tight text-[#1C1917] leading-none">
              Verify & Handover
            </h1>
            <p className="text-[13px] text-[#A8A29E] font-medium mt-1">
              Booking <strong className="text-[#57534E]">{booking.id}</strong> — {booking.bikeName}
            </p>
          </div>
        </div>

        <form onSubmit={handleStartTrip} className="flex flex-col gap-6">
          
          {/* Step 1: DL Verification */}
          <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[12px]">1</span>
              ID Verification
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Dummy DL Image */}
              <div className="w-full sm:w-[280px] shrink-0 bg-[#F5F5F4] rounded-[12px] border border-[#E7E5E4] overflow-hidden relative aspect-[1.58]">
                <img 
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400" 
                  alt="Customer"
                  className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-white font-bold text-[14px]">{booking.customerName}</span>
                  <span className="text-white/80 font-mono text-[12px]">{booking.dlNumber}</span>
                </div>
              </div>

              {/* Verification Toggle */}
              <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-[12px] p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-[#B45309] shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#92400E] leading-relaxed">
                    Please physically verify the original Driving Licence against this uploaded copy. Ensure the photo matches the customer present.
                  </p>
                </div>
                
                <label className="flex items-center gap-3 p-4 rounded-[12px] border border-[#E7E5E4] bg-[#FAFAF9] cursor-pointer hover:border-[#1C1917] transition-colors">
                  <div className={`w-6 h-6 rounded-[6px] border-2 flex items-center justify-center transition-colors ${dlVerified ? 'bg-[#1C1917] border-[#1C1917]' : 'border-[#A8A29E] bg-white'}`}>
                    {dlVerified && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={dlVerified} 
                    onChange={(e) => setDlVerified(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-[14px] font-semibold text-[#1C1917]">
                    I have manually verified the original Driving Licence
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 2: Digital Checklist */}
          <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[12px]">2</span>
              Condition & Checklist
            </h2>

            {/* Odometer Input */}
            <div className="mb-8">
              <label className="block text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                Starting Odometer Reading (km) <span className="text-red-500">*</span>
              </label>
              <div className="relative max-w-[300px]">
                <Gauge size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-4 py-3.5 pl-11 text-[14px] font-mono font-medium text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10"
                  placeholder="e.g. 14500"
                  required
                />
              </div>
            </div>

            {/* Photo Grid */}
            <label className="block text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider mb-3">
              Vehicle Photos (Optional for demo)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <PhotoUploadBox view="front" label="Front" />
              <PhotoUploadBox view="back" label="Back" />
              <PhotoUploadBox view="left" label="Left Side" />
              <PhotoUploadBox view="right" label="Right Side" />
              <PhotoUploadBox view="odometer" label="Odometer" />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-full font-bold text-[16px] transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
              isFormValid
                ? 'bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] active:scale-[0.98]'
                : 'bg-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
            }`}
          >
            <KeyRound size={20} />
            Start Trip (Mark Active)
          </button>
          
        </form>
      </div>
    </div>
  );
}
