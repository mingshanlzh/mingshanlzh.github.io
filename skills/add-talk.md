# Skill: Add Talk / Presentation

## Trigger phrases
"add a talk", "new presentation", "I presented at", "conference presentation", "add a workshop"

## What to do
1. Read `data/talks.json`
2. Append a new entry at the TOP of the array
3. Use the schema below

## Schema
```json
{
  "id": "talk-slug-YYYY",
  "title": "Presentation title",
  "event": "Full conference / event name",
  "location": "City, Country",
  "date": "YYYY-MM-DD",
  "type": "conference",   // "conference" | "workshop" | "invited" | "seminar"
  "slides": "",           // path or URL to slides file
  "video": "",            // YouTube / Vimeo URL if available
  "abstract": ""          // optional 1–2 sentence abstract
}
```

## Also add a News item
After adding the talk, also add a matching entry to `data/news.json`:
```json
{
  "id": "news-talk-YYYY",
  "type": "talk",
  "title": "Presented at [Event]",
  "summary": "Presented '[title]' at [event], [location].",
  "date": "YYYY-MM-DD",
  "link": "",
  "tags": ["conference", "presentation"]
}
```

## After editing
```bash
git add data/talks.json data/news.json && git commit -m "feat: add talk at [event]" && git push
```
