"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Cpu,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Server,
  Search
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { VerificationResult } from "@/types/interfaces";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [loading, setLoading] = useState(!!emailParam);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performVerify = async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/verify-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to verification protocol.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailParam) {
      performVerify(emailParam);
    }
  }, [emailParam]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-8">

          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Technical <span className="premium-text-gradient">Audit</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Deep-layer SMTP and DNS validation for professional outreach.
            </p>
          </header>

          <div className="grid gap-6">
            {/* Search Input */}
            <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  placeholder="Analyze another email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && performVerify(email)}
                  className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 outline-none font-bold"
                />
              </div>
              <button
                onClick={() => performVerify(email)}
                disabled={loading}
                className="premium-gradient px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Run Analysis"}
              </button>
            </div>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center gap-4 text-slate-400"
              >
                <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
                <span className="font-black tracking-widest uppercase text-xs">Initializing SMTP Handshake Protocol...</span>
              </motion.div>
            )}

            {error && (
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 font-bold flex items-center gap-3">
                <XCircle size={20} />
                {error}
              </div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
              >
                {/* Status Hero Card */}
                <div className={cn(
                  "p-6 sm:p-12 rounded-[2.5rem] border-2 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden",
                  result.status === "Valid"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-rose-50 border-rose-200"
                )}>
                  <div className={cn(
                    "p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg",
                    result.status === "Valid" ? "bg-white text-emerald-500" : "bg-white text-rose-500"
                  )}>
                    {result.status === "Valid" ? <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} /> : <XCircle className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} />}
                  </div>
                  <div className="w-full">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 break-all leading-tight px-2">{result.email}</h2>
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border",
                      result.status === "Valid"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-rose-100 text-rose-700 border-rose-200"
                    )}>
                      {result.status === "Valid" ? "Verified & Deliverable" : "Verification Failed"}
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium max-w-lg">
                    {result.status === "Valid"
                      ? "Success. The recipient server accepted the handshake protocol. This mailbox is active and ready to receive mail."
                      : `Result: ${result.reason}. The recipient server rejected the protocol or the domain is not configured for mail.`
                    }
                  </p>
                </div>

                {/* Technical Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* DNS Audit */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Globe size={24} />
                      </div>
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">DNS Configuration</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-50 gap-2">
                        <span className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase">MX Records</span>
                        <span className="text-slate-900 font-mono text-[10px] sm:text-xs font-bold truncate sm:max-w-[200px]">
                          {result.mx_record}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-2">
                          SPF Status {result.has_spf ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-300" />}
                        </span>
                        <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase", result.has_spf ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                          {result.has_spf ? "Configured" : "Missing"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-2">
                          DMARC {result.has_dmarc ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-300" />}
                        </span>
                        <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase", result.has_dmarc ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                          {result.has_dmarc ? "Configured" : "Missing"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Protocol Audit */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                        <Server size={24} />
                      </div>
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">SMTP Protocol</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-400 font-bold text-xs uppercase">Provider Type</span>
                        <span className="text-slate-900 font-black text-xs uppercase">
                          {result.is_free_provider ? "Public (Gmail/etc)" : "Professional/Private"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <span className="text-slate-400 font-bold text-xs uppercase">Account Class</span>
                        <span className="text-slate-900 font-black text-xs uppercase">
                          {result.is_role_account ? "Role-Based (Support/Admin)" : "Personal/Direct"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold text-xs uppercase">Handshake Verification</span>
                        <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase", result.status === "Valid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                          {result.status === "Valid" ? "Accepted" : "Rejected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SMTP RAW BUFFER */}
                  <div className="md:col-span-2 bg-slate-950 rounded-3xl p-8 shadow-inner border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu size={18} className="text-emerald-500" />
                      <h3 className="text-white/40 font-black text-xs uppercase tracking-widest">Protocol Response Buffer</h3>
                    </div>
                    <div className="font-mono text-emerald-500/80 text-xs leading-relaxed break-all bg-black/30 p-4 rounded-xl border border-emerald-500/10">
                      {result.smtp_banner || "No response banner received from server."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
