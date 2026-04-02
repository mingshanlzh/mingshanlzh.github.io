import { Mic2, Video, Download, ExternalLink, MapPin, Calendar } from "lucide-react";
import talks from "@/data/talks.json";
import { formatDate } from "@/app/lib/utils";

const typeLabel: Record<string, string> = {
  conference: "Conference",
  workshop: "Workshop / Short Course",
  invited: "Invited Talk",
  seminar: "Seminar",
};

type Talk = typeof talks[0];

function groupByYear(arr: Talk[]) {
  const map: Record<number, Talk[]> = {};
  for (const t of arr) {
    const yr = new Date(t.date).getFullYear();
    if (!map[yr]) map[yr] = [];
    map[yr].push(t);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function TalksPage() {
  const grouped = groupByYear([...talks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Talks &amp; Presentations</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Conference presentations, invited talks, workshop lectures, and short courses.
      </p>

      {grouped.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="section-title">{year}</h2>
          <div className="flex flex-col gap-4">
            {items.map((talk) => (
              <div key={talk.id} className="card">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Mic2 size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-heading)" }}>
                      {talk.title}
                    </p>
                    <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>
                      {talk.event}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <MapPin size={11} /> {talk.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Calendar size={11} /> {formatDate(talk.date)}
                      </span>
                      <span className="tag">{typeLabel[talk.type] ?? talk.type}</span>
                    </div>
                    {talk.abstract && (
                      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{talk.abstract}</p>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {talk.slides && (
                        <a href={talk.slides} download className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                          <Download size={11} /> Slides
                        </a>
                      )}
                      {talk.video && (
                        <a href={talk.video} target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                          <Video size={11} /> Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
