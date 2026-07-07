import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  FileCheck, 
  CreditCard, 
  Bell, 
  LogOut, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-24 pb-28 md:pb-10 px-4 md:px-8 font-['Manrope'] text-[#1C1917]">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* Page Title */}
        <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold tracking-tight">
          My Profile
        </h1>

        {/* Profile Header Card */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#E7E5E4] shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#1C1917] text-[#FBBF24] flex items-center justify-center font-['Space_Grotesk'] font-bold text-xl flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col gap-1 overflow-hidden">
            <h2 className="font-['Space_Grotesk'] text-lg font-bold truncate">
              {user.name}
            </h2>
            <p className="text-[#57534E] text-sm truncate">{user.email}</p>
            <p className="text-[#57534E] text-sm">{user.phone}</p>
          </div>
        </div>

        {/* KYC & Documents Card */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#E7E5E4] shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg flex items-center gap-2">
              <FileCheck size={20} className="text-[#1C1917]" />
              KYC & Documents
            </h3>
            {user.kycStatus === 'Verified' && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                <CheckCircle2 size={14} />
                Verified
              </span>
            )}
          </div>
          
          <div className="bg-[#FFFDF8] border border-[#E7E5E4] rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">Driving Licence</span>
              <span className="text-[#57534E] text-sm">Front & Back Uploaded</span>
            </div>
            <button className="text-sm font-semibold text-[#1C1917] hover:text-[#FBBF24] transition-colors underline decoration-2 underline-offset-4">
              Update
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-[#FFFFFF] rounded-[18px] border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col">
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-[#F5F5F4] transition-colors text-left border-b border-[#E7E5E4]">
            <div className="flex items-center gap-3">
              <User size={20} className="text-[#57534E]" />
              <span className="font-semibold text-[15px]">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-[#A8A29E]" />
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-[#F5F5F4] transition-colors text-left border-b border-[#E7E5E4]">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-[#57534E]" />
              <span className="font-semibold text-[15px]">Payment Methods</span>
            </div>
            <ChevronRight size={18} className="text-[#A8A29E]" />
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-[#F5F5F4] transition-colors text-left">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#57534E]" />
              <span className="font-semibold text-[15px]">Notification Preferences</span>
            </div>
            <ChevronRight size={18} className="text-[#A8A29E]" />
          </button>

        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#E7E5E4] text-[#EF4444] hover:bg-red-50 hover:border-red-200 py-3.5 rounded-full font-bold text-[15px] transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
