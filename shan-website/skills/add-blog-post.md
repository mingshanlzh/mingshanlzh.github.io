# Skill: Add Blog Post

## Trigger phrases
"write a blog post", "new blog post", "post about", "I want to write about"

## What to do
1. Create a new file at `content/blog/[slug].md` (create the directory if needed)
2. Use the frontmatter + content format below
3. Add a placeholder entry to the posts array in `app/blog/page.tsx`

## File format: `content/blog/slug.md`
```markdown
---
title: "Post title here"
excerpt: "One sentence summary shown in the list view."
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
---

Your full blog post content here in Markdown.

Use ## for subheadings, **bold**, *italic*, code blocks, etc.
```

## Add to blog page
In `app/blog/page.tsx`, add to the `placeholderPosts` array:
```ts
{
  slug: "your-slug",
  title: "Post title",
  excerpt: "One sentence summary.",
  date: "YYYY-MM-DD",
  tags: ["tag1", "tag2"],
}
```

## After editing
```bash
git add content/blog/ app/blog/page.tsx && git commit -m "blog: [post title]" && git push
```
