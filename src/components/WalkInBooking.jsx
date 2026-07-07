import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import {
  ChevronLeft,
  User,
  Smartphone,
  IdCard,
  CalendarDays,
  Clock,
  Bike,
  Banknote,
  QrCode,
  CheckCircle2,
} from 'lucide-react';

export default function WalkInBooking() {
  const navigate = useNavigate();
  const { fleet, createBooking } = useRental();
  
  // Only show available bikes
  const availableBikes = fleet.filter(b => b.status === 'Available');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    dlNumber: '',
    pickupDate: '',
    pickupTime: '10:00 AM',
    dropoffDate: '',
    dropoffTime: '10:00 AM',
    bikeId: '',
    paymentMethod: 'UPI',
  });

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.bikeId) {
      alert("Please select a vehicle.");
      return;
    }
    
    // Calculate mock total amount
    const selectedBike = availableBikes.find(b => b.id === formData.bikeId);
    const amount = selectedBike ? selectedBike.pricePerDay * 2 : 2998; // hardcoded 2 days for prototype

    // Dispatch to global context (creates booking & updates bike status to 'On Rent')
    createBooking(
      formData.bikeId,
      { 
        start: `${formData.pickupDate} ${formData.pickupTime}`,
        end: `${formData.dropoffDate} ${formData.dropoffTime}`
      },
      amount,
      {
        name: formData.name,
        phone: formData.mobile,
        dlNumber: formData.dlNumber,
        email: 'walk-in-customer@ride.com' // Dummy email for context structure
      }
    );

    alert(`✅ Payment of ₹${amount} received via ${formData.paymentMethod}. Booking Confirmed!`);
    navigate('/staff/dashboard');
  };

  const inputBase = "w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-4 py-3.5 pl-11 text-[14px] font-['Manrope'] font-medium text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10";
  const selectBase = "w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-4 py-3.5 pl-11 text-[14px] font-['Manrope'] font-medium text-[#1C1917] outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10 appearance-none";

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
              Walk-in Booking
            </h1>
            <p className="text-[13px] text-[#A8A29E] font-medium mt-1">
              Create a new booking and collect payment at the branch.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Card 1: Customer Details */}
          <div className="bg-white border border-[#E7E5E4] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] mb-5">
              1. Customer Details
            </h2>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={inputBase}
                  required
                />
              </div>
              <div className="relative">
                <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  maxLength={10}
                  className={inputBase}
                  required
                />
              </div>
              <div className="relative">
                <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="text"
                  name="dlNumber"
                  value={formData.dlNumber}
                  onChange={handleInputChange}
                  placeholder="Driving License Number"
                  className={inputBase}
                  required
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Ride Details */}
          <div className="bg-white border border-[#E7E5E4] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] mb-5">
              2. Ride Details
            </h2>
            
            {/* Vehicle Selection */}
            <div className="mb-5 relative">
              <label className="block text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                Select Vehicle
              </label>
              <div className="relative">
                <Bike size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <select
                  name="bikeId"
                  value={formData.bikeId}
                  onChange={handleInputChange}
                  className={selectBase}
                  required
                >
                  <option value="" disabled>Choose an available bike...</option>
                  {availableBikes.map(bike => (
                    <option key={bike.id} value={bike.id}>
                      {bike.name} — {bike.licensePlate} (₹{bike.pricePerDay}/day)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup */}
              <div>
                <label className="block text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                  Pickup
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-3 py-3 pl-10 text-[13px] font-medium text-[#1C1917] outline-none focus:border-[#1C1917]"
                      required
                    />
                  </div>
                  <div className="relative w-[110px]">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <select
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-3 py-3 pl-10 text-[13px] font-medium text-[#1C1917] outline-none focus:border-[#1C1917] appearance-none"
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Drop-off */}
              <div>
                <label className="block text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                  Drop-off
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-3 py-3 pl-10 text-[13px] font-medium text-[#1C1917] outline-none focus:border-[#1C1917]"
                      required
                    />
                  </div>
                  <div className="relative w-[110px]">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <select
                      name="dropoffTime"
                      value={formData.dropoffTime}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-3 py-3 pl-10 text-[13px] font-medium text-[#1C1917] outline-none focus:border-[#1C1917] appearance-none"
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment */}
          <div className="bg-white border border-[#E7E5E4] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h2 className="font-['Space_Grotesk'] font-bold text-[18px] text-[#1C1917] mb-5">
              3. Payment Collection
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* UPI Option */}
              <label className={`relative flex flex-col items-center justify-center p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                formData.paymentMethod === 'UPI' 
                  ? 'border-[#1C1917] bg-[#FAFAF9]' 
                  : 'border-[#E7E5E4] hover:border-[#A8A29E]'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="UPI" 
                  checked={formData.paymentMethod === 'UPI'} 
                  onChange={handleInputChange}
                  className="hidden"
                />
                <QrCode size={24} className={formData.paymentMethod === 'UPI' ? 'text-[#1C1917]' : 'text-[#A8A29E]'} />
                <span className={`mt-2 font-semibold text-[14px] ${formData.paymentMethod === 'UPI' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
                  UPI / QR
                </span>
                {formData.paymentMethod === 'UPI' && (
                  <div className="absolute top-2 right-2 text-[#1C1917]">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </label>

              {/* Cash Option */}
              <label className={`relative flex flex-col items-center justify-center p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                formData.paymentMethod === 'Cash' 
                  ? 'border-[#1C1917] bg-[#FAFAF9]' 
                  : 'border-[#E7E5E4] hover:border-[#A8A29E]'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Cash" 
                  checked={formData.paymentMethod === 'Cash'} 
                  onChange={handleInputChange}
                  className="hidden"
                />
                <Banknote size={24} className={formData.paymentMethod === 'Cash' ? 'text-[#1C1917]' : 'text-[#A8A29E]'} />
                <span className={`mt-2 font-semibold text-[14px] ${formData.paymentMethod === 'Cash' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
                  Cash
                </span>
                {formData.paymentMethod === 'Cash' && (
                  <div className="absolute top-2 right-2 text-[#1C1917]">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] font-bold text-[16px] py-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] cursor-pointer active:scale-[0.98] mt-2"
          >
            <CheckCircle2 size={20} />
            Mark as Paid & Confirm Booking
          </button>
          
        </form>
      </div>
    </div>
  );
}
