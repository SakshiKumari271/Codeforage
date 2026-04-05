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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [presentHeaders, setPresentHeaders] = useState({ first: false, last: false, domain: false });
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

  const validateCSVHeaders = (content: string) => {
    const firstLine = content.split('\n')[0];
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

    const required = {
      first: ['First Name', 'firstname', 'first', 'fname', 'first_name'],
      last: ['Last Name', 'lastname', 'last', 'lname', 'last_name'],
      domain: ['Company Name', 'companyname', 'company', 'domain', 'website', 'url', 'company_name']
    };

    const found = {
      first: required.first.some(alias => headers.includes(alias.toLowerCase().replace(/[^a-z0-9]/g, ''))),
      last: required.last.some(alias => headers.includes(alias.toLowerCase().replace(/[^a-z0-9]/g, ''))),
      domain: required.domain.some(alias => headers.includes(alias.toLowerCase().replace(/[^a-z0-9]/g, '')))
    };

    const missing: string[] = [];
    if (!found.first) missing.push("First Name");
    if (!found.last) missing.push("Last Name");
    if (!found.domain) missing.push("Company/Domain");

    return { missing, found };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setValidationError("Please upload a .csv file");
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const { missing, found } = validateCSVHeaders(content);

      setPresentHeaders(found);
      if (missing.length > 0) {
        setValidationError(`Missing columns: ${missing.join(', ')}`);
        setSelectedFile(null);
      } else {
        setValidationError(null);
        setSelectedFile(file);
      }
    };
    reader.readAsText(file.slice(0, 5000)); // Just read the beginning for headers
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/upload_csv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
      } else {
        alert(data.error || "Failed to upload CSV");
      }
    } catch (err) {
      console.error(err);
      alert("Eror connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!results.length) return;
    setIsExporting(true);

    try {
      const headers = ["First Name", "Last Name", "Domain", "Email", "Status", "Reason"];
      const rows = results.flatMap(res =>
        res.verifications.map(v => [
          res.first_name,
          res.last_name,
          res.domain || domain,
          v.email,
          v.status,
          (v as any).reason || ""
        ].map(val => `"${val}"`).join(","))
      );

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `permutator_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const content = "First Name,Last Name,Company Name\nJohn,Doe,example.com\nJane,Smith,google.com";
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_outreach.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-32 sm:px-8 max-w-6xl">
      <div className="flex flex-col gap-12">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Email <span className="premium-text-gradient">Permutator</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Generate and verify potentially active email addresses for any professional person at a company.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6 rounded-2xl sm:rounded-[32px] border border-border bg-card shadow-2xl p-4 sm:p-6 lg:p-8 overflow-hidden min-h-[400px] sm:min-h-[500px]">
              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 bg-muted/40 rounded-2xl mb-2 overflow-hidden">
                <button
                  onClick={() => setActiveTab("manual")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 px-1 py-3 text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest rounded-xl transition-all min-w-0",
                    activeTab === "manual" ? "bg-card text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <User size={14} className="flex-shrink-0" />
                  <span className="truncate">Individual</span>
                </button>
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 px-1 py-3 text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest rounded-xl transition-all min-w-0",
                    activeTab === "bulk" ? "bg-card text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Upload size={14} className="flex-shrink-0" />
                  <span className="truncate">Bulk Import</span>
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
                          className="flex flex-col sm:flex-row gap-2"
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
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-black uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-[11px] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <label
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 border-2 border-dashed rounded-[32px] transition-all group cursor-pointer relative",
                      validationError ? "border-red-400 bg-red-50/10" : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                    <div className={cn(
                      "h-16 w-16 items-center justify-center rounded-2xl mb-5 group-hover:scale-110 transition-transform flex",
                      validationError ? "bg-red-500/10 text-red-500" : "bg-primary/5 text-primary"
                    )}>
                      <FileSpreadsheet size={32} />
                    </div>
                    <div className="mb-6">
                      <h3 className="text-base sm:text-lg font-bold mb-1 break-all">
                        {selectedFile ? selectedFile.name : "Click or Drag CSV here"}
                      </h3>
                      {validationError ? (
                        <p className="text-xs text-red-500 font-bold">{validationError}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Standard CSV files are supported</p>
                      )}
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 p-3 px-5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      selectedFile
                        ? "bg-green-500/10 text-green-500"
                        : "bg-primary/10 text-primary"
                    )}>
                      <Upload size={14} />
                      {selectedFile ? "File Ready" : "Select CSV File"}
                    </div>
                  </label>

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                      <button
                        onClick={downloadSampleCSV}
                        className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-all flex items-center gap-2"
                      >
                        <ArrowDownCircle size={14} />
                        Download Sample
                      </button>
                    </div>

                    <button
                      onClick={handleBulkUpload}
                      disabled={loading || !selectedFile || !!validationError}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-black uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-[11px] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <Send size={16} />
                          Process Bulk List
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {([
                      { key: "first", label: "firstname" },
                      { key: "last", label: "lastname" },
                      { key: "domain", label: "domain" }
                    ] as const).map((col) => {
                      const isPresent = presentHeaders[col.key];
                      return (
                        <div
                          key={col.key}
                          className={cn(
                            "flex-1 min-w-[70px] flex flex-col items-center p-2 rounded-xl border transition-all text-center",
                            isPresent
                              ? "bg-green-500/5 border-green-500/20 text-green-500 opacity-100"
                              : selectedFile || validationError
                                ? "bg-red-500/5 border-red-500/20 text-red-400 opacity-100"
                                : "bg-muted/40 border-border/50 text-muted-foreground/30 opacity-40"
                          )}
                        >
                          <span className="text-[8px] font-black uppercase tracking-widest mb-1">{col.label}</span>
                          {isPresent ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6 rounded-[32px] border border-border bg-card/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="mb-2">
                <h3 className="text-xl font-bold tracking-tight mb-2">Search Summary</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time insights for your current permutation session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">Results</span>
                  <span className="text-2xl font-black text-primary">{results.length}</span>
                </div>
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">Valid</span>
                  <span className="text-2xl font-black text-green-500">{validCount}</span>
                </div>
              </div>

              <div className="mt-4 p-5 sm:p-6 rounded-[32px] bg-primary/5 border border-primary/10">
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-border/50 pb-8 gap-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-black tracking-tight uppercase">Results Dashboard</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-1 opacity-60">Verified permutations for {domain}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-border/50 pb-4 sm:pb-0 sm:pr-6 sm:mr-2">
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
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/10"
                  >
                    {copiedEmail === "all-valid" ? <Check size={16} /> : <Copy size={16} />}
                    {copiedEmail === "all-valid" ? "Copied" : "Copy Valid"}
                  </button>
                  <button
                    onClick={exportToCSV}
                    disabled={isExporting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted hover:border-border/80 active:scale-95 disabled:opacity-50"
                  >
                    <ArrowDownCircle size={16} className={isExporting ? "animate-bounce" : ""} />
                    {isExporting ? "Exporting..." : "Export CSV"}
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
                                  <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">{res.domain || domain}</span>
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
