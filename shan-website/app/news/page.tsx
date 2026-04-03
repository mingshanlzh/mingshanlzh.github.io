"use client";
import { BookOpen, Mic2, Trophy, Newspaper, ArrowRight, Plus, Trash2, Check, X } from "lucide-react";
import newsData from "@/data/news.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type NewsItem = { id: string; type: string; title: string; summary: string; date: string; link: string };

const typeIcon: Record<string, React.ElementType> = {
  publication: BookOpen, talk: Mic2, award: Trophy, blog: Newspaper,
};
const typeColor: Record<string, string> = {
  publication: "#5F8FA8", talk: "#A8C8C0", award: "#F6AD55",
  grant: "#68D391", blog: "#B794F4", other: "#718096",
};

const NEWS_TYPES = ["publication", "talk", "award", "grant", "blog", "other"];

const blankItem = (): Omit<NewsItem, "id"> => ({
  type: "publication", title: "", summary: "", date: "", link: "",
});

export default function NewsPage() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<NewsItem[]>(newsData as NewsItem[]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blankItem());

  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>News</h1>

      {sorted.length === 0 && !isAdmin ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Newspaper size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No news items yet. Sign in as admin to add updates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((item) => {
            const Icon = typeIcon[item.type] ?? ArrowRight;
            const colour = typeColor[item.type] ?? "#718096";
            return (
              <div key={item.id} className="card flex gap-4 items-start">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ background: colour + "20" }}>
                  <Icon size={16} style={{ color: colour }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="tag" style={{ background: colour + "20", color: colour }}>{item.type}</span>
                    {item.date && (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.date}</span>
                    )}
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{item.title}</p>
                  {item.summary && (
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{item.summary}</p>
                  )}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: "var(--accent)" }}>
                      Read more <ArrowRight size={11} />
                    </a>
                  )}
                </div>
                {isAdmin && (
                  <button onClick={() => setItems(p => p.filter(x => x.id !== item.id))}
                    className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
                    style={{ color: "#E53E3E" }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin: inline add form */}
      {isAdmin && adding && (
        <div className="card mt-6" style={{ border: "1.5px dashed var(--accent)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add news item</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {NEWS_TYPES.map(t => (
              <button key={t} type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className="btn text-xs"
                style={{
                  background: form.type === t ? (typeColor[t] ?? "#718096") + "22" : "transparent",
                  color: form.type === t ? (typeColor[t] ?? "#718096") : "var(--text-muted)",
                  border: `1.5px solid ${form.type === t ? (typeColor[t] ?? "#718096") : "var(--border)"}`,
                }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "title", label: "Title *",         placeholder: "e.g. New paper accepted in Health Economics" },
              { key: "date",  label: "Date *",          placeholder: "2025-06-01" },
              { key: "link",  label: "Link (opt.)",     placeholder: "https://..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                <input type="text" value={(form as Record<string, string>)[key]} placeholder={placeholder}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-lg px-2 py-1.5 text-xs"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Summary</label>
            <textarea rows={2} value={form.summary} placeholder="One or two sentences…"
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => {
              if (!form.title) return;
              setItems(p => [...p, { ...form, id: `news-${Date.now()}` }]);
              setForm(blankItem()); setAdding(false);
            }} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
              <Check size={12} /> Save
            </button>
            <button onClick={() => setAdding(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {isAdmin && !adding && (
        <button onClick={() => { setAdding(true); setForm(blankItem()); }}
          className="btn btn-outline text-xs mt-6">
          <Plus size={12} /> Add news item
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
