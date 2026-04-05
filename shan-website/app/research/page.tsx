"use client";
import { Star, Download, ExternalLink, Edit2, Check, X } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import type { Publication } from "@/app/lib/supabase";

function HighlightEditor({
  pub,
  onSave,
  onCancel,
}: {
  pub: Publication;
  onSave: (fields: { highlight_text: string; highlight_labels: string[]; highlight_pdf: string }) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(pub.highlight_text ?? "");
  const [labels, setLabels] = useState<string[]>(pub.highlight_labels ?? []);
  const [pdf, setPdf] = useState(pub.highlight_pdf ?? "");
  const [labelInput, setLabelInput] = useState("");
  const [saving, setSaving] = useState(false);

  function addLabel() {
    const t = labelInput.trim();
    if (t && !labels.includes(t)) setLabels((l) => [...l, t]);
    setLabelInput("");
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ highlight_text: text, highlight_labels: labels, highlight_pdf: pdf });
    setSaving(false);
  }

  return (
    <div className="mt-4 p-3 rounded-lg flex flex-col gap-3" style={{ background: "var(--accent-bg)", border: "1.5px solid var(--accent)" }}>
      <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Edit Highlights</p>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight Text</label>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Brief description of key findings or why this research matters..."
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight Labels</label>
        <div className="flex gap-2 mb-1 flex-wrap">
          {labels.map((t) => (
            <span key={t} className="tag flex items-center gap-1" style={{ background: "#F6AD5522", color: "#92400E" }}>
              {t}
              <button type="button" onClick={() => setLabels((l) => l.filter((x) => x !== t))}
                style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={labelInput} onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLabel())}
            placeholder="Add label - press Enter"
            className="rounded-lg px-2 py-1 text-xs flex-1"
            style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          <button type="button" onClick={addLabel} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>+</button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Highlight PDF URL</label>
        <input value={pdf} onChange={(e) => setPdf(e.target.value)}
          placeholder="https://... (optional separate highlight PDF)"
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
          <Check size={12} /> {saving ? "Saving..." : "Save Highlights"}
        </button>
        <button onClick={onCancel} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

function PaperCard({
  pub,
  isAdmin,
  onUpdate,
}: {
  pub: Publication;
  isAdmin: boolean;
  onUpdate: (updated: Publication) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleSaveHighlights(fields: { highlight_text: string; highlight_labels: string[]; highlight_pdf: string }) {
    const { data, error } = await supabase
      .from("publications")
      .update(fields)
      .eq("id", pub.id)
      .select()
      .single();
    if (!error && data) {
      onUpdate(data as Publication);
    }
    setEditing(false);
  }

  const hasHighlight = pub.highlight_text || (pub.highlight_labels && pub.highlight_labels.length > 0) || pub.highlight_pdf;

  return (
    <article id={pub.id} className="card mb-6">
      <div className="mb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {pub.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          <span className="tag" style={{ background: "#F0FFF4", color: "#38A169" }}>
            <Star size={10} style={{ display: "inline", marginRight: "3px" }} />Featured
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <h2 style={{ fontSize: "1.1rem", lineHeight: 1.35, marginBottom: "0.3rem", flex: 1 }}>
            {pub.title}
          </h2>
          {isAdmin && (
            <button onClick={() => { setEditing((e) => !e); setExpanded(true); }}
              className="btn btn-outline text-xs flex-shrink-0" style={{ padding: "0.25rem 0.5rem" }}
              title="Edit highlights">
              <Edit2 size={12} />
            </button>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {pub.authors}
          {pub.journal && <> - <em>{pub.journal}</em></>}
          {pub.year && <> - {pub.year}</>}
        </p>
      </div>

      {/* Highlight content */}
      {hasHighlight && (
        <div className="mt-3">
          {/* Labels */}
          {pub.highlight_labels && pub.highlight_labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {pub.highlight_labels.map((l) => (
                <span key={l} className="tag" style={{ background: "#F6AD5522", color: "#92400E" }}>{l}</span>
              ))}
            </div>
          )}

          {/* Highlight text - expandable if long */}
          {pub.highlight_text && (
            <div>
              <p className="text-sm" style={{ color: "var(--text-body)", lineHeight: 1.75 }}>
                {expanded || pub.highlight_text.length < 300
                  ? pub.highlight_text
                  : pub.highlight_text.slice(0, 280) + "..."}
              </p>
              {pub.highlight_text.length >= 300 && (
                <button onClick={() => setExpanded((e) => !e)}
                  className="text-xs mt-1" style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Highlight PDF embed */}
          {pub.highlight_pdf && expanded && (
            <div className="mt-3 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", height: "400px" }}>
              <iframe src={pub.highlight_pdf} width="100%" height="100%" style={{ border: "none" }} title={`PDF: ${pub.title}`} />
            </div>
          )}
        </div>
      )}

      {/* Edit highlights form */}
      {isAdmin && editing && (
        <HighlightEditor pub={pub} onSave={handleSaveHighlights} onCancel={() => setEditing(false)} />
      )}

      {/* Action links */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        {(pub.pdf || pub.highlight_pdf) && (
          <a href={pub.highlight_pdf || pub.pdf || ""} target="_blank" rel="noopener noreferrer"
            className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <Download size={12} /> PDF
          </a>
        )}
        {pub.url && (
          <a href={pub.url} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <ExternalLink size={12} /> View paper
          </a>
        )}
        {pub.doi && (
          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
            <ExternalLink size={12} /> DOI
          </a>
        )}
      </div>
    </article>
  );
}

export default function ResearchPage() {
  const { isAdmin } = useAdmin();
  const [papers, setPapers] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("publications")
      .select("*")
      .eq("featured", true)
      .order("year", { ascending: false })
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setPapers(data as Publication[]);
        setLoading(false);
      });
  }, []);

  function handleUpdate(updated: Publication) {
    setPapers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "860px" }}>
        <h1 style={{ marginBottom: "2rem" }}>Featured Research</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Featured Research</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Selected papers with extended summaries. Mark a publication as Featured Research in the{" "}
        <a href="/publications" style={{ color: "var(--accent)" }}>Publications</a> page to add it here.
      </p>

      {papers.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Star size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No featured papers yet. Mark publications as Featured Research in the Publications page.
          </p>
        </div>
      ) : (
        papers.map((pub) => (
          <PaperCard key={pub.id} pub={pub} isAdmin={isAdmin} onUpdate={handleUpdate} />
        ))
      )}
    </div>
  );
}
