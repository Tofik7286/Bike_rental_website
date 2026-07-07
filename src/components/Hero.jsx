import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-[#FFFDF8] pt-[140px] pb-[80px] lg:pt-[160px] lg:pb-[110px]"
    >
      <div className="max-w-[1320px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] items-center">
          {/* Left — Text Content */}
          <div className="order-2 lg:order-1 flex flex-col gap-6 items-start">
            {/* Micro Label */}
            <span className="font-['Manrope'] font-medium text-[13px] text-[#A8A29E] uppercase tracking-[0.16em]">
              Escape The Traffic
            </span>

            {/* Main Heading */}
            <h1 className="font-['Space_Grotesk'] font-bold text-[42px] md:text-[56px] lg:text-[68px] xl:text-[72px] leading-[1.1] tracking-tight text-[#1C1917]">
              Ride The{' '}
              <span className="relative inline-block">
                Adventure
                <svg
                  className="absolute -bottom-[6px] left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C50 2 100 2 150 6C200 10 250 4 298 6"
                    stroke="#FBBF24"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-[#FBBF24]">.</span>
            </h1>

            {/* Paragraph */}
            <p className="font-['Manrope'] text-[17px] leading-[1.65] text-[#57534E] max-w-[440px]">
              Premium motorcycles and scooters for your daily commute or weekend
              escapes. Pick up, ride, and return — it's that simple.
            </p>

            {/* CTA Button — Exact spec sizing */}
            <a
              href="#fleet"
              id="hero-cta"
              className="group bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] px-8 py-4 rounded-full font-['Manrope'] font-semibold text-[15px] flex items-center gap-2 transition-all shadow-[0_6px_20px_rgba(251,191,36,0.35)] hover:shadow-[0_10px_30px_rgba(251,191,36,0.5)]"
            >
              Book Now
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>

            {/* Trust Metrics — Clean divide-x row */}
            <div className="flex items-center gap-8 mt-12 divide-x divide-[#E7E5E4]">
              <div className="flex flex-col pr-8">
                <span className="font-['Space_Grotesk'] font-bold text-[30px] text-[#1C1917] leading-none">
                  50K+
                </span>
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E] mt-1">
                  Happy Riders
                </span>
              </div>
              <div className="flex flex-col pl-8 pr-8">
                <span className="font-['Space_Grotesk'] font-bold text-[30px] text-[#1C1917] leading-none">
                  200+
                </span>
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E] mt-1">
                  Premium Bikes
                </span>
              </div>
              <div className="flex flex-col pl-8">
                <span className="font-['Space_Grotesk'] font-bold text-[30px] text-[#1C1917] leading-none">
                  15+
                </span>
                <span className="font-['Manrope'] text-[13px] text-[#A8A29E] mt-1">
                  Cities
                </span>
              </div>
            </div>
          </div>

          {/* Right — Image (relative container for absolute badges) */}
          <div className="order-1 lg:order-2 relative flex justify-center items-center">
            {/* Main Image — no solid bg, blends with #FFFDF8 */}
            <img
              src="/images/hero-bike.png"
              alt="Premium cafe racer motorcycle for rent"
              className="relative z-10 w-full max-w-[580px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-[float_6s_ease-in-out_infinite]"
            />

            {/* Badge: Price — absolute top-left */}
            <div className="absolute z-20 top-6 left-6 bg-white px-4 py-2 rounded-[14px] shadow-md flex items-center gap-2 animate-[float_5s_ease-in-out_infinite_1s]">
              <span className="text-[16px]">🏷️</span>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-[15px] text-[#1C1917] leading-tight">
                  From ₹499
                </span>
                <span className="font-['Manrope'] text-[11px] text-[#A8A29E]">
                  Per Day
                </span>
              </div>
            </div>

            {/* Badge: Rating — absolute bottom-right */}
            <div className="absolute z-20 bottom-6 right-6 bg-white px-4 py-2 rounded-[14px] shadow-md flex items-center gap-2 animate-[float_4s_ease-in-out_infinite_0.5s]">
              <span className="text-[18px]">⭐</span>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917] leading-tight">
                  4.9
                </span>
                <span className="font-['Manrope'] text-[11px] text-[#A8A29E]">
                  Top Rated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
