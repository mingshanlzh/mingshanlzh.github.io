"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Download, Plus, Edit2, Trash2, X, Check, Star, RefreshCw } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";
import type { Publication } from "@/app/lib/supabase";

const SCHOLAR_USER = "TeSuUycAAAAJ";

type SyncPub = {
  key: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
};

function normaliseTitle(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchScholarPubs(): Promise<SyncPub[]> {
  const scholarUrl = `https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en&sortby=pubdate&pagesize=100`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(scholarUrl)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("Proxy error");
  const json = await res.json() as { contents: string };
  const html = json.contents;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rows = doc.querySelectorAll(".gsc_a_tr");
  const results: SyncPub[] = [];
  rows.forEach((row) => {
    const titleEl = row.querySelector(".gsc_a_at");
    if (!titleEl) return;
    const title = titleEl.textContent?.trim() ?? "";
    const href = titleEl.getAttribute("href") ?? "";
    const url = href ? `https://scholar.google.com${href}` : "";
    const grays = row.querySelectorAll(".gs_gray");
    const authors = grays[0]?.textContent?.trim() ?? "";
    const venue = grays[1]?.textContent?.trim() ?? "";
    const journal = venue.split(",")[0].trim();
    const yearText = row.querySelector(".gsc_a_h")?.textContent?.trim() ?? "";
    const year = parseInt(yearText) || new Date().getFullYear();
    results.push({ key: normaliseTitle(title), title, authors, journal, year, url });
  });
  return results;
}

const EMPTY_FORM: Omit<Publication, "id" | "sort_order"> = {
  title: "", authors: "", journal: "", year: new Date().getFullYear(),
  volume: "", pages: "", doi: "", url: "", pdf: "",
  tags: [], featured: false, pub_type: "journal", status: "published",
  highlight_text: "", highlight_labels: [], highlight_pdf: "",
};

function groupByYear(pubs: Publication[]) {
  const map: Record<number, Publication[]> = {};
  for (const p of pubs) {
    const y = p.year ?? 0;
    if (!map[y]) map[y] = [];
    map[y].push(p);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

function PubForm({
  form, setForm, editId, saving, tagInput, setTagInput,
  onSubmit, onCancel,
}: {
  form: Omit<Publication, "id" | "sort_order">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Publication, "id" | "sort_order">>>;
  editId: string | null;
  saving: boolean;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const [hlLabelInput, setHlLabelInput] = useState("");

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function addHlLabel() {
    const t = hlLabelInput.trim();
    if (t && !(form.highlight_labels ?? []).includes(t)) {
      setForm((f) => ({ ...f, highlight_labels: [...(f.highlight_labels ?? []), t] }));
    }
    setHlLabelInput("");
  }

  return (
    <div className="card mb-4" style={{ border: "1.5px solid var(--accent)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Publication" : "New Publication"}</h2>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={18} style={{ color: "var(--text-muted)" }} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Title *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Authors</label>
          <input value={form.authors || ""} onChange={(e) => setForm({ ...form, authors: e.target.value })}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
            placeholder="Last FM, Jiang S, et al." />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Journal</label>
            <input value={form.journal || ""} onChange={(e) => setForm({ ...form, journal: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Year *</label>
            <input required type="number" value={form.year || ""} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
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
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Type</label>
            <select value={form.pub_type} onChange={(e) => setForm({ ...form, pub_type: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
              {["journal", "conference", "book", "preprint"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
              {["published", "in_press", "preprint"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
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

        {/* Featured Research toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-body)" }}>
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <Star size={13} style={{ color: "#F6AD55" }} />
            Featured Research
          </label>
        </div>

        {/* Featured highlight fields — shown only when featured is checked */}
        {form.featured && (
          <div className="flex flex-col gap-3 p-3 rounded-lg" style={{ background: "var(--accent-bg)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Featured Research Highlights</p>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight Text</label>
              <textarea rows={3} value={form.highlight_text || ""}
                onChange={(e) => setForm({ ...form, highlight_text: e.target.value })}
                placeholder="Brief description of key findings or why this research matters…"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight Labels</label>
              <div className="flex gap-2 mb-1 flex-wrap">
                {(form.highlight_labels ?? []).map((t) => (
                  <span key={t} className="tag flex items-center gap-1" style={{ background: "#F6AD5522", color: "#92400E" }}>
                    {t}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, highlight_labels: (f.highlight_labels ?? []).filter((x) => x !== t) }))}
                      style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={hlLabelInput} onChange={(e) => setHlLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHlLabel())}
                  placeholder="e.g. DCEA, Equity, Australia — press Enter"
                  className="rounded-lg px-2 py-1 text-xs flex-1"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                <button type="button" onClick={addHlLabel} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>+</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight PDF URL</label>
              <input value={form.highlight_pdf || ""} onChange={(e) => setForm({ ...form, highlight_pdf: e.target.value })}
                placeholder="https://... (optional separate highlight PDF)"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary text-sm">
            <Check size={14} /> {saving ? "Saving…" : editId ? "Save Changes" : "Add Publication"}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-outline text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function PublicationsPage() {
  const { isAdmin } = useAdmin();
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Publication, "id" | "sort_order">>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [newPubs, setNewPubs] = useState<SyncPub[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    supabase
      .from("publications")
      .select("*")
      .order("year", { ascending: false })
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setPubs(data as Publication[]);
        setLoading(false);
      });
  }, []);

  function handleAdd() {
    setForm({ ...EMPTY_FORM, year: new Date().getFullYear() });
    setEditId(null);
    setTagInput("");
    setShowAddForm(true);
  }

  function handleEdit(pub: Publication) {
    const { id, sort_order, ...rest } = pub;
    setForm({
      ...rest,
      highlight_text: rest.highlight_text ?? "",
      highlight_labels: rest.highlight_labels ?? [],
      highlight_pdf: rest.highlight_pdf ?? "",
    });
    setEditId(id);
    setTagInput("");
    setShowAddForm(false);
  }

  async function handleSync() {
    setSyncing(true);
    setSyncError("");
    setNewPubs([]);
    try {
      const fetched = await fetchScholarPubs();
      const existing = new Set(pubs.map((p) => normaliseTitle(p.title)));
      const fresh = fetched.filter((p) => !existing.has(p.key));
      if (fresh.length === 0) {
        setSyncError("All Scholar publications are already in your list.");
      } else {
        setNewPubs(fresh);
        setSelected(new Set(fresh.map((p) => p.key)));
      }
    } catch {
      setSyncError("Could not fetch Scholar page. Try again later.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    const toImport = newPubs.filter((p) => selected.has(p.key));
    const maxOrder = pubs.reduce((m, p) => Math.max(m, p.sort_order), -1);
    const rows = toImport.map((p, i) => ({
      title: p.title,
      authors: p.authors,
      journal: p.journal,
      year: p.year,
      url: p.url,
      tags: [] as string[],
      featured: false,
      pub_type: "journal",
      status: "published",
      sort_order: maxOrder + 1 + i,
      doi: "", volume: "", pages: "", pdf: "",
      highlight_text: "", highlight_labels: [] as string[], highlight_pdf: "",
    }));
    const { data } = await supabase.from("publications").insert(rows).select();
    if (data) setPubs((p) => [...p, ...(data as Publication[])]);
    setNewPubs([]);
    setSelected(new Set());
    setImporting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this publication?")) return;
    await supabase.from("publications").delete().eq("id", id);
    setPubs((p) => p.filter((x) => x.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      const { data, error } = await supabase
        .from("publications")
        .update({ ...form })
        .eq("id", editId)
        .select()
        .single();
      if (!error && data) {
        setPubs((p) => p.map((x) => (x.id === editId ? (data as Publication) : x)));
      }
      setEditId(null);
    } else {
      const maxOrder = pubs.reduce((m, p) => Math.max(m, p.sort_order), -1);
      const { data, error } = await supabase
        .from("publications")
        .insert({ ...form, sort_order: maxOrder + 1 })
        .select()
        .single();
      if (!error && data) {
        setPubs((p) => [...p, data as Publication]);
      }
      setShowAddForm(false);
    }
    setSaving(false);
  }

  const filtered = search
    ? pubs.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.authors || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.journal || "").toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : pubs;

  const grouped = groupByYear(filtered);

  if (loading) return <div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ marginBottom: 0 }}>Publications</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={handleSync} disabled={syncing} className="btn btn-outline text-sm">
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync Scholar"}
            </button>
            <button onClick={handleAdd} className="btn btn-primary text-sm">
              <Plus size={15} /> Add Publication
            </button>
          </div>
        )}
      </div>

      {/* Scholar sync results panel */}
      {(newPubs.length > 0 || syncError) && isAdmin && (
        <div className="card mb-6" style={{ border: "1.5px solid var(--accent)", background: "var(--accent-bg)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {newPubs.length > 0 ? `${newPubs.length} new publication${newPubs.length > 1 ? "s" : ""} found on Scholar` : ""}
              {syncError && <span style={{ color: "#E53E3E" }}>{syncError}</span>}
            </p>
            <button onClick={() => { setNewPubs([]); setSyncError(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          {newPubs.length > 0 && (
            <>
              <div className="flex flex-col gap-2 mb-4" style={{ maxHeight: "320px", overflowY: "auto" }}>
                {newPubs.map((p) => (
                  <label key={p.key} className="flex items-start gap-3 cursor-pointer p-2 rounded-lg"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                    <input type="checkbox" checked={selected.has(p.key)}
                      onChange={(e) => setSelected((s) => {
                        const n = new Set(s);
                        e.target.checked ? n.add(p.key) : n.delete(p.key);
                        return n;
                      })}
                      style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug" style={{ color: "var(--text-heading)" }}>{p.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {p.authors && <>{p.authors} · </>}{p.journal && <em>{p.journal}</em>}{p.year && <> · {p.year}</>}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={handleImport} disabled={importing || selected.size === 0} className="btn btn-primary text-sm">
                  <Check size={14} /> {importing ? "Importing…" : `Import ${selected.size} selected`}
                </button>
                <button onClick={() => setSelected(new Set(newPubs.map((p) => p.key)))} className="btn btn-outline text-xs">
                  Select all
                </button>
                <button onClick={() => setSelected(new Set())} className="btn btn-outline text-xs">
                  Deselect all
                </button>
              </div>
            </>
          )}
        </div>
      )}

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

      {/* Add form — shown at top only when adding new */}
      {showAddForm && isAdmin && (
        <PubForm
          form={form}
          setForm={setForm}
          editId={null}
          saving={saving}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {grouped.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isAdmin ? "No publications yet. Click 'Add Publication' to get started." : "No publications found."}
        </p>
      )}

      {grouped.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="section-title">{year || "Year unknown"}</h2>
          <div className="flex flex-col gap-4">
            {items.map((pub) => {
              // Inline edit — render form in place of the card
              if (isAdmin && editId === pub.id) {
                return (
                  <div key={pub.id}>
                    <PubForm
                      form={form}
                      setForm={setForm}
                      editId={editId}
                      saving={saving}
                      tagInput={tagInput}
                      setTagInput={setTagInput}
                      onSubmit={handleSubmit}
                      onCancel={() => setEditId(null)}
                    />
                  </div>
                );
              }

              return (
                <div key={pub.id} className="card">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <p className="font-semibold text-sm leading-snug flex-1" style={{ color: "var(--text-heading)" }}>
                          {pub.title}
                        </p>
                        {pub.featured && (
                          <Star size={13} style={{ color: "#F6AD55", flexShrink: 0, marginTop: "2px" }} />
                        )}
                      </div>
                      {pub.authors && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{pub.authors}</p>}
                      <p className="text-xs mt-1 italic" style={{ color: "var(--accent)" }}>
                        {pub.journal}
                        {pub.volume && `, ${pub.volume}`}
                        {pub.pages && `, ${pub.pages}`}
                        {pub.year && ` · ${pub.year}`}
                      </p>
                      {pub.status !== "published" && (
                        <span className="tag text-xs mt-1" style={{ background: "#FEF3C7", color: "#92400E" }}>
                          {pub.status === "in_press" ? "In press" : "Preprint"}
                        </span>
                      )}
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
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
