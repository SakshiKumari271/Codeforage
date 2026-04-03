"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Mail, Search, Zap, Code, ShieldCheck, ArrowRight, CheckCircle2, Globe, Cpu, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GridBackground } from "@/components/GridBackground";
import { FloatingIcons } from "@/components/FloatingIcons";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const words = ["Success", "Growth", "Results", "Impact"];

const bentoFeatures = [
  {
    title: "Email Verifier",
    description: "Deep SMTP handshake verification with 99.9% accuracy. No more bounces.",
    icon: ShieldCheck,
    className: "lg:col-span-2 lg:row-span-1",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    accent: "border-l-4 border-blue-500/30",
  },
  {
    title: "AI Drafter",
    description: "Cold emails that actually get replies.",
    icon: Zap,
    className: "lg:col-span-1 lg:row-span-1",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    accent: "border-l-4 border-violet-500/30",
  },
  {
    title: "Permutator",
    description: "Find the needle in the haystack with smart domain permutation logic.",
    icon: Search,
    className: "lg:col-span-1 lg:row-span-2",
    color: "text-indigo-600",
    bg: "bg-indigo-500/10",
    accent: "border-t-4 border-indigo-500/30",
  },
  {
    title: "Global Reach",
    description: "Access contacts from any domain, anywhere in the world.",
    icon: Globe,
    className: "lg:col-span-2 lg:row-span-1",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    accent: "border-r-4 border-emerald-500/30",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [index, setIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  const containerRef = useRef(null);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch("http://localhost:5000/verify/verify-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
      setVerificationResult({ status: "Error", message: "Backend offline" });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div ref={containerRef} className="relative flex flex-col gap-32 pb-32">
      <GridBackground />
      <FloatingIcons />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16">
        <div className="container mx-auto px-4 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8 backdrop-blur-sm"
          >
            <SparklesIcon />
            <span>The Premium Outreach Suite</span>
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
            No complex signups, no hidden fees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/permutator">
              <button className="premium-gradient group relative inline-flex items-center gap-2 rounded-2xl px-10 py-5 font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95">
                Get Started
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/docs">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/80 backdrop-blur-md px-10 py-5 font-bold text-slate-900 transition-all hover:bg-slate-50 active:scale-95 shadow-sm">
                Documentation
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Verification Access */}
      <section className="container mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative rounded-[2.5rem] bg-indigo-950 p-2 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] ring-1 ring-white/10 overflow-hidden">
            <div className="relative z-10 rounded-[2.2rem] bg-slate-900/40 backdrop-blur-3xl p-8 md:p-14">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3 text-white">One-Click Verification</h2>
                <p className="text-indigo-200/60">High-precision SMTP validation in seconds.</p>
              </div>

              <form onSubmit={handleVerify} className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1 group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-white" size={22} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-indigo-900 bg-indigo-950/50 py-5 pl-14 pr-6 text-lg text-white outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-indigo-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="rounded-2xl bg-white px-10 py-5 font-bold text-indigo-950 transition-all hover:bg-indigo-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isVerifying ? "Processing..." : "Verify Identity"}
                </button>
              </form>

              <AnimatePresence>
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="mt-10 rounded-2xl border border-indigo-800/30 bg-indigo-900/10 p-8"
                  >
                    <div className="flex items-center gap-6 text-left">
                      <div className={cn(
                        "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg",
                        verificationResult.status === "Valid" ? "bg-emerald-500 text-white" : 
                        verificationResult.status === "Invalid" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                      )}>
                        <ShieldCheck size={32} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-2xl mb-1 text-white">{verificationResult.status}</h3>
                        <p className="text-indigo-200/80 font-medium">
                          {verificationResult.details || `Identity check complete for ${email}.`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Ambient glows inside card */}
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary rounded-full blur-[100px] opacity-10" />
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful by Design</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Every tool is optimized for conversion and built with the recruiter's workflow in mind.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {bentoFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: feature.color.replace('text-', '') }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-10 transition-all hover:shadow-2xl premium-shadow",
                feature.className,
                feature.accent
              )}
            >
              <div className="absolute inset-0 dots-pattern opacity-[0.05]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className={cn("inline-flex w-fit rounded-2xl p-5 mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6", feature.bg, feature.color)}>
                  <feature.icon size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-[0.05] transition-all group-hover:scale-110 group-hover:opacity-[0.1] group-hover:rotate-12">
                <feature.icon size={200} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="container mx-auto px-4 sm:px-8 pb-12">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="premium-gradient relative rounded-[3rem] p-1 shadow-2xl overflow-hidden"
        >
            <div className="rounded-[calc(3rem-4px)] bg-indigo-950/40 backdrop-blur-3xl p-16 md:p-24 text-center relative overflow-hidden">
                <h2 className="text-4xl font-black text-white sm:text-6xl mb-6">Elevate your outreach today.</h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-10 text-xl font-medium">
                    Join the professionals who use Codeforage to find more contacts and land more replies. No catch, just quality tools.
                </p>
                <div className="flex justify-center gap-6">
                    <Link href="/permutator">
                        <button className="bg-white text-indigo-950 px-10 py-5 rounded-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl">
                            Get Started for Free
                        </button>
                    </Link>
                </div>
                {/* Decorative floating icon */}
                <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-10 right-10 text-white/10"
                >
                    <ShieldCheck size={120} />
                </motion.div>
            </div>
            {/* Ambient glows for the CTA */}
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary rounded-full blur-[100px] opacity-20" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-accent rounded-full blur-[100px] opacity-20" />
        </motion.div>
      </section>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 0.75L9 5.25L13.5 6L9.75 9L11.25 13.5L7.5 11.25L3.75 13.5L5.25 9L1.5 6L6 5.25L7.5 0.75Z" fill="currentColor"/>
    </svg>
  );
}
