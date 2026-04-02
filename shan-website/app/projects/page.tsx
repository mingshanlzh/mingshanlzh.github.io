"use client";
import { useState } from "react";
import { Lock, LogIn, Upload, CheckCircle2, Clock, ChevronRight, X } from "lucide-react";

// Project progress milestones — equal-width timeline segments
const MILESTONES = [
  "Protocol",
  "Data",
  "Analysis",
  "Draft",
  "Co-author review",
  "Revision",
  "Submitted",
  "Accepted",
];

// Placeholder project data — in production this comes from Supabase
const ALL_PROJECTS = [
  {
    id: "proj1",
    title: "DCEA of Universal Newborn Genomic Screening in Australia",
    description: "Distributional cost-effectiveness analysis of universal genomic newborn screening, stratified by socioeconomic status and Indigenous status.",
    milestone: 4, // 0-indexed
    collaborators: ["user@collab1.edu", "user@collab2.edu"],
    lastUpdated: "2024-11-10",
    tags: ["DCEA", "genomics", "Australia"],
  },
  {
    id: "proj2",
    title: "Dynamic DCEA: Temporal Equity in Breast Cancer Screening",
    description: "A dynamic distributional CEA model tracking equity evolution over a 20-year policy horizon for population breast cancer screening.",
    milestone: 6,
    collaborators: ["user@collab1.edu"],
    lastUpdated: "2024-10-28",
    tags: ["DCEA", "breast cancer", "simulation"],
  },
];

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / (total - 1)) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {MILESTONES[current]}
        </span>
        <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex mt-1">
        {MILESTONES.map((m, i) => (
          <div key={m} className="flex-1 flex flex-col items-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: i <= current ? "var(--accent)" : "var(--border)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [uploadProject, setUploadProject] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // In production: Supabase Auth sign-in
    if (loginForm.email && loginForm.password) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Please enter your credentials.");
    }
  }

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: "420px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <Lock size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Working Projects</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sign in to view your projects</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Email
              </label>
              <input type="email" required value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="you@institution.edu"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Password
              </label>
              <input type="password" required value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
              />
            </div>
            {loginError && (
              <p className="text-xs" style={{ color: "#E53E3E" }}>{loginError}</p>
            )}
            <button type="submit" className="btn btn-primary">
              <LogIn size={15} /> Sign In
            </button>
          </form>
          <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
            Access is by invitation only. Contact Shan for credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Working Projects</h1>
          <p style={{ color: "var(--text-muted)" }}>Your active collaborations</p>
        </div>
        <button onClick={() => setLoggedIn(false)}
          className="btn btn-outline text-xs">
          Sign out
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {ALL_PROJECTS.map((proj) => (
          <div key={proj.id} id={proj.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>{proj.title}</h2>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {proj.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock size={11} className="inline mr-1" />
                  Last updated: {proj.lastUpdated}
                </p>
              </div>
            </div>

            <ProgressBar current={proj.milestone} total={MILESTONES.length} />

            {/* Milestone labels */}
            <div className="flex mt-2 gap-1">
              {MILESTONES.map((m, i) => (
                <div key={m} className="flex-1 text-center" style={{ fontSize: "0.6rem", color: i <= proj.milestone ? "var(--accent)" : "var(--text-muted)" }}>
                  {i === proj.milestone && <ChevronRight size={9} className="inline" />}
                </div>
              ))}
            </div>

            {/* Upload section */}
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              {uploadProject === proj.id ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium" style={{ color: "var(--text-heading)" }}>Upload a document</p>
                  <input type="file" accept=".pdf,.doc,.docx"
                    className="text-sm" style={{ color: "var(--text-muted)" }} />
                  <div className="flex gap-2">
                    <button className="btn btn-primary text-xs">
                      <CheckCircle2 size={13} /> Submit
                    </button>
                    <button onClick={() => setUploadProject(null)} className="btn btn-outline text-xs">
                      <X size={13} /> Cancel
                    </button>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Accepted formats: PDF, Word. Max 20 MB.
                  </p>
                </div>
              ) : (
                <button onClick={() => setUploadProject(proj.id)} className="btn btn-outline text-xs">
                  <Upload size={13} /> Upload document / feedback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
