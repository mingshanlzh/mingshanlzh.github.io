"use client";
import { useState, useEffect, useRef } from "react";
import { Users, Plus, Edit2, Trash2, X, Check, Upload, ChevronRight, Mail, Globe } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/app/lib/AdminContext";

const ROLE_OPTIONS = [
  "Supervisor", "Advisor", "Postdoc", "PhD Student",
  "Master", "Bachelor", "RA", "TA",
];

type Member = {
  id: string;
  name: string;
  role: string;
  institution: string;
  period: string;
  topic: string;
  status: "active" | "past";
  email?: string;
  website?: string;
  bio?: string;
  photo?: string; // base64 data URL
};

const EMPTY_FORM: Omit<Member, "id"> = {
  name: "", role: "PhD Student", institution: "Macquarie University",
  period: "", topic: "", status: "active",
  email: "", website: "", bio: "", photo: "",
};

function circleCrop(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(100, 100, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function MemberDrawer({ member, onClose, isAdmin, onEdit }: {
  member: Member;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (m: Member) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="h-full overflow-y-auto"
        style={{ width: "min(420px, 100vw)", background: "var(--bg-primary)", boxShadow: "-4px 0 24px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ marginBottom: 0, fontSize: "1.1rem" }}>{member.name}</h2>
            <div className="flex gap-2">
              {isAdmin && (
                <button onClick={() => { onClose(); onEdit(member); }} className="btn btn-outline text-xs">
                  <Edit2 size={12} /> Edit
                </button>
              )}
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            {member.photo ? (
              <img src={member.photo} alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
                style={{ border: "2px solid var(--border)" }} />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl mb-3"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <span className="tag">{member.role}</span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Institution</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{member.institution}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Period</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{member.period}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Topic / Project</p>
              <p className="text-sm" style={{ color: "var(--text-body)" }}>{member.topic}</p>
            </div>
            {member.bio && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--accent)" }}>Bio</p>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>{member.bio}</p>
              </div>
            )}
            <div className="flex gap-3 mt-2">
              {member.email && (
                <a href={`mailto:${member.email}`} className="btn btn-outline text-xs">
                  <Mail size={12} /> Email
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-xs">
                  <Globe size={12} /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { isAdmin } = useAdmin();
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Member, "id">>(EMPTY_FORM);
  const [drawerMember, setDrawerMember] = useState<Member | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_team");
      if (stored) setMembers(JSON.parse(stored));
    } catch {}
  }, []);

  function saveMembers(updated: Member[]) {
    setMembers(updated);
    localStorage.setItem("sj_team", JSON.stringify(updated));
  }

  function handleAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  }

  function handleEdit(member: Member) {
    const { id, ...rest } = member;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Remove this member?")) saveMembers(members.filter((m) => m.id !== id));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const cropped = await circleCrop(file);
    setForm((f) => ({ ...f, photo: cropped }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      saveMembers(members.map((m) => (m.id === editId ? { ...form, id: editId } : m)));
    } else {
      saveMembers([...members, { ...form, id: `member_${Date.now()}` }]);
    }
    setShowForm(false);
    setEditId(null);
  }

  const active = members.filter((m) => m.status === "active");
  const past = members.filter((m) => m.status !== "active");

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ marginBottom: 0 }}>Team</h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-primary text-sm">
            <Plus size={15} /> Add Member
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && isAdmin && (
        <div className="card mb-8" style={{ border: "1.5px solid var(--accent)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ marginBottom: 0, fontSize: "1rem" }}>{editId ? "Edit Member" : "New Member"}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              {form.photo ? (
                <img src={form.photo} alt="preview"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ border: "2px solid var(--border)" }} />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                  {form.name ? form.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "?"}
                </div>
              )}
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-outline text-xs">
                  <Upload size={12} /> {form.photo ? "Change Photo" : "Upload Photo"}
                </button>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Auto-cropped to circle</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}>
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
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
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Topic / Project</label>
              <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Bio (optional)</label>
              <textarea rows={2} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)", resize: "vertical" }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Email (optional)</label>
                <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Website (optional)</label>
                <input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }}
                  placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>Status</label>
              <div className="flex gap-3">
                {(["active", "past"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-body)" }}>
                    <input type="radio" name="status" value={s} checked={form.status === s}
                      onChange={() => setForm({ ...form, status: s })} />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary text-sm">
                <Check size={14} /> {editId ? "Save Changes" : "Add Member"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {members.length === 0 && !showForm && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No team members yet.{isAdmin ? " Click 'Add Member' to get started." : ""}
          </p>
        </div>
      )}

      {/* Current members */}
      {active.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title">Current</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((m) => (
              <div key={m.id} className="card cursor-pointer hover:shadow-md transition-shadow"
                style={{ position: "relative" }}
                onClick={() => setDrawerMember(m)}>
                <div className="flex flex-col items-center text-center pt-2 pb-1">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name}
                      className="w-16 h-16 rounded-full object-cover mb-3"
                      style={{ border: "2px solid var(--border)" }} />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-3"
                      style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{m.name}</p>
                  <span className="tag mt-1">{m.role}</span>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{m.institution}</p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{m.topic}</p>
                </div>
                <div className="flex justify-end mt-2 gap-2" onClick={(e) => e.stopPropagation()}>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(m)} className="btn btn-outline text-xs" style={{ padding: "0.15rem 0.5rem" }}>
                        <Edit2 size={10} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="btn text-xs" style={{ padding: "0.15rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                        <Trash2 size={10} />
                      </button>
                    </>
                  )}
                  <ChevronRight size={14} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past members */}
      {past.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title">Past</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((m) => (
              <div key={m.id} className="card cursor-pointer hover:shadow-md transition-shadow"
                      style={{ opacity: 0.8, position: "relative" }}
                onClick={() => setDrawerMember(m)}>
                <div className="flex flex-col items-center text-center pt-2 pb-1">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name}
                      className="w-14 h-14 rounded-full object-cover mb-2"
                      style={{ border: "2px solid var(--border)", filter: "grayscale(30%)" }} />
                  ) : (
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2"
                      style={{ background: "var(--border)", color: "var(--text-muted)" }}>
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{m.name}</p>
                  <span className="tag mt-1">{m.role}</span>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{m.period}</p>
                </div>
                <div className="flex justify-end mt-1 gap-2" onClick={(e) => e.stopPropagation()}>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(m)} className="btn btn-outline text-xs" style={{ padding: "0.15rem 0.5rem" }}>
                        <Edit2 size={10} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="btn text-xs" style={{ padding: "0.15rem 0.5rem", color: "#E53E3E", border: "1.5px solid #E53E3E", background: "transparent" }}>
                        <Trash2 size={10} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interested section */}
      <div className="card mt-4" style={{ background: "var(--accent-bg)" }}>
        <div className="flex items-start gap-3">
          <Users size={18} style={{ color: "var(--accent)", marginTop: 2 }} />
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>Interested in working with me?</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              I welcome inquiries from prospective PhD students and research assistants interested in health economics, DCEA, and equity-informed economic evaluation.
              Please <Link href="/contact" style={{ color: "var(--accent)" }}>get in touch</Link> with your CV and research interests.
            </p>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerMember && (
        <MemberDrawer
          member={drawerMember}
          onClose={() => setDrawerMember(null)}
          isAdmin={isAdmin}
          onEdit={(m) => { setDrawerMember(null); handleEdit(m); }}
        />
      )}
    </div>
  );
}
