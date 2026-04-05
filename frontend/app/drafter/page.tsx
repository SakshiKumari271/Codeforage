"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileUp,
  Sparkles,
  Key,
  ShieldCheck,
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Mail,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Provider } from "@/types/interfaces";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const providers: Provider[] = [
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
  const [draft, setDraft] = useState<string | { subject: string, body: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const getMailData = (d: string | { subject: string, body: string }) => {
    if (typeof d === 'object' && d !== null) {
      return {
        subject: encodeURIComponent(d.subject),
        body: encodeURIComponent(d.body),
        rawSubject: d.subject,
        rawBody: d.body
      };
    }

    const lines = d.split('\n');
    let subject = "Outreach from Codeforage";
    let body = d;

    const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'));
    if (subjectLine) {
      subject = subjectLine.replace(/subject:/i, '').trim();
      body = lines.filter(line => !line.toLowerCase().startsWith('subject:')).join('\n').trim();
    }

    return {
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body),
      rawSubject: subject,
      rawBody: body
    };
  };

  const mailData = draft ? getMailData(draft) : { subject: "", body: "", rawSubject: "", rawBody: "" };

  const composeOptions = [
    {
      name: "Gmail",
      icon: (
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EA4335]/10 text-[#EA4335]">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.26-9-6.26V21H1.5c-.85 0-1.5-.65-1.5-1.5v-15c0-.4.15-.75.45-1.05.3-.3.65-.45 1.05-.45H3.1l8.9 5.92L20.9 3H22.5c.4 0 .75.15 1.05.45.3.3.45.65.45 1.05z" />
          </svg>
        </div>
      ),
      url: `https://mail.google.com/mail/?view=cm&fs=1&su=${mailData.subject}&body=${mailData.body}`
    },
    {
      name: "Outlook",
      icon: (
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0078D4]/10 text-[#0078D4]">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M21 0H3C1.35 0 0 1.35 0 3v18c0 1.65 1.35 3 3 3h18c1.65 0 3-1.35 3-3V3c0-1.65-1.35-3-3-3z" />
            <path d="M17.4 17.4l-4.2-4.2 4.2-4.2L16 7.6l-5.6 5.6 5.6 5.6 1.4-1.4zM6.6 6.6l4.2 4.2-4.2 4.2L8 16.4l5.6-5.6L8 5.2 6.6 6.6z" className="text-white" />
          </svg>
        </div>
      ),
      url: `https://outlook.office.com/mail/deeplink/compose?subject=${mailData.subject}&body=${mailData.body}`
    },
    {
      name: "Default email app",
      icon: (
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Mail size={12} />
        </div>
      ),
      url: `mailto:?subject=${mailData.subject}&body=${mailData.body}`
    }
  ];

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
      const res = await fetch("http://localhost:5000/api/draft-email", {
        method: "POST",
        body: formData,
      });
      const data: { error?: string, draft?: any } = await res.json();
      if (data.error) throw new Error(data.error);
      
      let finalDraft = data.draft || null;
      
      // Enhanced JSON extraction and parsing
      if (typeof finalDraft === 'string') {
        try {
          // Find the first '{' and last '}' to extract potential JSON
          const start = finalDraft.indexOf('{');
          const end = finalDraft.lastIndexOf('}');
          
          if (start !== -1 && end !== -1 && end > start) {
            let jsonPart = finalDraft.substring(start, end + 1);
            
            // Fix "Bad control character" (literal newlines) in JSON strings
            // This replaces literal newlines inside the JSON with \n
            jsonPart = jsonPart.replace(/\n/g, "\\n")
                             // But we need to un-escape the ones that shouldn't be escaped 
                             // (between keys/values)
                             .replace(/\\n\s*"/g, '\n"')
                             .replace(/"\s*\\n/g, '"\n');

            const parsed = JSON.parse(jsonPart);
            if (parsed.subject || parsed.body) {
              finalDraft = parsed;
            }
          }
        } catch (e) {
          console.error("Failed to parse draft JSON", e);
        }
      }

      // Cleanup literal \n characters if they exist in the body
      if (typeof finalDraft === 'object' && finalDraft !== null && finalDraft.body) {
        finalDraft.body = finalDraft.body.replace(/\\n/g, '\n');
        // Rescue logic: Ensure sign-off is on separate lines
        finalDraft.body = finalDraft.body.replace(/(Best regards|Sincerely|Thanks|Cheers|Regards),\s*([A-Z][a-z]+)/g, '$1,\n$2');
      } else if (typeof finalDraft === 'string') {
        finalDraft = finalDraft.replace(/\\n/g, '\n');
        finalDraft = finalDraft.replace(/(Best regards|Sincerely|Thanks|Cheers|Regards),\s*([A-Z][a-z]+)/g, '$1,\n$2');
      }

      setDraft(finalDraft);
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error).message || "Error connecting to backend");
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const textToCopy = typeof draft === 'object' ? `Subject: ${draft.subject}\n\n${draft.body}` : draft;
                      navigator.clipboard.writeText(textToCopy);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase transition-all shadow-sm",
                        isDropdownOpen 
                          ? "bg-primary text-white scale-105" 
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <Send size={14} />
                      Compose
                      <ChevronDown size={12} className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-2xl z-50 glass"
                        >
                          {composeOptions.map((opt) => (
                            <a
                              key={opt.name}
                              href={opt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                            >
                              {opt.icon}
                              {opt.name}
                              <ExternalLink size={12} className="ml-auto opacity-30" />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
                  {typeof draft === 'object' ? (
                    <>
                      <div className="mb-6 pb-6 border-b border-border">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Subject</span>
                        <h4 className="text-lg font-bold text-foreground leading-tight">{draft.subject}</h4>
                      </div>
                      <div className="whitespace-pre-wrap">{draft.body}</div>
                    </>
                  ) : (
                    draft
                  )}
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
