# Skill: Add Publication

## Trigger phrases
"add a paper", "new publication", "paper accepted", "add a pub", "new paper in [journal]"

## What to do
1. Read `data/publications.json`
2. Append a new entry at the TOP of the array (most recent first)
3. Use the schema below — fill in all available fields, use `""` for unknown
4. Set `featured: true` only for first-author, high-impact papers the user wants a research page for

## Schema
```json
{
  "id": "short-slug-from-title",          // e.g. "dcea-genomics-2024"
  "title": "Full paper title",
  "authors": "Jiang S, Co-Author A, ...", // Surname Initial format
  "journal": "Journal name",
  "year": 2024,                           // integer
  "volume": "",
  "pages": "",
  "doi": "",                              // just the DOI, not the full URL
  "url": "",                              // full URL if available
  "pdf": "",                              // path like "/papers/slug.pdf" or external URL
  "tags": ["DCEA", "equity"],             // 2–5 relevant tags
  "featured": false,                      // true = gets a research page
  "type": "journal",                      // "journal" | "conference" | "preprint" | "book-chapter"
  "citedBy": 0
}
```

## After editing
Tell the user to run:
```bash
git add data/publications.json && git commit -m "feat: add [paper title]" && git push
```
