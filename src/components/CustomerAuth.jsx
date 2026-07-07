import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle,
  Smartphone,
  Mail,
  User as UserIcon,
  Shield,
  AlertCircle,
} from 'lucide-react';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, checkPhoneRegistration } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign In state
  const [loginPhone, setLoginPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [dlFrontUploaded, setDlFrontUploaded] = useState(false);
  const [dlBackUploaded, setDlBackUploaded] = useState(false);

  const resetAll = () => {
    setLoginStep('phone');
    setShowPassword(false);
    setLoginPhone('');
    setOtpValue('');
    setSignupName('');
    setSignupMobile('');
    setSignupEmail('');
    setDlFrontUploaded(false);
    setDlBackUploaded(false);
    setError('');
  };

  const handleModeSwitch = (newMode) => {
    resetAll();
    setMode(newMode);
  };

  const handleSuccessRedirect = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from);
  };

  // ── SIGN IN: Step 1 — Validate phone ──
  const handlePhoneCheck = (e) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const exists = checkPhoneRegistration(loginPhone);
      if (exists) {
        setError('');
        setLoginStep('otp');
      } else {
        setError('This mobile number is not registered. Please register first.');
      }
    }, 800);
  };

  // ── SIGN IN: Step 2 — Verify OTP & login ──
  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otpValue.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const success = login(loginPhone);
      if (success) {
        alert('✅ Login successful! Welcome back, rider.');
        handleSuccessRedirect();
      } else {
        setError('Something went wrong. Please try again.');
      }
    }, 1000);
  };

  // ── SIGN UP ──
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupMobile.trim() || !signupEmail.trim()) return;

    // Check if phone already registered
    if (checkPhoneRegistration(signupMobile)) {
      setError('This mobile number is already registered. Please sign in instead.');
      return;
    }

    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signup({
        name: signupName,
        email: signupEmail,
        phone: signupMobile,
      });
      alert('✅ Account created successfully! Welcome to RIDE.');
      handleSuccessRedirect();
    }, 1200);
  };

  const handleDlUpload = (side) => {
    if (side === 'front') setDlFrontUploaded(true);
    else setDlBackUploaded(true);
  };

  // ─── Shared input styles ───
  const inputBase =
    "w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-[14px] px-4 py-3.5 text-[14px] font-['Manrope'] font-medium text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-all duration-200 focus:border-[#1C1917] focus:ring-2 focus:ring-[#1C1917]/10";

  // ─── Spinner SVG ───
  const Spinner = () => (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-[76px] font-['Manrope']">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-76px)]">

        {/* ────────────────────────────────────────────────────────── */}
        {/*  LEFT — Hero Image Panel                                  */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#1C1917]">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917]/80 via-[#1C1917]/50 to-transparent z-10" />

          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1400"
            alt="Premium motorcycle"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />

          {/* Content overlay */}
          <div className="relative z-20 flex flex-col justify-between p-12 w-full">
            {/* Top tag */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
              <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-[#FBBF24]">
                Premium Rentals
              </span>
            </div>

            {/* Bottom copy */}
            <div className="max-w-[440px]">
              <h2 className="font-['Space_Grotesk'] text-[42px] font-bold text-white leading-[1.1] tracking-tight">
                The road is
                <br />
                calling<span className="text-[#FBBF24]">.</span>
              </h2>
              <p className="mt-4 text-[15px] text-white/60 leading-relaxed font-medium">
                Unlock curated motorcycles from iconic marques. Book in 60 seconds, ride in minutes.
              </p>

              {/* Social proof strip */}
              <div className="mt-8 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-white">2,400+</span>
                  <span className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">Happy Riders</span>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-white">4.9★</span>
                  <span className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">Avg. Rating</span>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[24px] font-bold text-white">12</span>
                  <span className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">Cities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  RIGHT — Auth Form Panel                                  */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-[440px]">

            {/* Brand mark (mobile only) */}
            <div className="lg:hidden flex items-baseline gap-0 mb-8">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] tracking-tight text-[#1C1917]">
                RIDE
              </span>
              <span className="w-[8px] h-[8px] rounded-full bg-[#FBBF24] inline-block mb-[3px] ml-[2px]" />
            </div>

            {/* Heading */}
            <h1 className="font-['Space_Grotesk'] font-bold text-[30px] tracking-tight text-[#1C1917] leading-tight">
              {mode === 'signin'
                ? loginStep === 'otp'
                  ? 'Verify OTP'
                  : 'Welcome back'
                : 'Create your account'}
              <span className="text-[#FBBF24]">.</span>
            </h1>
            <p className="mt-2 text-[14px] text-[#57534E] font-medium">
              {mode === 'signin'
                ? loginStep === 'otp'
                  ? `We sent a code to +91 ${loginPhone}. Enter it below.`
                  : 'Sign in with your registered mobile number.'
                : 'Join the RIDE community and start your journey.'}
            </p>

            {/* ── Mode Toggle ── */}
            {loginStep === 'phone' && (
              <div className="mt-8 bg-[#F5F5F4] p-1 rounded-full flex">
                <button
                  onClick={() => handleModeSwitch('signin')}
                  className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer ${mode === 'signin'
                      ? 'bg-white text-[#1C1917] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#A8A29E] hover:text-[#57534E]'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeSwitch('signup')}
                  className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer ${mode === 'signup'
                      ? 'bg-white text-[#1C1917] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#A8A29E] hover:text-[#57534E]'
                    }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════════════════ */}
            {/*  SIGN IN FORM                                       */}
            {/* ════════════════════════════════════════════════════ */}
            {mode === 'signin' && loginStep === 'phone' && (
              <form onSubmit={handlePhoneCheck} className="mt-8 flex flex-col gap-5">
                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="tel"
                      placeholder="e.g. 7048786234"
                      value={loginPhone}
                      onChange={(e) => {
                        setLoginPhone(e.target.value.replace(/\D/g, ''));
                        if (error) setError('');
                      }}
                      maxLength={10}
                      className={`${inputBase} pl-11 ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}`}
                      required
                    />
                  </div>
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-1.5 mt-1 animate-[fadeSlideIn_0.3s_ease-out]">
                      <AlertCircle size={14} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#EF4444] font-medium leading-snug">
                        {error}
                      </span>
                    </div>
                  )}
                  <span className="text-[11px] text-[#A8A29E] font-medium mt-0.5">
                    Demo: use <span className="font-bold text-[#57534E]">7048786234</span> to test login
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading || loginPhone.length < 10}
                  className="mt-2 w-full bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] py-4 rounded-full font-semibold text-[15px] transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Checking…
                    </span>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ════════════════════════════════════════════════════ */}
            {/*  SIGN IN: OTP STEP                                  */}
            {/* ════════════════════════════════════════════════════ */}
            {mode === 'signin' && loginStep === 'otp' && (
              <form onSubmit={handleOtpVerify} className="mt-8 flex flex-col gap-5 animate-[fadeSlideIn_0.35s_ease-out]">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => { setLoginStep('phone'); setOtpValue(''); setError(''); }}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer w-fit"
                >
                  <ArrowLeft size={14} />
                  Change number
                </button>

                {/* Phone display chip */}
                <div className="flex items-center gap-2 bg-[#F5F5F4] px-4 py-2.5 rounded-full w-fit">
                  <Smartphone size={14} className="text-[#57534E]" />
                  <span className="text-[13px] font-semibold text-[#1C1917]">+91 {loginPhone}</span>
                  <CheckCircle size={14} className="text-green-600" />
                </div>

                {/* OTP field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    One-Time Password
                  </label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value.replace(/\D/g, ''));
                        if (error) setError('');
                      }}
                      className={`${inputBase} pl-11 tracking-[0.3em] font-semibold ${error ? 'border-[#EF4444]' : ''}`}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div className="flex items-start gap-1.5 mt-1">
                      <AlertCircle size={14} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#EF4444] font-medium">{error}</span>
                    </div>
                  )}
                  <span className="text-[11px] text-[#A8A29E] font-medium mt-0.5">
                    Demo: enter any 6 digits to proceed
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading || otpValue.length < 4}
                  className="mt-2 w-full bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] py-4 rounded-full font-semibold text-[15px] transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Verifying…
                    </span>
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ════════════════════════════════════════════════════ */}
            {/*  SIGN UP FORM                                       */}
            {/* ════════════════════════════════════════════════════ */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="mt-8 flex flex-col gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={`${inputBase} pl-11`}
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="tel"
                      placeholder="7048786234"
                      value={signupMobile}
                      onChange={(e) => {
                        setSignupMobile(e.target.value.replace(/\D/g, ''));
                        if (error) setError('');
                      }}
                      maxLength={10}
                      className={`${inputBase} pl-11 ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}`}
                      required
                    />
                  </div>
                  {/* Error for duplicate phone on signup */}
                  {error && (
                    <div className="flex items-start gap-1.5 mt-1 animate-[fadeSlideIn_0.3s_ease-out]">
                      <AlertCircle size={14} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#EF4444] font-medium leading-snug">
                        {error}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={`${inputBase} pl-11`}
                      required
                    />
                  </div>
                </div>

                {/* KYC Upload Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-[#57534E] uppercase tracking-wider">
                    KYC — Driving License
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* DL Front */}
                    <button
                      type="button"
                      onClick={() => handleDlUpload('front')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-[14px] border-2 border-dashed text-[13px] font-semibold transition-all duration-200 cursor-pointer ${dlFrontUploaded
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E] hover:border-[#FBBF24] hover:bg-[#FEF3C7]/30'
                        }`}
                    >
                      {dlFrontUploaded ? (
                        <>
                          <CheckCircle size={16} />
                          DL Front ✓
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload DL Front
                        </>
                      )}
                    </button>

                    {/* DL Back */}
                    <button
                      type="button"
                      onClick={() => handleDlUpload('back')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-[14px] border-2 border-dashed text-[13px] font-semibold transition-all duration-200 cursor-pointer ${dlBackUploaded
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E] hover:border-[#FBBF24] hover:bg-[#FEF3C7]/30'
                        }`}
                    >
                      {dlBackUploaded ? (
                        <>
                          <CheckCircle size={16} />
                          DL Back ✓
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload DL Back
                        </>
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-[#A8A29E] font-medium">
                    Demo: click to simulate upload
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] py-4 rounded-full font-semibold text-[15px] transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      Creating Account…
                    </span>
                  ) : (
                    <>
                      Create Account & Continue
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer fine print */}
            <p className="mt-6 text-center text-[12px] text-[#A8A29E] font-medium leading-relaxed">
              By continuing, you agree to RIDE's{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-[#57534E] transition-colors">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-[#57534E] transition-colors">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ── Custom keyframe (inline for portability) ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
