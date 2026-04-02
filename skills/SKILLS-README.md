# Claude Maintenance Skills — Shan Jiang Academic Website

This `/skills/` directory contains instructions for Claude to maintain and update the website.
In any future conversation, tell Claude: "read the skill for [task]" or just describe what you want and Claude will use the appropriate skill automatically.

## Available Skills

| Skill file | When to use |
|---|---|
| `add-publication.md` | Add a new paper to the publications list |
| `add-talk.md` | Add a new talk or presentation |
| `add-news.md` | Add a news/update item |
| `add-blog-post.md` | Write and add a new blog post |
| `update-project.md` | Update a working project milestone |
| `update-profile.md` | Update bio, title, affiliations, photo |
| `mute-page.md` | Hide or show a page |
| `add-award.md` | Add a new award or grant |
| `add-service.md` | Add a new service role |

## How This Works

Each skill file tells Claude:
1. Which data file to edit
2. What schema/fields are required
3. How to format the entry
4. The git commands to deploy

After Claude edits the file, run:
```bash
git add . && git commit -m "your message" && git push
```
GitHub Actions will automatically redeploy the site.
