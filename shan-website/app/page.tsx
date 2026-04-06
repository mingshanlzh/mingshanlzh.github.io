"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BookOpen, Folder, Trophy, Users, ArrowRight,
  Edit2, Check, X, Camera
} from "lucide-react";
import profile from "@/data/profile.json";
import { useAdmin } from "@/app/lib/AdminContext";
import { supabase } from "@/app/lib/supabase";
import type { NewsItem } from "@/app/lib/supabase";

const typeColor: Record<string, string> = {
  publication: "#5F8FA8",
  talk: "#A8C8C0",
  award: "#F6AD55",
  grant: "#68D391",
};

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
}

// Social media icons as inline SVGs
function ScholarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L1 8l4 2.18v6L12 19l7-2.82v-6L21 9v7h2V8L12 2zm5 11.59L12 16.5l-5-2.91V11.1L12 14l5-2.9v2.49zM12 11.5L3.23 8 12 4.5 20.77 8 12 11.5z"/>
    </svg>
  );
}

function OrcidIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
      <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-16.7 61.3c5.2 0 9.4 4.2 9.4 9.4s-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4zM103 85h18v90h-18V85zm60.8 0c24.4 0 41.2 16.3 41.2 45s-17 44.9-41.5 44.9H138V85h25.8zm-7.8 73.3h7c14.7 0 23.5-8.6 23.5-28.3s-8.6-28.3-23.5-28.3h-7v56.6z"/>
    </svg>
  );
}

function ResearchGateIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
      <path d="M0 32v448h448V32H0zm262.2 334.4c-6.6 3.2-41.5 9.2-41.5-25.1V226.2c0-33.8 5.4-60.2 41.5-55.9v31.6c-18.7-.8-21.1 8.7-21.1 24.7v22.6h21.1v25H241v95.5c0 3.5 5.3 13.8 21.2 11.1v-10.4zM340 236.2c0 16-3.9 26.2-14.7 32.8 11.3 5.5 20.1 16.1 20.1 37.8 0 35.7-29.3 43.1-48.7 43.1-22.5 0-48.7-8-48.7-43.1 0-21.7 8.8-32.3 20.1-37.8-10.8-6.6-14.7-16.8-14.7-32.8 0-27.3 20.6-40.3 43.3-40.3 22.7 0 43.3 12.9 43.3 40.3zm-43.3 89.3c12.4 0 20.6-7 20.6-17.5s-8.2-17.5-20.6-17.5-20.6 7-20.6 17.5 8.2 17.5 20.6 17.5zm0-55.3c10.3 0 17-6.1 17-15.9s-6.7-15.9-17-15.9-17 6.1-17 15.9 6.7 15.9 17 15.9z"/>
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const SOCIAL_CONFIG = [
  { key: "scholar",      label: "Scholar",      Icon: ScholarIcon,      color: "#4285F4" },
  { key: "orcid",        label: "ORCID",        Icon: OrcidIcon,        color: "#A6CE39" },
  { key: "researchgate", label: "ResearchGate", Icon: ResearchGateIcon, color: "#00CCBB" },
  { key: "twitter",      label: "X / Twitter",  Icon: XIcon,            color: "#000000" },
  { key: "github",       label: "GitHub",       Icon: GitHubIcon,       color: "#24292E" },
  { key: "linkedin",     label: "LinkedIn",     Icon: LinkedInIcon,     color: "#0077B5" },
];

/** Crop image to a square (centre crop), no circle clip. Returns a data URL. */
function squareCropPhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = 300; canvas.height = 300;
        const ctx = canvas.getContext("2d")!;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 300, 300);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Parse default city/country from profile.location ("Sydney, Australia")
function parseLocation(loc: string): [string, string] {
  const parts = loc.split(",").map((s) => s.trim());
  return [parts[0] ?? "", parts.slice(1).join(", ") ?? ""];
}

