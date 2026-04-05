"use client";
import { useEffect, useState } from "react";
import { Trophy, Coins, ExternalLink, Plus, Trash2, Check, X } from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";

type Award = {
  id: string;
  entry_type: "award" | "grant";
  title: string;
  organisation?: string;
  year?: number;
  funder?: string;
  amount?: string;
  period?: string;
  role?: string;
  link?: string;
  sort_order: number;
};

const blankAward = (): Omit<Award, "id" | "sort_order"> => ({
  entry_type: "award", title: "", organisation: "", year: new Date().getFullYear(), link: "",
});
const blankGrant = (): Omit<Award, "id" | "sort_order"> => ({
  entry_type: "grant", title: "", funder: "", amount: "", period: "", role: "", link: "",
});

export default function AwardsPage() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAward, setAddingAward] = useState(false);
  const [addingGrant, setAddingGrant] = useState(false);
  const [awardForm, setAwardForm] = useState(blankAward());
  const [grantForm, setGrantForm] = useState(blankGrant());
  const [saving, setSaving] = useState(false);

  const awards = items.filter((i) => i.entry_type === "award");
  const grants = items.filter((i) => i.entry_type === "grant");

  useEffect(() => {
    supabase.from("awards").select("*").order("sort_order", { ascending: true })
      .then(({ data }) => { if (data) setItems(data as Award[]); setLoading(false); });
  }, []);

  async function handleDeleteAward(id: string) {
    if (!confirm("Remove this award?")) return;
    await supabase.from("awards").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function handleDeleteGrant(id: string) {
    if (!confirm("Remove this grant?")) return;
    await supabase.from("awards").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function handleSaveAward() {
    if (!awardForm.title) return;
    setSaving(true);
    const maxOrder = items.filter((i) => i.entry_type === "award").reduce((m, i) => Math.max(m, i.sort_order), -1);
    const { data, error } = await supabase.from("awards")
      .insert({ ...awardForm, sort_order: maxOrder + 1 }).select().single();
    setSaving(false);
    if (!error && data) { setItems((p) => [...p, data as Award]); setAwardForm(blankAward()); setAddingAward(false); }
  }

  async function handleSaveGrant() {
    if (!grantForm.title) return;
    setSaving(true);
    const maxOrder = items.filter((i) => i.entry_type === "grant").reduce((m, i) => Math.max(m, i.sort_order), -1);
    const { data, error } = await supabase.from("awards")
      .insert({ ...grantForm, sort_order: maxOrder + 1 }).select().single();
    setSaving(false);
    if (!error && data) { setItems((p) => [...p, data as Award]); setGrantForm(blankGrant()); setAddingGrant(false); }
  }

  if (loading) return <div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Awards &amp; Grants</h1>
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
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.organisation}{a.year ? ` · ${a.year}` : ""}</p>
                {a.link && (<a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}><ExternalLink size={11} /> Website</a>)}
              </div>
              {isAdmin && (<button onClick={() => handleDeleteAward(a.id)} className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove" style={{ color: "#E53E3E" }}><Trash2 size={13} /></button>)}
            </div>
          ))}
          {awards.length === 0 && !addingAward && (<p className="text-sm" style={{ color: "var(--text-muted)" }}>No awards listed yet.</p>)}
        </div>
        {isAdmin && addingAward && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add award</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[{key:"title",label:"Award title",placeholder:"e.g. Best Paper Award"},{key:"organisation",label:"Organisation",placeholder:"e.g. ISPOR"},{key:"year",label:"Year",placeholder:"2025"},{key:"link",label:"Website (opt.)",placeholder:"https://..."}].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={String((awardForm as Record<string, string | number | undefined>)[key] ?? "")} placeholder={placeholder}
                    onChange={e => setAwardForm(f => ({ ...f, [key]: key === "year" ? Number(e.target.value) : e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs" style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleSaveAward} disabled={saving} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}><Check size={12} /> {saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setAddingAward(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}><X size={12} /> Cancel</button>
            </div>
          </div>
        )}
        {isAdmin && !addingAward && (<button onClick={() => { setAddingAward(true); setAwardForm(blankAward()); }} className="btn btn-outline text-xs mt-3"><Plus size={12} /> Add award</button>)}
      </section>
      <section className="mb-10">
        <h2 className="section-title">Grants &amp; Funding</h2>
        <div className="flex flex-col gap-4">
          {grants.map((g) => (
            <div key={g.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0"><Coins size={18} style={{ color: "#38A169" }} /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{g.title}</p>
                {g.funder && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{g.funder}</p>}
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{g.period}{g.role ? ` · ${g.role}` : ""}</p>
                {g.amount && (<p className="text-xs mt-0.5 font-medium" style={{ color: "var(--accent)" }}>{g.amount}</p>)}
                {g.link && (<a href={g.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--accent)" }}><ExternalLink size={11} /> Website</a>)}
              </div>
              {isAdmin && (<button onClick={() => handleDeleteGrant(g.id)} className="p-1 rounded hover:opacity-70 flex-shrink-0" title="Remove" style={{ color: "#E53E3E" }}><Trash2 size={13} /></button>)}
            </div>
          ))}
          {grants.length === 0 && !addingGrant && (<p className="text-sm" style={{ color: "var(--text-muted)" }}>No grants listed yet.</p>)}
        </div>
        {isAdmin && addingGrant && (
          <div className="card mt-4" style={{ border: "1.5px dashed var(--accent)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--accent)" }}>Add grant / funding</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[{key:"title",label:"Title",placeholder:"Grant / scholarship name"},{key:"funder",label:"Funder",placeholder:"e.g. NHMRC"},{key:"amount",label:"Amount (opt.)",placeholder:"e.g. AUD 50,000"},{key:"period",label:"Period",placeholder:"2024–2027"},{key:"role",label:"Role",placeholder:"e.g. Chief Investigator"},{key:"link",label:"Website (opt.)",placeholder:"https://..."}].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-heading)" }}>{label}</label>
                  <input type="text" value={(grantForm as unknown as Record<string, string | undefined>)[key] ?? ""} placeholder={placeholder}
                    onChange={e => setGrantForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg px-2 py-1.5 text-xs" style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleSaveGrant} disabled={saving} className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}><Check size={12} /> {saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setAddingGrant(false)} className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}><X size={12} /> Cancel</button>
            </div>
          </div>
        )}
        {isAdmin && !addingGrant && (<button onClick={() => { setAddingGrant(true); setGrantForm(blankGrant()); }} className="btn btn-outline text-xs mt-3"><Plus size={12} /> Add grant</button>)}
      </section>
    </div>
  );
}
