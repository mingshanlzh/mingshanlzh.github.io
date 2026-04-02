"use client";
import { useState } from "react";
import { Mail, CheckCircle2, ExternalLink } from "lucide-react";

const socialProfiles = [
  { label: "Google Scholar", href: "https://scholar.google.com/citations?user=TeSuUycAAAAJ&hl=en", color: "#4285F4" },
  { label: "ORCID",          href: "https://orcid.org/0000-0003-1015-1278",                       color: "#A6CE39" },
  { label: "ResearchGate",   href: "https://www.researchgate.net/profile/Shan-Jiang-46",           color: "#00CCBB" },
  { label: "Twitter / X",    href: "https://x.com/ShanJiangHE",                                    color: "#1DA1F2" },
  { label: "GitHub",         href: "https://github.com/mingshanlzh",                               color: "#24292E" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to Supabase Edge Function or Formspree
    setSent(true);
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Contact</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Get in touch for collaborations, media inquiries, or general questions.
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Left — contact info */}
        <div>
          <section className="mb-8">
            <h2 className="section-title">Direct</h2>
            <a href="mailto:shan.jiang@mq.edu.au"
              className="flex items-center gap-3 card" style={{ textDecoration: "none" }}>
              <div className="p-2 rounded-lg" style={{ background: "var(--accent-bg)" }}>
                <Mail size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Institution email</p>
                <p className="font-medium text-sm" style={{ color: "var(--accent)" }}>shan.jiang@mq.edu.au</p>
              </div>
            </a>
          </section>

          <section>
            <h2 className="section-title">Profiles</h2>
            <div className="flex flex-col gap-3">
              {socialProfiles.map((p) => (
                <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 card" style={{ textDecoration: "none" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: p.color + "20", color: p.color }}>
                    {p.label.slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>
                    {p.label}
                  </span>
                  <ExternalLink size={12} className="ml-auto" style={{ color: "var(--text-muted)" }} />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right — contact form */}
        <div>
          <h2 className="section-title">Send a Message</h2>
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                { id: "subject", label: "Subject", type: "text", placeholder: "Collaboration / Media / Other" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                    {label}
                  </label>
                  <input required type={type} placeholder={placeholder}
                    value={(form as Record<string, string>)[id]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                  Message
                </label>
                <textarea required rows={4} placeholder="Your message…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Mail size={15} /> Send Message
              </button>
            </form>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "2rem", background: "var(--accent-bg)" }}>
              <CheckCircle2 size={28} style={{ color: "#38A169", margin: "0 auto 1rem" }} />
              <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>Message sent!</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                I&apos;ll get back to you at <strong>{form.email}</strong> shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
