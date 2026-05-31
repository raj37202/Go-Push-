'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, CreditCard, Gift, HardDrive, ShieldAlert, Cpu, Activity, 
  Trash2, Search, CheckCircle2, ArrowLeft, RefreshCcw, LifeBuoy,
  Edit, PlusCircle, Check, AlertTriangle
} from "lucide-react";
import { Coupon, SupportTicket, SystemLog } from "./types";

interface AdminPanelProps {
  onBack: () => void;
  subscribersCount: number;
  plans: any[];
  onSavePlans: (newPlans: any[]) => void;
}

export default function AdminPanel({ onBack, subscribersCount, plans, onSavePlans }: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"users" | "payments" | "coupons" | "tickets" | "logs" | "plans">("users");

  // Plan editor local states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formSave, setFormSave] = useState("");
  const [formPopular, setFormPopular] = useState(false);
  const [formFeatures, setFormFeatures] = useState(""); // newline separated
  const [formSuccessAlert, setFormSuccessAlert] = useState("");

  // Mock Admin users list
  const [users, setUsers] = useState([
    { id: "u_1", email: "jeff@amazon.com", plan: "Agency", domains: 12, joinedDate: "2026-05-30", status: "Active" },
    { id: "u_2", email: "satya@microsoft.com", plan: "Pro", domains: 3, joinedDate: "2026-05-29", status: "Active" },
    { id: "u_3", email: "fraudster@spammer.ru", plan: "Starter", domains: 1, joinedDate: "2026-05-20", status: "Banned" }
  ]);

  // Mock Payments list
  const [payments, setPayments] = useState([
    { id: "PN-482120", email: "jeff@amazon.com", plan: "Agency", total: 1349.10, gateway: "Stripe", date: "2026-05-30", status: "Settled" },
    { id: "PN-193489", email: "satya@microsoft.com", plan: "Pro", total: 749.00, gateway: "Razorpay", date: "2026-05-29", status: "Settled" },
    { id: "PN-842201", email: "clara@leipzig.de", plan: "Starter", total: 404.10, gateway: "PayPal", date: "2026-05-25", status: "Settled" },
  ]);

  // Mock Active Coupons list
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: "NOVA10", discountType: "percentage", amount: 10 },
    { code: "NOVA50", discountType: "fixed", amount: 50 },
    { code: "FREEPASS", discountType: "percentage", amount: 100 }
  ]);
  const [newCode, setNewCode] = useState("");
  const [newAmt, setNewAmt] = useState(15);

  // Mock Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "T-902", user: "satya@microsoft.com", subject: "FCM Script verification", priority: "High", status: "Open", date: "2026-05-30" },
    { id: "T-402", user: "clara@leipzig.de", subject: "WordPress webhook question", priority: "Medium", status: "Resolved", date: "2026-05-26" },
  ]);

  // Mock Server health logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    { timestamp: "07:12:45", level: "INFO", message: "Successfully executed FCM batch payload blast (12,400 push indexes successfully acknowledged by Google endpoint)", module: "QUEUE" },
    { timestamp: "07:10:02", level: "WARNING", message: "Pending check on SSL certificates renewal for client domain test-sandbox.io", module: "DOMAINS" },
    { timestamp: "06:44:12", level: "ERROR", message: "Timeout during connection to third-party webhooks endpoint index for spammers.ru", module: "WEBHOOK" }
  ]);

  // Actions
  const handleBanUser = (targetId: string) => {
    setUsers(users.map(u => u.id === targetId ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" } : u));
  };

  const handleAddNewCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    const fresh: Coupon = {
      code: newCode.toUpperCase().trim(),
      discountType: "percentage",
      amount: newAmt
    };
    setCoupons([...coupons, fresh]);
    setNewCode("");
  };

  const resolveSupportTicket = (targetId: string) => {
    setTickets(tickets.map(t => t.id === targetId ? { ...t, status: t.status === "Resolved" ? "Open" : "Resolved" } : t));
  };

  const triggerRefund = (orderId: string) => {
    setPayments(payments.map(p => p.id === orderId ? { ...p, status: "Refunded" as const } : p));
  };

  // Calculations
  const calculatedTotalRevenue = payments
    .filter(p => p.status === "Settled")
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-gray-200">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        <span>Exit Admin and Return to Landing</span>
      </button>

      {/* Admin Title metadata */}
      <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="bg-[#7C3AED]/10 text-[#A855F7] font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#7C3AED]/20">Sovereign Admin operations</span>
          <h1 className="text-2xl font-display font-bold text-white mt-3">PushNova Admin Terminal</h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">Simulate master settings, review licenses, calculate gross revenues, and manage client networks.</p>
        </div>

        {/* Dynamic metrics indicators */}
        <div className="flex gap-4">
          <div className="bg-[#0B1120] border border-gray-800 rounded-xl py-3 px-5 text-center">
            <span className="text-[10px] text-gray-500 font-mono block">PLATFORM REVENUE</span>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">${calculatedTotalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-[#0B1120] border border-gray-800 rounded-xl py-3 px-5 text-center">
            <span className="text-[10px] text-gray-500 font-mono block">SUBSCRIBERS COUNT</span>
            <span className="text-2xl font-extrabold text-white font-mono">{subscribersCount || 12}</span>
          </div>
        </div>
      </div>

      {/* Server Health Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono block mb-1">DASHBOARD MODULE CPU LOAD</span>
            <span className="text-xl font-bold text-white">5.14% (Normalized)</span>
          </div>
          <Cpu className="text-purple-400 w-8 h-8" />
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono block mb-1">RAM MEMORY ALLOCATION</span>
            <span className="text-xl font-bold text-white">1.08 GB / 4.00 GB</span>
          </div>
          <HardDrive className="text-pink-400 w-8 h-8" />
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono block mb-1">FCM GATEWAY RESPONSE</span>
            <span className="text-xl font-bold text-emerald-400">0.92ms (Extremely low)</span>
          </div>
          <Activity className="text-emerald-400 w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Navigation tabs inside Admin panel */}
      <div className="flex border-b border-[#1F2937] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: "users" as const, label: "Client Database Users" },
          { id: "payments" as const, label: "Groceries & Payments Logs" },
          { id: "coupons" as const, label: "Manage Coupon Codes" },
          { id: "tickets" as const, label: "Client Support Tickets" },
          { id: "plans" as const, label: "🛠️ Manage Pricing Plans" },
          { id: "logs" as const, label: "System health Logs" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
              activeAdminTab === tab.id 
                ? "border-[#7C3AED] text-purple-300" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#111827] border border-gray-800/80 rounded-3xl p-8">
        
        {/* TAB 1: USER DIRECTORY */}
        {activeAdminTab === "users" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white mb-4">Sovereign Client Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 font-mono">
                    <th className="py-2.5">User Email</th>
                    <th className="py-2.5">Licensed plan</th>
                    <th className="py-2.5 text-center">Configured Domains</th>
                    <th className="py-2.5">Joined Date</th>
                    <th className="py-2.5 text-center">Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3.5 font-bold text-white">{u.email}</td>
                      <td className="py-3.5"><span className="bg-purple-950 text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{u.plan}</span></td>
                      <td className="py-3.5 text-center font-mono">{u.domains}</td>
                      <td className="py-3.5 font-mono text-gray-500">{u.joinedDate}</td>
                      <td className="py-3.5 text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          u.status === "Active" 
                            ? "bg-emerald-950 text-emerald-400 border-emerald-500/20" 
                            : "bg-red-950 text-red-400 border-red-500/20"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleBanUser(u.id)}
                          className={`text-[10px] font-bold py-1 px-3 rounded transition ${
                            u.status === "Banned" 
                              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/15" 
                              : "bg-red-600/20 text-red-300 border border-red-500/15"
                          }`}
                        >
                          {u.status === "Banned" ? "Reinstate Access" : "Restrict / Ban"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INVOICES & PAYMENTS */}
        {activeAdminTab === "payments" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white mb-4">Sovereign settlement transaction reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 font-mono">
                    <th className="py-2.5">Receipt ID</th>
                    <th className="py-2.5">User Email</th>
                    <th className="py-2.5">Authorized Plan</th>
                    <th className="py-2.5">Total checkout</th>
                    <th className="py-2.5">Gateway</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 font-mono font-bold text-white">{p.id}</td>
                      <td className="py-3.5 text-gray-300">{p.email}</td>
                      <td className="py-3.5 font-bold uppercase tracking-wider text-purple-300">{p.plan}</td>
                      <td className="py-3.5 font-mono text-white font-bold">${p.total.toFixed(2)}</td>
                      <td className="py-3.5 font-mono text-gray-400">{p.gateway}</td>
                      <td className="py-3.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          p.status === "Settled" 
                            ? "bg-emerald-950 text-emerald-400 border-emerald-500/20" 
                            : "bg-amber-950 text-amber-400 border-amber-500/20"
                        }`}>{p.status}</span>
                      </td>
                      <td className="py-3.5 text-right">
                        {p.status === "Settled" && (
                          <button
                            onClick={() => triggerRefund(p.id)}
                            className="bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition py-1 px-3.5 rounded text-[10px] font-bold"
                          >
                            Refund Settlement
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COUPON MANAGER */}
        {activeAdminTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleAddNewCoupon} className="lg:col-span-4 bg-gray-950/40 p-6 border border-gray-850 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-white block">Generate Promo Coupons</span>
              <div>
                <label className="block text-[10px] text-gray-500 font-mono mb-1">Coupon code name</label>
                <input 
                  type="text" 
                  placeholder="e.g. DISCOUNT20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[#0B1120] border border-gray-800 py-1.5 px-3 text-xs text-white rounded-lg uppercase focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-mono mb-1">Percentage deduction (%)</label>
                <input 
                  type="number" 
                  value={newAmt}
                  onChange={(e) => setNewAmt(parseInt(e.target.value))}
                  className="w-full bg-[#0B1120] border border-gray-800 py-1.5 px-3 text-xs text-white rounded-lg focus:outline-none"
                  required 
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg text-xs transition"
              >
                Publish Coupon Code
              </button>
            </form>

            <div className="lg:col-span-8 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Published Active Coupons</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c, idx) => (
                  <div key={idx} className="bg-gray-950/45 p-4 border border-gray-850 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold text-white">{c.code}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Value: {c.amount}{c.discountType === "percentage" ? "% Off" : "$ Off"}</p>
                    </div>
                    <button 
                      onClick={() => setCoupons(coupons.filter(cop => cop.code !== c.code))}
                      className="text-red-400 hover:text-red-500 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT TICKETS MANAGER */}
        {activeAdminTab === "tickets" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white mb-4">Master Operations Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-5 bg-gray-950/50 border border-gray-850 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold">{t.id}</span>
                      <span className="text-xs font-bold text-white">{t.subject} (By {t.user})</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono">Priority: <strong>{t.priority}</strong> | Registered: {t.date}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] px-2 py-1 rounded border font-semibold ${
                      t.status === "Open" ? "bg-amber-950/60 text-amber-400 border-amber-500/20" : "bg-emerald-950 text-emerald-400 border-emerald-500/10"
                    }`}>{t.status}</span>
                    <button
                      onClick={() => resolveSupportTicket(t.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition"
                    >
                      {t.status === "Open" ? "Close Ticket" : "Re-open Ticket"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4.5: PLAN MANAGEMENT SYSTEM */}
        {activeAdminTab === "plans" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <h3 className="text-base font-extrabold text-white">Dynamic Pricing Plans & Licenses</h3>
                <p className="text-xs text-gray-400 mt-1">Configure active tiers, lifetime prices, quotas, and feature list parameters in real time.</p>
              </div>
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setIsAddingPlan(true);
                  setFormName("");
                  setFormDesc("");
                  setFormPrice(10);
                  setFormOriginalPrice(19);
                  setFormSave("Special promotion applied");
                  setFormPopular(false);
                  setFormFeatures("10,000 Push Notifications limit ONLY\nUnlimited Subscribers access\n1 Domain host integration\nBasic click tracking reports");
                  setFormSuccessAlert("");
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-1.5 self-start sm:self-auto transition duration-150 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Custom Plan ($10)</span>
              </button>
            </div>

            {/* Form Success/Error alert notification banner */}
            <AnimatePresence>
              {formSuccessAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4 font-extrabold" />
                  <span>{formSuccessAlert}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List Active Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {plans.map((p, idx) => (
                <div key={idx} className="bg-gray-950/60 border border-gray-850 p-5 rounded-2xl relative flex flex-col justify-between">
                  {p.popular && (
                    <span className="absolute top-3 right-3 bg-purple-900/40 border border-purple-500/30 text-purple-300 font-bold font-mono text-[8px] uppercase px-2 py-0.5 rounded-full">
                      🔥 Most Popular
                    </span>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="text-[#A855F7] font-mono">#{idx + 1}</span>
                      <span>{p.name}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">{p.desc}</p>
                    
                    {/* Live Pricing info */}
                    <div className="flex items-baseline space-x-2 font-mono text-xs">
                      <span className="text-[#A855F7] font-bold">${p.price}</span>
                      {p.originalPrice && <span className="text-gray-500 line-through">${p.originalPrice}</span>}
                      <span className="text-[9px] text-[#A855F7] bg-purple-950/30 border border-purple-500/10 px-1.5 py-0.5 rounded font-bold">LIFETIME</span>
                    </div>

                    {/* features summary */}
                    <div className="bg-gray-900/40 border border-gray-850 p-2.5 rounded-xl space-y-1">
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold">Included features ({p.features.length})</div>
                      <div className="text-[10px] text-gray-300 font-medium line-clamp-3">
                        {p.features.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-[#A855F7]">✓</span>
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit and Delete triggers) */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-850/45">
                    <button
                      onClick={() => {
                        setEditingIndex(idx);
                        setIsAddingPlan(false);
                        setFormName(p.name);
                        setFormDesc(p.desc);
                        setFormPrice(p.price);
                        setFormOriginalPrice(p.originalPrice || p.price);
                        setFormSave(p.save || "");
                        setFormPopular(p.popular || false);
                        setFormFeatures(p.features.join("\n"));
                        setFormSuccessAlert("");
                      }}
                      className="flex-grow bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-[#7C3AED]/40 text-gray-300 hover:text-white font-bold text-[10px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3 text-[#A855F7]" />
                      <span>Edit Configurations</span>
                    </button>
                    {plans.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = plans.filter((_, pIdx) => pIdx !== idx);
                          onSavePlans(updated);
                          setFormSuccessAlert("Plan deleted successfully! Active lists synchronized.");
                        }}
                        className="bg-gray-900 hover:bg-red-950/30 border border-gray-800 hover:border-red-500/20 text-gray-400 hover:text-red-400 p-2 rounded-xl transition"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic input interactive Form for edits or additions */}
            <AnimatePresence>
              {(editingIndex !== null || isAddingPlan) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-gray-950 hover:border-purple-500/10 border border-gray-850 rounded-2xl p-6 space-y-4 shadow-xl"
                >
                  <h4 className="text-xs font-bold font-mono text-[#A855F7] uppercase tracking-widest flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    <span>{editingIndex !== null ? "Modifying Existing Plan Properties" : "Provisioning New Custom Tier"}</span>
                  </h4>

                  {/* Pricing Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Plan Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Micro Lite"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-[#111827] border border-gray-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Promotional Save Banner Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Save $100 compared to competitor Pro tier"
                        value={formSave}
                        onChange={(e) => setFormSave(e.target.value)}
                        className="w-full bg-[#111827] border border-gray-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Price inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Checkout Price ($)</label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-[#111827] border border-gray-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Original Price ($)</label>
                      <input
                        type="number"
                        placeholder="e.g. 19"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full bg-[#111827] border border-[#1F2937] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                    <div className="flex items-center space-x-2.5 h-full pt-5">
                      <input
                        type="checkbox"
                        id="formPopular"
                        checked={formPopular}
                        onChange={(e) => setFormPopular(e.target.checked)}
                        className="rounded bg-gray-900 border-gray-800 text-purple-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="formPopular" className="text-xs text-gray-300 font-medium cursor-pointer">Enforce Premium highlight flag</label>
                    </div>
                  </div>

                  {/* Plan description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Brief Pitch Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Best for small testing projects or starting validation campaigns."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-[#111827] border border-gray-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Plan features separated by line */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400">Feature Deliverables (Separated by Newline)</label>
                      <span className="text-[9px] font-mono text-gray-500">Every line becomes a single bullet point check</span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="e.g.&#10;10,000 notifications limit only&#10;Unlimited domains&#10;Priority support node"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      className="w-full bg-[#111827] border border-[#1F2937] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                    />
                  </div>

                  {/* Action triggers */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formName.trim()) {
                          alert("Kripya plan name enter karein!");
                          return;
                        }
                        const featuresList = formFeatures
                          .split("\n")
                          .map((f) => f.trim())
                          .filter((f) => f.length > 0);

                        const planData = {
                          name: formName,
                          price: formPrice,
                          originalPrice: formOriginalPrice,
                          save: formSave,
                          desc: formDesc,
                          features: featuresList,
                          popular: formPopular,
                        };

                        let updatedPlans = [...plans];
                        if (editingIndex !== null) {
                          updatedPlans[editingIndex] = planData;
                          setFormSuccessAlert(`Plan '${formName}' configurations updated successfully!`);
                        } else {
                          updatedPlans.push(planData);
                          setFormSuccessAlert(`Plan '${formName}' added as active billing tier successfully!`);
                        }

                        onSavePlans(updatedPlans);
                        setEditingIndex(null);
                        setIsAddingPlan(false);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-lg transition duration-150 active:scale-95"
                    >
                      {editingIndex !== null ? "Commit Edits & Save" : "Provision & Activate Plan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setIsAddingPlan(false);
                      }}
                      className="bg-gray-900 border border-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white text-xs font-semibold px-4 rounded-xl transition duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 5: PLATFORM HEALTH LOGS */}
        {activeAdminTab === "logs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Platform Health Console Logs</h3>
              <button 
                onClick={() => setSystemLogs([
                  { timestamp: new Date().toLocaleTimeString(), level: "INFO", message: "Successfully executed SSL health sweep", module: "SYSTEM" },
                  ...systemLogs
                ])}
                className="text-xs text-purple-300 flex items-center space-x-1.5 hover:text-white transition"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Sweep Active States</span>
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 font-mono text-xs leading-relaxed space-y-2 max-h-[350px] overflow-y-auto">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-3 border-b border-gray-900 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`shrink-0 font-bold ${
                    log.level === "ERROR" ? "text-red-400" : log.level === "WARNING" ? "text-amber-400" : "text-emerald-400"
                  }`}>[{log.level}]</span>
                  <span className="text-purple-400 shrink-0 font-bold">[{log.module}]</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
