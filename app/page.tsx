'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { 
  Bell, CheckCircle2, FileText, Download, CreditCard, Sparkles, 
  HelpCircle, Gift, AlertCircle, ArrowRight, ArrowLeft, ScanEye, Lock, ShieldAlert, Check
} from "lucide-react";

import { ActiveCart } from "../components/types";
import LandingPage from "../components/LandingPage";
import CartFlow from "../components/CartFlow";
import Dashboard from "../components/Dashboard";
import AdminPanel from "../components/AdminPanel";
import LoginAuthFlow from "../components/LoginAuthFlow";
import FloatingChatbot from "../components/FloatingChatbot";
import FaceVerificationHub from "../components/FaceVerificationHub";

export default function Page() {
  const [currentTab, setCurrentTab] = useState<"landing" | "checkout" | "dashboard" | "admin" | "auth">("landing");
  const [loggedInEmail, setLoggedInEmail] = useState<string>("developer@aistudio.build");

  // Dynamic subscription plans management state
  const [plans, setPlans] = useState<any[]>(() => {
    const defaultPlans = [
      {
        name: "Lite 10K",
        originalPrice: 19,
        price: 10,
        save: "Special low-tier entry plan (Limited Offer)",
        desc: "Limited notification volume license. Best for small hobby websites or personal blogs.",
        features: [
          "10,000 Push Notifications Limit ONLY",
          "Unlimited Subscribers Access",
          "1 Single Website Integration Domain",
          "Basic Click Tracking Analytics",
          "Standard Delivery Queue Speed",
          "No white-label administration dashboards"
        ],
        popular: false
      },
      {
        name: "Starter",
        originalPrice: 449,
        price: 349,
        save: "Save up to $1,200/year over OneSignal Pro (Special $100 OFF Applied)",
        desc: "For small creators seeking absolute audience ownership.",
        features: [
          "Unlimited Subscribers",
          "Unlimited Domains Integration",
          "Unlimited Bulk Notifications",
          "Basic Click Analytics HUD",
          "Detailed Campaign Progress Reports",
          "CSV Format Subscriber Exports",
          "Standard WordPress Plugin Extension",
          "Sovereign REST API Access Node"
        ],
        popular: false
      },
      {
        name: "Pro",
        originalPrice: 749,
        price: 649,
        save: "Save up to $2,400/year over Pusher Pro (Special $100 OFF Applied)",
        desc: "Best for high-traffic media portals & dynamic websites.",
        features: [
          "Everything in Starter Plan tier",
          "Premium Subscriber Cohorts Analytics",
          "Full AI Writing suite integration",
          "Advanced Multi-step Automation Flows",
          "Dynamic Subscriber Segment Filters",
          "Automated Auto-Push RSS triggers",
          "Custom whitelabel user branding",
          "Multi-User Workspace Permissions",
          "Direct Developer Webhooks logs",
          "Priority 24/7 Technical Support SLA"
        ],
        popular: true
      },
      {
        name: "Agency",
        originalPrice: 1499,
        price: 1199,
        save: "Unbeatable multi-tenant capabilities (Mega $300 OFF Discount Applied)",
        desc: "For digital agencies, networks and modern SaaS operators.",
        features: [
          "Everything in Pro Plan tier",
          "Unlimited Clients portals creation",
          "Unlimited Shared client spaces",
          "Custom whitelabel rebranding panel",
          "Full Commercial Resell License keys",
          "Advanced low-level developer logs",
          "Dedicated VIP account manager support",
          "Forever free future upgrades forever"
        ],
        popular: false
      }
    ];

    if (typeof window !== "undefined") {
      const persisted = localStorage.getItem("pushnova_active_plans");
      if (persisted) {
        try {
          return JSON.parse(persisted);
        } catch {
          return defaultPlans;
        }
      }
    }
    return defaultPlans;
  });

  // Save updated plans list state helper
  const handleSavePlans = (newPlans: any[]) => {
    setPlans(newPlans);
    if (typeof window !== "undefined") {
      localStorage.setItem("pushnova_active_plans", JSON.stringify(newPlans));
    }
  };

  // Face ID biometrics parameters
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(false);
  const [isFaceIdRegistered, setIsFaceIdRegistered] = useState(false);
  const [isFaceUnlocked, setIsFaceUnlocked] = useState(false);
  const [showFaceUnlockOverlay, setShowFaceUnlockOverlay] = useState(false);
  const [targetTabPending, setTargetTabPending] = useState<any | null>(null);
  const [showRegisterFaceModal, setShowRegisterFaceModal] = useState(false);
  const [isFaceIdPanelOpen, setIsFaceIdPanelOpen] = useState(false);
  const faceIdDragControls = useDragControls();

  // Safely sync biometric parameters on client mount
  useEffect(() => {
    Promise.resolve().then(() => {
      setIsFaceIdEnabled(localStorage.getItem("pushnova_face_id_enabled") === "true");
      setIsFaceIdRegistered(localStorage.getItem("pushnova_face_id_registered") === "true");
    });
  }, []);

  // Secure customized route navigation wrapper to lock dashboards in biometrics
  const requestTabTransition = (tab: "landing" | "checkout" | "dashboard" | "admin" | "auth") => {
    if (isFaceIdEnabled && isFaceIdRegistered && !isFaceUnlocked && (tab === "dashboard" || tab === "admin" || tab === "checkout")) {
      setTargetTabPending(tab);
      setShowFaceUnlockOverlay(true);
    } else {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Cart, applied discount, and billing data
  const [activeCart, setActiveCart] = useState<ActiveCart>({ planName: "", price: 0 });
  const [invoice, setInvoice] = useState<{
    orderId: string;
    subtotal: number;
    tax: number;
    total: number;
    plan: string;
    discount: number;
    email: string;
    gatewayUsed?: string;
    razorpayId?: string;
  } | null>(null);

  // Conversion optimizers: promotional countdowns and trigger dialogs
  const [countdownMinutes, setCountdownMinutes] = useState(45);
  const [countdownSeconds, setCountdownSeconds] = useState(12);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  // Countdown timer calculation loops
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((sec) => {
        if (sec > 0) {
          return sec - 1;
        } else {
          setCountdownMinutes((min) => (min > 0 ? min - 1 : 45));
          return 59;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Exit intent simulator
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50 && !hasShownExitIntent && currentTab === "landing") {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExitIntent, currentTab]);

  // Actions
  const handlePlanSelect = (plan: string, price: number) => {
    setActiveCart({ planName: plan, price });
    setInvoice(null);
    requestTabTransition("checkout");
  };

  const handlePaymentSuccess = (info: {
    orderId: string;
    subtotal: number;
    tax: number;
    total: number;
    plan: string;
    discount: number;
    email: string;
    gatewayUsed?: string;
    razorpayId?: string;
  }) => {
    setInvoice(info);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const downloadSimulatedPdf = () => {
    if (!invoice) return;
    const documentBody = `
========================================
             INVOICE & RECEIPTS 
========================================
PushNova Inc. Sovereign Push Alerts
Invoice ID: ${invoice.orderId}
Billing Date: ${new Date().toLocaleDateString()}
Client Email: ${invoice.email}
Authorized Plan: PushNova ${invoice.plan} (LTD)
----------------------------------------
Core Original Price:     $${invoice.subtotal.toFixed(2)}
Promo Applied Discount:  -$${invoice.discount.toFixed(2)}
Calculated Sales GST:    $${invoice.tax.toFixed(2)}
----------------------------------------
Grand Settlement Paid:   $${invoice.total.toFixed(2)}
========================================
Status: 100% PAID & PROVISIONED
Thank you for choosing PushNova SaaS.
========================================
    `;
    const blob = new Blob([documentBody], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pushnova_invoice_${invoice.orderId}.txt`;
    a.click();
  };

  return (
    <div className="relative font-sans text-gray-200 bg-[#0B1120] min-h-screen">
      
      {/* Top sticky countdown ticker promotion banner */}
      {currentTab === "landing" && (
        <div className="bg-gradient-to-r from-purple-800 via-pink-700 to-purple-900 border-b border-purple-500/20 py-2.5 px-6 relative z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-white text-center gap-2">
            <span className="flex items-center space-x-2">
              <Gift className="w-4 h-4 animate-bounce" />
              <span>💥 <strong>SPECIAL SOVEREIGN LIFETIME OFFER:</strong> Save up to <strong>$300 OFF</strong> on Premium Licenses! Starter/Pro dropped by $100, Agency dropped by $300!</span>
            </span>
            <div className="flex items-center space-x-2 bg-black/30 py-1 px-3 rounded-full border border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Offer Ends In:</span>
              <span className="font-mono text-pink-300 font-extrabold">{countdownMinutes}m {countdownSeconds}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Switch router controller */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {currentTab === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage 
                onPlanSelect={handlePlanSelect} 
                onEnterDashboard={() => requestTabTransition("auth")}
                onEnterAdmin={() => requestTabTransition("admin")}
                plans={plans}
              />
            </motion.div>
          )}

          {currentTab === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 bg-[#0B1120]"
            >
              <LoginAuthFlow 
                onBack={() => requestTabTransition("landing")}
                onSuccess={(email) => {
                  setLoggedInEmail(email);
                  requestTabTransition("dashboard");
                }}
                isFaceIdRegistered={isFaceIdRegistered}
                isFaceIdEnabled={isFaceIdEnabled}
                isFaceUnlocked={isFaceUnlocked}
                setIsFaceIdRegistered={setIsFaceIdRegistered}
                setIsFaceIdEnabled={setIsFaceIdEnabled}
                setIsFaceUnlocked={setIsFaceUnlocked}
                onTriggerRegister={() => setShowRegisterFaceModal(true)}
                onTriggerUnlock={() => {
                  setTargetTabPending("dashboard");
                  setShowFaceUnlockOverlay(true);
                }}
              />
            </motion.div>
          )}

          {currentTab === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 bg-[#0B1120]"
            >
              {!invoice ? (
                <CartFlow 
                  cart={activeCart} 
                  onBack={() => requestTabTransition("landing")} 
                  onSuccess={handlePaymentSuccess}
                  plans={plans}
                />
              ) : (
                /* Payment Success summary invoice layout */
                <div className="max-w-3xl mx-auto px-6 text-center space-y-8 py-10">
                  <div className="relative p-1.5 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl inline-block">
                    <div className="w-16 h-16 rounded-[22px] bg-[#111827] flex items-center justify-center">
                      <CheckCircle2 className="text-emerald-400 w-10 h-10 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-display font-extrabold text-white">License Key Provisioned!</h1>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm">
                      Your high-throughput push notification queue has been provisioned under ID <strong className="text-white font-mono">{invoice.orderId}</strong>. Check your inbox for setup tokens details.
                    </p>
                  </div>

                  {/* Stunning Stripe/Vercel styled invoice details card */}
                  <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl max-w-lg mx-auto text-left relative">
                    <div className="absolute top-4 right-4 bg-emerald-950 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">100% SUCCESS</div>
                    
                    <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Official Receipt Payment</h3>
                    
                    <div className="space-y-3.5 text-xs text-gray-300 font-sans border-b border-gray-800 pb-5 mb-5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Merchant platform</span>
                        <strong className="text-white">PushNova Inc. (Ltd)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Allocated Plan</span>
                        <strong className="text-purple-300 font-bold">PushNova {invoice.plan} LTD</strong>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-b border-gray-800/40 py-2.5 my-1">
                        <span className="text-gray-400 font-mono text-[9px] uppercase tracking-wider font-bold">Plan Limits & Entitlements:</span>
                        <p className="text-[11px] text-gray-300 bg-purple-950/20 border border-purple-500/10 p-2 rounded-lg font-mono">
                          {(() => {
                            const activePlanDetails = plans.find(p => p.name.toLowerCase() === invoice.plan.toLowerCase());
                            return activePlanDetails ? activePlanDetails.desc : "Sovereign platform license keys for lifetime setup alerts and WordPress integration guidelines.";
                          })()}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Client Email Address</span>
                        <strong className="text-white truncate max-w-[200px]">{invoice.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Settled transaction Gateway</span>
                        <strong className="text-white font-mono uppercase text-[11px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-805/30">
                          {invoice.gatewayUsed === "stripe" ? "Stripe Secure API" : invoice.gatewayUsed || "Razorpay API Server"}
                        </strong>
                      </div>
                      {invoice.razorpayId && (
                        <div className="flex justify-between items-center bg-gray-950 px-2.5 py-1.5 rounded-lg border border-gray-850">
                          <span className="text-[10px] text-gray-400 font-mono">Razorpay ID Used</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold select-all">{invoice.razorpayId}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between text-gray-400">
                        <span>Original LTD Price</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                      </div>
                      {invoice.discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Promo code deduction</span>
                          <span>-${invoice.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-400">
                        <span>Calculated local sales Tax</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-800/80 pt-3.5 flex justify-between text-base font-display font-bold text-white">
                        <span>Total charged</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={downloadSimulatedPdf}
                      className="flex items-center space-x-2 bg-gray-900 border border-gray-800 hover:text-white text-gray-300 py-3.5 px-6 rounded-xl font-bold text-xs transition hover:bg-gray-800"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Invoice Receipt</span>
                    </button>
                    <button
                      onClick={() => requestTabTransition("dashboard")}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl shadow-lg shadow-purple-900/40 transition"
                    >
                      <span>Forward to Sovereign Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard 
                onBackToLanding={() => {
                  setLoggedInEmail("developer@aistudio.build");
                  requestTabTransition("landing");
                }}
                userEmail={loggedInEmail || (invoice ? invoice.email : "developer@aistudio.build")}
                initialPlan={invoice ? invoice.plan : "Pro"}
              />
            </motion.div>
          )}

          {currentTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel 
                onBack={() => requestTabTransition("landing")}
                subscribersCount={5}
                plans={plans}
                onSavePlans={handleSavePlans}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Intent dialog overlay modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#111827] border border-gray-800 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
            >
              {/* background subtle visual accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-xl rounded-full" />

              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-2xl shrink-0">
                  <Gift className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Wait! Secure Extra 10% Discount</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Own your subscribers database forever without monthly costs. Use code <span className="font-mono text-purple-400 font-bold">NOVA10</span> inside the cart to lock in your lifetime license with 10% instant off savings.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExitIntent(false)}
                  className="flex-grow bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-xs py-3 rounded-xl border border-gray-850 transition"
                >
                  Dismiss Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExitIntent(false);
                    setActiveCart({ planName: "Pro", price: 649 });
                    requestTabTransition("checkout");
                  }}
                  className="flex-grow bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-purple-900/30"
                >
                  Secure Pro Discount
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Floating Face ID Security Trigger (Top-Right) - Draggable */}
      <motion.div 
        id="face-id-floating-trigger" 
        drag
        dragListener={false}
        dragControls={faceIdDragControls}
        dragMomentum={false}
        className="fixed top-4 right-4 z-50 font-sans flex flex-col items-end"
      >
        <button
          type="button"
          onPointerDown={(e) => faceIdDragControls.start(e)}
          onClick={() => setIsFaceIdPanelOpen(!isFaceIdPanelOpen)}
          className="w-10 h-10 rounded-full bg-[#111827]/95 border border-purple-550/30 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: "none" }}
        >
          <ScanEye className={`w-4.5 h-4.5 text-purple-400 group-hover:text-pink-400 transition-colors ${isFaceIdEnabled && isFaceIdRegistered ? 'animate-pulse' : ''}`} />
          
          {/* Small Active Status dot indicator */}
          <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0B1120] ${
            isFaceIdEnabled && isFaceIdRegistered ? "bg-emerald-500 animate-pulse" : "bg-gray-600"
          }`} />
        </button>

        {/* Panel expanded near the trigger (drops down elegantly) */}
        <AnimatePresence>
          {isFaceIdPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 bg-[#111827]/95 border border-gray-800/80 rounded-2xl p-3 flex flex-col gap-2.5 w-52 shadow-2xl backdrop-blur-md relative"
            >
              <div className="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-gray-850">
                <div className="flex items-center gap-1 text-purple-400">
                  <ScanEye className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                  <span className="font-display tracking-tight text-[9.5px]">Biometric Lock</span>
                </div>
                <span className={`text-[7px] font-mono font-extrabold uppercase px-1 py-0.5 rounded ${
                  isFaceIdEnabled && isFaceIdRegistered ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/10" : "bg-gray-900 text-gray-500"
                }`}>
                  {isFaceIdEnabled && isFaceIdRegistered ? "ACTIVE" : "OFF"}
                </span>
              </div>

              {isFaceIdRegistered ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8.5px] text-gray-400 font-sans leading-tight">Enforce facial locks:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const state = !isFaceIdEnabled;
                        setIsFaceIdEnabled(state);
                        localStorage.setItem("pushnova_face_id_enabled", String(state));
                        if (!state) {
                          setIsFaceUnlocked(false);
                        }
                      }}
                      className={`w-7 h-4 rounded-full transition-all duration-300 relative shrink-0 ${isFaceIdEnabled ? "bg-purple-600" : "bg-gray-800"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow ${isFaceIdEnabled ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>
                  
                  {isFaceIdEnabled && (
                    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-gray-850/65">
                      <div className="flex items-center justify-between text-[8px] font-mono">
                        <span className="text-gray-500 font-bold">STATE:</span>
                        <span className={isFaceUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {isFaceUnlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>
                      {isFaceUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsFaceUnlocked(false);
                            requestTabTransition("landing");
                          }}
                          className="w-full bg-[#181024]/60 hover:bg-[#201034] text-purple-300 hover:text-white py-1 rounded-lg border border-purple-900/35 font-bold text-[8.5px] leading-none text-center transition"
                        >
                          🔒 LOCK SESSION NOW
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTargetTabPending(currentTab);
                            setShowFaceUnlockOverlay(true);
                          }}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-550 hover:to-pink-450 text-white font-extrabold py-1.5 rounded-lg text-center text-[8.5px] leading-none shadow-md transition"
                        >
                          ⚡ SECURE SCAN
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your current Face ID templates?")) {
                        localStorage.removeItem("pushnova_face_id_registered");
                        localStorage.removeItem("pushnova_face_id_enabled");
                        setIsFaceIdRegistered(false);
                        setIsFaceIdEnabled(false);
                        setIsFaceUnlocked(false);
                        setIsFaceIdPanelOpen(false);
                      }
                    }}
                    className="w-full text-center text-red-400/90 hover:text-red-300 font-mono text-[8px] hover:underline pt-1.5 border-t border-gray-850/50"
                  >
                    Clear Biometrics
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[8.5px] text-gray-400 leading-normal">
                    Protect credentials & keys with facial recognition locks.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegisterFaceModal(true);
                      setIsFaceIdPanelOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-550 hover:to-pink-450 text-white font-extrabold text-[8.5px] py-1.5 rounded-lg shadow-lg transition active:scale-95 text-center block"
                  >
                    📷 REGISTER FACE
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FaceID Registration Scanner Modal */}
      <AnimatePresence>
        {showRegisterFaceModal && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <FaceVerificationHub 
              mode="register" 
              onVerificationSuccess={() => {
                setIsFaceIdRegistered(true);
                setIsFaceIdEnabled(true);
                setIsFaceUnlocked(true);
                localStorage.setItem("pushnova_face_id_registered", "true");
                localStorage.setItem("pushnova_face_id_enabled", "true");
                setShowRegisterFaceModal(false);
              }} 
              onClose={() => setShowRegisterFaceModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FaceID Active Biometrics Lock Check Screen Overlay */}
      <AnimatePresence>
        {showFaceUnlockOverlay && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <FaceVerificationHub 
              mode="unlock" 
              onVerificationSuccess={() => {
                setIsFaceUnlocked(true);
                setShowFaceUnlockOverlay(false);
                if (targetTabPending) {
                  setCurrentTab(targetTabPending);
                  setTargetTabPending(null);
                }
              }} 
              onClose={() => {
                setShowFaceUnlockOverlay(false);
                setTargetTabPending(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global conversational AI Help Desk */}
      <FloatingChatbot onSelectPlan={handlePlanSelect} activeTab={currentTab} plans={plans} />

    </div>
  );
}
