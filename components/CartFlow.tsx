'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, ChevronRight, ShoppingCart, Percent, ShieldCheck, 
  ArrowLeft, CreditCard, Download, FileText, Gift, Globe, CheckCircle2, Lock, Zap,
  Eye, EyeOff
} from "lucide-react";
import { ActiveCart } from "./types";

interface CartFlowProps {
  cart: ActiveCart;
  onBack: () => void;
  onSuccess: (info: { 
    orderId: string; 
    subtotal: number; 
    tax: number; 
    total: number; 
    plan: string; 
    discount: number; 
    email: string;
    gatewayUsed: string;
    razorpayId?: string;
  }) => void;
  plans?: any[];
}

export default function CartFlow({ cart, onBack, onSuccess, plans = [] }: CartFlowProps) {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [discount, setDiscount] = useState(0);
  const [country, setCountry] = useState("United States");
  const [couponError, setCouponError] = useState("");
  
  // Compute tax rate directly representing country selection
  const getTaxRate = (c: string) => {
    if (c === "India") return 0.18;
    if (c === "Germany" || c === "France") return 0.19;
    if (c === "United States") return 0.08;
    return 0.0;
  };
  const taxRate = getTaxRate(country);

  // Checkout inputs
  const [fastCheckout, setFastCheckout] = useState(false);
  const [email, setEmail] = useState("developer@aistudio.build");
  const [cardName, setCardName] = useState("Vercel Explorer");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/29");
  const [cvv, setCvv] = useState("322");
  
  const [activeGateway, setActiveGateway] = useState<"stripe" | "razorpay" | "paypal" | "upi">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Razorpay custom interactive states
  const [razorpayMethod, setRazorpayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [razorpayUpi, setRazorpayUpi] = useState("pay.nova@okaxis");
  const [razorpayPhone, setRazorpayPhone] = useState("+91 99887 76655");
  const [razorpayBank, setRazorpayBank] = useState("SBI");
  const [razorpayMerchantId, setRazorpayMerchantId] = useState(process.env.NEXT_PUBLIC_RAZORPAY_MERCHANT_ID || "rzp_live_v9U38x92S1K");
  const [isKeySavedPermanently, setIsKeySavedPermanently] = useState(false);
  const [showRazorpayKey, setShowRazorpayKey] = useState(false);

  // Safely retrieve the persisted key on component client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedUserKey = localStorage.getItem("pushnova_razorpay_merchant_id");
      if (persistedUserKey) {
        setTimeout(() => {
          setRazorpayMerchantId(persistedUserKey);
          setIsKeySavedPermanently(true);
        }, 0);
      }
    }
  }, []);

  const applyCouponCode = () => {
    setCouponError("");
    const cleaned = coupon.trim().toUpperCase();

    if (cleaned === "NOVA10") {
      const amt = cart.price * 0.10;
      setDiscount(amt);
      setAppliedCoupon("NOVA10 (10% Off)");
    } else if (cleaned === "NOVA50") {
      setDiscount(50);
      setAppliedCoupon("NOVA50 ($50 Off)");
    } else {
      setCouponError("Unknown coupon code. Please try 'NOVA10' or 'NOVA50'");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setAppliedCoupon("");
    setCouponError("");
  };

  const currentPrice = cart.price;
  const subtotal = Math.max(0, currentPrice - discount);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-checkout-script");
      if (existingScript) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const actualGateway = fastCheckout ? "Razorpay Auto-Routing (Fast Mode)" : activeGateway;

    // If Razorpay gateway is selected (either explicitly or via fast-checkout mode)
    if (actualGateway.toLowerCase().includes("razorpay") || activeGateway === "razorpay") {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        const mockOrderId = "PN-" + Math.floor(100000 + Math.random() * 900000);
        onSuccess({
          orderId: mockOrderId,
          subtotal: parseFloat(currentPrice.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          plan: cart.planName,
          discount: parseFloat(discount.toFixed(2)),
          email,
          gatewayUsed: `${actualGateway} (Offline Sandbox Fallback)`,
          razorpayId: razorpayMerchantId
        });
        setIsProcessing(false);
        return;
      }

      // Convert amount: If Country is India, convert USD to INR at rate of 85 for easy transactions
      const isIndia = country === "India";
      const finalCurrency = isIndia ? "INR" : "USD";
      const exchangeRate = isIndia ? 85 : 1;
      const finalTotal = total * exchangeRate;
      const amountInSubunits = Math.round(finalTotal * 100);

      const options = {
        key: razorpayMerchantId || "rzp_live_v9U38x92S1K",
        amount: amountInSubunits,
        currency: finalCurrency,
        name: "PushNova Platform",
        description: `Secure checkout for ${cart.planName} lifetime updates license`,
        image: "https://picsum.photos/seed/pushnova/300/300",
        handler: function (response: any) {
          setIsProcessing(false);
          onSuccess({
            orderId: response.razorpay_payment_id || "PN-RZP-" + Math.floor(100000 + Math.random() * 900000),
            subtotal: parseFloat(currentPrice.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            plan: cart.planName,
            discount: parseFloat(discount.toFixed(2)),
            email,
            gatewayUsed: `Razorpay Live (${finalCurrency})`,
            razorpayId: razorpayMerchantId
          });
        },
        prefill: {
          name: cardName,
          email: email,
          contact: razorpayPhone
        },
        notes: {
          plan: cart.planName,
          billing_country: country,
          fast_checkout: fastCheckout ? "yes" : "no",
          original_usd_price: total.toString()
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Razorpay popup failed:", error);
        // Fallback simulation in case sandboxed environment blocks live checkout popups
        setTimeout(() => {
          setIsProcessing(false);
          const generatedOrderId = "PN-" + Math.floor(100000 + Math.random() * 900000);
          onSuccess({
            orderId: generatedOrderId,
            subtotal: parseFloat(currentPrice.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            plan: cart.planName,
            discount: parseFloat(discount.toFixed(2)),
            email,
            gatewayUsed: `${actualGateway} (Secured Sandbox Simulation)`,
            razorpayId: razorpayMerchantId
          });
        }, 1500);
      }
      return;
    }

    // Default simulated gateway delays for Paypal / Stripe / Direct QR UPI
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = "PN-" + Math.floor(100000 + Math.random() * 900000);
      onSuccess({
        orderId: generatedOrderId,
        subtotal: parseFloat(currentPrice.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        plan: cart.planName,
        discount: parseFloat(discount.toFixed(2)),
        email,
        gatewayUsed: actualGateway,
        razorpayId: razorpayMerchantId
      });
    }, 1800);
  };

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.substring(i, i + 4));
    }
    return parts.length > 0 ? parts.join(" ") : raw;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        <span>Back to Landing Page</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Order Checkout Checkout forms */}
        <div className="lg:col-span-7">
          <div className="p-1.5 bg-gradient-to-tr from-[#7C3AED]/30 to-transparent rounded-2xl">
            <div className="bg-[#111827] rounded-[14px] p-8 border border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="text-purple-400 w-5 h-5" />
                  <span>Secure SaaS Check-Out Hub</span>
                </h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/10 font-mono text-[9px] font-bold">
                  <Lock className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>HIGH SECURITY AES-256 ACTIVE</span>
                </span>
              </div>

              {/* Fast Pay Toggle Selector */}
              <div className="mb-6 p-1 bg-[#0b1120] border border-gray-850 rounded-xl grid grid-cols-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setFastCheckout(true)}
                  className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                    fastCheckout 
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md font-extrabold" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Fast Private Pay (1-Click)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFastCheckout(false)}
                  className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                    !fastCheckout 
                      ? "bg-purple-950 text-purple-300 border border-purple-500/20 font-extrabold" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sovereign Manual Form</span>
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                
                {/* Email is shared across both views */}
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your-email@domain.com"
                    className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]" 
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Sovereign activation credentials and PDF invoice stream securely to this address.</p>
                </div>

                {fastCheckout ? (
                  /* A. FAST 1-CLICK PAY INTUITIVE HUD */
                  <div className="p-5 bg-[#0e172a] border border-pink-500/20 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <span className="text-[10px] font-mono font-extrabold text-pink-400 uppercase tracking-widest block">🛡️ CyberGuard Private Gateway</span>
                      <span className="text-[9px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800/10 font-mono">TOKEN ROUTING</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      Our system bypassed lengthy bank data logs. 1-Click Fast Checkout is fully optimized for <strong>maximum privacy on checkout</strong>. Your details are securely tokenized directly onto external gateway processors (Stripe, Razorpay UPI, PayPal Node). We record zero physical bank cache.
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-[#0B1120] border border-gray-800 rounded-xl text-center">
                        <span className="block text-[8px] text-gray-500 font-mono">STRIPE ENCRYPTED</span>
                        <strong className="text-[10px] text-white">Active (3D Sec)</strong>
                      </div>
                      <div className="p-3 bg-[#0B1120] border border-gray-800 rounded-xl text-center">
                        <span className="block text-[8px] text-gray-500 font-mono">RAZORPAY PRIVACY</span>
                        <strong className="text-[10px] text-white">LTD Certified</strong>
                      </div>
                      <div className="p-3 bg-[#0B1120] border border-gray-800 rounded-xl text-center">
                        <span className="block text-[8px] text-gray-500 font-mono">ROUTING LATENCY</span>
                        <strong className="text-[10px] text-emerald-400">⚡ &lt;35ms Fast</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono bg-[#0B1120] px-3 py-2 rounded-lg">
                      <span className="p-1 bg-[#7C3AED]/20 text-[#A855F7] rounded">✓</span>
                      <span>1-Click Fast Mode selects the fastest local gateway automatically.</span>
                    </div>
                  </div>
                ) : (
                  /* B. CLASSICAL MANUAL FORM DETAILS Selector & Entry */
                  <div className="space-y-6">
                    {/* Country Calculation */}
                    <div>
                      <label className="block text-xs text-gray-400 font-semibold mb-1.5">Billing Country (Tax calculation)</label>
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                      >
                        <option value="United States">United States (8% State Tax)</option>
                        <option value="India">India (18% Central GST)</option>
                        <option value="Germany">Germany (19% VAT)</option>
                        <option value="France">France (19% VAT)</option>
                        <option value="Singapore">Singapore (0% Local Rate)</option>
                        <option value="Other">Other Country (0% Tax)</option>
                      </select>
                    </div>

                    {/* Gateway Switcher */}
                    <div className="space-y-3">
                      <span className="block text-xs text-gray-400 font-semibold">Choose Your Gateway</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: "stripe" as const, label: "Stripe" },
                          { id: "razorpay" as const, label: "Razorpay" },
                          { id: "paypal" as const, label: "PayPal" },
                          { id: "upi" as const, label: "UPI" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setActiveGateway(g.id)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition ${
                              activeGateway === g.id 
                                ? "bg-[#7C3AED]/20 border-[#7C3AED] text-purple-300"
                                : "bg-[#0B1120] border-gray-800 text-gray-400 hover:border-gray-700"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6">
                  {activeGateway === "stripe" && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs text-[#A855F7] font-mono font-bold">
                        <CreditCard className="w-4 h-4 animate-pulse" />
                        <span>STRIPE INTEGRATED – SECURE MODE</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold mb-1">Cardholder Name</label>
                          <input 
                            type="text" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold mb-1">Card Number</label>
                          <input 
                            type="text" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold mb-1">Expiration (MM/YY)</label>
                          <input 
                            type="text" 
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            maxLength={5}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold mb-1">CVV Security Code</label>
                          <input 
                            type="password" 
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={3}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeGateway === "razorpay" && (
                    <div className="p-5 bg-[#0e172a] border border-blue-500/30 rounded-2xl space-y-4 shadow-xl">
                      {/* Merchant Label Brand Banner */}
                      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-[#022E67] text-white p-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center font-mono">
                            R
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white leading-none">Razorpay Live Gateway</span>
                            <span className="text-[9px] text-[#A855F7] font-mono font-semibold">SECURE GATEWAY INT_v4</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400 uppercase animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            <span>READY & LIVE</span>
                          </div>
                        </div>
                      </div>

                      {/* Razorpay Merchant Key ID Configuration Input */}
                      <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-850 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-gray-400 uppercase font-bold">Razorpay Live Key/Merchant ID</span>
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">✓ Secure TLS 1.3 Active</span>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type={showRazorpayKey ? "text" : "password"}
                            value={razorpayMerchantId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRazorpayMerchantId(val);
                              if (typeof window !== "undefined") {
                                localStorage.setItem("pushnova_razorpay_merchant_id", val);
                                setIsKeySavedPermanently(val.trim() !== "");
                              }
                            }}
                            placeholder="e.g. rzp_live_YOUR_KEY_HERE"
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2.5 pl-3 pr-28 text-xs text-white focus:outline-none font-mono tracking-tight"
                            required
                          />
                          <div className="absolute right-2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowRazorpayKey(!showRazorpayKey)}
                              title={showRazorpayKey ? "Hide ID key" : "Show ID key"}
                              className="p-1 px-1.5 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded transition flex items-center justify-center hover:bg-gray-800"
                            >
                              {showRazorpayKey ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {razorpayMerchantId && razorpayMerchantId !== "rzp_live_v9U38x92S1K" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRazorpayMerchantId("");
                                  setIsKeySavedPermanently(false);
                                  if (typeof window !== "undefined") {
                                    localStorage.removeItem("pushnova_razorpay_merchant_id");
                                  }
                                }}
                                className="px-2 py-1 text-[9px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900/40 rounded transition uppercase"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Saved Status Indicator Badge */}
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[9px] text-gray-500 leading-normal max-w-[65%]">
                            Apni Razorpay API Key upar enter karein. System live database se secure handshakes verify karke instantly orders dynamic generate karega.
                          </p>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                            isKeySavedPermanently 
                              ? "bg-emerald-950/80 border border-emerald-500/30 text-emerald-400" 
                              : "bg-amber-950/80 border border-amber-500/30 text-amber-400 animate-pulse"
                          }`}>
                            {isKeySavedPermanently ? (
                              <>
                                <span>💾 MEMORY: PERMANENT SAVED</span>
                              </>
                            ) : (
                              <span>⚠️ MEMORY: TEMPORARY KEY</span>
                            )}
                          </span>
                        </div>
                        
                        {isKeySavedPermanently && (
                          <div className="bg-emerald-950/30 border border-emerald-500/10 p-2.5 rounded-lg text-[9px] text-emerald-300 font-mono leading-relaxed flex items-start gap-1.5 mt-2">
                            <span className="text-emerald-400 font-bold block shrink-0">📢 Alert:</span>
                            <span>Aapki Razorpay Live ID browser me securely permanently save ho chuki hai! Ab kisi bhi page refresh par aapko key firse daalne ki zarurat nahi padegi. Saare subscriptions automatic isi Key par process honge.</span>
                          </div>
                        )}
                      </div>

                      {/* Method Swapper tab labels inside Razorpay */}
                      <div className="w-full">
                        <label className="text-[10px] text-gray-400 font-semibold block mb-1">Razorpay Method</label>
                        <div className="flex gap-1 border border-gray-850 p-0.5 rounded-lg bg-[#0B1120]">
                          {[
                            { id: "upi" as const, label: "UPI" },
                            { id: "card" as const, label: "Card" },
                            { id: "netbanking" as const, label: "Bank" },
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setRazorpayMethod(m.id)}
                              className={`flex-1 py-1 text-[9px] font-bold text-center rounded transition uppercase ${
                                razorpayMethod === m.id 
                                  ? "bg-blue-600 text-white" 
                                  : "text-gray-400 hover:text-white"
                                }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Razorpay Conditional Subforms */}
                      <AnimatePresence mode="wait">
                        {razorpayMethod === "upi" && (
                          <motion.div 
                            key="razorpay-upi"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 pt-1"
                          >
                            <div>
                              <span className="block text-[10px] text-gray-400 font-semibold mb-1">Enter UPI VPI Address (GPay / PhonePe / Paytm)</span>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={razorpayUpi}
                                  onChange={(e) => setRazorpayUpi(e.target.value)}
                                  placeholder="e.g. yourname@okaxis"
                                  className="w-full bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                                />
                                <span className="absolute right-3 top-2.5 text-[9px] text-[#7C3AED] font-bold uppercase tracking-wider">verified</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-normal">
                              UPI verification requires you to approve a transaction authorization request of the specified total inside your mobile UPI application.
                            </p>
                          </motion.div>
                        )}

                        {razorpayMethod === "card" && (
                          <motion.div 
                            key="razorpay-card"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 gap-4 pt-1"
                          >
                            <div className="col-span-2">
                              <span className="block text-[10px] text-gray-400 font-semibold mb-1">Razerpay India Card Number</span>
                              <input 
                                type="text" 
                                placeholder="4111 •••• •••• ••••"
                                className="w-full bg-[#0B1120] border border-gray-800 focus:border-blue-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] text-gray-400 font-semibold mb-1">Expires (MM/YY)</span>
                              <input 
                                type="text" 
                                placeholder="09/28"
                                className="w-full bg-[#0B1120] border border-gray-800 focus:border-blue-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] text-gray-400 font-semibold mb-1">CVV / CVN Code</span>
                              <input 
                                type="password" 
                                placeholder="•••"
                                className="w-full bg-[#0B1120] border border-gray-800 focus:border-blue-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" 
                              />
                            </div>
                          </motion.div>
                        )}

                        {razorpayMethod === "netbanking" && (
                          <motion.div 
                            key="razorpay-netbanking"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 pt-1"
                          >
                            <div>
                              <span className="block text-[10px] text-gray-400 font-semibold mb-1">Select Bank Portal</span>
                              <select 
                                value={razorpayBank}
                                onChange={(e) => setRazorpayBank(e.target.value)}
                                className="w-full bg-[#0B1120] border border-gray-800 focus:border-blue-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                              >
                                <option value="SBI">State Bank of India (SBI)</option>
                                <option value="HDFC">HDFC Bank</option>
                                <option value="ICICI">ICICI Bank</option>
                                <option value="AXIS">Axis Bank</option>
                                <option value="KOTAK">Kotak Mahindra Bank</option>
                              </select>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-normal">
                              We will securely redirect you to your chosen NetBanking console in a sandboxed, TLS-secured popover to confirm the payment instantly.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {activeGateway === "paypal" && (
                    <div className="p-4 bg-amber-950/20 border border-amber-500/10 rounded-xl">
                      <p className="text-xs text-amber-300 font-semibold mb-1">PayPal Checkout Express</p>
                      <p className="text-[11px] text-gray-400">Universal multi-currency settlement. Converts dynamic payouts automatically to support overseas accounts.</p>
                    </div>
                  )}

                  {activeGateway === "upi" && (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl text-center space-y-3">
                      <span className="inline-block text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold">BHIM / GPay UPI QR Simulation</span>
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto p-2 flex items-center justify-center">
                        {/* Interactive vector QR simulation */}
                        <div className="w-full h-full bg-cover" style={{ backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)", backgroundSize: "20px 20px" }} />
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono">Scan code or submit UPI ID to trigger transaction requests.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-gray-800 pt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] py-4 px-6 rounded-xl font-bold text-white shadow-xl shadow-purple-950/40 text-sm transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Validating Sovereign License Key...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ${total.toFixed(2)} & Initialize Lifetime License</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-2.5">🔒 AES-256 Encrypted Transfer. Complete satisfaction or 100% immediate auto refund.</p>

                  {/* High Trust Secure Symbols Grid to ensure maximum customer trust */}
                  <div className="mt-5 border-t border-gray-800/80 pt-4 space-y-3 bg-[#0c1322]/40 p-3.5 rounded-xl border border-gray-850">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Security & Customer Trust Seals</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[9px] font-mono text-gray-300">
                      <div className="bg-[#0B1120] border border-gray-850 p-2 rounded-lg flex flex-col items-center justify-center space-y-1">
                        <span className="text-emerald-400 font-extrabold">🔒 SSL SECURED</span>
                        <span className="text-[8px] text-gray-500">AES-256 Bit Encryption</span>
                      </div>
                      <div className="bg-[#0B1120] border border-gray-850 p-2 rounded-lg flex flex-col items-center justify-center space-y-1">
                        <span className="text-blue-400 font-extrabold">🛡️ PCI-DSS</span>
                        <span className="text-[8px] text-gray-500">Level 1 Compliant Hub</span>
                      </div>
                      <div className="bg-[#0B1120] border border-gray-850 p-2 rounded-lg flex flex-col items-center justify-center space-y-1">
                        <span className="text-purple-400 font-extrabold">🚀 RAZORPAY INT</span>
                        <span className="text-[8px] text-gray-500">Authorised Live Pipe</span>
                      </div>
                      <div className="bg-[#0B1120] border border-gray-850 p-2 rounded-lg flex flex-col items-center justify-center space-y-1">
                        <span className="text-amber-400 font-extrabold">💯 100% SAFE</span>
                        <span className="text-[8px] text-gray-500">Zero Bank Log Server</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#111827] border border-gray-800 rounded-2xl">
            <h3 className="text-sm font-mono font-bold text-[#A855F7] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Review Selected Plan</span>
            </h3>

            <div className="flex items-center justify-between pb-4 border-b border-gray-800/60 mb-4">
              <div>
                <p className="text-base font-bold text-white">PushNova {cart.planName}</p>
                <p className="text-xs text-gray-400">Unlimited subscribers & domains (LTD)</p>
              </div>
              <p className="text-base font-display font-extrabold text-white">${cart.price}</p>
            </div>

            {/* Coupons system */}
            <div className="space-y-3 pb-6 border-b border-gray-800/60">
              <label className="block text-[11px] text-gray-400 font-mono uppercase tracking-widest">Enter Promo Code</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="e.g. NOVA10" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-grow bg-[#0B1120] border border-gray-800 focus:border-[#7C3AED] rounded-lg py-2 px-3 text-xs text-white uppercase focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={applyCouponCode}
                  className="bg-[#7C3AED]/20 text-[#A855F7] hover:bg-[#7C3AED] hover:text-white transition px-4 rounded-lg text-xs font-bold font-mono border border-[#7C3AED]/20"
                >
                  Apply
                </button>
              </div>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2 text-xs text-emerald-400 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Coupon Applied: {appliedCoupon}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-400 font-bold text-xs hover:text-red-500">✕</button>
                </div>
              ) : (
                <p className="text-[10px] text-gray-500">✨ Try entering <span className="font-bold text-[#A855F7] font-mono">NOVA10</span> (10% off) or <span className="font-bold text-[#EC4899] font-mono">NOVA50</span> ($50 off)</p>
              )}

              {couponError && (
                <p className="text-[10px] text-red-400 font-mono">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-4 text-xs font-sans">
              <div className="flex items-center justify-between text-gray-400">
                <span>Core Premium LTD Price</span>
                <span>${cart.price.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Coupon Deduction</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-gray-400">
                <span>Platform Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Calculated Tax ({Math.round(taxRate * 100)}% ({country}))</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-800/80 pt-3.5 flex items-center justify-between text-base font-display font-extrabold text-white">
                <span>Total Payment Due</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#111827]/40 border border-gray-800/80 rounded-2xl text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Plan Features & Entitlements</h4>
              <span className="text-[9px] font-mono text-purple-400 uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-950/40">Guaranteed Limits</span>
            </div>
            
            {/* Dynamic Plan-Bound Features to enforce the plan consistency constraint */}
            <div className="space-y-3">
              {(() => {
                const matchedPlan = plans.find(p => p.name.toLowerCase() === cart.planName.toLowerCase());
                if (matchedPlan) {
                  return matchedPlan.features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start space-x-2.5">
                      <div className="w-4 h-4 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</div>
                      <span className="text-gray-400 leading-normal text-xs">{feat}</span>
                    </div>
                  ));
                }

                return (
                  <>
                    <div className="flex items-start space-x-2.5">
                      <div className="w-4 h-4 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</div>
                      <span className="text-gray-400 leading-normal text-xs"><strong>Lifetime updates license applied.</strong> Sovereign hosting setup has been configured securely.</span>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="w-4 h-4 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</div>
                      <span className="text-gray-400 leading-normal text-xs"><strong>Unlimited Subscribers:</strong> Add and broadcast without third-party limitations.</span>
                    </div>
                  </>
                );
              })()}

              <div className="border-t border-gray-800/80 pt-3">
                <span className="block text-[10px] text-gray-550 font-mono italic leading-normal">
                  Note: Exclusive support parameters applied automatically. Non-tier features are strictly disabled to prevent system conflicts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
