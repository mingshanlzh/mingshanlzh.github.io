"use client";
import { Users, BookOpen, ExternalLink, Plus, Trash2, X, Check, Calendar } from "lucide-react";
import servicesData from "@/data/services.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type OrgService = { id: string; role: string; organisation: string; period: string; link: string };
type EdService   = { id: string; role: string; journal: string; publisher: string; period: string; link: string };

const blankOrg = (): Omit<OrgService, "id"> => ({ role: "", organisation: "", period: "", link: "" });
const blankEd  = (): Omit<EdService,  "id"> => ({ role: "", journal: "", publisher: "", period: "", link: "" });

export default function ServicesPage() {
  const { isAdmin } = useAdmin();
  const [orgs, setOrgs]     = useState<OrgService[]>(servicesData.organisations as OrgService[]);
  const [editorial, setEd]  = useState<EdService[]>(servicesData.editorial as EdService[]);
  const [addingOrg, setAddingOrg] = useState(false);
  const [addingEd,  setAddingEd]  = useState(false);
  const [orgForm, setOrgForm] = useState(blankOrg());
  const [edForm,  setEdForm]  = useState(blankEd());

  function OrgCard({ item }: { item: OrgService }) {
    return (
      <div className="card flex gap-4 items-start">
        <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
          <Users size={16} style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{item.role}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{item.organisation}</p>
          {item.period && (
            <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <Calendar size={10} /> {item.period}
            </span>
          )}
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}>
              <ExternalLink size={10} /> Website
            </a>
          )}
        </div>
        {isAdmin && (
          <button onClick={() => setOrgs(p => p.filter(x => x.id !== item.id))}
            className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
            style={{ color: "#E53E3E" }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  }

  function EdCard({ item }: { item: EdService }) {
    return (
      <div className="card flex gap-4 items-start">
        <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "#EBF8FF" }}>
          <BookOpen size={16} style={{ color: "#2B6CB0" }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{item.role}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
            <em>{item.journal}</em>
            {item.publisher && ` · ${item.publisher}`}
          </p>
          {item.period && (
            <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <Calendar size={10} /> {item.period}
            </span>
          )}
        </div>
        {isAdmin && (
          <button onClick={() => setEd(p => p.filter(x => x.id !== item.id))}
            className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
            style={{ color: "#E53E3E" }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Services</h1>

      {/* Academic organisations */}
      <section className="mb-10">
        <h2 className="section-title">Academic Organisations</h2>
        <div className="flex flex-col gap-4">
          {orgs.map(item => <OrgCard key={item.id} item={item} />)}
        </div>

        {/* Inline add form — organisations */}
        {isAdmin && addingOrg && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add organisation role</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "role",         label: "Role",         placeholder: "e.g. Convenor, SIG Name" },
                { key: "organisation", label: "Organisation", placeholder: "e.g. AHES" },
                { key: "period",       label: "Period",       placeholder: "2025 – present" },
                { key: "link",         label: "Website (optional)", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={(orgForm as Record<string,string>)[key]} placeholder={placeholder}
                    onChange={e => setOrgForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setOrgs(p => [...p, { ...orgForm, id: `org-${Date.now()}` }]); setOrgForm(blankOrg()); setAddingOrg(false); }}
                className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Check size={12} /> Save
              </button>
              <button onClick={() => setAddingOrg(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
        {isAdmin && !addingOrg && (
          <button onClick={() => { setAddingOrg(true); setOrgForm(blankOrg()); }}
            className="btn btn-outline text-xs mt-3">
            <Plus size={12} /> Add organisation role
          </button>
        )}
      </section>

      {/* Editorial roles */}
      <section className="mb-10">
        <h2 className="section-title">Editorial Roles</h2>
        <div className="flex flex-col gap-4">
          {editorial.map(item => <EdCard key={item.id} item={item} />)}
        </div>

        {/* Inline add form — editorial */}
        {isAdmin && addingEd && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add editorial role</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "role",      label: "Role",            placeholder: "e.g. Section Editor" },
                { key: "journal",   label: "Journal",         placeholder: "Journal name" },
                { key: "publisher", label: "Publisher",       placeholder: "e.g. Springer" },
                { key: "period",    label: "Period",          placeholder: "2025 – present" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={(edForm as Record<string,string>)[key]} placeholder={placeholder}
                    onChange={e => setEdForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEd(p => [...p, { ...edForm, id: `ed-${Date.now()}` }]); setEdForm(blankEd()); setAddingEd(false); }}
                className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Check size={12} /> Save
              </button>
              <button onClick={() => setAddingEd(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
        {isAdmin && !addingEd && (
          <button onClick={() => { setAddingEd(true); setEdForm(blankEd()); }}
            className="btn btn-outline text-xs mt-3">
            <Plus size={12} /> Add editorial role
          </button>
        )}
      </section>

      {/* Admin note */}
      {isAdmin && (
        <div className="card" style={{ background: "var(--accent-bg)", border: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <strong>Admin mode:</strong> Changes are live in this session. To make them permanent, tell Claude what you added and run <code>git push</code>.
          </p>
        </div>
      )}
    </div>
  );
}
