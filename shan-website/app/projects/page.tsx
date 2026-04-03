"use client";
import { useState, useEffect } from "react";
import { Folder, Plus, Edit2, Trash2, X, Check, ExternalLink, Lock, UserCircle, FileText, ChevronRight } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import Link from "next/link";

type Document = {
  id: string;
  name: string;
  url: string;
  type: "report" | "data" | "code" | "other";
};

type Project = {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  collaboratorLabels: string[];
  notice?: string;
  documents?: Document[];
  startDate?: string;
  endDate?: string;
};

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  description: "",
  status: "active",
  collaboratorLabels: [],
  notice: "",
  documents: [],
  startDate: "",
  endDate: "",
};

const EMPTY_DOC: Omit<Document, "id"> = {
  name: "",
  url: "",
  type: "other",
};

const STATUS_COLORS: Record<string, string> = {
  active: "#38A169",
  completed: "#3182CE",
  "on-hold": "#D69E2E",
};

export default function ProjectsPage() {
  const { isAdmin, isGuest, guestUser } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY_PROJECT);
  const [labelInput, setLabelInput] = useState("");
  const [docForm, setDocForm] = useState<Omit<Document, "id"> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_projects");
      if (stored) setProjects(JSON.parse(stored));
    } catch {}
  }, []);

  function saveProjects(updated: Project[]) {
    setProjects(updated);
    localStorage.setItem("sj_projects", JSON.stringify(updated));
  }

  function handleAdd() {
    setForm({ ...EMPTY_PROJECT, documents: [] });
    setEditId(null);
    setLabelInput("");
    setDocForm(null);
    setShowForm(true);
  }

  function handleEdit(p: Project) {
    const { id, ...rest } = p;
    setForm({ ...rest, documents: rest.documents || [] });
    setEditId(id);
    setLabelInput("");
    setDocForm(null);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this project?")) saveProjects(projects.filter((p) => p.id !== id));
  }

  function addLabel() {
    const t = labelInput.trim();
    if (t && !form.collaboratorLabels.includes(t))
      setForm((f) => ({ ...f, collaboratorLabels: [...f.collaboratorLabels, t] }));
    setLabelInput("");
  }

  function addDoc() {
    if (!docForm || !docForm.name || !docForm.url) return;
    const newDoc: Document = { ...docForm, id: `doc_${Date.now()}` };
    setForm((f) => ({ ...f, documents: [...(f.documents || []), newDoc] }));
    setDocForm(null);
  }

  function removeDoc(docId: string) {
    setForm((f) => ({ ...f, documents: (f.documents || []).filter((d) => d.id !== docId) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      saveProjects(projects.map((p) => (p.id === editId ? { ...form, id: editId } : p)));
    } else {
      saveProjects([...projects, { ...form, id: `proj_${Date.now()}` }]);
    }
    setShowForm(false);
    setEditId(null);
  }

  // Visitor: not logged in, not admin
  if (!isAdmin && !isGuest) {
    return (
      <div style={{ maxWidth: "520px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--accent-bg)" }}>
            <Lock size={22} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0 }}>Working Projects</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Restricted access</p>
          </div>
        </div>
        <div className="card" style={{ background: "var(--accent-bg)", borderColor: "var(--accent)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--text-body)" }}>
            This section is for collaborators only. Please log in with your guest credentials to view working projects.
          </p>
          <Link href="/guest" className="btn btn-primary text-sm inline-flex">
            <UserCircle size={15} /> Guest Login
          </Link>
        </div>
      </div>
    );
  }

  const visibleProjects = isAdmin
    ? projects
    : projects.filter((p) =>
        guestUser && p.collaboratorLabels.includes(guestUser.collaboratorLabel)
      );

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 style={{ marginBottom: 0 }}>Working Projects</h1>
          {isGuest && guestUser && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Showing projects for: <code style={{ background: "var(--accent-bg)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{guestUser.collaboratorLabel}</code>
            </p>
          )}
        </div>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Project
          </button>
        )}
      </div>

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
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Start Date</label>
                <input type="text" value={form.startDate || ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  placeholder="e.g. Jan 2024" className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>End Date</label>
                <input type="text" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  placeholder="e.g. Dec 2025 or Ongoing" className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Notice / Status Update</label>
              <textarea value={form.notice || ""} onChange={(e) => setForm({ ...form, notice: e.target.value })}
                rows={2} placeholder="Optional note for collaborators..."
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                Collaborator Labels
                <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>(guest accounts with matching label can see this)</span>
              </label>
              <div className="flex gap-2 mb-1 flex-wrap">
                {form.collaboratorLabels.map((l) => (
                  <span key={l} className="tag flex items-center gap-1">
                    {l}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, collaboratorLabels: f.collaboratorLabels.filter((x) => x !== l) }))}
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
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-heading)" }}>Documents</label>
              {(form.documents || []).map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 mb-1">
                  <FileText size={13} style={{ color: "var(--accent)" }} />
                  <span className="text-xs flex-1" style={{ color: "var(--text-body)" }}>{doc.name}</span>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "var(--accent)" }}>View</a>
                  <button type="button" onClick={() => removeDoc(doc.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#E53E3E" }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              {docForm ? (
                <div className="flex flex-col gap-2 mt-2 p-2 rounded-lg" style={{ border: "1.5px dashed var(--border)" }}>
                  <input value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                    placeholder="Document name" className="rounded-lg px-2 py-1 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                  <input value={docForm.url} onChange={(e) => setDocForm({ ...docForm, url: e.target.value })}
                    placeholder="GitHub URL or direct URL (https://...)" className="rounded-lg px-2 py-1 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                  <select value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value as Document["type"] })}
                    className="rounded-lg px-2 py-1 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                    <option value="report">Report</option>
                    <option value="data">Data</option>
                    <option value="code">Code</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="button" onClick={addDoc} className="btn btn-primary text-xs">
                      <Check size={12} /> Add
                    </button>
                    <button type="button" onClick={() => setDocForm(null)} className="btn btn-outline text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setDocForm({ ...EMPTY_DOC })}
                  className="btn btn-outline text-xs mt-1" style={{ padding: "0.25rem 0.6rem" }}>
                  <Plus size={11} /> Add Document
                </button>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> {editId ? "Save Changes" : "Create Project"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {visibleProjects.length === 0 && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAdmin ? 'No projects yet. Click "Add Project" to create one.' : "No projects are currently shared with you."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {visibleProjects.map((project) => (
          <div key={project.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: STATUS_COLORS[project.status] + "20", color: STATUS_COLORS[project.status] }}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  {project.startDate && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {project.startDate}{project.endDate ? ` \u2013 ${project.endDate}` : ""}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-heading)" }}>{project.title}</h2>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{project.description}</p>

                {project.notice && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent)" }}>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--accent)" }}>Notice</p>
                    <p className="text-xs" style={{ color: "var(--text-body)" }}>{project.notice}</p>
                  </div>
                )}

                {isAdmin && project.collaboratorLabels.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {project.collaboratorLabels.map((l) => (
                      <span key={l} className="tag text-xs">{l}</span>
                    ))}
                  </div>
                )}

                {(project.documents || []).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Documents</p>
                    <div className="flex flex-col gap-1">
                      {(project.documents || []).map((doc) => (
                        <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs"
                          style={{ color: "var(--accent)", textDecoration: "none" }}>
                          <FileText size={12} />
                          <span>{doc.name}</span>
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(project)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="btn text-xs"
                    style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
