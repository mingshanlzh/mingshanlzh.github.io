# Skill: Update Profile

## Trigger phrases
"update my bio", "change my title", "update my position", "new affiliation", "update the homepage"

## What to do
Edit `data/profile.json`.

## Fields reference
```json
{
  "name": "Shan Jiang",
  "pronouns": "he/him",
  "title": "PhD Candidate",             // e.g. "Research Fellow", "Senior Lecturer"
  "institution": "...",
  "location": "Sydney, Australia",
  "photo": "/images/profile.jpg",       // place new photo in public/images/
  "bio": "Full bio paragraph",
  "researchStatement": "2–4 sentence statement",
  "links": {
    "scholar": "...",
    "orcid": "...",
    "researchgate": "...",
    "twitter": "...",
    "github": "...",
    "email": "..."
  },
  "stats": {
    "publications": 12,                 // update manually or Scholar scraper updates this
    "workingProjects": 6,
    "activeGrants": 2,
    "studentsSupervised": 4
  }
}
```

## After editing
```bash
git add data/profile.json && git commit -m "chore: update profile" && git push
```
