import { PenLine, ArrowRight } from "lucide-react";
import Link from "next/link";

// Blog posts will eventually be loaded from /content/blog/*.mdx
const placeholderPosts = [
  {
    slug: "dcea-introduction",
    title: "What is Distributional Cost-Effectiveness Analysis — and why does it matter?",
    excerpt: "A plain-language introduction to DCEA and why standard cost-effectiveness analysis often misses the equity picture.",
    date: "2024-06-15",
    tags: ["DCEA", "equity", "methods"],
  },
];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Blog</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Thoughts on health economics, equity, methods, and academic life.
      </p>

      <div className="flex flex-col gap-6">
        {placeholderPosts.map((post) => (
          <article key={post.slug} className="card">
            <div className="flex gap-2 mb-2">
              {post.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              <Link href={`/blog/${post.slug}`} style={{ color: "var(--text-heading)" }}>
                {post.title}
              </Link>
            </h2>
            <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.date}</span>
              <Link href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                Read more <ArrowRight size={11} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="card mt-8" style={{ background: "var(--accent-bg)" }}>
        <div className="flex items-start gap-3">
          <PenLine size={18} style={{ color: "var(--accent)", marginTop: 2 }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            New posts are written via the Admin Panel. Each post is stored as an MDX file
            in <code className="text-xs">/content/blog/</code> and rendered here automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
