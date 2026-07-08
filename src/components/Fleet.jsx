import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRental } from '../context/RentalContext';

export default function Fleet() {
  const { fleet } = useRental();

  // Only display bikes where status === "Available"
  const availableBikes = fleet.filter((bike) => bike.status === 'Available');

  return (
    <section id="fleet" className="bg-[#F5F5F4] py-[70px] md:py-[110px]">
      <div className="max-w-[1320px] mx-auto px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-[60px]">
          <span className="font-['Manrope'] font-medium text-[13px] text-[#A8A29E] uppercase tracking-[0.16em]">
            Choose Your Machine
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-[36px] md:text-[48px] leading-[1.1] tracking-tight text-[#1C1917] mt-3">
            Our Premium Fleet
          </h2>
          <p className="font-['Manrope'] text-[16px] leading-[1.65] text-[#57534E] mt-4 max-w-[480px] mx-auto">
            Hand-picked machines, meticulously maintained, ready for your next
            ride.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {availableBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-[6px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image Container — fixed h-64 */}
              <div className="relative w-full h-64 overflow-hidden bg-white">
                <img
                  src={bike.image_url}
                  alt={`${bike.make} ${bike.model}`}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                {/* Tag Badge */}
                {bike.tag && (
                  <span className="absolute top-4 left-4 bg-[#FBBF24] text-[#1C1917] font-['Manrope'] font-semibold text-[11px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-[14px]">
                    {bike.tag}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-[26px] flex flex-col gap-4 flex-1">
                {/* Title */}
                <h3 className="font-['Space_Grotesk'] font-semibold text-[22px] text-[#1C1917] leading-tight">
                  {bike.make} {bike.model}
                </h3>

                {/* Meta Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#57534E]">
                    <MapPin size={14} className="text-[#A8A29E]" />
                    <span className="font-['Manrope'] text-[13px]">
                      {bike.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#57534E]">
                    <Star
                      size={14}
                      className="text-[#FBBF24] fill-[#FBBF24]"
                    />
                    <span className="font-['Manrope'] text-[13px]">
                      {bike.rating}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#E7E5E4]" />

                {/* Price & CTA Row */}
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-baseline">
                    <span className="font-['Space_Grotesk'] font-bold text-[30px] text-[#1C1917]">
                      ₹{bike.daily_rate}
                    </span>
                    <span className="text-sm font-['Manrope'] text-[#A8A29E] font-normal ml-1">
                      /day
                    </span>
                  </div>
                  <Link to={`/book/${bike.id}`} className="text-[#1C1917] font-['Manrope'] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer">
                    Rent Now
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-[50px]">
          <Link
            to="/fleet"
            id="fleet-view-all"
            className="inline-flex items-center gap-2 font-['Manrope'] font-semibold text-[15px] text-[#1C1917] border-b-2 border-[#FBBF24] pb-1 hover:text-[#F59E0B] transition-colors duration-200"
          >
            View All Bikes
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
