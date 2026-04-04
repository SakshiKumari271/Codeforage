"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Globe, 
  Send, 
  User, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Loader2, 
  Mail, 
  Copy, 
  Check, 
  Filter, 
  ChevronDown, 
  ArrowDownCircle,
  Upload,
  FileSpreadsheet,
  Info
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PermutatorResult } from "@/types/interfaces";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PermutatorPage() {
  const [domain, setDomain] = useState("");
  const [employees, setEmployees] = useState([{ id: 1, first: "", last: "" }]);
  const [results, setResults] = useState<PermutatorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "valid" | "unknown">("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"manual" | "bulk">("manual");
  const hasResults = results.length > 0;
  const resultsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasResults && resultsGridRef.current) {
      setTimeout(() => {
        resultsGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [hasResults]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  }, []);

  const copyAllValid = useCallback(() => {
    const allValid = results.flatMap(r => 
      r.verifications.filter(v => v.status === "Valid").map(v => v.email)
    ).join(", ");
    if (allValid) {
      navigator.clipboard.writeText(allValid);
      setCopiedEmail("all-valid");
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  }, [results]);

  const filteredResults = results.map(res => ({
    ...res,
    verifications: res.verifications.filter(v => {
      if (filter === "all") return true;
      if (filter === "valid") return v.status === "Valid";
      if (filter === "unknown") return v.status === "Unknown" || v.status === "Catch-all";
      return false;
    })
  })).filter(res => res.verifications.length > 0);

  const validCount = results.reduce((acc, res) => 
    acc + res.verifications.filter(v => v.status === "Valid").length, 0
  );

  const addEmployee = () => {
    setEmployees([...employees, { id: employees.length + 1, first: "", last: "" }]);
  };

  const removeEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handlePermute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setLoading(true);
    setResults([]);

    try {
      const payload = {
        domain,
        finds: employees.filter(e => e.first && e.last).map(e => ({
          first_name: e.first,
          last_name: e.last
        }))
      };

      const res = await fetch("http://localhost:5000/api/permutator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 sm:px-8 max-w-6xl">
      <div className="flex flex-col gap-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Email <span className="premium-text-gradient">Permutator</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate and verify potentially active email addresses for any professional person at a company.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6 rounded-[32px] border border-border bg-card shadow-2xl p-6 lg:p-8 overflow-hidden min-h-[500px]">
              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 bg-muted/40 rounded-2xl mb-2">
                <button
                  onClick={() => setActiveTab("manual")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                    activeTab === "manual" ? "bg-card text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <User size={16} />
                  Individual
                </button>
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                    activeTab === "bulk" ? "bg-card text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Upload size={16} />
                  Bulk Import
                </button>
              </div>

              {activeTab === "manual" ? (
                <form onSubmit={handlePermute} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
                      Company Domain
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                      <input
                        type="text"
                        placeholder="example.com"
                        className="w-full rounded-2xl border border-border/50 bg-muted/20 py-4 pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
                      Target Employees
                    </label>
                    <div className="flex flex-col gap-3">
                      {employees.map((emp) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={emp.id}
                          className="flex gap-2"
                        >
                          <div className="relative flex-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                            <input
                              type="text"
                              placeholder="First Name"
                              className="w-full rounded-xl border border-border/50 bg-muted/20 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                              value={emp.first}
                              onChange={(e) =>
                                setEmployees(employees.map(ev => ev.id === emp.id ? { ...ev, first: e.target.value } : ev))
                              }
                              required
                            />
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="w-full rounded-xl border border-border/50 bg-muted/20 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                              value={emp.last}
                              onChange={(e) =>
                                setEmployees(employees.map(ev => ev.id === emp.id ? { ...ev, last: e.target.value } : ev))
                              }
                              required
                            />
                          </div>
                          {employees.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmployee(emp.id)}
                              className="rounded-xl border border-border/50 p-3 text-red-400 hover:bg-red-50/50 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addEmployee}
                      className="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-all group"
                    >
                      <Plus size={16} className="group-hover:scale-110 transition-transform" />
                      Add another employee
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-black uppercase tracking-[0.2em] text-[11px] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={16} />
                        Run Permutations
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col flex-1"
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/60 rounded-[32px] hover:border-primary/40 hover:bg-muted/30 transition-all group cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv,.xlsx,.xls" />
                    <div className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-5 group-hover:scale-110 transition-transform flex">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-1">Click or Drag CSV here</h3>
                      <p className="text-xs text-muted-foreground">XLSX, XLS files are also supported (Max 10MB)</p>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 px-5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                       <Upload size={14} />
                       Upload Spreadsheet
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {["firstname", "lastname", "domain"].map((col) => (
                      <div key={col} className="flex flex-col items-center p-3 rounded-2xl bg-muted/40 border border-border/50 text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">{col}</span>
                        <CheckCircle2 size={14} className="text-green-500" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 italic opacity-60">
                    Required headers must match precisely to ensure correct mapping.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6 rounded-[32px] border border-border bg-card/50 backdrop-blur-sm p-6 lg:p-8 shadow-xl">
              <div className="mb-2">
                <h3 className="text-xl font-bold tracking-tight mb-2">Search Summary</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Real-time insights for your current permutation session.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">Results</span>
                  <span className="text-2xl font-black text-primary">{results.length}</span>
                </div>
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">Valid</span>
                  <span className="text-2xl font-black text-green-500">{validCount}</span>
                </div>
              </div>

              <div className="mt-4 p-6 rounded-[32px] bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary flex">
                    <Info size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Pro Outreach Tip</span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground font-medium">
                  Use the <span className="text-foreground font-bold">Copy Valid</span> button at the bottom to instantly grab all safe emails for your CRM or Sequencer.
                </p>
              </div>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6"
                >
                  <Loader2 className="animate-spin text-primary mb-4" size={32} />
                  <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Running Scan...</p>
                </motion.div>
              )}
              
              {!loading && results.length > 0 && (
                <button 
                  onClick={() => resultsGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-card border border-border/50 py-4 text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted transition-all active:scale-95 shadow-sm"
                >
                  Jump to results
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Dashboard Table (Bottom Section) */}
        {results.length > 0 && (
          <motion.div 
            ref={resultsGridRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-16 pb-32"
          >
            <div className="flex flex-col gap-12">
              <div className="flex items-center justify-between border-b border-border/50 pb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Results Dashboard</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-1 opacity-60">Verified permutations for {domain}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 border-r border-border/50 pr-6 mr-2">
                    {(["all", "valid", "unknown"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                          filter === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={copyAllValid}
                    className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/10"
                  >
                    {copiedEmail === "all-valid" ? <Check size={16} /> : <Copy size={16} />}
                    {copiedEmail === "all-valid" ? "Copied" : "Copy Valid"}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card/10 backdrop-blur-sm custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-1/4">Employee</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-2/5">Email Address</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-1/5 text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-auto text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((res) => (
                      res.verifications.map((v, index) => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={`${res.first_name}-${res.last_name}-${index}`}
                          className={cn(
                            "group border-b border-border/10 last:border-0 hover:bg-primary/5 transition-colors",
                            index === res.verifications.length - 1 && "border-b-border/60 border-b-2"
                          )}
                        >
                          <td className="px-6 py-3">
                            {index === 0 ? (
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                                  <User size={14} className="text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold tracking-tight">{res.first_name} {res.last_name}</span>
                                  <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">{domain}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="pl-11 opacity-20 text-[10px] font-mono italic">"</div>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <span className={cn(
                              "text-sm tracking-tight transition-colors",
                              v.status === "Valid" ? "text-foreground font-bold" : "text-muted-foreground font-medium"
                            )}>
                              {v.email}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-center gap-3">
                              {v.status === "Valid" ? (
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                              ) : v.status === "Invalid" ? (
                                <div className="h-2 w-2 rounded-full bg-red-400 opacity-40" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-yellow-400 opacity-40" />
                              )}
                              <span className={cn(
                                "text-[10px] uppercase font-black tracking-widest min-w-[60px]",
                                v.status === "Valid" ? "text-green-600" : "text-muted-foreground/40"
                              )}>
                                {v.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button
                              onClick={() => copyToClipboard(v.email)}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-primary transition-all active:scale-90"
                              title="Copy Email"
                            >
                              {copiedEmail === v.email ? <Check size={16} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
