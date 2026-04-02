import { Star, Download, ExternalLink, Code } from "lucide-react";
import publications from "@/data/publications.json";

// Featured publications — those marked featured: true in publications.json
const featured = publications.filter((p) => p.featured);

// Placeholder research project pages
const researchProjects = [
  {
    id: "dcea-methods",
    title: "Distributional Cost-Effectiveness Analysis: A Methodological Framework",
    year: 2024,
    authors: "Shan Jiang",
    journal: "Health Economics",
    abstract:
      "This paper develops a unified methodological framework for DCEA, extending standard cost-effectiveness analysis to account for the distributional implications of health technologies across socioeconomic groups.",
    keyFindings: [
      "Proposes a standardised equity-weighting procedure adaptable to any ICER-based analysis.",
      "Demonstrates that DCEA can reverse conventional cost-effectiveness conclusions when equity weights are applied.",
      "Provides open-source R code and a reproducible workflow using the DCEA package.",
    ],
    figures: [
      { caption: "Equity-weighted NHB by SES quintile", placeholder: true },
      { caption: "DCEA cost-effectiveness plane", placeholder: true },
    ],
    code: "https://github.com/mingshanlzh/dcea-methods",
    data: "",
    pdf: "",
    doi: "",
    tags: ["DCEA", "equity", "methods", "R"],
  },
  {
    id: "genomic-screening",
    title: "Equity-Weighted CEA of Universal Newborn Genomic Screening",
    year: 2024,
    authors: "Shan Jiang, M Haas, R Viney",
    journal: "Value in Health",
    abstract:
      "We apply DCEA to universal newborn genomic screening in Australia, examining how costs and benefits are distributed across socioeconomic and Indigenous/non-Indigenous groups.",
    keyFindings: [
      "Standard ICER favours universal screening; DCEA reveals differential gains favouring disadvantaged groups.",
      "Equity weights amplify the cost-effectiveness conclusion when society assigns extra weight to health gains in lower SES groups.",
      "Interactive visualisations allow policymakers to explore outcomes under different social value assumptions.",
    ],
    figures: [
      { caption: "Distribution of net health benefit by SES quintile", placeholder: true },
      { caption: "Sensitivity of equity-weighted ICER to Atkinson epsilon", placeholder: true },
    ],
    code: "https://github.com/mingshanlzh/genomic-screening-dcea",
    data: "",
    pdf: "",
    doi: "",
    tags: ["DCEA", "genomics", "Australia", "equity"],
  },
];

function FigurePlaceholder({ caption }: { caption: string }) {
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center p-6 text-center"
      style={{
        background: "var(--accent-bg)",
        border: "2px dashed var(--border)",
        minHeight: "160px",
      }}
    >
      <Star size={20} style={{ color: "var(--accent)", marginBottom: "0.5rem" }} />
      <p className="text-xs font-medium" style={{ color: "var(--text-heading)" }}>{caption}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        Figure / interactive visualisation
      </p>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Selected Research</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Deep dives into my most important papers — with figures, key findings, code, and reproducible workflows.
        Inspired by how AI/ML researchers present their work.
      </p>

      {researchProjects.map((proj) => (
        <article key={proj.id} id={proj.id} className="card mb-10">
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {proj.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              <span className="tag" style={{ background: "#F0FFF4", color: "#38A169" }}>★ Featured</span>
            </div>
            <h2 style={{ fontSize: "1.2rem", lineHeight: 1.3, marginBottom: "0.3rem" }}>
              {proj.title}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {proj.authors} · <em>{proj.journal}</em> · {proj.year}
            </p>
          </div>

          {/* Abstract */}
          <p className="text-sm mb-6" style={{ color: "var(--text-body)", lineHeight: 1.75 }}>
            {proj.abstract}
          </p>

          {/* Key findings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ fontSize: "0.9rem", color: "var(--text-heading)" }}>
              Key Findings
            </h3>
            <ul className="flex flex-col gap-2">
              {proj.keyFindings.map((f, i) => (
                <li key={i} className="flex gap-3 items-start text-sm" style={{ color: "var(--text-body)" }}>
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Figures */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {proj.figures.map((fig) => (
              <FigurePlaceholder key={fig.caption} caption={fig.caption} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            {proj.pdf && (
              <a href={proj.pdf} download className="btn btn-primary text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Download size={12} /> PDF
              </a>
            )}
            {proj.doi && (
              <a href={`https://doi.org/${proj.doi}`} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <ExternalLink size={12} /> DOI
              </a>
            )}
            {proj.code && (
              <a href={proj.code} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Code size={12} /> Code
              </a>
            )}
            {proj.data && (
              <a href={proj.data} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline text-xs" style={{ padding: "0.3rem 0.8rem" }}>
                <Download size={12} /> Data
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
