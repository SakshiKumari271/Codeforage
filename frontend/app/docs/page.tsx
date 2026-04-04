"use client";

import { motion } from "framer-motion";
import { Book, ShieldCheck, Mail, Zap, CheckCircle2, AlertCircle, Info } from "lucide-react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    content: "Codeforage is designed to be a simple, professional toolkit for outbound outreach. There are no paid plans, no account requirements, and no tracking. Every tool is built for maximum privacy and performance.",
    tips: [
      "Use the Navbar to navigate between tools.",
      "Verification tools don't require an API key.",
      "Email Drafting requires your own OpenAI or Groq API key for privacy."
    ]
  },
  {
    id: "email-verifier",
    title: "Email Verifier",
    icon: ShieldCheck,
    content: "The email verifier uses SMTP (Simple Mail Transfer Protocol) checking to determine if an email address exists and can receive messages. It connects directly to the mail server to confirm validity without actually sending an email.",
    details: "This is 100% free and requires no configuration. Simply enter an email and check its status instantly."
  },
  {
    id: "permutator",
    title: "Permutator",
    icon: Mail,
    content: "Our Permutation tool helps you discover the correct email address for contacts at a given company domain. By providing a first and last name, we generate common professional email patterns (like first.last@company.com) and verify each one for you.",
    details: "You can add multiple employees at once to speed up your prospecting workflow."
  },
  {
    id: "email-drafter",
    title: "AI Email Drafter",
    icon: Zap,
    content: "The Drafter combines your unique professional background (from your resume) with specific company context to write high-converting cold emails. It uses the latest LLMs to ensure your outreach feels human and relevant.",
    details: "To ensure your data privacy, we do not store your API keys. You must provide your own key from OpenAI or Groq, which is kept only in your browser session."
  }
];

export default function DocsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-8">
      <div className="flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            Everything you need to know about the Codeforage professional toolkit.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {sections.map((section) => (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-3xl border border-border bg-card p-1 shadow-sm overflow-hidden"
            >
              <div className="rounded-[calc(1.5rem-1px)] bg-background p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <section.icon size={28} />
                  </div>
                  <h2 className="text-3xl font-bold">{section.title}</h2>
                </div>

                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {section.content}
                </p>

                {section.details && (
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 mb-8">
                    <Info className="mt-1 text-primary shrink-0" size={20} />
                    <p className="text-sm font-medium text-muted-foreground italic">
                      {section.details}
                    </p>
                  </div>
                )}

                {section.tips && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Tips</h4>
                    <ul className="grid gap-3">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-foreground/70">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl premium-gradient p-12 text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">No Paid Plans</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 font-medium">
            Codeforage is a passion project built to democratize professional outreach tools.
            We will never charge for features and we do not provide a public API for programmatic use.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">Free Forever</span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">Secure & Private</span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">No API Keys Required (Verify)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
