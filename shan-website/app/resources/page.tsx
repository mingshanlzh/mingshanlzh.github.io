"use client";
import { useState, useEffect } from "react";
import {
  Database, Code2, BarChart3, BookOpen, FileText, Download,
  Plus, Edit2, Trash2, X, Check, EyeOff, ExternalLink
} from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";

type ResourceItem = {
  id: string;
  title: string;
  description: string;
  category: "code" | "data" | "figure" | "theory" | "other";
  url: string;
  format?: string;
  size?: string;
  license?: string;
  date?: string;
  released: boolean; // only released items are visible to visitors
};

const CATEGORIES: { key: ResourceItem["category"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "code", label: "Code" },
  { key: "data", label: "Data" },
  { key: "figure", label: "Figures" },
  { key: "theory", label: "Theory & Methods" },
  { key: "other", label: "Other" },
];

const CATEGORY_META: Record<ResourceItem["category"], { icon: typeof Code2; color: string }> = {
  code:   { icon: Code2,     color: "#5F8FA8" },
  data:   { icon: Database,  color: "#38A169" },
  figure: { icon: BarChart3, color: "#8B5CF6" },
  theory: { icon: BookOpen,  color: "#D97706" },
  other:  { icon: FileText,  color: "#64748B" },
};

const EMPTY: Omit<ResourceItem, "id"> = {
  title: "", description: "", category: "code", url: "",
  format: "", size: "", license: "", date: "", released: true,
};

export default function ResourcesPage() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<ResourceItem, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resources")
      .single()
      .then(({ data }) => {
        if (data?.value) {
          try { setItems(JSON.parse(data.value) as ResourceItem[]); } catch {}
        }
        setLoading(false);
      });
  }, []);

  async function persist(next: ResourceItem[]): Promise<boolean> {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "resources", value: JSON.stringify(next) });
    if (error) {
      alert("Save failed - the change was not stored. Please check you are logged in as admin and try again.");
      return false;
    }
    return true;
  }

  async function handleAdd() {
    if (!form.title.trim() || !form.url.trim()) { alert("Title and URL are required."); return; }
    const item: ResourceItem = { ...form, id: `res-${Date.now()}` };
    const next = [item, ...items];
    setSaving(true);
    const ok = await persist(next);
    setSaving(false);
    if (ok) { setItems(next); setAdding(false); setForm(EMPTY); }
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    if (!form.title.trim() || !form.url.trim()) { alert("Title and URL are required."); return; }
    const next = items.map((x) => (x.id === editingId ? { ...x, ...form } : x));
    setSaving(true);
    const ok = await persist(next);
    setSaving(false);
    if (ok) { setItems(next); setEditingId(null); setForm(EMPTY); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resource? Visitors will no longer be able to download it.")) return;
    const next = items.filter((x) => x.id !== id);
    setSaving(true);
    const ok = await persist(next);
    setSaving(false);
    if (ok) setItems(next);
  }

  async function toggleReleased(id: string) {
    const next = items.map((x) => (x.id === id ? { ...x, released: !x.released } : x));
    const ok = await persist(next);
    if (ok) setItems(next);
  }

  const visible = items
    .filter((x) => isAdmin || x.released)
    .filter((x) => filter === "all" || x.category === filter);

  function renderForm(title: string, onSave: () => void, onCancel: () => void) {
    return (
      <div className="card mb-4" style={{ border: "1.5px dashed var(--accent)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>{title}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. DCEA tutorial R code"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What is this resource, and how can others use it?"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Download URL *</label>
            <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://github.com/... or direct file link"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ResourceItem["category"] }))}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
              {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Format (optional)</label>
            <input value={form.format || ""} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
              placeholder="e.g. R script, CSV, PDF"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Size (optional)</label>
            <input value={form.size || ""} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              placeholder="e.g. 1.2 MB"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>License (optional)</label>
            <input value={form.license || ""} onChange={(e) => setForm((f) => ({ ...f, license: e.target.value }))}
              placeholder="e.g. CC BY 4.0, MIT"
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="released" checked={form.released}
              onChange={(e) => setForm((f) => ({ ...f, released: e.target.checked }))} />
            <label htmlFor="released" className="text-xs" style={{ color: "var(--text-body)" }}>
              Released - visible and downloadable by all visitors
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onSave} disabled={saving} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <Check size={12} /> {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-3">
        <h1 style={{ marginBottom: 0 }}>Open Knowledge</h1>
        {isAdmin && !adding && (
          <button onClick={() => { setAdding(true); setEditingId(null); setForm(EMPTY); }} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Resource
          </button>
        )}
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
        Shared code, data, figures, and methods notes from my research projects - free to download and reuse.
        Please cite the associated paper where indicated, and respect each item&apos;s license.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="tag"
            style={{
              cursor: "pointer",
              border: "1.5px solid " + (filter === key ? "var(--accent)" : "var(--border)"),
              background: filter === key ? "var(--accent)" : "transparent",
              color: filter === key ? "white" : "var(--text-muted)",
            }}>
            {label}
          </button>
        ))}
      </div>

      {isAdmin && adding && renderForm("Add resource", handleAdd, () => { setAdding(false); setForm(EMPTY); })}

      {loading && <div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>}

      {!loading && visible.length === 0 && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAdmin
              ? "No resources yet. Click 'Add Resource' to share your first item."
              : "No resources in this category yet - please check back soon."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {visible.map((item) => {
          if (isAdmin && editingId === item.id) {
            return (
              <div key={item.id}>
                {renderForm("Edit resource", handleSaveEdit, () => { setEditingId(null); setForm(EMPTY); })}
              </div>
            );
          }
          const meta = CATEGORY_META[item.category] ?? CATEGORY_META.other;
          const Icon = meta.icon;
          return (
            <div key={item.id} className="card flex gap-4 items-start" style={{ opacity: item.released ? 1 : 0.6 }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: meta.color + "1A" }}>
                <Icon size={18} style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{item.title}</p>
                  <span className="tag" style={{ background: meta.color + "1A", color: meta.color }}>
                    {CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category}
                  </span>
                  {!item.released && isAdmin && (
                    <span className="tag flex items-center gap-1" style={{ background: "#FFF8E1", color: "#D97706" }}>
                      <EyeOff size={10} /> hidden
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{item.description}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-1.5">
                  {item.format && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.format}</span>}
                  {item.size && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.size}</span>}
                  {item.license && <span className="text-xs" style={{ color: "var(--text-muted)" }}>License: {item.license}</span>}
                  {item.date && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.date}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" download
                    className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                    <Download size={12} /> Download
                  </a>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                    <ExternalLink size={12} /> View
                  </a>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => toggleReleased(item.id)}
                    className="p-1 rounded hover:opacity-70" title={item.released ? "Hide from visitors" : "Release to visitors"}
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                    <EyeOff size={14} />
                  </button>
                  <button onClick={() => { setEditingId(item.id); setAdding(false); setForm({ ...item }); }}
                    className="p-1 rounded hover:opacity-70" title="Edit"
                    style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-1 rounded hover:opacity-70" title="Delete"
                    style={{ color: "#E53E3E", background: "none", border: "none", cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
