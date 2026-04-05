"use client";
import { useState, useEffect } from "react";
import { Lock, Folder, Plus, Edit2, Trash2, X, Check, ExternalLink, Upload, AlertTriangle, Info } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";
import type { Project, DocAttachment } from "@/app/lib/supabase";
import Link from "next/link";

const EMPTY_FORM: Omit<Project, "id" | "created_at"> = {
  title: "", description: "", summary: "", status: "active",
  tags: [], collaborator_labels: [], last_updated: new Date().toISOString().slice(0, 10),
  notice: "", notice_type: "info", documents: [],
};

export default function ProjectsPage() {
  const { isAdmin, isGuest, guestUser } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, "id" | "created_at">>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [newDoc, setNewDoc] = useState({ name: "", url: "" });
  const [showDocForm, setShowDocForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProjectId, setUploadProjectId] = useState<string | null>(null);
  const [guestUploadName, setGuestUploadName] = useState("");
  const [guestUploadFile, setGuestUploadFile] = useState<File | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProjects(data as Project[]);
        setLoading(false);
      });
  }, []);

  function handleAdd() {
    setForm({ ...EMPTY_FORM, last_updated: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setShowForm(true);
    setTagInput(""); setLabelInput(""); setShowDocForm(false);
  }

  function handleEdit(proj: Project) {
    const { id, created_at, ...rest } = proj;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
    setTagInput(""); setLabelInput(""); setShowDocForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects((p) => p.filter((x) => x.id !== id));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function addLabel() {
    const l = labelInput.trim();
    if (l && !form.collaborator_labels.includes(l)) setForm((f) => ({ ...f, collaborator_labels: [...f.collaborator_labels, l] }));
    setLabelInput("");
  }

  function addDocument() {
    if (!newDoc.name || !newDoc.url) return;
    const doc: DocAttachment = { ...newDoc, id: `doc_${Date.now()}` };
    setForm((f) => ({ ...f, documents: [...(f.documents || []), doc] }));
    setNewDoc({ name: "", url: "" });
    setShowDocForm(false);
  }

  function removeDocument(docId: string) {
    setForm((f) => ({ ...f, documents: (f.documents || []).filter((d) => d.id !== docId) }));
  }

  async function handleGuestUpload(projId: string) {
    if (!guestUploadFile || !guestUploadName) return;
    // Upload file to Supabase Storage bucket "uploads"
    const ext = guestUploadFile.name.split(".").pop();
    const path = `${projId}/${Date.now()}_${guestUploadName}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(path, guestUploadFile);
    if (uploadError) {
      alert("Upload failed. Please try again.");
      return;
    }
    setUploadProjectId(null);
    setGuestUploadName("");
    setGuestUploadFile(null);
    alert("Document submitted successfully. The admin will be notified.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editId)
        .select()
        .single();
      if (!error && data) {
        setProjects((p) => p.map((x) => (x.id === editId ? (data as Project) : x)));
      }
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...form })
        .select()
        .single();
      if (!error && data) {
        setProjects((p) => [data as Project, ...p]);
      }
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
  }

  // Filter projects based on role
  const visibleProjects = isAdmin
    ? projects
    : isGuest && guestUser
    ? projects.filter((p) =>
        p.collaborator_labels.length === 0 ||
        p.collaborator_labels.includes(guestUser.collaborator_label)
      )
    : [];

  // Visitor (not admin, not guest) sees a locked screen
  if (!isAdmin && !isGuest) {
    return (
      <div style={{ maxWidth: "500px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <Lock size={22} style={{ color: "var(--accent)" }} />
          </div>
          <h1 style={{ marginBottom: 0 }}>Working Projects</h1>
        </div>
        <div className="card mb-4" style={{ background: "#FFF8E1", border: "1px solid #F6AD55" }}>
          <div className="flex gap-3 items-start">
            <AlertTriangle size={18} style={{ color: "#D97706", marginTop: 2, flexShrink: 0 }} />
            <div>
              <p className="font-medium text-sm" style={{ color: "#92400E" }}>Access Restricted</p>
              <p className="text-xs mt-1" style={{ color: "#78350F" }}>
                This section is for collaborators only. If you are a collaborator on one of Shan&apos;s projects,
                please use your guest credentials to sign in.
              </p>
            </div>
          </div>
        </div>
        <Link href="/guest" className="btn btn-primary">
          <Lock size={15} /> Guest Login
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Working Projects</h1>
          {isGuest && guestUser && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Showing projects for: <strong>{guestUser.display_name}</strong>
            </p>
          )}
        </div>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Project
          </button>
        )}
      </div>

      {/* Admin add/edit form */}
      {showForm && isAdmin && (
        <div className="card mb-8" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Project" : "New Project"}</h2>
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
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Description *</label>
              <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Summary (optional, visible to guests)</label>
              <textarea rows={2} value={form.summary || ""} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  {["active", "completed", "paused"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Last Updated</label>
                <input type="date" value={form.last_updated || ""} onChange={(e) => setForm({ ...form, last_updated: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
            </div>

            {/* Tags */}
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

            {/* Collaborator labels */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Collaborator Labels (guests with these labels can see this project)
              </label>
              <div className="flex gap-2 mb-1 flex-wrap">
                {form.collaborator_labels.map((l) => (
                  <span key={l} className="tag flex items-center gap-1" style={{ background: "var(--accent)", color: "white" }}>
                    {l}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, collaborator_labels: f.collaborator_labels.filter((x) => x !== l) }))}
                      style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={labelInput} onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLabel())}
                  placeholder="Add label, press Enter" className="rounded-lg px-2 py-1 text-xs flex-1"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                <button type="button" onClick={addLabel} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>+</button>
              </div>
            </div>

            {/* Notice */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Notice / Status Box (optional)</label>
              <div className="flex gap-2 mb-2">
                {(["info", "warning", "success"] as const).map((t) => (
                  <label key={t} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--text-body)" }}>
                    <input type="radio" name="noticeType" value={t} checked={form.notice_type === t}
                      onChange={() => setForm({ ...form, notice_type: t })} />
                    {t}
                  </label>
                ))}
              </div>
              <input value={form.notice || ""} onChange={(e) => setForm({ ...form, notice: e.target.value })}
                placeholder="e.g. Analysis phase: please review the attached script by Friday"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "var(--text-heading)" }}>Documents (GitHub URL or direct link)</label>
                <button type="button" onClick={() => setShowDocForm(!showDocForm)} className="btn btn-outline text-xs" style={{ padding: "0.15rem 0.5rem" }}>
                  <Plus size={11} /> Add
                </button>
              </div>
              {(form.documents || []).map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 mb-1 p-2 rounded-lg" style={{ background: "var(--accent-bg)" }}>
                  <span className="text-xs flex-1 truncate" style={{ color: "var(--text-body)" }}>{doc.name}</span>
                  <span className="text-xs truncate" style={{ color: "var(--text-muted)", maxWidth: "150px" }}>{doc.url}</span>
                  <button type="button" onClick={() => removeDocument(doc.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <X size={13} style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>
              ))}
              {showDocForm && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <input value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    placeholder="Document name" className="rounded-lg px-2 py-1 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", minWidth: "120px" }} />
                  <input value={newDoc.url} onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                    placeholder="GitHub raw URL or https://..." className="rounded-lg px-2 py-1 text-xs flex-1"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", minWidth: "160px" }} />
                  <button type="button" onClick={addDocument} className="btn btn-primary text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                    <Check size={11} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="btn btn-primary text-sm">
                <Check size={14} /> {saving ? "Saving…" : editId ? "Save Changes" : "Add Project"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {visibleProjects.length === 0 && !showForm && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAdmin ? "No projects yet. Click 'Add Project' to get started." : "No projects available for your account."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {visibleProjects.map((proj) => {
          const noticeColors: Record<string, { bg: string; border: string; icon: string }> = {
            info:    { bg: "#EFF6FF", border: "#93C5FD", icon: "#3B82F6" },
            warning: { bg: "#FFF8E1", border: "#F6AD55", icon: "#D97706" },
            success: { bg: "#F0FFF4", border: "#68D391", icon: "#38A169" },
          };
          const nc = noticeColors[proj.notice_type || "info"];

          return (
            <div key={proj.id} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 style={{ fontSize: "1.05rem", marginBottom: 0 }}>{proj.title}</h2>
                    <span className="tag" style={{
                      background: proj.status === "active" ? "#E6F9EF" : proj.status === "completed" ? "#EFF6FF" : "#FFF8E1",
                      color: proj.status === "active" ? "#38A169" : proj.status === "completed" ? "#3B82F6" : "#D97706",
                    }}>{proj.status}</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {isGuest ? (proj.summary || proj.description) : proj.description}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(proj)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => handleDelete(proj.id)} className="btn text-xs"
                      style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {proj.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                {isAdmin && proj.collaborator_labels.map((l) => (
                  <span key={l} className="tag" style={{ background: "var(--accent)", color: "white" }}>{l}</span>
                ))}
              </div>

              {proj.last_updated && (
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  Last updated: {proj.last_updated}
                </p>
              )}

              {/* Notice box */}
              {proj.notice && (
                <div className="p-3 rounded-lg mb-3 flex gap-2 items-start"
                  style={{ background: nc.bg, border: `1px solid ${nc.border}` }}>
                  <Info size={15} style={{ color: nc.icon, marginTop: 1, flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: nc.icon }}>{proj.notice}</p>
                </div>
              )}

              {/* Documents */}
              {proj.documents && proj.documents.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--text-heading)" }}>Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.documents.map((doc) => (
                      <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                        <ExternalLink size={11} /> {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest upload */}
              {(isAdmin || isGuest) && (
                <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  {uploadProjectId === proj.id ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-medium" style={{ color: "var(--text-heading)" }}>Upload a document</p>
                      <input value={guestUploadName} onChange={(e) => setGuestUploadName(e.target.value)}
                        placeholder="Document name / description"
                        className="rounded-lg px-2 py-1 text-xs"
                        style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                      <input type="file" accept=".pdf,.doc,.docx,.xlsx,.csv,.R,.py,.tex"
                        onChange={(e) => setGuestUploadFile(e.target.files?.[0] || null)}
                        className="text-xs" style={{ color: "var(--text-muted)" }} />
                      <div className="flex gap-2">
                        <button onClick={() => handleGuestUpload(proj.id)} className="btn btn-primary text-xs"
                          disabled={!guestUploadName || !guestUploadFile}>
                          <Check size={12} /> Submit
                        </button>
                        <button onClick={() => setUploadProjectId(null)} className="btn btn-outline text-xs">
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setUploadProjectId(proj.id)} className="btn btn-outline text-xs">
                      <Upload size={12} /> Upload document
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
