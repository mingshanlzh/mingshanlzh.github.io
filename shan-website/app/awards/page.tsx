import { Trophy, Coins, ExternalLink } from "lucide-react";
import awardsData from "@/data/awards.json";

export default function AwardsPage() {
  const { awards, grants } = awardsData;
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Awards &amp; Grants</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Fellowships, prizes, and research funding.
      </p>

      <section className="mb-10">
        <h2 className="section-title">Awards &amp; Prizes</h2>
        <div className="flex flex-col gap-4">
          {awards.map((a) => (
            <div key={a.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "#FEF3C720", color: "#D97706" }}>
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
            </div>
          ))}
        </div>
      </section>

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
                  {g.funder} · {g.period} · Role: {g.role}
                </p>
                {g.amount && (
                  <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--accent)" }}>{g.amount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
