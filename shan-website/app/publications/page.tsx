"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Download, BookOpen, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import defaultPubs from "@/data/publications.json";

type Pub = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  tags: string[];
  featured?: boolean;
  type?: string;
  citedBy?: number;
};

const EMPTY_FORM: Omit<Pub, "id"> = {
  title: "", authors: "", journal: "", year: new Date().getFullYear(),
  volume: "", pages: "", doi: "", url: "", pdf: "",
  tags: [], featured: false, type: "journal", citedBy: 0,
};

function groupByYear(pubs: Pub[]) {
  const map: Record<number, Pub[]> = {};
  for (const p of pubs) {
    if (!map[p.year]) map[p.year] = [];
    map[p.year].push(p);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function PublicationsPage() {
  const { isAdmin } = useAdmin();
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Pub, "id">>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_publications");
      if (stored) {
        setPubs(JSON.parse(stored));
      } else {
        // Seed from publications.json on first load
        setPubs(defaultPubs as Pub[]);
      }
    } catch {
      setPubs(defaultPubs as Pub[]);
    }
  }, []);

  function savePubs(updated: Pub[]) {
    setPubs(updated);
    localStorage.setItem("sj_publications", JSON.stringify(updated));
  }

  function handleAdd() {
    setForm({ ...EMPTY_FORM, year: new Date().getFullYear() });
    setEditId(null);
    setTagInput("");
    setShowForm(true);
  }

  function handleEdit(pub: Pub) {
    const { id, ...rest } = pub;
    setForm(rest);
    setEditId(id);
    setTagInput("");
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this publication?")) savePubs(pubs.filter((p) => p.id !== id));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      savePubs(pubs.map((p) => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      const newId = `pub_${Date.now()}`;
      savePubs([...pubs, { ...form, id: newId }]);
    }
    setShowForm(false);
    setEditId(null);
  }

  const filtered = search
    ? pubs.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authors.toLowerCase().includes(search.toLowerCase()) ||
        p.journal.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : pubs;

  const grouped = groupByYear(filtered);

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ marginBottom: 0 }}>Publications</h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Publication
          </button>
        )}
      </div>

      <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
        Also see my full list on{" "}
        <a href="https://scholar.google.com/citations?user=TeSuUycAAAAJ&hl=en" target="_blank" rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}>
          Google Scholar
        </a>.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, journal, or tag…"
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
        />
      </div>

      {/* Add / Edit Form */}
      {showForm && isAdmin && (
        <div className="card mb-8" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Publication" : "New Publication"}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Authors *</label>
              <input required value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="Last FM, Jiang S, et al." />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Journal *</label>
                <input required value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Year *</label>
                <input required type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
               }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Authors *</label>
              <input required value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="Last FM, Jiang S, et al." />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Journal *</label>
                <input required value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Year *</label>
                <input required type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Volume / Pages</label>
                <div className="flex gap-2">
                  <input value={form.volume || ""} onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    placeholder="Vol" className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                  <input value={form.pages || ""} onChange={(e) => setForm({ ...form, pages: e.target.value })}
                    placeholder="Pp" className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>DOI</label>
                <input value={form.doi || ""} onChange={(e) => setForm({ ...form, doi: e.target.value })}
                  placeholder="10.xxxx/xxxxx" className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>URL</label>
                <input value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..." className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>PDF URL</label>
                <input value={form.pdf || ""} onChange={(e) => setForm({ ...form, pdf: e.target.value })}
                  placeholder="https://..." className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Tags</label>
              <div className="flex gap-2 mb-1 flex-wrap">
                {form.tags.map((t) => (
                  <span key={t} className="tag flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}
                      style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag, press Enter" className="rounded-lg px-2 py-1 text-xs flex-1"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                <button type="button" onClick={addTag} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>+</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-body)" }}>
                <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured (show on Research page)
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> {editId ? "Save Changes" : "Add Publication"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {grouped.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No publications found.</p>
      )}

      {grouped.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="section-title">{year}</h2>
          <div className="flex flex-col gap-4">
            {items.map((pub) => (
              <div key={pub.id} className="card">
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-heading)" }}>
                      {pub.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{pub.authors}</p>
                    <p className="text-xs mt-1 italic" style={{ color: "var(--accent)" }}>
                      {pub.journal}
                      {pub.volume && `, ${pub.volume}`}
                      {pub.pages && `, ${pub.pages}`}
                      {" · "}{pub.year}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pub.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap items-center">
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      <ExternalLink size={11} /> View
                    </a>
                  )}
                  {pub.pdf && (
                    <a href={pub.pdf} download
                      className="btn btn-primary text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      <Download size={11} /> PDF
                    </a>
                  )}
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      DOI
                    </a>
                  )}
                  {pub.featured && (
                    <a href={`/research#${pub.id}`}
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem", color: "var(--accent-soft)", borderColor: "var(--accent-soft)" }}>
                      ★ Research page
                    </a>
                  )}
                  {isAdmin && (
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => handleEdit(pub)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                        <Edit2 size={11} />
                      </button>
                      <button onClick={() => handleDelete(pub.id)} className="btn text-xs"
                        style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
