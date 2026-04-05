"use client";
import { useState, useEffect } from "react";
import {
  Settings, LogIn, Eye, EyeOff, MessageSquare,
  Users, Plus, Edit2, Trash2, X, Check, UserCircle, Mail
} from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";
import type { GuestAccount, ContactMessage } from "@/app/lib/supabase";

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
  username: "", password: "", display_name: "", collaborator_label: "", active: true,
};

export default function AdminPage() {
  const { isAdmin, login, logout, pageVisibility, togglePage } = useAdmin();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "guests" | "messages">("pages");

  // Guest accounts state
  const [guests, setGuests] = useState<GuestAccount[]>([]);
  const [guestsLoaded, setGuestsLoaded] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editGuestId, setEditGuestId] = useState<string | null>(null);
  const [guestForm, setGuestForm] = useState<Omit<GuestAccount, "id">>(EMPTY_GUEST);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [guestSaving, setGuestSaving] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  // Load guests when tab is opened
  useEffect(() => {
    if (isAdmin && activeTab === "guests" && !guestsLoaded) {
      supabase
        .from("guest_accounts")
        .select("*")
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (data) setGuests(data as GuestAccount[]);
          setGuestsLoaded(true);
        });
    }
  }, [isAdmin, activeTab, guestsLoaded]);

  // Load messages when tab is opened
  useEffect(() => {
    if (isAdmin && activeTab === "messages" && !messagesLoaded) {
      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setMessages(data as ContactMessage[]);
          setMessagesLoaded(true);
        });
    }
  }, [isAdmin, activeTab, messagesLoaded]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const ok = await login(credentials.email, credentials.password);
    setLoginLoading(false);
    if (!ok) setLoginError("Invalid credentials. Only the site owner can access this panel.");
  }

  async function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuestSaving(true);
    if (editGuestId) {
      const { data, error } = await supabase
        .from("guest_accounts")
        .update({ ...guestForm })
        .eq("id", editGuestId)
        .select()
        .single();
      if (!error && data) {
        setGuests((g) => g.map((x) => (x.id === editGuestId ? (data as GuestAccount) : x)));
      }
    } else {
      const { data, error } = await supabase
        .from("guest_accounts")
        .insert({ ...guestForm })
        .select()
        .single();
      if (!error && data) {
        setGuests((g) => [...g, data as GuestAccount]);
      }
    }
    setGuestSaving(false);
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

  async function handleDeleteGuest(id: string) {
    if (!confirm("Delete this guest account?")) return;
    await supabase.from("guest_accounts").delete().eq("id", id);
    setGuests((g) => g.filter((x) => x.id !== id));
  }

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((m) => m.filter((x) => x.id !== id));
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
                placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
              />
            </div>
            {loginError && <p className="text-xs" style={{ color: "#E53E3E" }}>{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="btn btn-primary">
              <LogIn size={15} /> {loginLoading ? "Signing inâ¦" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

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
          { id: "messages", label: messagesLoaded && unreadCount > 0 ? `Messages (${unreadCount} new)` : "Messages", icon: MessageSquare },
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

      {/* ââ PAGE VISIBILITY âââââââââââââââââââââââââââââââââââââââââ */}
      {activeTab === "pages" && (
        <div>
          <h2 className="section-title">Page Visibility</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Toggle pages on/off. Hidden pages are removed from the sidebar navigation. Changes are saved to the database immediately.
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

      {/* ââ GUEST ACCOUNTS ââââââââââââââââââââââââââââââââââââââââââ */}
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
            Create guest accounts for collaborators. Each account has a collaborator label that controls which Working Projects they can see.
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
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Display Name *</label>
                    <input required value={guestForm.display_name}
                      onChange={(e) => setGuestForm({ ...guestForm, display_name: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="Dr Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Username *</label>
                    <input required value={guestForm.username}
                      onChange={(e) => setGuestForm({ ...guestForm, username: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="jsmith" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Password *</label>
                    <input required value={guestForm.password}
                      onChange={(e) => setGuestForm({ ...guestForm, password: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="Set a password" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                      Collaborator Label *
                      <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>(matches project labels)</span>
                    </label>
                    <input required value={guestForm.collaborator_label}
                      onChange={(e) => setGuestForm({ ...guestForm, collaborator_label: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                      placeholder="e.g. HBOC-team" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-body)" }}>
                    <input type="checkbox" checked={guestForm.active}
                      onChange={(e) => setGuestForm({ ...guestForm, active: e.target.checked })} />
                    Account active
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={guestSaving} className="btn btn-primary text-sm">
                    <Check size={14} /> {guestSaving ? "Savingâ¦" : editGuestId ? "Save Changes" : "Create Account"}
                  </button>
                  <button type="button" onClick={() => { setShowGuestForm(false); setEditGuestId(null); }} className="btn btn-outline text-sm">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {!guestsLoaded && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loadingâ¦</p>
          )}

          {guestsLoaded && guests.length === 0 && !showGuestForm && (
            <div className="card" style={{ background: "var(--accent-bg)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No guest accounts yet. Click &quot;Add Guest&quot; to create one.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {guests.map((acct) => (
              <div key={acct.id} className="card">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full" style={{ background: "var(--accent-bg)" }}>
                    <UserCircle size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{acct.display_name || acct.username}</p>
                      {!acct.active && (
                        <span className="tag text-xs" style={{ background: "#FFF5F5", color: "#E53E3E" }}>inactive</span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Username: <code style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.username}</code>
                      &nbsp;Â· Label: <code style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.collaborator_label}</code>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Password: </span>
                      {showPasswords[acct.id] ? (
                        <code className="text-xs" style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{acct.password}</code>
                      ) : (
                        <code className="text-xs" style={{ color: "var(--text-muted)" }}>â¢â¢â¢â¢â¢â¢</code>
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

      {/* ââ MESSAGES ââââââââââââââââââââââââââââââââââââââââââââââââ */}
      {activeTab === "messages" && (
        <div>
          <h2 className="section-title">Contact Form Messages</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Messages submitted via the Contact page. Click a message to mark it as read.
          </p>

          {!messagesLoaded && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loadingâ¦</p>
          )}

          {messagesLoaded && messages.length === 0 && (
            <div className="card" style={{ background: "var(--accent-bg)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className="card" style={{ borderLeft: msg.read ? undefined : `3px solid var(--accent)` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={14} style={{ color: msg.read ? "var(--text-muted)" : "var(--accent)" }} />
                      <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>
                        {msg.name}
                        {msg.guest_username && (
                          <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-muted)" }}>
                            (guest: {msg.guest_username})
                          </span>
                        )}
                      </p>
                      {!msg.read && (
                        <span className="tag text-xs" style={{ background: "var(--accent)", color: "white" }}>New</span>
                      )}
                    </div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      <a href={`mailto:${msg.email}`} style={{ color: "var(--accent)" }}>{msg.email}</a>
                      {msg.subject && ` Â· Subject: ${msg.subject}`}
                      {" Â· "}{new Date(msg.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-sm mt-2" style={{ color: "var(--text-body)", whiteSpace: "pre-wrap" }}>{msg.message}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!msg.read && (
                      <button onClick={() => markRead(msg.id)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                        <Check size={11} /> Read
                      </button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} className="btn text-xs"
                      style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
