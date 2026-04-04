"use client";

import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Mail, Search, Zap, ShieldCheck, ArrowRight, CheckCircle2, Globe, MousePointer2, Sparkles, Lock, XCircle, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GridBackground } from "@/components/GridBackground";
import { FloatingIcons } from "@/components/FloatingIcons";
import { VerificationResult } from "@/types/interfaces";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const words = ["Success", "Growth", "Results", "Impact"];

const bentoFeatures = [
  {
    title: "Email Verifier",
    description: "High-precision SMTP handshake verification. Includes real-time MX record analysis and multi-layer DNS checks to identify invalid addresses and protect your sender reputation.",
    icon: ShieldCheck,
    className: "lg:col-span-2 lg:row-span-1",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    accent: "border-l-4 border-blue-500/30",
  },
  {
    title: "AI Drafter",
    description: "Draft high-impact replies with AI-driven personalization. Our engine analyzes recipient intent and tone to craft responses that feel human, not automated.",
    icon: Zap,
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    accent: "border-l-4 border-violet-500/30",
  },
  {
    title: "Permutator",
    description: "Find the needle in the haystack with smart domain permutation logic and probabilistic matching for hundreds of possible variants.",
    icon: Search,
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-indigo-600",
    bg: "bg-indigo-500/10",
    accent: "border-l-4 border-indigo-500/30",
  },
  {
    title: "No Gatekeeping",
    description: "We believe in pure tool utility. No complex signups, no hidden tracking, and absolutely no commercial bloat. Just the protocols you need to succeed at scale.",
    icon: MousePointer2,
    className: "lg:col-span-2 lg:row-span-1",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    accent: "border-l-4 border-emerald-500/30",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [heroEmail, setHeroEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [quickResult, setQuickResult] = useState<VerificationResult | null>(null);

  const containerRef = useRef(null);

  const handleHeroVerify = async () => {
    if (!heroEmail) return;
    setIsVerifying(true);
    try {
      const res = await fetch("http://localhost:5000/api/verify-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: heroEmail }),
      });
      const data: VerificationResult = await res.json();
      setQuickResult(data);
    } catch (err) {
      console.error(err);
      alert("Verification failed. Check backend connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div ref={containerRef} className="relative flex flex-col gap-32 pb-32">
      <GridBackground />
      <FloatingIcons />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center sm:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8 backdrop-blur-sm"
          >
            <ShieldCheck size={14} />
            <span>Unrestricted Outreach Protocol</span>
          </motion.div>

          <h1 className="text-6xl font-black tracking-tight text-slate-900 sm:text-8xl mb-8 leading-[1.1]">
            Outreach for <br />
            <span className="relative inline-flex items-center justify-center min-w-[280px] sm:min-w-[420px] h-[1.2em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="premium-text-gradient absolute"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-xl text-slate-600 mb-12 leading-relaxed font-medium"
          >
            A calm, professional suite of tools to help you find, verify, and reach out to anyone.
            No gatekeeping. No trackers. Zero signups required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto"
          >
            {!quickResult ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleHeroVerify();
                }}
                className="relative w-full group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-white/80 backdrop-blur-2xl rounded-[1.8rem] border border-white/20 shadow-2xl">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      placeholder="Enter email to verify instantly..."
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                      required
                    />
                  </div>
                  <button
                    disabled={isVerifying}
                    className="premium-gradient px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {isVerifying ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Verify
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-6 rounded-[2rem] bg-white border border-slate-200 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-4 rounded-2xl",
                    quickResult.status === "Valid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {quickResult.status === "Valid" ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                  </div>
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-widest font-black text-slate-400 mb-1">Status Result</div>
                    <div className="text-xl font-black text-slate-900">{quickResult.email}</div>
                    <div className={cn("text-sm font-bold", quickResult.status === "Valid" ? "text-emerald-500" : "text-rose-500")}>
                      {quickResult.status === "Valid" ? "Verified & Deliverable" : `Invalid Result: ${quickResult.reason}`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setQuickResult(null)}
                    className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Clear
                  </button>
                  <Link href={`/verify?email=${heroEmail}`}>
                    <button className="premium-gradient px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-primary/20 transition-all">
                      View Detailed Audit
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-6 mt-4 text-slate-400 text-[10px] font-black tracking-widest uppercase">
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> SMTP HANDSHAKE</span>
              <span className="flex items-center gap-1.5"><Search size={12} /> MX ANALYSIS</span>
              <span className="flex items-center gap-1.5"><Zap size={12} /> AI ASSIST</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Verification Access */}
      {/* Suite Switcher / Protocol Modules */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Explore the Protocol Suite</h2>
          <p className="text-slate-500 font-medium">Professional-grade tools for every stage of your outreach pipeline.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Email Permutator",
              desc: "Generate and verify high-probability professional addresses from names.",
              icon: Globe,
              link: "/permutator",
              btn: "Launch Permutator",
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              title: "AI Drafter",
              desc: "Design high-converting outreach messages using context-aware AI.",
              icon: Sparkles,
              link: "/drafter",
              btn: "Start Drafting",
              color: "text-violet-600",
              bg: "bg-violet-50"
            },
            {
              title: "Technical Docs",
              desc: "Master the protocol and optimize your delivery rates with our guide.",
              icon: FileText,
              link: "/docs",
              btn: "View Protocol",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            }
          ].map((module, i) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 transition-all hover:shadow-2xl flex flex-col items-center text-center"
            >
              <div className={cn("p-5 rounded-[1.5rem] mb-6 transition-transform group-hover:scale-110", module.bg, module.color)}>
                <module.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{module.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">
                {module.desc}
              </p>
              <Link href={module.link} className="w-full">
                <button className="w-full py-4 rounded-xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 group-hover:border-slate-950 group-hover:text-slate-950 transition-all flex items-center justify-center gap-2">
                  {module.btn}
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful by Design</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Every tool is optimized for conversion and built with the recruiter&apos;s workflow in mind.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {bentoFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: feature.color.replace('text-', '') }}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 transition-all hover:shadow-2xl premium-shadow h-full flex flex-col",
                feature.className,
                feature.accent
              )}
            >
              <div className="absolute inset-0 dots-pattern opacity-[0.05]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className={cn("inline-flex w-fit rounded-xl p-4 mb-5 transition-transform group-hover:scale-110 group-hover:rotate-6", feature.bg, feature.color)}>
                  <feature.icon size={26} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-[0.05] transition-all group-hover:scale-110 group-hover:opacity-[0.1] group-hover:rotate-12">
                <feature.icon size={160} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="container mx-auto px-4 sm:px-8 pb-16">
        <InteractiveCTA />
      </section>

    </div>
  );
}

