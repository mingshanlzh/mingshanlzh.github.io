"use client";
import { useState, useEffect } from "react";
import { UserCircle, LogIn, LogOut, Folder, ChevronRight } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuestPage() {
  const { isGuest, guestUser, guestLogin, guestLogout, isAdmin } = useAdmin();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = guestLogin(form.username, form.password);
    if (ok) {
      router.push("/projects");
    } else {
      setError("Invalid username or password. Please contact Shan for your credentials.");
    }
  }

  function handleLogout() {
    guestLogout();
    setForm({ username: "", password: "" });
    setError("");
  }

  // Already logged in as guest
  if (isGuest && guestUser) {
    return (
      <div style={{ maxWidth: "480px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <UserCircle size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Guest Access</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Logged in as {guestUser.name}</p>
          </div>
        </div>

        <div className="card mb-4" style={{ background: "var(--accent-bg)" }}>
          <div className="flex items-center gap-3">
            <UserCircle size={18} style={{ color: "var(--accent)" }} />
            <div>
              <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>{guestUser.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Collaborator label: <code style={{ background: "var(--bg-primary)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{guestUser.collaboratorLabel}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <p className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>Quick Links</p>
          <Link href="/projects" className="card flex items-center gap-3 hover:shadow-md transition-shadow" style={{ textDecoration: "none" }}>
            <Folder size={18} style={{ color: "var(--accent)" }} />
            <span className="text-sm flex-1" style={{ color: "var(--text-body)" }}>Working Projects</span>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </Link>
        </div>

        <button onClick={handleLogout} className="btn btn-outline">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    );
  }

  // Admin already logged in
  if (isAdmin) {
    return (
      <div style={{ maxWidth: "420px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <UserCircle size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Guest Login</h1>
          </div>
        </div>
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            You are already signed in as admin. Guest login is not needed.
          </p>
          <Link href="/projects" className="btn btn-primary mt-3 inline-flex text-sm">
            <Folder size={14} /> Go to Working Projects
          </Link>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div style={{ maxWidth: "420px" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
          <UserCircle size={22} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 style={{ marginBottom: 0 }}>Guest Login</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Collaborator access</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Username</label>
            <input type="text" required value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
              placeholder="Your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>Password</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
              placeholder="••••••••"
            />
      2   </div>
          {error && <p className="text-xs" style={{ color: "#E53E3E" }}>{error}</p>}
          <button type="submit" className="btn btn-primary">
            <LogIn size={15} /> Sign In
          </button>
        </form>
        <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
          Access is by invitation only.{" "}
          <Link href="/contact" style={{ color: "var(--accent)" }}>Contact Shan</Link> to request credentials.
        </p>
      </div>
    </div>
  );
}
