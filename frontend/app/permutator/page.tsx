"use client";

import { motion } from "framer-motion";
import { Plus, Trash2, Globe, Send, User, CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
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
    <div className="container mx-auto max-w-5xl px-4 pt-32 pb-16 sm:px-8">
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
            <form onSubmit={handlePermute} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-xl lg:p-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Company Domain
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="example.com"
                    className="w-full rounded-xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Employees
                </label>
                <div className="flex flex-col gap-3">
                  {employees.map((emp) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={emp.id}
                      className="flex gap-2"
                    >
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="First Name"
                          className="w-full rounded-xl border border-border bg-muted/30 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                          className="w-full rounded-xl border border-border bg-muted/30 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                          className="rounded-xl border border-border p-3 text-red-500 hover:bg-red-50 transition-all"
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
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  <Plus size={18} />
                  Add another employee
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl premium-gradient py-4 font-bold text-white shadow-lg transition-transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} />
                    Run Permutations
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-border bg-muted/20 p-6 lg:p-8">
              <h3 className="text-xl font-bold">Results</h3>
              {results.length === 0 && !loading && (
                <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground opacity-50">
                  <Mail size={48} strokeWidth={1} className="mb-4" />
                  <p>Results will appear here after you run permutations.</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Loader2 className="animate-spin text-primary mb-4" size={48} />
                  <p className="text-muted-foreground font-medium">Hunting for valid emails...</p>
                </div>
              )}

              <div className="flex flex-col gap-6 overflow-y-auto max-h-[600px] pr-2">
                {results.map((res, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                      <span className="font-bold">{res.first_name} {res.last_name}</span>
                      <span className="text-xs text-muted-foreground uppercase">{domain}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {res.verifications.map((v, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-mono text-xs opacity-80 break-all">{v.email}</span>
                          <span className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            v.status === "Valid" ? "bg-green-500/10 text-green-600" :
                              v.status === "Invalid" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"
                          )}>
                            {v.status === "Valid" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {v.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
