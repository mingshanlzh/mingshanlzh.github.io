import Link from "next/link";
import {
  BookOpen, Folder, Trophy, Users, Mic2,
  Wrench, ExternalLink, ArrowRight, Mail
} from "lucide-react";
import profile from "@/data/profile.json";
import news from "@/data/news.json";
import { formatDate } from "@/app/lib/utils";

const typeColor: Record<string, string> = {
  publication: "#5F8FA8",
  talk: "#A8C8C0",
  award: "#F6AD55",
  grant: "#68D391",
};

const socialLinks = [
  { label: "Google Scholar", href: profile.links.scholar },
  { label: "ORCID",         href: profile.links.orcid },
  { label: "ResearchGate",  href: profile.links.researchgate },
  { label: "Twitter / X",   href: profile.links.twitter },
  { label: "GitHub",        href: profile.links.github },
];

export default function HomePage() {
  const recentNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div style={{ maxWidth: "820px" }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-8 items-start mb-12">
        <div className="flex-shrink-0">
          <div
            className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold"
            style={{
              border: "3px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              background: "var(--accent-bg)",
              color: "var(--accent)",
            }}
          >
            SJ
          </div>
        </div>
        <div className="flex-1">
          <h1 style={{ color: "var(--text-heading)", marginBottom: "0.25rem" }}>
            {profile.name}
          </h1>
          <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: "0.5rem" }}>
            {profile.title} · {profile.institution}
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {profile.location}
          </p>
          <p style={{ color: "var(--text-body)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            {profile.researchStatement}
          </p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <ExternalLink size={12} />
                {s.label}
              </a>
            ))}
            <a href={`mailto:${profile.links.email}`}
              className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
              <Mail size={12} /> Email
            </a>
          </div>
        </div>
      </section>

      {/* ── At-a-glance stats ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: BookOpen, label: "Publications", value: profile.stats.publications, href: "/publications" },
          { icon: Folder,   label: "Projects",     value: profile.stats.workingProjects, href: "/projects" },
          { icon: Trophy,   label: "Active Grants", value: profile.stats.activeGrants,  href: "/awards" },
          { icon: Users,    label: "Students",      value: profile.stats.studentsSupervised, href: "/supervision" },
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

      {/* ── Research themes ───────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Research Themes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Distributional CEA",
              desc: "Developing and applying DCEA methods that reveal who gains and loses from health programmes, going beyond aggregate ICERs." },
            { title: "Methodological Innovation",
              desc: "Advancing health economic modelling including microsimulation, DES, agent-based models, and Bayesian approaches." },
            { title: "Global Health Equity",
              desc: "Applying equity-informative evaluations in low- and middle-income country contexts where distributional concerns are paramount." },
            { title: "Health Technology Assessment",
              desc: "Informing PBAC and MSAC submissions with rigorous economic evidence tailored to Australian HTA requirements." },
          ].map((theme) => (
            <div key={theme.title} className="card">
              <h3 className="font-semibold mb-1" style={{ color: "var(--text-heading)", fontSize: "0.95rem" }}>
                {theme.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{theme.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Professional roles ────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Professional Roles</h2>
        <div className="flex flex-col gap-2">
          {[
            "Convenor — AHES Health Equity SIG",
            "Secretary — ISPOR Health Preference Research SIG",
            "Peer Reviewer — Health Economics, Value in Health, PharmacoEconomics",
          ].map((role) => (
            <div key={role} className="flex items-center gap-3">
              <Wrench size={14} style={{ color: "var(--accent-soft)", flexShrink: 0 }} />
              <span className="text-sm" style={{ color: "var(--text-body)" }}>{role}</span>
            </div>
          ))}
        </div>
        <Link href="/services" className="btn btn-outline mt-4 inline-flex text-sm">
          View all services <ArrowRight size={14} />
        </Link>
      </section>

      {/* ── Recent news ───────────────────────────────────────────── */}
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
                <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
                  {item.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {formatDate(item.date)} · {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/news" className="btn btn-outline mt-4 inline-flex text-sm">
          All news <ArrowRight size={14} />
        </Link>
      </section>

      {/* ── Talks snapshot ────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Recent Talks</h2>
        <div className="flex flex-col gap-2 mb-4">
          {[
            "iHEA World Congress 2023 — Cape Town, South Africa",
            "AHES Annual Conference 2023 — Melbourne, Australia",
            "ISPOR Asia Pacific 2023 — Short course on DCEA",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <Mic2 size={14} style={{ color: "var(--accent-soft)", flexShrink: 0 }} />
              <span className="text-sm" style={{ color: "var(--text-body)" }}>{t}</span>
            </div>
          ))}
        </div>
        <Link href="/talks" className="btn btn-outline text-sm inline-flex">
          All talks &amp; presentations <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
