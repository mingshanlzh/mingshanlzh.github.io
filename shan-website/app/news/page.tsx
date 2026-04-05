"use client";
import { BookOpen, Mic2, Trophy, Newspaper, ArrowRight, Plus, Trash2, Check, X, Edit2 } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import type { NewsItem } from "@/app/lib/supabase";

const typeIcon: Record<string, React.ElementType> = {
  publication: BookOpen, talk: Mic2, award: Trophy, blog: Newspaper,
};
const typeColor: Record<string, string> = {
  publication: "#5F8FA8", talk: "#A8C8C0", award: "#F6AD55",
  grant: "#68D391", blog: "#B794F4", other: "#718096",
};

const NEWS_TYPES = ["publication", "talk", "award", "grant", "blog", "other"];

const blankItem = (): Omit<NewsItem, "id"> => ({
  type: "publication", title: "", summary: "", item_date: "", link: "", tags: [],
});

function NewsForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<NewsItem, "id">;
  onSave: (form: Omit<NewsItem, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div className="card" style={{ border: "1.5px dashed var(--accent)" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>
        {initial.title ? "Edit news item" : "Add news item"}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {NEWS_TYPES.map((t) => (
          <button key={t} type="button"
            onClick={() => setForm((f) => ({ ...f, type: t }))}
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
          { key: "title",     label: "Title *",     placeholder: "e.g. New paper accepted in Health Economics" },
          { key: "item_date", label: "Date *",       placeholder: "2025-06-01" },
          { key: "link",      label: "Link (opt.)",  placeholder: "https://..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
            <input type="text" value={(form as Record<string, string>)[key] ?? ""} placeholder={placeholder}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Summary</label>
        <textarea rows={2} value={form.summary} placeholder="One or two sentences…"
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          className="w-full rounded-lg px-2 py-1.5 text-xs"
          style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => { if (!form.title) return; onSave(form); }}
          disabled={saving || !form.title}
          className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
          <Check size={12} /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("news_items")
      .select("*")
      .order("item_date", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as NewsItem[]);
        setLoading(false);
      });
  }, []);

  async function handleAdd(form: Omit<NewsItem, "id">) {
    setSaving(true);
    const { data, error } = await supabase
      .from("news_items")
      .insert({ ...form })
      .select()
      .single();
    if (!error && data) {
      setItems((prev) =>
        [data as NewsItem, ...prev].sort(
          (a, b) => new Date(b.item_date).getTime() - new Date(a.item_date).getTime()
        )
      );
    }
    setSaving(false);
    setAdding(false);
  }

  async function handleEdit(id: string, form: Omit<NewsItem, "id">) {
    setSaving(true);
    const { data, error } = await supabase
      .from("news_items")
      .update({ ...form })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setItems((prev) =>
        prev
          .map((x) => (x.id === id ? (data as NewsItem) : x))
          .sort((a, b) => new Date(b.item_date).getTime() - new Date(a.item_date).getTime())
      );
    }
    setSaving(false);
    setEditId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    const { error } = await supabase.from("news_items").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "820px" }}>
        <h1 style={{ marginBottom: "2rem" }}>News</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>News</h1>

      {items.length === 0 && !isAdmin && (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Newspaper size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No news items yet.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const Icon = typeIcon[item.type] ?? ArrowRight;
          const colour = typeColor[item.type] ?? "#718096";

          if (isAdmin && editId === item.id) {
            return (
              <div key={item.id}>
                <NewsForm
                  initial={{ type: item.type, title: item.title, summary: item.summary, item_date: item.item_date, link: item.link, tags: item.tags ?? [] }}
                  onSave={(form) => handleEdit(item.id, form)}
                  onCancel={() => setEditId(null)}
                  saving={saving}
                />
              </div>
            );
          }

          return (
            <div key={item.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: colour + "20" }}>
                <Icon size={16} style={{ color: colour }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="tag" style={{ background: colour + "20", color: colour }}>{item.type}</span>
                  {item.item_date && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.item_date}</span>
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
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditId(item.id); setAdding(false); }}
                    className="p-1 rounded hover:opacity-70" title="Edit"
                    style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-1 rounded hover:opacity-70" title="Delete"
                    style={{ color: "#E53E3E", background: "none", border: "none", cursor: "pointer" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin: add form */}
      {isAdmin && adding && (
        <div className="mt-6">
          <NewsForm
            initial={blankItem()}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
            saving={saving}
          />
        </div>
      )}

      {isAdmin && !adding && (
        <button onClick={() => { setAdding(true); setEditId(null); }}
          className="btn btn-outline text-xs mt-6">
          <Plus size={12} /> Add news item
        </button>
      )}
    </div>
  );
}
