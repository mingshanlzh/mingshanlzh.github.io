"use client";
import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { useAdmin } from "@/app/lib/AdminContext";

export default function ContactPage() {
  const { guestUser } = useAdmin();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name:           form.name,
        email:          form.email,
        subject:        form.subject || null,
        message:        form.message,
        guest_username: guestUser?.username ?? null,
      });

    setSubmitting(false);
    if (dbError) {
      setError("Failed to send message. Please try again or email directly.");
    } else {
      setSent(true);
    }
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Contact</h1>

      {!sent ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { id: "name",    label: "Name",    type: "text",  placeholder: "Your name" },
            { id: "email",   label: "Email",   type: "email", placeholder: "you@example.com" },
            { id: "subject", label: "Subject", type: "text",  placeholder: "Collaboration / Media / Other" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                {label}{id !== "subject" && <span style={{ color: "#E53E3E" }}> *</span>}
              </label>
              <input required={id !== "subject"} type={type} placeholder={placeholder}
                value={(form as Record<string, string>)[id]}
                onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
              Message <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <textarea required rows={5} placeholder="Your message…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }}
            />
          </div>
          {error && <p className="text-xs" style={{ color: "#E53E3E" }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Mail size={15} /> {submitting ? "Sending…" : "Send Message"}
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
  );
}
