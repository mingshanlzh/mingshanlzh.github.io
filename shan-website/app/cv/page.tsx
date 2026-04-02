"use client";
import { useState } from "react";
import { Download, Lock, Mail, CheckCircle2 } from "lucide-react";

export default function CVPage() {
  const [step, setStep] = useState<"idle" | "form" | "submitted">("idle");
  const [form, setForm] = useState({ name: "", email: "", affiliation: "", reason: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this POSTs to a Supabase function or Formspree
    setStep("submitted");
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Curriculum Vitae</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Download my full academic CV. Access requires a brief request — approved requests receive a direct download link by email.
      </p>

      {step === "idle" && (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ background: "var(--accent-bg)" }}>
              <Lock size={28} style={{ color: "var(--accent)" }} />
            </div>
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>CV Download</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            To maintain quality connections, CV downloads require a short request. I review requests
            promptly and send a download link by email, usually within 24 hours.
          </p>
          <button onClick={() => setStep("form")} className="btn btn-primary">
            <Download size={16} /> Request CV Access
          </button>
        </div>
      )}

      {step === "form" && (
        <div className="card">
          <h2 className="mb-4">Request CV Access</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Your Name *
              </label>
              <input required type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="Dr Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Email Address *
              </label>
              <input required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="jane@university.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Institution / Organisation *
              </label>
              <input required type="text" value={form.affiliation}
                onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="University of X"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Reason for Request
              </label>
              <textarea rows={3} value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }}
                placeholder="e.g. Considering for a collaborative grant application"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-primary">
                <Mail size={15} /> Submit Request
              </button>
              <button type="button" onClick={() => setStep("idle")} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {step === "submitted" && (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ background: "#E6F9EF" }}>
              <CheckCircle2 size={28} style={{ color: "#38A169" }} />
            </div>
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>Request Received</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Thank you — I will review your request and send a download link to{" "}
            <strong>{form.email}</strong> shortly (usually within 24 hours).
          </p>
        </div>
      )}

      {/* Preview section */}
      <div className="mt-8">
        <h2 className="section-title">CV Highlights</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Education", value: "PhD (in progress) — Macquarie University; BSc & MSc — [Previous institutions]" },
            { label: "Research Focus", value: "DCEA · Health equity · Advanced economic modelling · Global health" },
            { label: "Professional Roles", value: "AHES Health Equity SIG Convenor · ISPOR SIG Secretary" },
            { label: "Selected Journals", value: "Health Economics · Value in Health · PharmacoEconomics" },
          ].map((item) => (
            <div key={item.label} className="card">
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>{item.label}</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
