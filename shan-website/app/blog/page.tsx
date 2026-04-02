import { PenLine } from "lucide-react";

// Blog posts are stored as MDX files in /content/blog/
// When you have posts, import them here or load via a utility function.
// For now the list is empty — add posts through the Claude Desktop workflow below.
const posts: { slug: string; title: string; excerpt: string; date: string; tags: string[] }[] = [];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Blog</h1>

      {posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="card">
              <div className="flex gap-2 mb-2 flex-wrap">
                {post.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <h2 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>
                <a href={`/blog/${post.slug}`} style={{ color: "var(--text-heading)" }}>
                  {post.title}
                </a>
              </h2>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.date}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="card" style={{ background: "var(--accent-bg)" }}>
          <div className="flex items-start gap-3">
            <PenLine size={18} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-heading)" }}>
                No posts yet
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                To publish a post, share a draft or idea with Claude — even a rough note or voice
                transcript — and ask Claude to polish it, assign tags, and save it as an MDX file
                in <code className="text-xs">/content/blog/</code>. Then run{" "}
                <code className="text-xs">git push</code> to deploy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
