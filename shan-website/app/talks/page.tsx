"use client";
import { useState, useEffect } from "react";
import { Mic2, Video, Download, ExternalLink, MapPin, Calendar, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";

type Talk = {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  type: "conference" | "workshop" | "invited" | "seminar";
  abstract?: string;
  slides?: string;
  video?: string;
};

const TYPE_OPTIONS = [
  { value: "conference", label: "Conference" },
  { value: "workshop",   label: "Workshop / Short Course" },
  { value: "invited",    label: "Invited Talk" },
  { value: "seminar",    label: "Seminar" },
];

const EMPTY_FORM: Omit<Talk, "id"> = {
  title: "", event: "", location: "", date: "",
  type: "conference", abstract: "", slides: "", video: "",
};

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
}

function groupByYear(arr: Talk[]) {
  const map: Record<number, Talk[]> = {};
  for (const t of arr) {
    const yr = new Date(t.date).getFullYear();
    if (!map[yr]) map[yr] = [];
    map[yr].push(t);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function TalksPage() {
  const { isAdmin } = useAdmin();
  const [talks, setTalks] = useState<Talk[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Talk, "id">>(EMPTY_FORM);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_talks");
      if (stored) setTalks(JSON.parse(stored));
    } catch {}
  }, []);

  function save(updated: Talk[]) {
    setTalks(updated);
    localStorage.setItem("sj_talks", JSON.stringify(updated));
  }

  function handleAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  }

  function handleEdit(talk: Talk) {
    const { id, ...rest } = talk;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this talk?")) save(talks.filter((t) => t.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      save(talks.map((t) => (t.id === editId ? { ...form, id: editId } : t)));
    } else {
      save([...talks, { ...form, id: `talk_${Date.now()}` }]);
    }
    setShowForm(false);
    setEditId(null);
  }

  const grouped = groupByYear([...talks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

  return (
    <div style={{ maxWidth: "820px" }}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ marginBottom: 0 }}>Talks</h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Talk
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && isAdmin && (
        <div className="card mb-8" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Talk" : "New Talk"}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="Talk title" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Event / Conference *</label>
                <input required value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="iHEA World Congress 2024" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Location *</label>
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="Sydney, Australia" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Date *</label>
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Talk["type"] })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Abstract (optional)</label>
              <textarea rows={2} value={form.abstract || ""} onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Slides URL (optional)</label>
                <input value={form.slides || ""} onChange={(e) => setForm({ ...form, slides: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Video URL (optional)</label>
                <input value={form.video || ""} onChange={(e) => setForm({ ...form, video: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> {editId ? "Save Changes" : "Add Talk"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {talks.length === 0 && !showForm && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No talks yet.{isAdmin ? " Click 'Add Talk' to add your first entry." : ""}
          </p>
        </div>
      )}

      {grouped.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="section-title">{year}</h2>
          <div className="flex flex-col gap-4">
            {items.map((talk) => (
              <div key={talk.id} className="card">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Mic2 size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-heading)" }}>
                      {talk.title}
                    </p>
                    <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>
                      {talk.event}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <MapPin size={11} /> {talk.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Calendar size={11} /> {formatDate(talk.date)}
                      </span>
                      <span className="tag">{TYPE_OPTIONS.find((o) => o.value === talk.type)?.label ?? talk.type}</span>
                    </div>
                    {talk.abstract && (
                      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{talk.abstract}</p>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap items-center">
                      {talk.slides && (
                        <a href={talk.slides} download className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                          <Download size={11} /> Slides
                        </a>
                      )}
                      {talk.video && (
                        <a href={talk.video} target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                          <Video size={11} /> Video
                        </a>
                      )}
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(talk)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem", marginLeft: "auto" }}>
                            <Edit2 size={11} /> Edit
                          </button>
                          <button onClick={() => handleDelete(talk.id)} className="btn text-xs" style={{ padding: "0.25rem 0.6rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                            <Trash2 size={11} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