export default function HomePage() {
  const { isAdmin } = useAdmin();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [intro, setIntro] = useState(profile.researchStatement);
  const [editingIntro, setEditingIntro] = useState(false);
  const [introDraft, setIntroDraft] = useState(profile.researchStatement);
  const [links, setLinks] = useState<Record<string, string>>({ ...profile.links, linkedin: "" });
  const [editingLinks, setEditingLinks] = useState(false);
  const [linksDraft, setLinksDraft] = useState<Record<string, string>>({ ...profile.links, linkedin: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile identity fields
  const [defaultCity, defaultCountry] = parseLocation(profile.location);
  const [position, setPosition] = useState(profile.title);
  const [affiliation, setAffiliation] = useState(profile.institution);
  const [locationCity, setLocationCity] = useState(defaultCity);
  const [locationCountry, setLocationCountry] = useState(defaultCountry);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    position: profile.title,
    affiliation: profile.institution,
    locationCity: defaultCity,
    locationCountry: defaultCountry,
  });

  // News from Supabase
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);

  // Real-time stats from Supabase
  const [stats, setStats] = useState({ publications: 0, projects: 0, grants: 0, team: 0 });

  useEffect(() => {
    // Load from localStorage
    try {
      const savedIntro = localStorage.getItem("sj_intro");
      if (savedIntro) { setIntro(savedIntro); setIntroDraft(savedIntro); }
      const savedLinks = localStorage.getItem("sj_links");
      if (savedLinks) {
        const parsed = JSON.parse(savedLinks);
        setLinks(parsed); setLinksDraft(parsed);
      }
      const savedPos = localStorage.getItem("sj_position");
      const savedAff = localStorage.getItem("sj_affiliation");
      const savedCity = localStorage.getItem("sj_location_city");
      const savedCountry = localStorage.getItem("sj_location_country");
      const p = savedPos ?? profile.title;
      const a = savedAff ?? profile.institution;
      const c = savedCity ?? defaultCity;
      const co = savedCountry ?? defaultCountry;
      setPosition(p); setAffiliation(a); setLocationCity(c); setLocationCountry(co);
      setProfileDraft({ position: p, affiliation: a, locationCity: c, locationCountry: co });
    } catch {}

    // Load profile photo — try Supabase first, then localStorage
    async function loadPhoto() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "profile_photo")
          .single();
        if (data?.value) {
          setProfilePhoto(data.value);
          return;
        }
      } catch {}
      try {
        const local = localStorage.getItem("sj_profile_photo");
        if (local) setProfilePhoto(local);
      } catch {}
    }
    loadPhoto();
  }, [defaultCity, defaultCountry]);

  // Fetch news from Supabase
  useEffect(() => {
    supabase
      .from("news_items")
      .select("*")
      .order("item_date", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setRecentNews(data as NewsItem[]);
      });
  }, []);

  // Fetch real-time stats from Supabase
  useEffect(() => {
    async function fetchStats() {
      try {
        const [pubsRes, projectsRes, grantsRes] = await Promise.all([
          supabase.from("publications").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("awards").select("id", { count: "exact", head: true }).eq("entry_type", "grant"),
        ]);
        setStats({
          publications: pubsRes.count ?? 0,
          projects: projectsRes.count ?? 0,
          grants: grantsRes.count ?? 0,
          team: 0,
        });
      } catch {}
    }
    fetchStats();
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const cropped = await squareCropPhoto(file);
    setProfilePhoto(cropped);
    // Save to localStorage (fast, same-browser)
    try { localStorage.setItem("sj_profile_photo", cropped); } catch {}
    // Save to Supabase (cross-browser visibility)
    try {
      await supabase.from("site_settings").upsert({ key: "profile_photo", value: cropped });
    } catch {}
  }

  function saveIntro() {
    setIntro(introDraft);
    localStorage.setItem("sj_intro", introDraft);
    setEditingIntro(false);
  }

  function saveLinks() {
    setLinks(linksDraft);
    localStorage.setItem("sj_links", JSON.stringify(linksDraft));
    setEditingLinks(false);
  }

  function saveProfile() {
    setPosition(profileDraft.position);
    setAffiliation(profileDraft.affiliation);
    setLocationCity(profileDraft.locationCity);
    setLocationCountry(profileDraft.locationCountry);
    localStorage.setItem("sj_position", profileDraft.position);
    localStorage.setItem("sj_affiliation", profileDraft.affiliation);
    localStorage.setItem("sj_location_city", profileDraft.locationCity);
    localStorage.setItem("sj_location_country", profileDraft.locationCountry);
    setEditingProfile(false);
  }

  const activeSocialLinks = SOCIAL_CONFIG.filter(({ key }) => links[key]);

  return (
    <div style={{ maxWidth: "820px" }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-8 items-start mb-12">
        <div className="flex-shrink-0 relative">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Shan Jiang"
              className="w-32 h-32 object-cover"
              style={{
                borderRadius: "16px",
                border: "3px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }} />
          ) : (
            <div
              className="w-32 h-32 overflow-hidden flex items-center justify-center text-3xl font-bold"
              style={{
                borderRadius: "16px",
                border: "3px solid var(--border)",
                boxShadow: "var(--shadow-md)",
                background: "var(--accent-bg)",
                color: "var(--accent)",
              }}>
              SJ
            </div>
          )}
          {isAdmin && (
            <>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <button onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 p-1.5 rounded-full"
                style={{ background: "var(--accent)", color: "white", border: "2px solid white" }}
                title="Upload photo">
                <Camera size={12} />
              </button>
            </>
          )}
        </div>

        <div className="flex-1">
          <h1 style={{ color: "var(--text-heading)", marginBottom: "0.25rem" }}>{profile.name}</h1>

          {/* Position / Affiliation / Location — editable */}
          {editingProfile && isAdmin ? (
            <div className="card mb-3" style={{ border: "1.5px solid var(--accent)", padding: "0.75rem 1rem" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>Edit Profile Details</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Position / Title", key: "position" as const, placeholder: "e.g. PhD Candidate" },
                  { label: "Affiliation",       key: "affiliation" as const, placeholder: "e.g. Macquarie University" },
                  { label: "City",              key: "locationCity" as const, placeholder: "e.g. Sydney" },
                  { label: "Country",           key: "locationCountry" as const, placeholder: "e.g. Australia" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs w-28 flex-shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <input
                      value={profileDraft[key]}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="rounded-lg px-2 py-1 text-xs flex-1"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveProfile} className="btn btn-primary text-xs"><Check size={12} /> Save</button>
                <button onClick={() => { setEditingProfile(false); setProfileDraft({ position, affiliation, locationCity, locationCountry }); }}
                  className="btn btn-outline text-xs"><X size={12} /> Cancel</button>
              </div>
            </div>
          ) : (
            <div className="relative mb-3 group">
              <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: "0.25rem" }}>
                {position} · {affiliation}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {locationCity}{locationCountry ? `, ${locationCountry}` : ""}
              </p>
              {isAdmin && (
                <button
                  onClick={() => { setProfileDraft({ position, affiliation, locationCity, locationCountry }); setEditingProfile(true); }}
                  className="absolute -top-1 -right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--accent-bg)" }}
                  title="Edit position / location">
                  <Edit2 size={12} style={{ color: "var(--accent)" }} />
                </button>
              )}
            </div>
          )}

          {/* Research statement */}
          {editingIntro && isAdmin ? (
            <div className="mb-4">
              <textarea rows={4} value={introDraft} onChange={(e) => setIntroDraft(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1.5px solid var(--accent)", outline: "none", background: "var(--bg-primary)", resize: "vertical", lineHeight: 1.7 }} />
              <div className="flex gap-2 mt-2">
                <button onClick={saveIntro} className="btn btn-primary text-xs"><Check size={12} /> Save</button>
                <button onClick={() => { setEditingIntro(false); setIntroDraft(intro); }} className="btn btn-outline text-xs"><X size={12} /> Cancel</button>
              </div>
            </div>
          ) : (
            <div className="relative mb-4 group">
              <p style={{ color: "var(--text-body)", lineHeight: 1.7 }}>{intro}</p>
              {isAdmin && (
                <button onClick={() => setEditingIntro(true)}
                  className="absolute -top-1 -right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--accent-bg)" }}>
                  <Edit2 size={12} style={{ color: "var(--accent)" }} />
                </button>
              )}
            </div>
          )}

          {/* Social links */}
          <div className="flex flex-wrap gap-2 items-center">
            {activeSocialLinks.map(({ key, label, Icon, color }) => (
              <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline text-xs flex items-center gap-1.5"
                style={{ padding: "0.3rem 0.7rem", color, borderColor: color + "44" }}>
                <Icon size={13} />
                {label}
              </a>
            ))}
            {isAdmin && (
              <button onClick={() => setEditingLinks(!editingLinks)}
                className="btn btn-outline text-xs"
                style={{ padding: "0.3rem 0.7rem", color: "var(--text-muted)" }}>
                <Edit2 size={12} /> {editingLinks ? "Close" : "Edit links"}
              </button>
            )}
          </div>

          {/* Edit social links form */}
          {editingLinks && isAdmin && (
            <div className="card mt-4" style={{ border: "1.5px solid var(--accent)" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-heading)" }}>Edit Social Links</p>
              <div className="flex flex-col gap-2">
                {SOCIAL_CONFIG.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs w-28 flex-shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <input value={linksDraft[key] || ""} onChange={(e) => setLinksDraft({ ...linksDraft, [key]: e.target.value })}
                      placeholder={`https://...`} className="rounded-lg px-2 py-1 text-xs flex-1"
                      style={{ border: "1.5px solid var(--border)", outline: "none", background: "var(--bg-primary)" }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveLinks} className="btn btn-primary text-xs"><Check size={12} /> Save</button>
                <button onClick={() => { setEditingLinks(false); setLinksDraft(links); }} className="btn btn-outline text-xs"><X size={12} /> Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── At-a-glance stats ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: BookOpen, label: "Publications",  value: stats.publications, href: "/publications" },
          { icon: Folder,   label: "Active Projects", value: stats.projects,  href: "/projects" },
          { icon: Trophy,   label: "Active Grants", value: stats.grants,      href: "/awards" },
          { icon: Users,    label: "Team Members",  value: stats.team,        href: "/supervision" },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href}
            className="card text-center" style={{ textDecoration: "none" }}>
            <div className="flex justify-center mb-2">
              <Icon size={22} style={{ color: "var(--accent)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-heading)" }}>{value}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
          </Link>
        ))}
      </section>

      {/* ── Recent news (from Supabase) ───────────────────────────── */}
      {recentNews.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title">Latest News</h2>
          <div className="flex flex-col gap-3">
            {recentNews.map((item) => (
              <div key={item.id} className="card flex gap-4 items-start">
                <span className="tag mt-0.5 flex-shrink-0"
                  style={{
                    background: (typeColor[item.type] ?? "#5F8FA8") + "22",
                    color: typeColor[item.type] ?? "#5F8FA8",
                  }}>
                  {item.type}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatDate(item.item_date)} · {item.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/news" className="btn btn-outline mt-4 inline-flex text-sm">
            All news <ArrowRight size={14} />
          </Link>
        </section>
      )}
    </div>
  );
}
