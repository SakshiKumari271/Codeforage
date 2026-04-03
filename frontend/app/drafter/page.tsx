"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Sparkles, 
  Key, 
  Globe, 
  ShieldCheck, 
  Brain, 
  Send, 
  Loader2, 
  X, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useState, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const providers = [
  { 
    id: "OpenAI", 
    name: "OpenAI", 
    icon: Sparkles,
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"]
  },
  { 
    id: "Groq", 
    name: "Groq (Llama)", 
    icon: Brain,
    models: ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768"]
  }
];

export default function EmailDrafterPage() {
  const [provider, setProvider] = useState(providers[0]);
  const [model, setModel] = useState(providers[0].models[0]);
  const [apiKey, setApiKey] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleProviderChange = (p: typeof providers[0]) => {
    setProvider(p);
    setModel(p.models[0]);
  };

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !apiKey || !context) return;
    setLoading(true);
    setDraft(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("context", context);
    formData.append("provider", provider.id);
    formData.append("api_key", apiKey);
    formData.append("model", model);

    try {
      const res = await fetch("http://localhost:5000/draft/draft-email", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDraft(data.draft);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Settings Side */}
        <div className="lg:w-1/3 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Email <span className="premium-text-gradient">Drafter</span>
            </h1>
            <p className="text-muted-foreground">
              Personalize your outreach using AI and your professional profile.
            </p>
          </div>

          <form onSubmit={handleDraft} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-xl">
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  AI Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {providers.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => handleProviderChange(p)}
                            className={cn(
                                "flex items-center justify-center gap-2 rounded-xl border border-border py-3 px-2 text-xs font-semibold transition-all",
                                p.id === provider.id ? "bg-primary/10 border-primary text-primary" : "hover:bg-muted"
                            )}
                        >
                            <p.icon size={14} />
                            {p.name}
                        </button>
                    ))}
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Model
                </label>
                <select
                    className="w-full rounded-xl border border-border bg-muted/30 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    {provider.models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="password"
                    placeholder={`${provider.id} API Key`}
                    className="w-full rounded-xl border border-border bg-muted/30 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck size={10} /> Not stored on our servers. Browser only.
                </p>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Resume (PDF)
                </label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 py-8 transition-all hover:border-primary/50 hover:bg-primary/5",
                        resume ? "border-green-500/50 bg-green-500/5" : ""
                    )}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="application/pdf"
                        className="hidden" 
                    />
                    {resume ? (
                        <>
                            <CheckCircle2 className="text-green-500" size={32} />
                            <span className="text-sm font-medium text-green-700">{resume.name}</span>
                        </>
                    ) : (
                        <>
                            <FileUp className="text-muted-foreground" size={32} />
                            <span className="text-sm font-medium">Click to upload PDF</span>
                        </>
                    )}
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Company Context
                </label>
                <textarea
                    placeholder="Tell us about the company or the role..."
                    className="min-h-[120px] w-full rounded-xl border border-border bg-muted/30 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    required
                />
             </div>

             <button
                type="submit"
                disabled={loading || !resume || !apiKey || !context}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl premium-gradient py-4 font-bold text-white shadow-lg transition-transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Personal Email
                  </>
                )}
              </button>
          </form>
        </div>

        {/* Output Side */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="flex h-full flex-col rounded-3xl border border-border bg-muted/10 p-6 lg:p-8 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Email Draft</h3>
                {draft && (
                    <button 
                        onClick={() => navigator.clipboard.writeText(draft)}
                        className="text-xs font-bold uppercase text-primary hover:underline"
                    >
                        Copy to Clipboard
                    </button>
                )}
              </div>

              {!draft && !loading && (
                <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground opacity-50 px-12">
                  <Send size={64} strokeWidth={1} className="mb-6" />
                  <h4 className="text-lg font-semibold mb-2">Ready for Outreach?</h4>
                  <p className="max-w-xs text-sm">
                    Fill in the details on the left and our AI will craft a high-converting cold email for you.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="text-primary opacity-30" size={80} strokeWidth={1} />
                  </motion.div>
                  <p className="mt-8 text-lg font-medium text-foreground">AI is reading your profile...</p>
                  <p className="text-muted-foreground text-sm">Calculating the best outreach strategy.</p>
                </div>
              )}

              {draft && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 rounded-2xl border border-border bg-card p-8 shadow-inner overflow-hidden flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-serif">
                        {draft}
                    </div>
                </motion.div>
              )}

              {draft && (
                <div className="mt-6 flex items-center gap-2 p-4 rounded-xl bg-blue-500/5 text-blue-600 text-xs border border-blue-200">
                    <AlertTriangle size={14} />
                    <span>AI can make mistakes. Always review the content before sending.</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
