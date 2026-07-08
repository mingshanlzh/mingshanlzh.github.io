"use client";
import { Building2, ExternalLink, MapPin, Calendar, Plus, Trash2, X, Check, Edit2 } from "lucide-react";
import affiliationsData from "@/data/affiliations.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

type AffItem = { id: string; role: string; institution: string; location?: string; period?: string; link: string };
type AffData = { main: AffItem[]; adjunct: AffItem[] };

const blank = (): Omit<AffItem, "id"> => ({ role: "", institution: "", location: "", period: "", link: "" });

const FIELDS: { key: keyof Omit<AffItem, "id">; label: string; placeholder: string }[] = [
  { key: "role", label: "Role / Title", placeholder: "e.g. Adjunct Fellow" },
  { key: "institution", label: "Institution", placeholder: "University / Organisation" },
  { key: "location", label: "Location (optional)", placeholder: "City, Country" },
  { key: "period", label: "Period (optional)", placeholder: "2024 - present" },
  { key: "link", label: "Website URL (optional)", placeholder: "https://..." },
];

export default function AffiliationsPage() {
  const { isAdmin } = useAdmin();
  const [main, setMain] = useState<AffItem[]>(affiliationsData.main as AffItem[]);
  const [adjunct, setAdjunct] = useState<AffItem[]>(affiliationsData.adjunct as AffItem[]);
  const [addingTo, setAddingTo] = useState<"main" | "adjunct" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blank());
  const [saving, setSaving] = useState(false);

  // Load persisted affiliations from Supabase (falls back to bundled JSON)
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "affiliations")
      .single()
      .then(({ data }) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value) as AffData;
            if (parsed.main) setMain(parsed.main);
            if (parsed.adjunct) setAdjunct(parsed.adjunct);
          } catch {}
        }
      });
  }, []);

  // Persist both lists to Supabase. Returns true on success.
  async function persist(nextMain: AffItem[], nextAdjunct: AffItem[]): Promise<boolean> {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "affiliations", value: JSON.stringify({ main: nextMain, adjunct: nextAdjunct }) });
    if (error) {
      alert("Save failed - the change was not stored. Please check you are logged in as admin and try again.");
      return false;
    }
    return true;
  }

  async function removeItem(section: "main" | "adjunct", id: string) {
    if (!confirm("Are you sure you want to delete this affiliation?")) return;
    const nextMain = section === "main" ? main.filter((x) => x.id !== id) : main;
    const nextAdjunct = section === "adjunct" ? adjunct.filter((x) => x.id !== id) : adjunct;
    setSaving(true);
    const ok = await persist(nextMain, nextAdjunct);
    setSaving(false);
    if (ok) { setMain(nextMain); setAdjunct(nextAdjunct); }
  }

  async function addItem() {
    if (!form.role.trim() || !form.institution.trim()) {
      alert("Role and institution are required.");
      return;
    }
    const item = { ...form, id: `aff-${Date.now()}` };
    const nextMain = addingTo === "main" ? [...main, item] : main;
    const nextAdjunct = addingTo === "adjunct" ? [...adjunct, item] : adjunct;
    setSaving(true);
    const ok = await persist(nextMain, nextAdjunct);
    setSaving(false);
    if (ok) {
      setMain(nextMain); setAdjunct(nextAdjunct);
      setForm(blank());
      setAddingTo(null);
    }
  }

  function startEdit(item: AffItem) {
    setEditingId(item.id);
    setAddingTo(null);
    setForm({ role: item.role, institution: item.institution, location: item.location || "", period: item.period || "", link: item.link || "" });
  }

  async function saveEdit(section: "main" | "adjunct") {
    if (!editingId) return;
    if (!form.role.trim() || !form.institution.trim()) {
      alert("Role and institution are required.");
      return;
    }
    const apply = (list: AffItem[]) => list.map((x) => (x.id === editingId ? { ...x, ...form } : x));
    const nextMain = section === "main" ? apply(main) : main;
    const nextAdjunct = section === "adjunct" ? apply(adjunct) : adjunct;
    setSaving(true);
    const ok = await persist(nextMain, nextAdjunct);
    setSaving(false);
    if (ok) {
      setMain(nextMain); setAdjunct(nextAdjunct);
      setEditingId(null);
      setForm(blank());
    }
  }

  function renderAffForm(title: string, onSave: () => void, onCancel: () => void) {
    return (
      <div className="card mt-3" style={{ border: "1.5px dashed var(--accent)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>{title}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
              <input type="text" value={form[key]} placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-lg px-2 py-1.5 text-xs"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
          ))}
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

  function renderAffCard(item: AffItem, section: "main" | "adjunct") {
    if (isAdmin && editingId === item.id) {
      return renderAffForm("Edit affiliation", () => saveEdit(section), () => { setEditingId(null); setForm(blank()); });
    }
    return (
      <div className="card flex gap-4 items-start">
        <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
          <Building2 size={18} style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{item.role}</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-body)" }}>{item.institution}</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {item.location && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <MapPin size={11} /> {item.location}
              </span>
            )}
            {item.period && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <Calendar size={11} /> {item.period}
              </span>
            )}
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}>
              <ExternalLink size={11} /> Website
            </a>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => startEdit(item)}
              className="p-1 rounded hover:opacity-70" title="Edit" aria-label="Edit affiliation"
              style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
              <Edit2 size={14} />
            </button>
            <button onClick={() => removeItem(section, item.id)}
              className="p-1 rounded hover:opacity-70" title="Delete" aria-label="Delete affiliation"
              style={{ color: "#E53E3E", background: "none", border: "none", cursor: "pointer" }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderSection(id: "main" | "adjunct", title: string, items: AffItem[]) {
    return (
      <section className="mb-10">
        <h2 className="section-title">{title}</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => <div key={item.id}>{renderAffCard(item, id)}</div>)}
        </div>
        {isAdmin && addingTo === id && renderAffForm("Add affiliation", addItem, () => { setAddingTo(null); setForm(blank()); })}
        {isAdmin && addingTo !== id && (
          <button onClick={() => { setAddingTo(id); setEditingId(null); setForm(blank()); }}
            className="btn btn-outline text-xs mt-3">
            <Plus size={12} /> Add
          </button>
        )}
      </section>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Affiliations</h1>
      {renderSection("main", "Primary Affiliation", main)}
      {renderSection("adjunct", "Adjunct Affiliations", adjunct)}
    </div>
  );
}
