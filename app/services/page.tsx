import { Wrench, ExternalLink } from "lucide-react";
import services from "@/data/services.json";

export default function ServicesPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Services</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Professional service roles in academic and research communities.
      </p>
      <div className="flex flex-col gap-4">
        {services.map((s) => (
          <div key={s.id} className="card flex gap-4 items-start">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
              <Wrench size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{s.role}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {s.organisation} · {s.period}
              </p>
              {s.link && (
                <a href={s.link} target="_blank" rel="noopener noreferrer"
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
