import { Building2, ExternalLink } from "lucide-react";
import affiliations from "@/data/affiliations.json";

export default function AffiliationsPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Adjunct Affiliations</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Current institutional affiliations and collaborative appointments.
      </p>
      <div className="flex flex-col gap-4">
        {affiliations.map((a) => (
          <div key={a.id} className="card flex gap-4 items-start">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
              <Building2 size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{a.role}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.institution}</p>
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
    </div>
  );
}
