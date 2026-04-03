"use client";
import { Youtube, Mic, Newspaper, ExternalLink, Plus, Trash2, Check, X, Play } from "lucide-react";
import mediaData from "@/data/media.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type MediaItem = {
  id: string;
  type: "youtube" | "podcast" | "press" | "other";
  title: string;
  outlet: string;
  date: string;
  link: string;
  summary: string;
};

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function MediaCard({ item, onDelete, isAdmin }: { item: MediaItem; onDelete: () => void; isAdmin: boolean }) {
  const ytThumb = item.type === "youtube" ? getYoutubeThumbnail(item.link) : null;
  const TypeIcon = item.type === "youtube" ? Youtube : item.type === "podcast" ? Mic : Newspaper;
  const iconColor = item.type === "youtube" ? "#FF0000" : item.type === "podcast" ? "#8B5CF6" : "#5F8FA8";

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      {/* Thumbnail / click area */}
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        className="block relative" style={{ textDecoration: "none" }}>
        {ytThumb ? (
          <div className="relative" style={{ aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
            <img src={ytThumb} alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full flex items-center justify-center"
                style={{ width: 52, height: 52, background: "rgba(0,0,0,0.65)" }}>
                <Play size={24} style={{ color: "white", marginLeft: 3 }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center"
            style={{ aspectRatio: "16/9", background: "var(--accent-bg)" }}>
            <TypeIcon size={48} style={{ color: iconColor, opacity: 0.5 }} />
          </div>
        )}
      </a>

      {/* Text content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="tag" style={{ background: iconColor + "18", color: iconColor }}>
                {item.type === "youtube" ? "Video" : item.type === "podcast" ? "Podcast" : "Press"}
              </span>
              {item.date && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.date}</span>
              )}
            </div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-heading)" }}>{item.title}</p>
            {item.outlet && (
              <p className="text-xs" style={{ color: "var(--accent)" }}>{item.outlet}</p>
            )}
            {item.summary && (
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>{item.summary}</p>
            )}
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: "var(--accent)" }}>
              <ExternalLink size={11} /> Open
            </a>
          </div>
          {isAdmin && (
            <button onClick={onDelete} className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
              style={{ color: "#E53E3E" }}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const blankItem = (): Omit<MediaItem, "id"> => ({
  type: "youtube", title: "", outlet: "", date: "", link: "", summary: ""
});

export default function MediaPage() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<MediaItem[]>(mediaData as MediaItem[]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blankItem());

  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Media</h1>

      {items.length === 0 && !isAdmin ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Youtube size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No media items yet. Sign in as admin to add videos, podcasts, and press coverage.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map(item => (
            <MediaCard key={item.id} item={item}
              onDelete={() => setItems(p => p.filter(x => x.id !== item.id))}
              isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Admin: inline add form */}
      {isAdmin && adding && (
        <div className="card mt-6" style={{ border: "1.5px dashed var(--accent)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add media item</p>

          {/* Type selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(["youtube", "podcast", "press", "other"] as const).map(t => (
              <button key={t} type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className="btn text-xs"
                style={{
                  background: form.type === t ? "var(--accent)" : "transparent",
                  color: form.type === t ? "white" : "var(--text-muted)",
                  border: `1.5px solid ${form.type === t ? "var(--accent)" : "var(--border)"}`,
                }}>
                {t === "youtube" ? "YouTube" : t === "podcast" ? "Podcast" : t === "press" ? "Press / Article" : "Other"}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "title",   label: "Title *",          placeholder: "e.g. Interview on DCEA" },
              { key: "outlet",  label: "Outlet / Channel", placeholder: "e.g. ABC News, Spotify" },
              { key: "date",    label: "Date",             placeholder: "2025-06-01" },
              { key: "link",    label: "Link *",           placeholder: "https://youtube.com/watch?v=..." },
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
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Summary (opt.)</label>
            <textarea rows={2} value={form.summary} placeholder="Brief description…"
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              className="w-full rounded-lg px-2 py-1.5 text-xs"
              style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => {
              if (!form.title || !form.link) return;
              setItems(p => [...p, { ...form, id: `media-${Date.now()}` }]);
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
          <Plus size={12} /> Add media item
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
