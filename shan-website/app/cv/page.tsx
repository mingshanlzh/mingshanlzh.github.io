"use client";
import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, X, ExternalLink, Download, Check } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";

type CVEntry = {
  id: string;
  label: string;
  url: string;
  type: "github" | "direct";
  uploadedAt: string;
};

function toRawUrl(url: string, type: "github" | "direct"): string {
  if (type === "direct") return url;
  // Convert GitHub blob URL to raw URL
  return url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

export default function CVPage() {
  const { isAdmin } = useAdmin();
  const [entries, setEntries] = useState<CVEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<CVEntry, "id" | "uploadedAt">>({
    label: "",
    url: "",
    type: "github",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_cv_entries");
      if (stored) setEntries(JSON.parse(stored));
    } catch {}
  }, []);

  function saveEntries(updated: CVEntry[]) {
    setEntries(updated);
    localStorage.setItem("sj_cv_entries", JSON.stringify(updated));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.url) return;
    const newEntry: CVEntry = {
      ...form,
      id: `cv_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    saveEntries([...entries, newEntry]);
    setForm({ label: "", url: "", type: "github" });
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (confirm("Remove this CV entry?")) saveEntries(entries.filter((e) => e.id !== id));
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Curriculum Vitae</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            My academic CV — available to view and download below.
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-sm">
            <Plus size={15} /> Add CV
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="card mb-6" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>Add CV Link</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Label *</label>
              <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Full CV (April 2026)" className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>URL *</label>
              <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="GitHub file URL or direct PDF URL" className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CVEntry["type"] })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                <option value="github">GitHub URL (auto-converted to raw)</option>
                <option value="direct">Direct URL (use as-is)</option>
              </select>
              {form.type === "github" && form.url && (
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Raw URL: {toRawUrl(form.url, "github")}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> Add
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {entries.length === 0 && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAdmin ? 'No CV uploaded yet. Click "Add CV" to add a link.' : "CV not yet available. Please check back later."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {entries.map((entry) => {
          const rawUrl = toRawUrl(entry.url, entry.type);
          return (
            <div key={entry.id} className="card">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
                  <FileText size={22} style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{entry.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Added {new Date(entry.uploadedAt).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <a href={rawUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline text-xs" style={{ padding: "0.35rem 0.7rem" }}>
                    <ExternalLink size={13} /> View
                  </a>
                  <a href={rawUrl} download
                    className="btn btn-primary text-xs" style={{ padding: "0.35rem 0.7rem" }}>
                    <Download size={13} /> Download
                  </a>
                  {isAdmin && (
                    <button onClick={() => handleDelete(entry.id)}
                      className="btn text-xs"
                      style={{ padding: "0.35rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
