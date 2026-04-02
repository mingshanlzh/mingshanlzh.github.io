"use client";
import { Building2, ExternalLink, MapPin, Calendar, Plus, Trash2, X, Check } from "lucide-react";
import affiliationsData from "@/data/affiliations.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type AffItem = { id: string; role: string; institution: string; location?: string; period?: string; link: string };

const blank = (): Omit<AffItem, "id"> => ({ role: "", institution: "", location: "", period: "", link: "" });

export default function AffiliationsPage() {
  const { isAdmin } = useAdmin();
  const [main, setMain]     = useState<AffItem[]>(affiliationsData.main as AffItem[]);
  const [adjunct, setAdjunct] = useState<AffItem[]>(affiliationsData.adjunct as AffItem[]);
  const [addingTo, setAddingTo] = useState<"main" | "adjunct" | null>(null);
  const [form, setForm] = useState(blank());

  function removeItem(section: "main" | "adjunct", id: string) {
    if (section === "main") setMain(p => p.filter(x => x.id !== id));
    else setAdjunct(p => p.filter(x => x.id !== id));
  }

  function addItem() {
    const item = { ...form, id: `aff-${Date.now()}` };
    if (addingTo === "main") setMain(p => [...p, item]);
    else setAdjunct(p => [...p, item]);
    setForm(blank());
    setAddingTo(null);
  }

  function AffCard({ item, section }: { item: AffItem; section: "main" | "adjunct" }) {
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
          <button onClick={() => removeItem(section, item.id)}
            className="flex-shrink-0 p-1 rounded hover:opacity-70" title="Remove"
            style={{ color: "#E53E3E" }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    );
  }

  function AddForm({ section }: { section: "main" | "adjunct" }) {
    return (
      <div className="card mt-3" style={{ border: "1.5px dashed var(--accent)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add affiliation</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { key: "role", label: "Role / Title", placeholder: "e.g. Adjunct Fellow" },
            { key: "institution", label: "Institution", placeholder: "University / Organisation" },
            { key: "location", label: "Location (optional)", placeholder: "City, Country" },
            { key: "period", label: "Period (optional)", placeholder: "2024 – present" },
            { key: "link", label: "Website URL (optional)", placeholder: "https://..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
              <input type="text" value={(form as Record<string,string>)[key]} placeholder={placeholder}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-lg px-2 py-1.5 text-xs"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={addItem} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <Check size={12} /> Save
          </button>
          <button onClick={() => setAddingTo(null)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Affiliations</h1>

      {/* Main affiliation */}
      <section className="mb-10">
        <h2 className="section-title">Primary Affiliation</h2>
        <div className="flex flex-col gap-4">
          {main.map(item => <AffCard key={item.id} item={item} section="main" />)}
        </div>
        {isAdmin && addingTo === "main" && <AddForm section="main" />}
        {isAdmin && addingTo !== "main" && (
          <button onClick={() => { setAddingTo("main"); setForm(blank()); }}
            className="btn btn-outline text-xs mt-3">
            <Plus size={12} /> Add
          </button>
        )}
      </section>

      {/* Adjunct affiliations */}
      <section className="mb-10">
        <h2 className="section-title">Adjunct Affiliations</h2>
        <div className="flex flex-col gap-4">
          {adjunct.map(item => <AffCard key={item.id} item={item} section="adjunct" />)}
        </div>
        {isAdmin && addingTo === "adjunct" && <AddForm section="adjunct" />}
        {isAdmin && addingTo !== "adjunct" && (
          <button onClick={() => { setAddingTo("adjunct"); setForm(blank()); }}
            className="btn btn-outline text-xs mt-3">
            <Plus size={12} /> Add
          </button>
        )}
      </section>
    </div>
  );
}
