import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function StaffAdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'staff' && password === 'staff') {
      onLogin('staff');
      navigate('/staff/dashboard');
    } else if (username === 'admin' && password === 'admin') {
      onLogin('admin');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please contact IT support.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1917] flex items-center justify-center px-6 py-12 font-['Manrope']">
      <div className="w-full max-w-md bg-[#292524] p-8 md:p-10 rounded-[24px] shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FBBF24] opacity-[0.03] rounded-full blur-[80px]" />
        
        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-full bg-[#1C1917] flex items-center justify-center border border-white/10 shadow-inner">
            <Lock className="text-[#FBBF24]" size={24} />
          </div>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="font-['Space_Grotesk'] font-bold text-[32px] md:text-[36px] text-white tracking-tight mb-2 leading-tight">
            Internal Portal
          </h1>
          <p className="text-[#A8A29E] text-[15px] font-medium">
            Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57534E]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1C1917] border border-[#57534E] rounded-[14px] pl-12 pr-4 py-3.5 text-[15px] text-white placeholder:text-[#57534E] outline-none transition-all duration-200 focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[#A8A29E] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57534E]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1C1917] border border-[#57534E] rounded-[14px] pl-12 pr-4 py-3.5 text-[15px] text-white placeholder:text-[#57534E] outline-none transition-all duration-200 focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium px-4 py-3 rounded-[12px] animate-[fadeIn_0.3s_ease-out]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1917] font-bold text-[15px] py-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(251,191,36,0.2)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.35)] cursor-pointer active:scale-[0.98]"
          >
            Authenticate
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
