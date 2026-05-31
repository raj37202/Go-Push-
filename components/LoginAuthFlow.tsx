'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Mail, Lock, User, Sparkles, CheckCircle2, 
  HelpCircle, ShieldCheck, Check, AlertCircle, RefreshCw, Smartphone, ScanEye
} from "lucide-react";

interface LoginAuthFlowProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  isFaceIdRegistered: boolean;
  isFaceIdEnabled: boolean;
  isFaceUnlocked: boolean;
  setIsFaceIdRegistered: (reg: boolean) => void;
  setIsFaceIdEnabled: (en: boolean) => void;
  setIsFaceUnlocked: (unlocked: boolean) => void;
  onTriggerRegister: () => void;
  onTriggerUnlock: () => void;
}

export default function LoginAuthFlow({ 
  onBack, 
  onSuccess,
  isFaceIdRegistered,
  isFaceIdEnabled,
  isFaceUnlocked,
  setIsFaceIdRegistered,
  setIsFaceIdEnabled,
  setIsFaceUnlocked,
  onTriggerRegister,
  onTriggerUnlock
}: LoginAuthFlowProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [subTab, setSubTab] = useState<"email" | "mobile">("email");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Mobile OTP Sign In states
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [simulatedMobileOtp, setSimulatedMobileOtp] = useState("");

  // Recovery process states
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & simulated info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (subTab === "email") {
      if (!email || !password) {
        setErrorMsg("Kripya email aur password dono enter karein.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(email);
      }, 1200);
    } else {
      // Mobile login
      if (!mobileNumber) {
        setErrorMsg("Kripya apna mobile number enter karein.");
        return;
      }
      if (!isMobileOtpSent) {
        // Request OTP
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          const generated = Math.floor(100000 + Math.random() * 900000).toString();
          setSimulatedMobileOtp(generated);
          setIsMobileOtpSent(true);
          setSuccessMsg(`Secure Mobile OTP successfully generated for authentication: ${generated}`);
        }, 1100);
      } else {
        // Verify OTP
        if (mobileOtp !== simulatedMobileOtp) {
          setErrorMsg("Galat mobile login OTP code! Kripya sahi code fill karein.");
          return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess(mobileNumber + "@tel.pushnova");
        }, 1200);
      }
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!fullName || !email || !password || !mobileNumber) {
      setErrorMsg("Kripya apna Naam, Email, Mobile aur Password saare fields fill karein.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg("Aapko platform terms ke liye agree karna hoga.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email);
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess("user.gsignup@gmail.com");
    }, 1500);
  };

  const handleRecoveryEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!recoveryEmail) {
      setErrorMsg("Kripya apna email id fill karein.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtp(generatedCode);
      setResetStep(2);
      setSuccessMsg(`Ek password reset OTP code aapke email par bhej diya gaya hai: ${generatedCode}`);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!otpCode) {
      setErrorMsg("Kripya 6-digit OTP code fill karein.");
      return;
    }
    if (otpCode !== simulatedOtp) {
      setErrorMsg("Galat VIP security OTP! Kripya sahi code fill karein.");
      return;
    }

    setResetStep(3);
    setSuccessMsg("OTP Sahi hai! Kripya apna naya password select karein.");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newPassword || !confirmPassword) {
      setErrorMsg("Kripya naya password set karein.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords matching nahi ho rahe hain.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg("Aapka password badal chunka hai! Ab login karein.");
      setMode("signin");
      setResetStep(1);
      setEmail(recoveryEmail);
      setPassword(newPassword);
    }, 1300);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 relative z-10">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition mb-6 group cursor-pointer"
        id="auth-back-btn"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        <span>Ghar Par Wapas (Back)</span>
      </button>

      {/* Auth Card Container */}
      <div className="p-1.5 bg-gradient-to-tr from-[#7C3AED]/20 to-[#EC4899]/10 rounded-3xl border border-gray-800">
        <div className="bg-[#111827] rounded-[22px] p-7 relative overflow-hidden" id="auth-main-card">
          
          {/* Accent decoration background bubbles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 blur-[40px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#EC4899]/5 blur-[40px] rounded-full pointer-events-none" />

          {/* Logo brand (highly minimalised and shrunk) */}
          <div className="text-center mb-5">
            <h2 className="text-lg font-display font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-full animate-pulse" />
              Push<span className="text-[#7C3AED] text-sm">Nova</span> Accounts
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {mode === "signin" && "Sovereign Dashboard login portal"}
              {mode === "signup" && "PushNova client account registration"}
              {mode === "forgot" && "Reset your credential nodes"}
            </p>
          </div>

          {/* Messages info */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start space-x-2 p-2.5 rounded-lg bg-red-950/40 border border-red-500/20 text-[11px] text-red-200 mb-4"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start space-x-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 mb-4"
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MODE: SIGN IN */}
          {mode === "signin" && (
            <div className="space-y-4">
              {/* Login Method Sub-Tabs */}
              <div className="grid grid-cols-2 p-1 bg-gray-950/80 rounded-xl border border-gray-850 text-center mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setSubTab("email");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-bold tracking-tight uppercase transition ${
                    subTab === "email" ? "bg-purple-900/60 text-white shadow-sm border border-purple-500/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  📧 Gmail / Email ID
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubTab("mobile");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-bold tracking-tight uppercase transition ${
                    subTab === "mobile" ? "bg-purple-900/60 text-white shadow-sm border border-purple-500/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  📱 Mobile & OTP
                </button>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                {subTab === "email" ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-gray-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-gray-300">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot");
                            setResetStep(1);
                            setErrorMsg("");
                            setSuccessMsg("");
                            setRecoveryEmail(email);
                          }}
                          className="text-[10px] text-[#A855F7] hover:text-[#EC4899] font-medium transition"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-gray-300">Mobile Number (Mobile Se LogIn)</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                        />
                      </div>
                    </div>

                    {isMobileOtpSent && (
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-gray-300">Enter Received OTP Code</label>
                        <input
                          type="text"
                          required
                          placeholder="6-digit OTP code"
                          maxLength={6}
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value)}
                          className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-2.5 px-4 text-center font-mono font-bold tracking-widest text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{subTab === "mobile" && !isMobileOtpSent ? "Request OTP Code" : "Access Live Dashboard"}</span>
                  )}
                </button>
              </form>

              {/* Separator */}
              <div className="relative py-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-850"></div>
                </div>
                <span className="relative bg-[#111827] px-3 font-mono text-[9px] text-gray-500 uppercase">Or Secure Alternate</span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full bg-[#0B1120] hover:bg-[#111827] border border-gray-850 text-gray-300 hover:text-white py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-3 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ke saath login</span>
              </button>

              {/* INTEGRATED BIOMETRIC SECURE GATEWAY PANEL BELOW LOGIN INPUTS */}
              <div className="pt-3 border-t border-gray-850 mt-3.5 space-y-2 text-center">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <ScanEye className="w-3.5 h-3.5 text-pink-500" />
                    <span className="text-[10px] font-display text-gray-300 font-semibold uppercase tracking-wider">Face ID On / Off Switch:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const state = !isFaceIdEnabled;
                      setIsFaceIdEnabled(state);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("pushnova_face_id_enabled", String(state));
                      }
                      if (!state) {
                        setIsFaceUnlocked(false);
                      }
                    }}
                    className={`w-8 h-4.5 rounded-full transition-all duration-300 relative shrink-0 ${isFaceIdEnabled ? "bg-[#7C3AED]" : "bg-gray-800"}`}
                  >
                    <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all duration-300 shadow ${isFaceIdEnabled ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                {isFaceIdRegistered ? (
                  isFaceIdEnabled && (
                    <button
                      type="button"
                      onClick={onTriggerUnlock}
                      className="w-full bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-white hover:opacity-90 py-2 rounded-xl text-center tracking-tight text-[10px] leading-none font-bold font-mono flex items-center justify-center gap-2 transition"
                    >
                      <ScanEye className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                      <span>📸 FACE ID SE DIRECT LOGIN</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={onTriggerRegister}
                    className="w-full bg-gradient-to-r from-purple-600/10 to-pink-500/10 border border-[#7C3AED]/20 hover:border-purple-500/50 text-purple-200 font-bold text-[9px] py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <ScanEye className="w-3.5 h-3.5 text-purple-400" />
                    <span>📷 SETUP 1-CLICK INSTANT FACE ID ACCESS</span>
                  </button>
                )}
              </div>

              <div className="text-center pt-1.5">
                <span className="text-[11px] text-gray-500">Account nahi hai? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[11px] font-bold text-[#A855F7] hover:text-[#EC4899] underline transition"
                >
                  Naya Account Banayein
                </button>
              </div>
            </div>
          )}

          {/* MODE: SIGN UP */}
          {mode === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-300">Pura Naam (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-300">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 py-1">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 accent-[#7C3AED]"
                />
                <label htmlFor="agreed" className="text-[9px] text-gray-400 leading-normal">
                  Main PushNova ke Sovereign digital privacy policy aur lifetime conditions se sehmat hu.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <span>Sign Up Account</span>
                )}
              </button>

              {/* INTEGRATED BIOMETRIC SECURE GATEWAY PANEL BELOW SIGN UP INPUTS */}
              <div className="pt-3 border-t border-gray-850 mt-2 space-y-2 text-center">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">Automatic registration setup with Face ID:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const state = !isFaceIdEnabled;
                      setIsFaceIdEnabled(state);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("pushnova_face_id_enabled", String(state));
                      }
                    }}
                    className={`w-7 h-4 rounded-full transition duration-300 relative shrink-0 ${isFaceIdEnabled ? "bg-[#7C3AED]" : "bg-gray-800"}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition duration-300 shadow ${isFaceIdEnabled ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={onTriggerRegister}
                  className="w-full bg-gradient-to-r from-purple-600/10 to-pink-500/10 border border-[#7C3AED]/20 hover:border-purple-500/50 text-purple-200 font-bold text-[9px] py-1.5 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <ScanEye className="w-3.5 h-3.5 text-purple-450" />
                  <span>📷 Scan Face To Link Account Key</span>
                </button>
              </div>

              <div className="text-center pt-1 border-t border-gray-850">
                <span className="text-xs text-gray-500">Pehle se key register hai? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs font-bold text-[#A855F7] hover:text-[#EC4899] underline transition"
                >
                  Sign In Karein
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === "forgot" && (
            <div className="space-y-4">
              {/* STEP 1: Email Request Form */}
              {resetStep === 1 && (
                <form onSubmit={handleRecoveryEmailSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-300">Puraani Email ID (Enter Registered Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-3 px-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Generating OTP...</span>
                      </>
                    ) : (
                      <span>Reset Code Send Karein</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP Verification Form */}
              {resetStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-purple-950/40 border border-[#7C3AED]/20 rounded-xl text-center">
                    <span className="block text-[11px] text-gray-400 mb-1">VIP OTP Secure Key Sent:</span>
                    <strong className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">
                      {simulatedOtp}
                    </strong>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-300">6-Digit reset Security code (OTP)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 px-4 text-base font-bold font-mono tracking-wider text-center text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-3 px-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest transition duration-300 cursor-pointer"
                  >
                    Verify reset Code
                  </button>
                </form>
              )}

              {/* STEP 3: Brand New Password select form */}
              {resetStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-300">Naya Password (New Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-300">Password Confirm Karein</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#0B1120] border border-gray-850 focus:border-[#7C3AED] rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-3 px-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer text-center"
                  >
                    Set Password & Update Account
                  </button>
                </form>
              )}

              {/* INTEGRATED BIOMETRIC SETUP TRIGGER UNDER RESET PASSWORD FORMS AS WELL */}
              <div className="pt-3.5 border-t border-gray-850 mt-1.5 space-y-2 text-center bg-[#0d1321]/50 p-2.5 rounded-xl">
                <span className="block text-[9px] text-gray-400 font-mono">Need urgent recovery access using Face ID?</span>
                <button
                  type="button"
                  onClick={onTriggerUnlock}
                  className="w-full bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 text-purple-200 border border-purple-900/40 text-[10px] py-1.5 rounded-lg font-mono font-bold"
                >
                  🔒 USE REGISTERED BIOMETRIC LOCK OVERRIDE
                </button>
              </div>

              <div className="text-center pt-2 border-t border-gray-850">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                    setSuccessMsg("");
                    setResetStep(1);
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-white transition underline"
                >
                  Sign In Window par wapas jayein
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
