import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import supervision from "@/data/supervision.json";

export default function SupervisionPage() {
  const active = supervision.filter((s) => s.status === "active");
  const past   = supervision.filter((s) => s.status !== "active");

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Supervision</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Current and past students and research assistants.
      </p>

      {active.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title">Current</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {active.map((s) => (
              <div key={s.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{s.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.degree} · {s.institution}</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <strong>Topic:</strong> {s.topic}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <strong>Period:</strong> {s.period}
                </p>
                {s.projectId && (
                  <Link href={`/projects#${s.projectId}`}
                    className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: "var(--accent)" }}>
                    View project <ArrowRight size={11} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="section-title">Past</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((s) => (
              <div key={s.id} className="card" style={{ opacity: 0.8 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "var(--border)", color: "var(--text-muted)" }}>
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{s.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.degree} · {s.institution} · {s.period}</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.topic}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="card mt-8" style={{ background: "var(--accent-bg)" }}>
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
    </div>
  );
}
