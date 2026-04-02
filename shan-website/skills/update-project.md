# Skill: Update Working Project

## Trigger phrases
"update project progress", "milestone reached", "project moved to", "new collaborator on project"

## What to do
Edit `app/projects/page.tsx` → find the `ALL_PROJECTS` array → update the relevant project.

## Milestone index (0-indexed)
```
0 = Protocol
1 = Data
2 = Analysis
3 = Draft
4 = Co-author review
5 = Revision
6 = Submitted
7 = Accepted
```

## Update a project milestone
Find the project by title and change its `milestone` value:
```ts
{
  id: "proj1",
  title: "...",
  milestone: 5,   // ← update this
  lastUpdated: "YYYY-MM-DD",  // ← also update this
  ...
}
```

## Add a new project
Add a new entry to the `ALL_PROJECTS` array:
```ts
{
  id: "projN",
  title: "Full project title",
  description: "One paragraph description.",
  milestone: 0,
  collaborators: ["email@inst.edu"],
  lastUpdated: "YYYY-MM-DD",
  tags: ["tag1", "tag2"],
}
```

## After editing
```bash
git add app/projects/page.tsx && git commit -m "feat: update project [name]" && git push
```
