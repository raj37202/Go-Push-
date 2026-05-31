'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, Play, Bell, Shield, Zap, TrendingUp, Sparkles, BarChart3,
  Globe, Globe2, Cpu, Smartphone, Settings, Users, ArrowRight, Star,
  X, Lock, Mail, Send, FileText
} from "lucide-react";
import { ActiveCart } from "./types";

interface LandingProps {
  onPlanSelect: (plan: string, price: number) => void;
  onEnterDashboard: () => void;
  onEnterAdmin: () => void;
  plans: any[];
}

const simulatedPurchases = [
  { name: "Rahul Sharma", city: "Delhi", country: "IN", plan: "Agency LTD", timeago: "15s ago" },
  { name: "Sarah Jenkins", city: "Austin, Texas", country: "US", plan: "Pro LTD", timeago: "42s ago" },
  { name: "Amit Goel", city: "Mumbai, Maharashtra", country: "IN", plan: "Agency LTD", timeago: "9s ago" },
  { name: "Dietrich Müller", city: "Munich", country: "DE", plan: "Starter LTD", timeago: "28s ago" },
  { name: "Siddharth Verma", city: "Bangalore", country: "IN", plan: "Pro LTD", timeago: "4s ago" },
  { name: "Jean-Pierre", city: "Paris", country: "FR", plan: "Agency LTD", timeago: "16s ago" },
  { name: "Priya Nair", city: "Chennai", country: "IN", plan: "Agency LTD", timeago: "25s ago" },
  { name: "Michael Carter", city: "London", country: "UK", plan: "Pro LTD", timeago: "37s ago" }
];

