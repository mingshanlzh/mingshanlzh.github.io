"use client";
import { Trophy, Coins, ExternalLink, Plus, Trash2, Check, X } from "lucide-react";
import awardsData from "@/data/awards.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { useState } from "react";

type Award = { id: string; title: string; organisation: string; year: number; link: string };
type Grant = { id: string; title: string; funder: string; amount: string; period: string; role: string; link: string };

const blankAward = (): Omit<Award, "id"> => ({ title: "", organisation: "", year: new Date().getFullYear(), link: "" });
const blankGrant = (): Omit<Grant, "id"> => ({ title: "", funder: "", amount: "", period: "", role: "", link: "" });

export default function AwardsPage() {
  const { isAdmin } = useAdmin();
  const [awards, setAwards] = useState<Award[]>(awardsData.awards as Award[]);
  const [grants, setGrants] = useState<Grant[]>(awardsData.grants as Grant[]);
  const [addingAward, setAddingAward] = useState(false);
  const [addingGrant, setAddingGrant] = useState(false);
  const [awardForm, setAwardForm] = useState(blankAward());
  const [grantForm, setGrantForm] = useState(blankGrant());

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Awards &amp; Grants</h1>

      {/* Awards & Prizes */}
      <section className="mb-10">
        <h2 className="section-title">Awards &amp; Prizes</h2>
        <div className="flex flex-col gap-4">
          {awards.map((a) => (
            <div key={a.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "#FEF3C720" }}>
                <Trophy size={18} style={{ color: "#D97706" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{a.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {a.organisation} · {a.year}
                </p>
                {a.link && (
                  <a href={a.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}>
                    <ExternalLink size={11} /> Website
                  </a>
                )}
              </div>
              {isAdmin && (
                <button onClick={() => setAwards(p => p.filter(x => x.id !== a.id))}
                  className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
                  style={{ color: "#E53E3E" }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && addingAward && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add award</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "title",        label: "Award title",    placeholder: "e.g. Best Paper Award" },
                { key: "organisation", label: "Organisation",   placeholder: "e.g. ISPOR" },
                { key: "year",         label: "Year",           placeholder: "2025" },
                { key: "link",         label: "Website (opt.)", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={String((awardForm as Record<string, string | number>)[key])} placeholder={placeholder}
                    onChange={e => setAwardForm(f => ({ ...f, [key]: key === "year" ? Number(e.target.value) : e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setAwards(p => [...p, { ...awardForm, id: `award-${Date.now()}` }]); setAwardForm(blankAward()); setAddingAward(false); }}
                className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Check size={12} /> Save
              </button>
              <button onClick={() => setAddingAward(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
        {isAdmin && !addingAward && (
          <button onClick={() => { setAddingAward(true); setAwardForm(blankAward()); }}
            className="btn btn-outline text-xs mt-3"><Plus size={12} /> Add award</button>
        )}
      </section>

      {/* Grants & Funding */}
      <section className="mb-10">
        <h2 className="section-title">Grants &amp; Funding</h2>
        <div className="flex flex-col gap-4">
          {grants.map((g) => (
            <div key={g.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0">
                <Coins size={18} style={{ color: "#38A169" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{g.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {g.funder}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {g.period}{g.role ? ` · ${g.role}` : ""}
                </p>
                {g.amount && (
                  <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--accent)" }}>{g.amount}</p>
                )}
                {g.link && (
                  <a href={g.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}>
                    <ExternalLink size={11} /> Website
                  </a>
                )}
              </div>
              {isAdmin && (
                <button onClick={() => setGrants(p => p.filter(x => x.id !== g.id))}
                  className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove"
                  style={{ color: "#E53E3E" }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && addingGrant && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add grant / funding</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "title",  label: "Title",           placeholder: "Grant / scholarship name" },
                { key: "funder", label: "Funder",          placeholder: "e.g. NHMRC" },
                { key: "amount", label: "Amount (opt.)",   placeholder: "e.g. AUD 50,000" },
                { key: "period", label: "Period",          placeholder: "2024–2027" },
                { key: "role",   label: "Role",            placeholder: "e.g. Chief Investigator" },
                { key: "link",   label: "Website (opt.)",  placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={(grantForm as Record<string, string>)[key]} placeholder={placeholder}
                    onChange={e => setGrantForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs"
                    style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setGrants(p => [...p, { ...grantForm, id: `grant-${Date.now()}` }]); setGrantForm(blankGrant()); setAddingGrant(false); }}
                className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Check size={12} /> Save
              </button>
              <button onClick={() => setAddingGrant(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
        {isAdmin && !addingGrant && (
          <button onClick={() => { setAddingGrant(true); setGrantForm(blankGrant()); }}
            className="btn btn-outline text-xs mt-3"><Plus size={12} /> Add grant</button>
        )}
      </section>

      {isAdmin && (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <strong>Admin mode:</strong> Changes are live in this session. To make them permanent, tell Claude what you added and run <code>git push</code>.
          </p>
        </div>
      )}
    </div>
  );
}
