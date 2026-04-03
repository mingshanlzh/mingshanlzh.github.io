"use client";
import { useState, useEffect } from "react";
import { GraduationCap, Plus, Edit2, Trash2, X, Check, ChevronRight, Download, Upload } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";

type Material = {
  id: string;
  name: string;
  url: string;
  type: "slides" | "notes" | "assignment" | "other";
};

type Course = {
  id: string;
  title: string;
  institution: string;
  level: string;
  period: string;
  role: string;
  description?: string;
  materials?: Material[];
};

const EMPTY_FORM: Omit<Course, "id"> = {
  title: "", institution: "Macquarie University", level: "Postgraduate",
  period: "", role: "Lecturer", description: "", materials: [],
};

const LEVEL_OPTIONS = ["Undergraduate", "Postgraduate", "PhD", "Short Course / Workshop", "Guest Lecture"];
const ROLE_OPTIONS = ["Lecturer", "Tutor", "Guest Lecturer", "Workshop Facilitator", "Course Coordinator"];

function CourseDrawer({ course, onClose, isAdmin, onEdit }: {
  course: Course;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (c: Course) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="h-full overflow-y-auto"
        style={{ width: "min(460px, 100vw)", background: "var(--bg-primary)", boxShadow: "-4px 0 24px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ marginBottom: 0, fontSize: "1.05rem" }}>{course.title}</h2>
            <div className="flex gap-2">
              {isAdmin && (
                <button onClick={() => { onClose(); onEdit(course); }} className="btn btn-outline text-xs">
                  <Edit2 size={12} /> Edit
                </button>
              )}
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Institution</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{course.institution}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Level</p>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{course.level}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Period</p>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{course.period}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Role</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{course.role}</p>
            </div>
            {course.description && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Description</p>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{course.description}</p>
              </div>
            )}
            {course.materials && course.materials.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--accent)" }}>Course Materials</p>
                <div className="flex flex-col gap-2">
                  {course.materials.map((mat) => (
                    <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-xs justify-start gap-2"
                      style={{ padding: "0.4rem 0.75rem" }}>
                      <Download size={12} />
                      {mat.name}
                      <span className="ml-auto tag">{mat.type}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {(!course.materials || course.materials.length === 0) && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No materials uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeachingPage() {
  const { isAdmin } = useAdmin();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Course, "id">>(EMPTY_FORM);
  const [drawerCourse, setDrawerCourse] = useState<Course | null>(null);
  const [newMaterial, setNewMaterial] = useState({ name: "", url: "", type: "slides" as Material["type"] });
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_teaching");
      if (stored) {
        setCourses(JSON.parse(stored));
      }
    } catch {}
  }, []);

  function saveCourses(updated: Course[]) {
    setCourses(updated);
    localStorage.setItem("sj_teaching", JSON.stringify(updated));
  }

  function handleAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
    setShowMaterialForm(false);
  }

  function handleEdit(course: Course) {
    const { id, ...rest } = course;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
    setShowMaterialForm(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this course?")) saveCourses(courses.filter((c) => c.id !== id));
  }

  function addMaterial() {
    if (!newMaterial.name || !newMaterial.url) return;
    const mat: Material = { ...newMaterial, id: `mat_${Date.now()}` };
    setForm((f) => ({ ...f, materials: [...(f.materials || []), mat] }));
    setNewMaterial({ name: "", url: "", type: "slides" });
    setShowMaterialForm(false);
  }

  function removeMaterial(matId: string) {
    setForm((f) => ({ ...f, materials: (f.materials || []).filter((m) => m.id !== matId) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      saveCourses(courses.map((c) => (c.id === editId ? { ...form, id: editId } : c)));
    } else {
      saveCourses([...courses, { ...form, id: `course_${Date.now()}` }]);
    }
    setShowForm(false);
    setEditId(null);
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ marginBottom: 0 }}>Teaching</h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Course
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && isAdmin && (
        <div className="card mb-8" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Course" : "New Course"}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Course Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                placeholder="Health Economic Evaluation" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Institution</label>
                <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Period</label>
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="2023–present" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Description (optional)</label>
              <textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>

            {/* Materials */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "var(--text-heading)" }}>Course Materials</label>
                <button type="button" onClick={() => setShowMaterialForm(!showMaterialForm)} className="btn btn-outline text-xs" style={{ padding: "0.15rem 0.5rem" }}>
                  <Plus size={11} /> Add
                </button>
              </div>
              {(form.materials || []).map((mat) => (
                <div key={mat.id} className="flex items-center gap-2 mb-1 p-2 rounded-lg" style={{ background: "var(--accent-bg)" }}>
                  <span className="tag">{mat.type}</span>
                  <span className="text-xs flex-1 truncate" style={{ color: "var(--text-body)" }}>{mat.name}</span>
                  <button type="button" onClick={() => removeMaterial(mat.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <X size={13} style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>
              ))}
              {showMaterialForm && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <input value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    placeholder="Material name" className="rounded-lg px-2 py-1 text-xs flex-1"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", minWidth: "120px" }} />
                  <input value={newMaterial.url} onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                    placeholder="URL or GitHub link" className="rounded-lg px-2 py-1 text-xs flex-1"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", minWidth: "120px" }} />
                  <select value={newMaterial.type} onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as Material["type"] })}
                    className="rounded-lg px-2 py-1 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                    {["slides", "notes", "assignment", "other"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button type="button" onClick={addMaterial} className="btn btn-primary text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                    <Check size={11} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> {editId ? "Save Changes" : "Add Course"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {courses.length === 0 && !showForm && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No courses yet.{isAdmin ? " Click 'Add Course' to get started." : ""}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div key={course.id} className="card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setDrawerCourse(course)}>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
                <GraduationCap size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{course.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                  {course.institution} · {course.level} · {course.period}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Role: {course.role}</p>
                {course.materials && course.materials.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {course.materials.length} material{course.materials.length > 1 ? "s" : ""} available
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(course)} className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.5rem" }}>
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="btn text-xs" style={{ padding: "0.25rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                      <Trash2 size={11} />
                    </button>
                  </>
                )}
                <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {drawerCourse && (
        <CourseDrawer
          course={drawerCourse}
          onClose={() => setDrawerCourse(null)}
          isAdmin={isAdmin}
          onEdit={(c) => { setDrawerCourse(null); handleEdit(c); }}
        />
      )}
    </div>
  );
}
