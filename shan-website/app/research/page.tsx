"use client";
import { Star, Download, ExternalLink, Code, Plus, Trash2, Check, X } from "lucide-react";
import featuredData from "@/data/featured-research.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type FeaturedPaper = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  keyFindings: string[];
  tags: string[];
  doi: string;
  pdf: string;
  code: string;
};

const blankPaper = (): Omit<FeaturedPaper, "id"> => ({
  title: "", authors: "", journal: "", year: new Date().getFullYear(),
  abstract: "", keyFindings: [], tags: [], doi: "", pdf: "", code: "",
});

function PaperCard({ paper, onDelete, isAdmin }: { paper: FeaturedPaper; onDelete: () => void; isAdmin: boolean }) {
  return (
    <article className="card mb-8">
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {paper.tags.map(t => <span key={t} className="tag">{t}</span>)}
          <span className="tag" style={{ background: "#F0FFF4", color: "#38A169" }}>★ Featured</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h2 style={{ fontSize: "1.15rem", lineHeight: 1.35, marginBottom: "0.3rem", flex: 1 }}>
            {paper.title}
          </h2>
          {isAdmin && (
            <button onClick={onDelete} className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
              style={{ color: "#E53E3E" }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {paper.authors} · <em>{paper.journal}</em> · {paper.year}
        </p>
      </div>

      {paper.abstract && (
        <p className="text-sm mb-5" style={{ color: "var(--text-body)", lineHeight: 1.75 }}>
          {paper.abstract}
        </p>
      )}

      {paper.keyFindings.length > 0 && (
        <div className="mb-5">
          <h3 className="font-semibold mb-3" style={{ fontSize: "0.9rem", color: "var(--text-heading)" }}>
            Key Findings
          </h3>
          <ul className="flex flex-col gap-2">
            {paper.keyFindings.map((f, i) => (
              <li key={i} className="flex gap-3 items-start text-sm" style={{ color: "var(--text-body)" }}>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: "var(--accent)", color: "white" }}>
                  {i + 1}
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        {paper.pdf && (
          <a href={paper.pdf} download className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <Download size={12} /> PDF
          </a>
        )}
        {paper.doi && (
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <ExternalLink size={12} /> DOI
          </a>
        )}
        {paper.code && (
          <a href={paper.code} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <Code size={12} /> Code
          </a>
        )}
      </div>
    </article>
  );
}

export default function ResearchPage() {
  const { isAdmin } = useAdmin();
  const [papers, setPapers] = useState<FeaturedPaper[]>(featuredData as FeaturedPaper[]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blankPaper());
  const [keyFindingsText, setKeyFindingsText] = useState("");
  const [tagsText, setTagsText] = useState("");

  function handleSave() {
    if (!form.title) return;
    const newPaper: FeaturedPaper = {
      ...form,
      id: `research-${Date.now()}`,
      keyFindings: keyFindingsText.split("\n").map(s => s.trim()).filter(Boolean),
      tags: tagsText.split(",").map(s => s.trim()).filter(Boolean),
    };
    setPapers(p => [...p, newPaper]);
    setForm(blankPaper());
    setKeyFindingsText("");
    setTagsText("");
    setAdding(false);
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Featured Research</h1>

      {papers.length === 0 && !isAdmin ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Star size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Featured papers will appear here. Sign in as admin to add them.
          </p>
        </div>
      ) : (
        papers.map(paper => (
          <PaperCard key={paper.id} paper={paper}
            onDelete={() => setPapers(p => p.filter(x => x.id !== paper.id))}
            isAdmin={isAdmin} />
        ))
      )}

      {/* Admin: inline add form */}
      {isAdmin && adding && (
        <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add featured paper</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "title",   label: "Title *",         placeholder: "Full paper title" },
              { key: "authors", label: "Authors",         placeholder: "Shan Jiang, Co-author…" },
              { key: "journal", label: "Journal",         placeholder: "Health Economics" },
              { key: "year",    label: "Year",            placeholder: "2024" },
              { key: "doi",     label: "DOI (opt.)",      placeholder: "10.1002/hec.xxxx" },
              { key: "pdf",     label: "PDF link (opt.)", placeholder: "https://..." },
              { key: "code",    label: "Code link (opt.)", placeholder: "https://github.com/..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                <input type="text" value={String((form as unknown as Record<string, string | number>)[key])} placeholder={placeholder}
                  onChange={e => setForm(f => ({ ...f, [key]: key === "year" ? Number(e.target.value) : e.target.value }))}
                  className="w-full rounded-lg px-2 py-1.5 text-xs"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Tags (comma-separated)</label>
            <input type="text" value={tagsText} placeholder="DCEA, equity, methods, R"
              onChange={e => setTagsText(e.target.value)}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Abstract</label>
            <textarea rows={3} value={form.abstract} placeholder="Paper abstract…"
              onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>
              Key Findings (one per line)
            </label>
            <textarea rows={4} value={keyFindingsText} placeholder={"Finding 1\nFinding 2\nFinding 3"}
              onChange={e => setKeyFindingsText(e.target.value)}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSave} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
              <Check size={12} /> Save
            </button>
            <button onClick={() => setAdding(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {isAdmin && !adding && (
        <button onClick={() => { setAdding(true); setForm(blankPaper()); setKeyFindingsText(""); setTagsText(""); }}
          className="btn btn-outline text-xs mt-4">
          <Plus size={12} /> Add featured paper
        </button>
      )}

      {isAdmin && (
        <div className="card mt-6" style={{ background: "var(--accent-bg)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <strong>Admin mode:</strong> Changes are live in this session. To make them permanent, tell Claude what you added and run <code>git push</code>.
          </p>
        </div>
      )}
    </div>
  );
}
