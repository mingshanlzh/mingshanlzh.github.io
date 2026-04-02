"use client";
import { useState } from "react";
import {
  Settings, LogIn, BookOpen, Mic2, Trophy, Newspaper,
  MessageSquare, Eye, EyeOff, Upload, CheckCircle2, Tv2
} from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";

const NEWS_TYPES = [
  { value: "publication", label: "Publication",       icon: BookOpen,  color: "#5F8FA8" },
  { value: "talk",        label: "Talk / Presentation", icon: Mic2,    color: "#A8C8C0" },
  { value: "award",       label: "Award / Grant",     icon: Trophy,    color: "#F6AD55" },
  { value: "media",       label: "Media / Interview", icon: Tv2,       color: "#FC8181" },
  { value: "blog",        label: "Blog Post",         icon: Newspaper, color: "#68D391" },
];

const PAGE_LIST = [
  { id: "publications", label: "Publications" },
  { id: "cv",           label: "CV" },
  { id: "projects",     label: "Working Projects" },
  { id: "teaching",     label: "Teaching" },
  { id: "supervision",  label: "Supervision" },
  { id: "talks",        label: "Talks & Presentations" },
  { id: "news",         label: "News & Updates" },
  { id: "research",     label: "Selected Research" },
  { id: "media",        label: "Media" },
  { id: "awards",       label: "Awards & Grants" },
  { id: "services",     label: "Services" },
  { id: "affiliations", label: "Affiliations" },
  { id: "blog",         label: "Blog" },
];

export default function AdminPage() {
  const { isAdmin, login, logout, pageVisibility, togglePage } = useAdmin();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"news" | "pages" | "uploads" | "messages">("news");
  const [newsForm, setNewsForm] = useState({
    type: "publication", title: "", date: "", summary: "", link: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(credentials.email, credentials.password);
    if (!ok) setError("Invalid credentials. Only the site owner can access this panel.");
  }

  function handleNewsSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to Supabase, auto-routes to relevant page
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <Settings size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Admin Panel</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Site owner access only</p>
          </div>
        </div>
        <div className="card">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Email</label>
              <input type="email" required value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="shan.jiang@mq.edu.au"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Password</label>
              <input type="password" required value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs" style={{ color: "#E53E3E" }}>{error}</p>}
            <button type="submit" className="btn btn-primary">
              <LogIn size={15} /> Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Admin Panel</h1>
          <p style={{ color: "var(--text-muted)" }}>Centralised site management for Shan Jiang</p>
        </div>
        <button onClick={logout} className="btn btn-outline text-xs">
          Sign out
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "news",     label: "News Hub",        icon: Newspaper },
          { id: "pages",    label: "Page Visibility", icon: Eye },
          { id: "uploads",  label: "Uploads",         icon: Upload },
          { id: "messages", label: "Messages",        icon: MessageSquare },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
            className="btn text-xs"
            style={{
              background: activeTab === id ? "var(--accent)" : "transparent",
              color:      activeTab === id ? "white" : "var(--text-muted)",
              border: `1.5px solid ${activeTab === id ? "var(--accent)" : "var(--border)"}`,
            }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── NEWS HUB ───────────────────────────────────────────────── */}
      {activeTab === "news" && (
        <div>
          <h2 className="section-title">Add News Item</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Enter a new item here and it will automatically appear on the News page and be routed to the relevant section.
          </p>
          {submitted && (
            <div className="card mb-4 flex gap-3 items-center" style={{ background: "#F0FFF4", border: "1px solid #68D391" }}>
              <CheckCircle2 size={18} style={{ color: "#38A169" }} />
              <p className="text-sm" style={{ color: "#276749" }}>
                Item added! It will appear on the News page and the relevant section immediately.
              </p>
            </div>
          )}
          <div className="card">
            <form onSubmit={handleNewsSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-heading)" }}>Type *</label>
                <div className="flex flex-wrap gap-2">
                  {NEWS_TYPES.map((nt) => {
                    const Icon = nt.icon;
                    return (
                      <button key={nt.value} type="button"
                        onClick={() => setNewsForm({ ...newsForm, type: nt.value })}
                        className="btn text-xs"
                        style={{
                          background: newsForm.type === nt.value ? nt.color + "22" : "transparent",
                          color:      newsForm.type === nt.value ? nt.color : "var(--text-muted)",
                          border: `1.5px solid ${newsForm.type === nt.value ? nt.color : "var(--border)"}`,
                        }}>
                        <Icon size={12} /> {nt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Title *</label>
                <input required type="text" value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="e.g. New paper accepted in Health Economics"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Date *</label>
                  <input required type="date" value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Link (optional)</label>
                  <input type="url" value={newsForm.link}
                    onChange={(e) => setNewsForm({ ...newsForm, link: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Summary</label>
                <textarea rows={3} value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }}
                  placeholder="One or two sentences summarising the item."
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={15} /> Add Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PAGE VISIBILITY ───────────────────────────────────────── */}
      {activeTab === "pages" && (
        <div>
          <h2 className="section-title">Page Visibility</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Toggle pages on/off. Hidden pages are removed from the sidebar navigation. Changes persist across browser sessions.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PAGE_LIST.map((page) => {
              const visible = pageVisibility[page.id] !== false;
              return (
                <div key={page.id} className="card flex items-center justify-between gap-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>{page.label}</span>
                  <button onClick={() => togglePage(page.id)}
                    className="flex items-center gap-2 text-xs btn"
                    style={{
                      background: visible ? "#F0FFF4" : "#FFF5F5",
                      color:      visible ? "#38A169" : "#E53E3E",
                      border: "none",
                      padding: "0.25rem 0.6rem",
                    }}>
                    {visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    {visible ? "Visible" : "Hidden"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── UPLOADS ───────────────────────────────────────────────── */}
      {activeTab === "uploads" && (
        <div>
          <h2 className="section-title">Collaborator Uploads</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Documents uploaded by project collaborators appear here. In production, files are stored in Supabase Storage.
          </p>
          <div className="card" style={{ background: "var(--accent-bg)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No uploads yet. Collaborators upload documents via the Working Projects page after signing in.
            </p>
          </div>
        </div>
      )}

      {/* ── MESSAGES ──────────────────────────────────────────────── */}
      {activeTab === "messages" && (
        <div>
          <h2 className="section-title">Contact Form Messages</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Messages submitted via the Contact page. In production, messages are stored in Supabase.
          </p>
          <div className="card" style={{ background: "var(--accent-bg)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet.</p>
          </div>
          <div className="card mt-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              <strong>CV download requests</strong> also appear here once a visitor submits the CV access form.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
