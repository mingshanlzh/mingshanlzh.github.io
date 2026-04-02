import { Tv2, ExternalLink, Radio, Newspaper } from "lucide-react";

const mediaItems = [
  // Placeholder — populate via Admin panel or edit data/media.json
];

export default function MediaPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Media Exposure</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Interviews, podcast appearances, press coverage, and other media featuring my research or my group.
      </p>

      {mediaItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--accent-bg)" }}>
          <Tv2 size={36} style={{ color: "var(--accent)", margin: "0 auto 1rem" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Media items will appear here. Add them via the Admin Panel → News Hub by entering a record of type &ldquo;media&rdquo;.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* rendered when items exist */}
        </div>
      )}

      <div className="card mt-8" style={{ border: "1px dashed var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <strong>For media inquiries:</strong> Please contact me at{" "}
          <a href="mailto:shan.jiang@mq.edu.au" style={{ color: "var(--accent)" }}>shan.jiang@mq.edu.au</a>.
        </p>
      </div>
    </div>
  );
}
