"use client";
import { useState } from "react";
import {
  Settings, LogIn, Eye, EyeOff, Upload, MessageSquare,
  Users, Plus, Edit2, Trash2, X, Check, UserCircle
} from "lucide-react";
import { useAdmin, GuestAccount } from "@/app/lib/AdminContext";

const PAGE_LIST = [
  { id: "publications", label: "Publications" },
  { id: "cv",           label: "CV" },
  { id: "projects",     label: "Working Projects" },
  { id: "teaching",     label: "Teaching" },
  { id: "supervision",  label: "Team" },
  { id: "talks",        label: "Talks" },
  { id: "news",         label: "News" },
  { id: "research",     label: "Featured Research" },
  { id: "media",        label: "Media" },
  { id: "awards",       label: "Awards & Grants" },
  { id: "services",     label: "Services" },
  { id: "affiliations", label: "Affiliations" },
  { id: "blog",         label: "Blog" },
  { id: "contact",      label: "Contact" },
];

const EMPTY_GUEST: Omit<GuestAccount, "id"> = {
  name: "", username: "", password: "", collaboratorLabel: "",
};

export default function AdminPage() {
  const {
    isAdmin, login, logout, pageVisibility, togglePage,
    guestAccounts, addGuestAccount, updateGuestAccount, deleteGuestAccount,
  } = useAdmin();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pages" | "guests" | "uploads" | "messages">("pages");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editGuestId, setEditGuestId] = useState<string | null>(null);
  const [guestForm, setGuestForm] = useState<Omit<GuestAccount, "id">>(EMPTY_GUEST);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(credentials.email, credentials.password);
    if (!ok) setError("Invalid credentials. Only the site owner can access this panel.");
  }

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editGuestId) {
      updateGuestAccount(editGuestId, guestForm);
    } else {
      addGuestAccount(guestForm);
    }
    setShowGuestForm(false);
    setEditGuestId(null);
    setGuestForm(EMPTY_GUEST);
  }

  function startEditGuest(acct: GuestAccount) {
    const { id, ...rest } = acct;
    setGuestForm(rest);
    setEditGuestId(id);
    setShowGuestForm(true);
  }

  function handleDeleteGuest(id: string) {
    if (confirm("Delete this guest account?")) deleteGuestAccount(id);
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <Settings size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Admin Login</h1>
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
        <button onClick={logout} className="btn btn-outline text-xs">Sign out</button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "pages",    label: "Page Visibility", icon: Eye },
          { id: "guests",   label: "Guest Accounts",  icon: Users },
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
                      border: "none", padding: "0.25rem 0.6rem",
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

      {/* ── GUEST ACCOUNTS ────────────────────────────────────────── */}
      {activeTab === "guests" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Guest Accounts</h2>
            <button onClick={() => { setGuestForm(EMPTY_GUEST); setEditGuestId(null); setShowGuestForm(true); }}
              className="btn btn-primary text-sm">
              <Plus size={14} /> Add Guest
            </button>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
     0      Create guest accounts for collaborators. Each account has a collaborator label that controls which Working Projects they can see.
          </p>

          {/* Add/edit form */}
          {showGuestForm && (
            <div className="card mb-6" style={{ border: "1.5px solid var(--accent)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ marginBottom: 0, fontSize: "0.95rem" }}>{editGuestId ? "Edit Guest Account" : "New Guest Account"}</h3>
                <button onClick={() => { setShowGuestForm(false); setEditGuestId(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={18} style={{ color: "var(--text-muted)" }} />
                </button>
              </div>
              <form onSubmit={handleGuestSubmit} className="flex flex-col gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Full Name *</label>
                    <input required value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="Dr Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Username *</label>
                    <input required value={guestForm.username} onChange={(e) => setGuestForm({ ...guestForm, username: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="jsmith" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Password *</label>
                    <input required value={guestForm.password} onChange={(e) => setGuestForm({ ...guestForm, password: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="Set a password" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                      Collaborator Label *
                      <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>(matches project labels)</span>
                    </label>
                    <input required value={guestForm.collaboratorLabel} onChange={(e) => setGuestForm({ ...guestForm, collaboratorLabel: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="e.g. HBOC-team" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="btn btn-primary text-sm">
                    <Check size={14} /> {editGuestId ? "Save Changes" : "Create Account"}
                  </button>
                  <button type="button" onClick={() => { setShowGuestForm(false); setEditGuestId(null); }} className="btn btn-outline text-sm">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {guestAccounts.length === 0 && !showGuestForm && (
            <div className="card" style={{ background: "var(--accent-bg)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No guest accounts yet. Click &quot;Add Guest&quot; to create one.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {guestAccounts.map((acct) => (
              <div key={acct.id} className="card">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full" style={{ background: "var(--accent-bg)" }}>
                    <UserCircle size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{acct.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Username: <code style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.username}</code>
                      &nbsp;· Label: <code style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.collaboratorLabel}</code>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Password: </span>
                      {showPasswords[acct.id] ? (
                        <code className="text-xs" style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.password}</code>
                      ) : (
                        <code className="text-xs" style={{ color: "var(--text-muted)" }}>••••••</code>
                      )}
                      <button onClick={() => setShowPasswords((p) => ({ ...p, [acct.id]: !p[acct.id] }))}
                        className="text-xs" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)" }}>
                        {showPasswords[acct.id] ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditGuest(acct)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDeleteGuest(acct.id)} className="btn text-xs"
                      style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UPLOADS ───────────────────────────────────────────────── */}
      {activeTab === "uploads" && (
        <div>
          <h2 className="section-title">Collaborator Uploads</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Documents submitted by guests via the Working Projects page.
          </p>
          {(() => {
            let uploads: Array<{ projectId: string; fileName: string; uploadedBy: string; uploadedAt: string }> = [];
            try { uploads = JSON.parse(localStorage.getItem("sj_guest_uploads") || "[]"); } catch {}
            return uploads.length === 0 ? (
              <div className="card" style={{ background: "var(--accent-bg)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No uploads yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {uploads.map((u, i) => (
                  <div key={i} className="card">
                    <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>{u.fileName}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      By {u.uploadedBy} · Project: {u.projectId} · {new Date(u.uploadedAt).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MESSAGES ──────────────────────────────────────────────── */}
      {activeTab === "messages" && (
        <div>
          <h2 className="section-title">Contact Form Messages</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Messages submitted via the Contact page.
          </p>
          <div className="card" style={{ background: "var(--accent-bg)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
