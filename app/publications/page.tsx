import { ExternalLink, Download, BookOpen } from "lucide-react";
import publications from "@/data/publications.json";

type Pub = typeof publications[0];

function groupByYear(pubs: Pub[]) {
  const map: Record<number, Pub[]> = {};
  for (const p of pubs) {
    if (!map[p.year]) map[p.year] = [];
    map[p.year].push(p);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function PublicationsPage() {
  const grouped = groupByYear(publications);

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Publications</h1>
      <p className="mb-2" style={{ color: "var(--text-muted)" }}>
        Also see my full list on{" "}
        <a href="https://scholar.google.com/citations?user=TeSuUycAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
          Google Scholar
        </a>
        {" "}(auto-updated weekly).
      </p>

      {/* Scholar embed notice */}
      <div className="card mb-8" style={{ background: "var(--accent-bg)", border: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <BookOpen size={18} style={{ color: "var(--accent)", marginTop: 2 }} />
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
              Live Scholar Sync
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              This page is refreshed weekly via a GitHub Actions scraper that pulls citation data from Google Scholar.
              Add new papers by logging into the Admin panel → News Hub.
            </p>
          </div>
        </div>
      </div>

      {grouped.map(({ year, items }) => (
        <section key={year} className="mb-10">
          <h2 className="section-title">{year}</h2>
          <div className="flex flex-col gap-4">
            {items.map((pub) => (
              <div key={pub.id} className="card">
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-heading)" }}>
                      {pub.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {pub.authors}
                    </p>
                    <p className="text-xs mt-1 italic" style={{ color: "var(--accent)" }}>
                      {pub.journal}
                      {pub.volume && `, ${pub.volume}`}
                      {pub.pages && `, ${pub.pages}`}
                      {" · "}{pub.year}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pub.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      <ExternalLink size={11} /> View
                    </a>
                  )}
                  {pub.pdf && (
                    <a href={pub.pdf} download
                      className="btn btn-primary text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      <Download size={11} /> PDF
                    </a>
                  )}
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem" }}>
                      DOI
                    </a>
                  )}
                  {pub.featured && (
                    <a href={`/research#${pub.id}`}
                      className="btn btn-outline text-xs" style={{ padding: "0.25rem 0.6rem", color: "var(--accent-soft)", borderColor: "var(--accent-soft)" }}>
                      ★ Research page
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
