import { formatDate } from "@/app/lib/utils";
import news from "@/data/news.json";
import { BookOpen, Mic2, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const typeIcon: Record<string, React.ElementType> = {
  publication: BookOpen,
  talk: Mic2,
  award: Trophy,
};
const typeColor: Record<string, string> = {
  publication: "#5F8FA8",
  talk: "#A8C8C0",
  award: "#F6AD55",
  grant: "#68D391",
};

export default function NewsPage() {
  const sorted = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>News &amp; Updates</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Latest news, publications, talks, and announcements.
      </p>

      <div className="flex flex-col gap-4">
        {sorted.map((item) => {
          const Icon = typeIcon[item.type] ?? ArrowRight;
          const colour = typeColor[item.type] ?? "#5F8FA8";
          return (
            <div key={item.id} className="card flex gap-4 items-start">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: colour + "20" }}>
                <Icon size={16} style={{ color: colour }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="tag" style={{ background: colour + "20", color: colour }}>
                    {item.type}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatDate(item.date)}
                  </span>
                </div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-heading)" }}>
                  {item.title}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {item.summary}
                </p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: "var(--accent)" }}>
                    Read more <ArrowRight size={11} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin entry point */}
      <div className="card mt-10" style={{ background: "var(--accent-bg)", borderColor: "var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <strong>Admin:</strong> Add new items via the{" "}
          <Link href="/admin" style={{ color: "var(--accent)" }}>Admin Panel → News Hub</Link>
          . New entries are automatically distributed to the relevant pages (Publications, Talks, Awards…).
        </p>
      </div>
    </div>
  );
}
