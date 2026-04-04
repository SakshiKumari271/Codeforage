"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Mail, FileText, Book, Menu, X, Rocket, ChevronRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", href: "/", icon: Code },
  { name: "Permutator", href: "/permutator", icon: Mail },
  { name: "Verifier", href: "/verify", icon: ShieldCheck },
  { name: "AI Drafter", href: "/drafter", icon: FileText },
  { name: "Docs", href: "/docs", icon: Book },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 sm:p-4 transition-all duration-300">
      <nav
        className={cn(
          "w-full max-w-7xl rounded-2xl border transition-all duration-500",
          scrolled 
            ? "border-indigo-500/20 bg-indigo-950/80 shadow-2xl backdrop-blur-xl py-1.5 sm:py-2" 
            : "border-transparent bg-transparent py-2 sm:py-4"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Code size={22} strokeWidth={2.5} />
            </motion.div>
            <span className={cn(
              "text-lg sm:text-xl font-extrabold tracking-tight transition-colors group-hover:text-primary",
              scrolled ? "text-white" : "text-slate-900"
            )}>
              Codeforage
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:bg-black/5",
                  scrolled 
                    ? (pathname === item.href ? "text-white" : "text-indigo-200/60 hover:text-white")
                    : (pathname === item.href ? "text-primary" : "text-slate-600 hover:text-slate-900")
                )}
              >
                <item.icon size={16} strokeWidth={2} />
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 z-[-1] rounded-xl ring-1",
                      scrolled ? "bg-white/10 ring-white/20" : "bg-primary/10 ring-primary/20"
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/permutator" className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                <span>Launch App</span>
                <Rocket size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </Link>

            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors md:hidden",
                scrolled 
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="mx-2 mt-2 space-y-1 rounded-2xl border border-border/50 bg-background/80 p-2 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[80vh]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-95",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} strokeWidth={2.5} />
                      {item.name}
                    </div>
                    <ChevronRight size={16} opacity={0.5} />
                  </Link>
                ))}
                <Link
                  href="/permutator"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
                  onClick={() => setIsOpen(false)}
                >
                  <Rocket size={18} />
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

