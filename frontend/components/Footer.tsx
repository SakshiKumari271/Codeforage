"use client";

import Link from "next/link";
import { Mail, Code, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-slate-950 py-16 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Code size={22} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Codeforage
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Empowering developers and recruiters with high-performance outreach tools.
              Built for speed, privacy, and results.
            </p>
            <div className="flex gap-4">
              {[
                {
                  name: "GitHub",
                  href: "https://github.com",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )
                },
                {
                  name: "X (Twitter)",
                  href: "https://twitter.com",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
                    </svg>
                  )
                },
                {
                  name: "LinkedIn",
                  href: "https://linkedin.com",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )
                },
                {
                  name: "Email",
                  href: "mailto:hello@codeforage.com",
                  icon: <Mail className="w-5 h-5" />
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-primary/50 hover:text-primary"
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Product</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-slate-400">
                <li><Link href="/permutator" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Permutator <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/verify" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Email Verifier <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/drafter" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Email Drafter <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/templates" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Templates <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Resources</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-slate-400">
                <li><Link href="/docs" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Documentation <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/api" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">API Reference <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Engineering Blog <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Company</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-slate-400">
                <li><Link href="/about" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">About Us <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Privacy Policy <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">Terms of Service <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>© {currentYear} Codeforage Inc. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/status" className="hover:text-white transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <p className="font-medium text-slate-400 italic underline decoration-primary/50 decoration-2 underline-offset-4">
              Zero Tracking. Zero Cookies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
