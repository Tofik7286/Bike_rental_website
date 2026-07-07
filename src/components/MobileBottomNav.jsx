import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  User,
  LayoutDashboard,
  Key,
  ClipboardCheck,
} from 'lucide-react';

const customerTabs = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Bookings', to: '/customer/dashboard', icon: Calendar },
  { label: 'Profile', to: '/profile', icon: User },
];

const staffTabs = [
  { label: 'Dashboard', to: '/staff', icon: LayoutDashboard },
  { label: 'Handover', to: '/staff/pickup', icon: Key },
  { label: 'Return', to: '/staff/return', icon: ClipboardCheck },
];

export default function MobileBottomNav({ userRole = 'customer' }) {
  const tabs = userRole === 'staff' ? staffTabs : customerTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E7E5E4] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-stretch justify-around w-full px-2 pb-[env(safe-area-inset-bottom,16px)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/' || tab.to === '/staff'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] pt-2 pb-1 relative transition-colors duration-200 ${
                  isActive ? 'text-[#1C1917]' : 'text-[#A8A29E]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Top highlight bar */}
                  <span
                    className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-8 bg-[#FBBF24]'
                        : 'w-0 bg-transparent'
                    }`}
                  />

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className="transition-all duration-200"
                    />
                    {/* Amber dot under icon */}
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-[5px] h-[5px] bg-[#FBBF24]'
                          : 'w-0 h-0 bg-transparent'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] font-['Manrope'] mt-1 transition-all duration-200 ${
                      isActive ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
