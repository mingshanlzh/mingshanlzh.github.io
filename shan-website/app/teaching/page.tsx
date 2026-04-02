import { GraduationCap, Download } from "lucide-react";
import teaching from "@/data/teaching.json";

export default function TeachingPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Teaching</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        University courses, guest lectures, conference short courses, and workshops.
      </p>
      <div className="flex flex-col gap-6">
        {teaching.map((course) => (
          <div key={course.id} className="card">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "var(--accent-bg)" }}>
                <GraduationCap size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>{course.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                  {course.institution} · {course.level} · {course.period}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Role: {course.role}
                </p>
                {course.description && (
                  <p className="text-sm mt-2" style={{ color: "var(--text-body)" }}>{course.description}</p>
                )}
                {course.slides && (
                  <div className="mt-3">
                    <a href={course.slides} download
                      className="btn btn-primary text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      <Download size={11} /> Download Slides
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