export default function LandingPage({ onPlanSelect, onEnterDashboard, onEnterAdmin, plans }: LandingProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentModal, setCurrentModal] = useState<"terms" | "privacy" | "contact" | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Dynamic purchase notifications popping up every 20 seconds
  const [purchaseToast, setPurchaseToast] = useState<typeof simulatedPurchases[0] | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  React.useEffect(() => {
    let index = 0;
    // Highlight first purchase action after 4s
    const firstTimeout = setTimeout(() => {
      setPurchaseToast(simulatedPurchases[0]);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 6000);
    }, 4000);

    // Triggers notification purchasing prompt every 20 seconds
    const interval = setInterval(() => {
      index = (index + 1) % simulatedPurchases.length;
      setPurchaseToast(simulatedPurchases[index]);
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 6000);
    }, 20000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  const features = [
    { icon: <Users className="text-purple-400 w-5 h-5" />, title: "Unlimited Subscribers", desc: "No limits, no sudden upgrades or unexpected monthly charges ever." },
    { icon: <Globe className="text-pink-400 w-5 h-5" />, title: "Unlimited Domains", desc: "Install and manage push alerts on as many portals as you own." },
    { icon: <Zap className="text-amber-400 w-5 h-5" />, title: "Instant Notification Blast", desc: "High throughput distribution queues deploy millions of notifications instantly." },
    { icon: <BarChart3 className="text-blue-400 w-5 h-5" />, title: "Advanced Analytics", desc: "Track click telemetry, real-time subscriber activity, and conversion rates." },
    { icon: <Sparkles className="text-purple-400 w-5 h-5" />, title: "AI Campaign Assistant", desc: "Generates high-conversion notification headers, messages, and calls to action instantly." },
    { icon: <Cpu className="text-emerald-400 w-5 h-5" />, title: "Drip Automation Flows", desc: "Schedule welcome streams, abandoned cart trigger loops, and updates automatically." },
    { icon: <Shield className="text-red-400 w-5 h-5" />, title: "White Label Console", desc: "Full sovereign hosting control. Hide our identity and badge it under your business." },
    { icon: <Smartphone className="text-indigo-400 w-5 h-5" />, title: "WordPress Plugin Integration", desc: "Zero coding. Get active on any standard WordPress ecosystem in 60 seconds." },
  ];

  // Plans are received dynamically from the parent component props

  const testimonials = [
    { quote: "PushNova saved us over $12,400 query fees month-over-month. Switched from OneSignal, delivery is literally instantaneous.", author: "Marcus Vance", role: "VP Growth, TechMedia" },
    { quote: "Having no recurring bill feels like a cheat code. Built-in AI copywriting features boosted our notifications CTR by 5.4%.", author: "Priya Sharma", role: "E-Commerce Founder, GlowUp" }
  ];

  return (
    <div className="relative font-sans text-gray-200 bg-[#0B1120]">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating Sparkle Gradient Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-pink-600/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      {/* Hero Header Utility */}
      <header className="sticky top-0 z-50 h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-gray-800 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior: "smooth"})}>
            <div className="w-8 h-8 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              <span className="text-sm font-extrabold uppercase">P</span>
            </div>
            <div>
              <span className="text-xl font-display font-bold text-white tracking-tight">Push<span className="text-[#7C3AED]">Nova</span></span>
              <span className="text-[9px] block font-mono text-[#A855F7] -mt-1 font-semibold tracking-wider">LIFETIME SOVEREIGNTY</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition">Platform</a>
            <a href="#ai" className="hover:text-white transition flex items-center space-x-1">
              <span>AI Tools</span>
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-[9px] px-1.5 py-0.5 rounded text-white font-bold uppercase">Gen</span>
            </a>
            <a href="#pricing" className="text-[#7C3AED] hover:text-[#EC4899] transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">Docs</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onEnterDashboard}
              className="px-4 py-2 text-xs font-semibold hover:text-white transition text-gray-300 border border-gray-800 rounded-lg hover:bg-gray-900"
            >
              Demo Dashboard
            </button>
            <button 
              onClick={onEnterAdmin}
              className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full text-xs font-semibold transition-all shadow-lg shadow-purple-500/20 text-white"
            >
              Admin Console
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Description and Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Banner Announcement */}
            <div className="inline-flex items-center space-x-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1.5 rounded-full text-xs text-[#A855F7] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#EC4899] animate-pulse" />
              <span className="font-mono tracking-tight font-bold uppercase text-[10px]">✨ SOVEREIGN OWNERSHIP – NO MONTHLY FEES FOREVER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
              Unlimited Push <br />
              Notifications. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">One-Time Payment</span>.
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed font-sans">
              Own your entire audience forever. Free yourself from greedy recurring subscription pricing limits. Send instant push notifications across unlimited domains instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a 
                href="#pricing"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:bg-gradient-to-r hover:from-[#6D28D9] hover:to-[#DB2777] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xl shadow-purple-900/30 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <span>Lock in One-Time Price</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={onEnterDashboard}
                className="flex items-center justify-center space-x-2 bg-[#111827] border border-gray-800 text-gray-300 hover:text-white px-6 py-3.5 rounded-xl text-sm font-medium transition hover:bg-gray-900 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 text-[#7C3AED] fill-current" />
                <span>Interactive Live Play</span>
              </button>
            </div>

            {/* Glowing 5-Star sovereign trust rating block */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-800/60">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 border border-gray-950 flex items-center justify-center font-bold text-[9px] text-white">R</div>
                <div className="w-8 h-8 rounded-full bg-pink-600 border border-gray-950 flex items-center justify-center font-bold text-[9px] text-white">K</div>
                <div className="w-8 h-8 rounded-full bg-purple-600 border border-gray-950 flex items-center justify-center font-bold text-[9px] text-white">S</div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 border border-gray-950 flex items-center justify-center font-bold text-[9px] text-white">A</div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs font-extrabold text-white ml-2">5-Star Elite Sovereign Rating</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono tracking-tight">Verified by 9,999+ self-hosted WordPress &amp; SaaS owners worldwide</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual stacked 3D push notification simulation screen */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#7C3AED]/20 to-[#EC4899]/20 blur-3xl rounded-full opacity-40 pointer-events-none" />
            
            {/* Phone device mockup casing */}
            <div className="relative w-76 sm:w-80 bg-[#0d1527] border-4 border-gray-800 rounded-[40px] px-4 py-8 shadow-2xl flex flex-col space-y-4 overflow-hidden transform hover:rotate-1 transition-transform duration-300">
              {/* Phone ear speaker & camera groove */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-gray-800 rounded-full flex items-center justify-center space-x-1">
                <div className="w-10 h-1.5 bg-gray-700 rounded-full" />
                <div className="w-2 h-2 bg-gray-700 rounded-full" />
              </div>

              {/* Top lockscreen time banner */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono font-bold px-2 pt-1 border-b border-gray-900 pb-2">
                <span>9:41 AM UTC</span>
                <span className="text-emerald-400 animate-pulse flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>SECURE CONNECTED</span>
                </span>
              </div>

              {/* Mock Lock Screen Notification Card 1 */}
              <div className="p-3 bg-[#111827]/90 border border-gray-800 rounded-2xl shadow-xl flex flex-col space-y-2 relative transition duration-300 hover:border-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-4 h-4 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-sm flex items-center justify-center text-[8px] font-black text-white">PN</div>
                    <span className="text-[9px] font-bold text-white tracking-wide uppercase">PushNova AI Agent</span>
                  </div>
                  <span className="text-[8px] text-gray-500 font-mono">Just Now</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-white">⚡ Flash Sale: 94% Conversion Boost!</h4>
                  <p className="text-[9px] text-gray-400 leading-normal mt-0.5">Your campaign was successfully drafted and autogenerated using direct Gemini. 4,213 clicks estimated.</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button onClick={onEnterDashboard} className="bg-purple-950 hover:bg-purple-900 text-purple-300 text-[8px] font-extrabold py-1 rounded text-center transition">
                    Approve Blast ✅
                  </button>
                  <button onClick={onEnterDashboard} className="bg-gray-800 hover:bg-gray-750 text-gray-300 text-[8px] font-bold py-1 rounded text-center transition">
                    Edit Copy ✏️
                  </button>
                </div>
              </div>

              {/* Stacked Mock Card 2 */}
              <div className="p-3 bg-[#111827]/70 border border-gray-800/80 rounded-2xl shadow-lg flex flex-col space-y-1.5 opacity-80 scale-95 transition duration-300 hover:opacity-100 hover:scale-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-4 h-4 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] font-black text-white">CG</div>
                    <span className="text-[9px] font-bold text-emerald-400 tracking-wide uppercase">CyberGuard Shield</span>
                  </div>
                  <span className="text-[8px] text-gray-500 font-mono">5m ago</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-white">🛡️ Threat Scan Completed</h4>
                  <p className="text-[9px] text-gray-400 leading-normal mt-0.5">Checked &quot;https://my-checkout-link.com&quot;. Safety score: 99/100 (Unsafe telemetry triggers clean).</p>
                </div>
              </div>

              {/* Mock Floating Stats Bubble */}
              <div className="bg-[#1e1b4b] border border-[#a855f7]/30 shadow-2xl p-2.5 rounded-xl flex items-center space-x-2 w-full animate-bounce [animation-duration:5s] !mt-8">
                <div className="p-1 bg-[#a855f7]/20 rounded-lg text-xs">🔔</div>
                <div>
                  <span className="block text-[8px] text-purple-400 font-mono font-bold leading-none">REALTIME ENGAGEMENT</span>
                  <span className="text-[10px] font-bold text-white">Active CTR: 18.45% peak speed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Brand/Supported Platforms Row requested by user */}
      <div className="max-w-7xl mx-auto px-6 py-4 pb-10">
        <div className="bg-[#111827]/40 border border-gray-800/80 rounded-2xl p-4 sm:p-5 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Supported Platforms: Add, Link & Connect Any Website In 1-Click</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1">
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">Ⓜ️</span>
              <span className="text-xs font-bold font-mono text-gray-200">WordPress</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">🛍️</span>
              <span className="text-xs font-bold font-mono text-gray-200">Shopify</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">🛒</span>
              <span className="text-xs font-bold font-mono text-gray-200">WooCommerce</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-bold font-mono text-gray-200">Custom HTML/PHP</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">📝</span>
              <span className="text-xs font-bold font-mono text-gray-200">Blogger</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">⚡</span>
              <span className="text-xs font-bold font-mono text-gray-200">Webflow</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-950/50 border border-gray-850 px-3.5 py-1.5 rounded-xl hover:border-purple-500/30 transition">
              <span className="text-sm">⚛️</span>
              <span className="text-xs font-bold font-mono text-gray-200">Next.js/React</span>
            </div>
          </div>
        </div>
      </div>

        {/* Live Mock Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto p-1 border border-gray-800/80 bg-[#111827] backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.05)]">
          <div className="p-6 text-center border-r border-b md:border-b-0 border-gray-800/60">
            <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Total Delivery Blast</p>
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">12M+</p>
            <p className="text-xs text-emerald-400 mt-1 font-semibold">Sent Monthly</p>
          </div>
          <div className="p-6 text-center md:border-r border-b md:border-b-0 border-gray-800/60">
            <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Active Portals</p>
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">50K+</p>
            <p className="text-xs text-purple-400 mt-1 font-semibold">Campaigns</p>
          </div>
          <div className="p-6 text-center border-r border-gray-800/60">
            <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Delivery Success Ratio</p>
            <p className="text-3xl md:text-4xl font-display font-extrabold text-green-400">99.9%</p>
            <p className="text-xs text-pink-400 mt-1 font-semibold">Delivery Rate</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Subscribers Registered</p>
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">8.5 Million+</p>
            <p className="text-[11px] text-blue-400 mt-1 font-semibold">Across multiple OS</p>
          </div>
        </div>

      {/* Features Overview */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-gray-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-extrabold mb-4 tracking-tight text-white leading-tight">
            Designed for Zero Friction Sovereignty
          </h2>
          <p className="text-gray-400">
            No forced monthly payments, no client restrictions, and fully optimized for maximum conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#111827] border border-gray-800 hover:border-[#7C3AED]/40 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Intelligence Module */}
      <section id="ai" className="py-20 border-t border-gray-900 bg-[#0B1120]/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#EC4899]/10 border border-[#EC4899]/20 px-3 py-1 rounded-full text-xs text-[#EC4899] mb-4 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COGNITIVE PUSH ENGINE</span>
            </div>
            <h2 className="text-4xl font-display font-extrabold tracking-tight text-white mb-6">
              Empower Campaigns with Sovereign Google AI
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              PushNova is directly supercharged with built-in server-side AI integrations. Get copy recommendations and prediction insights on your dashboard immediately.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mt-0.5">
                  <Check className="text-[#A855F7] w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-gray-300"><span className="text-purple-200 font-semibold">AI Headline / CTA Synthesizer:</span> Create hyper-urgent headers in seconds.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-[#EC4899]/10 border border-[#EC4899]/20 flex items-center justify-center mt-0.5">
                  <Check className="text-[#EC4899] w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-gray-300"><span className="text-pink-200 font-semibold">AI Campaign Predictive Click Stats:</span> Pre-evaluate your messages for CTR success rate before broadcasting.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mt-0.5">
                  <Check className="text-[#A855F7] w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-gray-300"><span className="text-blue-200 font-semibold">Live Sandbox Device Mockup:</span> Real-time instant visual feedback of notification shapes.</span>
              </li>
            </ul>
          </div>

          <div className="relative p-1 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#0B1120] rounded-[22px] p-8">
              <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-[#EC4899] w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Campaign Synthesizer Engine</span>
                </div>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-mono">STABLE COMPILING</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Enter Campaign Core Pitch</label>
                  <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 min-h-[50px]">
                    Generate absolute urgency for our cyber weekend lifetime deal offering 50% discount.
                  </div>
                </div>

                <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#A855F7] uppercase tracking-widest font-bold">Synthesized Copy Output</span>
                    <span className="text-[9px] text-gray-400 font-mono">1.1ms latency</span>
                  </div>
                  <p className="text-xs text-white font-semibold">⚡ Don&apos;t wait: 50% Cyber Deal ends in 2 Hours!</p>
                  <p className="text-[11px] text-gray-400">Urgency rating: Extreme CTR. Recommended button CTA: &quot;Secure Deal Now 🎁&quot;</p>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={onEnterDashboard}
                    className="flex items-center space-x-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-md shadow-purple-900/30 transition border border-[#7C3AED]/20"
                  >
                    <span>Try Writing Tool inside Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Module */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-gray-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1 bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1 rounded text-[#A855F7] text-xs font-mono font-bold uppercase mb-4">
            <span>NO MONTHLY BILLS EVER</span>
          </div>
          <h2 className="text-4xl font-display font-extrabold text-white mb-4 tracking-tight leading-tight">
            One Lifetime Cost. Sovereign Independence.
          </h2>
          <p className="text-gray-400 text-base">
            PushNova offers complete, developer-friendly marketing push automation with no subscription tiers or limitations. Secure your license once, host infinitely, and broadcast forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((p, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                p.popular 
                  ? "bg-[#111827] border-2 border-[#7C3AED] shadow-[0_0_50px_rgba(124,58,237,0.1)] md:scale-[1.03]" 
                  : "bg-[#111827] border border-gray-800 hover:border-gray-700"
              }`}
            >
              {p.popular && (
                <span className="absolute top-0 right-0 bg-[#7C3AED] text-white text-[10px] px-6 py-1 rounded-bl-2xl font-bold uppercase tracking-widest leading-none">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#A855F7]">{p.name} LICENSE</span>
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/10">LIFETIME</span>
                </div>
                
                <div className="flex items-baseline space-x-2.5 mb-1.5 flex-wrap">
                  <span className="text-3.5xl font-display font-extrabold text-white">${p.price}</span>
                  {p.originalPrice && (
                    <span className="text-sm text-gray-500 line-through font-mono font-bold">${p.originalPrice}</span>
                  )}
                  <span className="text-[10px] text-gray-500 font-normal font-mono">one-time</span>
                  {p.originalPrice && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-tight text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/10">
                      -${p.originalPrice - p.price} Off
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-medium mb-4 italic block">{p.save}</p>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">{p.desc}</p>
                
                <div className="border-t border-gray-800 pt-6 space-y-3 mb-8">
                  {p.features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-sm">
                      <div className="w-5 h-5 bg-[#7C3AED]/20 rounded-full flex items-center justify-center text-[#7C3AED] font-bold text-[10px] shrink-0">
                        ✓
                      </div>
                      <span className="text-xs text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onPlanSelect(p.name, p.price)}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] ${
                  p.popular 
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#6D28D9] hover:to-[#DB2777] text-white shadow-xl shadow-purple-900/30 font-bold" 
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                Unlock Lifetime License
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Matrix Grid */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-display font-extrabold text-white">Direct Competitive Comparison</h3>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider uppercase">HOW WE TOTALLY ELIMINATE LIFETIME INFRASTRUCTURE COST Friction</p>
          </div>

          <div className="overflow-x-auto bg-[#111827] border border-gray-800/80 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0B1120]/50 text-gray-400 font-mono">
                  <th className="p-4 font-bold uppercase tracking-wider">Core Parameters</th>
                  <th className="p-4 text-[#A855F7] font-extrabold uppercase tracking-wider">PushNova Premium (LTD)</th>
                  <th className="p-4 font-bold uppercase tracking-wider">OneSignal (SaaS)</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Pusher Channels</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Novu Sovereign API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Pricing Model</td>
                  <td className="p-4 text-emerald-400 font-extrabold">One-Time Fee (Lifetime Updates)</td>
                  <td className="p-4 text-gray-300 font-mono">$1,200+/yr Recurring cost</td>
                  <td className="p-4 text-gray-300 font-mono">$1,180+/yr Recurring cost</td>
                  <td className="p-4 text-gray-300 font-mono">$3,000+/yr Enterprise tier</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Subscribers Allowed</td>
                  <td className="p-4 text-emerald-400 font-extrabold">Unlimited Subscribers (Uncapped)</td>
                  <td className="p-4 text-gray-400">Restricted up to 50k (Scales up bills)</td>
                  <td className="p-4 text-gray-400">Strictly throttled capacity blocks</td>
                  <td className="p-4 text-gray-400 font-mono">30k limits on primary level</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Domain Registrations</td>
                  <td className="p-4 text-emerald-400 font-extrabold">Unlimited Domain Consoles</td>
                  <td className="p-4 text-gray-400">Single active target domain</td>
                  <td className="p-4 text-gray-400">Up to 3 domains with high latency</td>
                  <td className="p-4 text-gray-400 font-mono">Complex API integrations needed</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Sovereign Data Storage</td>
                  <td className="p-4 text-emerald-400 font-extrabold">100% Owned (Your Server Database)</td>
                  <td className="p-4 text-red-400 font-mono">Cloud Locked (No ownership)</td>
                  <td className="p-4 text-red-400 font-mono">Shared Cluster Servers only</td>
                  <td className="p-4 text-gray-400">Partial setups (Self management stress)</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Cognitive AI Campaign Suite</td>
                  <td className="p-4 text-emerald-400 font-extrabold">Yes (Free Gemini Key support)</td>
                  <td className="p-4 text-gray-400">Priced extra (Addon premium)</td>
                  <td className="p-4 text-red-500">Not supported natively</td>
                  <td className="p-4 text-gray-400">Not supported natively</td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition">
                  <td className="p-4 text-white font-bold">Spam Link Checker Shield</td>
                  <td className="p-4 text-emerald-400 font-extrabold">CyberGuard AI Model Auditing</td>
                  <td className="p-4 text-gray-500">Manual review mandatory</td>
                  <td className="p-4 text-gray-500">No verification checks</td>
                  <td className="p-4 text-gray-500">No verification checks</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-3 leading-normal text-center">
            * Comparison reflects equivalent features of direct push broadcast capability analyzed on May 2026 logs. High-speed delivery relies directly on standard FCM network protocol rules.
          </p>
        </div>
      </section>

      {/* Proof Testimonials */}
      <section className="py-20 border-t border-gray-900 pb-24 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-xl font-mono text-gray-500 uppercase tracking-widest mb-10">VOUCHED BY SAAS FOUNDERS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 bg-[#111827] border border-gray-800 rounded-2xl relative">
              <span className="text-4xl text-[#7C3AED] absolute top-4 right-6 font-serif select-none pointer-events-none">“</span>
              <p className="text-sm italic text-gray-300 mb-6 leading-relaxed">{t.quote}</p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899]" />
                <div>
                  <p className="text-xs font-bold text-white">{t.author}</p>
                  <p className="text-[10px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 border-t border-[#111827] max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: "Is there any hidden limits on subscription?", a: "Absolutely not. PushNova operates with individual direct server sovereignty. It allows you to deliver notifications directly of any intensity without monthly bandwidth tiers." },
            { q: "How does PushNova compare to traditional monthly SaaS subscriptions?", a: "Unlike OneSignal or Pusher, which charge steep monthly recurring plans that increase as your subscriber list grows, PushNova is a sovereign lifetime solution. You pay once, host independently on your own servers, and broadcast notifications for free using Google's FCM key parameters, saving thousands of dollars a year." },
            { q: "Do you support FCM keys?", a: "Yes. PushNova integrates seamlessly with default Web-Push protocol standards and standard Firebase Cloud Messaging configurations to unlock 100% free delivery." },
            { q: "What layout optimization is available inside?", a: "Includes a gorgeous client campaign scheduler, rich CSV exporter metrics, live device previews (iOS, Android, Windows), and immediate API logs integrations." }
          ].map((f, fIdx) => (
            <div key={fIdx} className="border border-gray-800 rounded-xl overflow-hidden bg-[#111827]/40">
              <button 
                onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                className="w-full text-left p-5 flex justify-between items-center bg-[#111827]/10 hover:bg-[#111827]/60 transition"
              >
                <span className="text-sm font-semibold text-gray-300">{f.q}</span>
                <span className="text-[#7C3AED] font-bold ml-2">{activeFaq === fIdx ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeFaq === fIdx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-gray-850 bg-[#111827]/30 text-xs text-gray-400 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer copyright and trust */}
      <footer className="px-8 py-6 bg-[#0B1120] border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-center md:text-left">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>● LATEST UPDATE: V4.2.0 BRINGING MULTI-TENANCY & KEY SHIELD ACTIVE</span>
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] font-bold text-gray-400 font-mono">
          <button 
            type="button" 
            onClick={() => setCurrentModal("privacy")}
            className="hover:text-purple-400 cursor-pointer transition uppercase"
          >
            Privacy Policy
          </button>
          <span className="text-gray-850">|</span>
          <button 
            type="button" 
            onClick={() => setCurrentModal("terms")}
            className="hover:text-purple-400 cursor-pointer transition uppercase"
          >
            Terms of Service
          </button>
          <span className="text-gray-850">|</span>
          <button 
            type="button" 
            onClick={() => {
              setCurrentModal("contact");
              setContactSubmitted(false);
            }}
            className="hover:text-pink-400 cursor-pointer transition uppercase flex items-center gap-1 text-pink-500"
          >
            <Mail className="w-3 h-3" />
            <span>Contact Support</span>
          </button>
        </div>
      </footer>

      {/* Legal & Compliance Modals Overlay */}
      <AnimatePresence>
        {currentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurrentModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#111827] border border-gray-800 rounded-3xl w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[85vh] text-left"
            >
              {/* Close Button */}
              <button 
                onClick={() => setCurrentModal(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-850 transition"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* PRIVACY POLICY VIEW */}
              {currentModal === "privacy" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Lock className="w-5 h-5" />
                    <h3 className="text-lg font-bold font-display text-white">Sovereign Privacy Statement</h3>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Last updated: May 2026</p>
                  
                  <div className="text-xs text-gray-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                    <p>
                      At <strong>PushNova</strong>, we care deeply about data minimization and sovereign network control. Unlike standard cloud-locked SaaS providers which harvest click telemetry, our architecture guarantees absolute privacy on checkout and live notifications.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">1. Local Host Security</h4>
                    <p>
                      Because PushNova operates as a pre-compiled self-contained dashboard tool, your notification lists, FCM encryption keys, and active user credentials are saved directly inside your private browser standard <code>localStorage</code> cache or server database.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">2. Direct Key Transmission</h4>
                    <p>
                      We never route notification payloads through external servers. Everything goes directly to official Google Firebase Cloud Messaging (FCM) endpoints, protecting privacy rights according to sovereign GDPR protocols.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">3. No Bank Ledger Caching</h4>
                    <p>
                      Our payment framework utilizes instant secure 1-click tokenization. Your financial payment logs bypass our platform and go directly onto certified AES-256 secure networks.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-850 flex justify-end">
                    <button 
                      onClick={() => setCurrentModal(null)}
                      className="bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs py-2 px-4 rounded-xl transition"
                    >
                      Acknowledge & Seal
                    </button>
                  </div>
                </div>
              )}

              {/* TERMS OF SERVICE VIEW */}
              {currentModal === "terms" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <FileText className="w-5 h-5" />
                    <h3 className="text-lg font-bold font-display text-white">Sovereign Terms of Service</h3>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Effective License: Lifetime Agreement</p>

                  <div className="text-xs text-gray-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                    <p>
                      Welcome to <strong>PushNova</strong>. By purchasing a lifetime subscription license, you agree to comply with the standard terms set for professional sovereign communication.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">1. One-Time Payment Guarantee</h4>
                    <p>
                      Every license tier (Starter, Pro, and Agency) is fully covered under the one-time transactional fee structure. No future updates require monthly subscriptions or maintenance fees.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">2. Respectful Use & Safe Links</h4>
                    <p>
                      Users are required to obey legal communication standard rules. Spamming clickbait patterns, virus relays, or misleading redirects is strictly banned under standard FCM protocol conditions. Use the integrated <strong>CyberGuard Spam Checker</strong> to check target URLs before triggering blasts.
                    </p>
                    <h4 className="font-bold text-white text-xs mt-2">3. White-Label Limitations</h4>
                    <p>
                      Agency license owners have the right to sub-license PushNova dashboards to clients using local domains limitlessly. Starter and Pro keys are restricted to private use cases.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-850 flex justify-end">
                    <button 
                      onClick={() => setCurrentModal(null)}
                      className="bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs py-2 px-4 rounded-xl transition"
                    >
                      Agree & Close
                    </button>
                  </div>
                </div>
              )}

              {/* CONTACT SUPPORT / SALES VIEW */}
              {currentModal === "contact" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-pink-400">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-lg font-bold font-display text-white">Let&apos;s Connect - PushNova Help Desk</h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    Apka koi sawal hai regarding server setup, FCM configuration, custom integrations, ya bulk licenses? Humein batayein, hamari team live support pradaan karegi.
                  </p>

                  <AnimatePresence mode="wait">
                    {!contactSubmitted ? (
                      <motion.form
                        key="contact-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          setContactSubmitted(true);
                        }}
                        className="space-y-4 pt-2"
                      >
                        <div>
                          <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Apka Naam / Full Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Raj Sahani"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-purple-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Email Address</label>
                          <input 
                            type="email" 
                            required
                            placeholder="your-email@domain.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-purple-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Message / Sawal</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Apna sawaal ya integration issue yahan likhein..."
                            value={contactForm.msg}
                            onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                            className="w-full bg-[#0B1120] border border-gray-800 focus:border-purple-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] transition py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Secure Query</span>
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="contact-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-950/20 border border-purple-500/20 p-5 rounded-2xl text-center space-y-3"
                      >
                        <span className="text-2xl block animate-bounce">📨</span>
                        <h4 className="text-xs font-bold text-white">Bahut Bahut Dhanyawad, {contactForm.name}!</h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                          Apka sandesh surakshit roop se direct support ledger mein submit ho gaya hai. Hamari integration team manual verification ke baad <strong>{contactForm.email}</strong> par update bhejegi within 2 ghante!
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setContactForm({ name: "", email: "", msg: "" });
                            setContactSubmitted(false);
                          }}
                          className="text-[10px] bg-purple-900/40 text-purple-300 hover:bg-purple-900 border border-purple-500/10 px-3 py-1 rounded-lg transition font-bold font-mono"
                        >
                          Send Another Sandesh
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Realtime Purchasing Notification Toaster - Ultra Minified & Compact Layout */}
      <AnimatePresence>
        {toastVisible && purchaseToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 left-4 z-50 max-w-[250px] bg-[#111827]/95 border border-purple-550/20 rounded-xl p-2 shadow-xl flex items-center space-x-2 backdrop-blur-md"
          >
            <div className="w-7 h-7 bg-purple-950/60 text-purple-300 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 border border-purple-500/20 animate-pulse">
              ⚡
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[8.5px] text-purple-400 font-mono font-bold uppercase truncate">Sale Confirmed</span>
                <span className="text-[7.5px] text-gray-500 font-mono shrink-0">{purchaseToast.timeago}</span>
              </div>
              <p className="text-[9px] text-gray-300 leading-tight font-medium truncate">
                {purchaseToast.name} ({purchaseToast.city})
              </p>
              <p className="text-[8px] text-gray-500 leading-none mt-0.5 truncate">
                Bought <strong className="text-pink-400 font-semibold">{purchaseToast.plan}</strong> via Razorpay
              </p>
            </div>
            <button 
              onClick={() => setToastVisible(false)}
              className="text-gray-500 hover:text-white transition duration-150 shrink-0 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