function InteractiveCTA() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="premium-gradient relative rounded-[2.5rem] p-0.5 shadow-2xl transition-all duration-300 w-full max-w-5xl group mx-auto"
    >
      {/* Border Beam Effect */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[500%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(255,255,255,0.4)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div
        style={{ transform: "translateZ(50px)" }}
        className="rounded-[calc(2.5rem-2px)] bg-slate-950/80 backdrop-blur-3xl p-10 md:p-16 text-center relative overflow-hidden"
      >
        {/* Animated Feature Dock (Integrated Advantages) */}
        <div
          style={{ transform: "translateZ(75px)" }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { label: "SMTP Verified", icon: ShieldCheck, color: "text-blue-400" },
            { label: "Privacy First", icon: Lock, color: "text-emerald-400" },
            { label: "AI Powered", icon: Zap, color: "text-violet-400" },
            { label: "No Signup", icon: MousePointer2, color: "text-indigo-400" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md"
            >
              <item.icon size={14} className={item.color} />
              <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <h2
          style={{ transform: "translateZ(100px)" }}
          className="text-4xl font-black text-white sm:text-6xl mb-6 leading-tight tracking-tight"
        >
          Elevate your <br className="sm:hidden" /> outreach today.
        </h2>

        <p
          style={{ transform: "translateZ(75px)" }}
          className="text-slate-400 max-w-xl mx-auto mb-10 text-lg md:text-xl font-medium leading-relaxed"
        >
          A professional suite built for depth. We remove the barriers so you can focus on building connections that matter.
        </p>

        <div
          style={{ transform: "translateZ(125px)" }}
          className="flex flex-col items-center gap-6"
        >
          <Link href="/permutator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group/btn relative bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-white/20 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              Initialize Protocol
              <ArrowRight size={22} className="transition-transform group-hover/btn:translate-x-1" />
            </motion.button>
          </Link>

          <div className="flex items-center gap-3 text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">
            <span>ZERO TRACKERS • UNRESTRICTED ACCESS • NO SIGNUP</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"
        />
      </div>
    </motion.div>
  );
}

