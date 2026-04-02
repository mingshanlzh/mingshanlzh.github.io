# How to Deploy Your Website
### Shan Jiang Academic Website — Step-by-Step Guide

---

## Your website address (free, no purchase needed)

> **https://mingshanlzh.github.io**

This is a permanent, real URL powered by GitHub Pages. No cost. No expiry.
You can add a custom domain (e.g. `shanjiang.com`) later for ~AU$20/year — optional, no rush.

---

## What you need to do once

### STEP 1 — Install Node.js (5 min)

1. Go to **https://nodejs.org**
2. Click the big green **LTS** button to download
3. Run the installer — accept all defaults
4. To verify: open Command Prompt (`Win+R` → type `cmd` → Enter), type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` ✅

---

### STEP 2 — Install Git (5 min)

1. Go to **https://git-scm.com/download/win**
2. Download and run the installer — accept all defaults
3. To verify: in Command Prompt, type:
   ```
   git --version
   ```
   You should see something like `git version 2.x.x` ✅

---

### STEP 3 — Create your GitHub repository (3 min)

1. Go to **https://github.com** and sign in as `mingshanlzh`
2. Click the **+** button (top right corner) → **New repository**
3. Repository name: type exactly →  **`mingshanlzh.github.io`**
   *(This special name tells GitHub to host it as your personal website)*
4. Set visibility to **Public**
5. Leave all checkboxes **unchecked** (no README, no .gitignore, no licence)
6. Click **Create repository**

Leave this page open — you'll need the URL shown on screen.

---

### STEP 4 — Push your website code to GitHub (10 min)

Open **Command Prompt** and run these commands **one at a time**.
Copy each line, paste it, press Enter, wait for it to finish, then do the next.

```cmd
cd "C:\Users\MQ10007557\Dropbox\personal website"
```
```cmd
npm install
```
*(Downloads code libraries — takes 1–2 minutes, lots of text is normal)*

```cmd
git init
```
```cmd
git add .
```
```cmd
git commit -m "initial website launch"
```
```cmd
git branch -M main
```
```cmd
git remote add origin https://github.com/mingshanlzh/mingshanlzh.github.io.git
```
```cmd
git push -u origin main
```

**If asked for a password:** GitHub no longer accepts passwords here.
Instead, go to: GitHub → your profile photo (top right) → **Settings** →
scroll to **Developer settings** (very bottom of left sidebar) →
**Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)** →
give it any name → tick the **repo** checkbox → click **Generate token** →
**copy the token immediately** (you won't see it again) →
use this token as your "password" when git asks.

---

### STEP 5 — Enable GitHub Pages (2 min)

1. Go to your repo: **https://github.com/mingshanlzh/mingshanlzh.github.io**
2. Click **Settings** (top menu bar)
3. Click **Pages** (left sidebar, under "Code and automation")
4. Under "Build and deployment" → Source → select **GitHub Actions**
5. That's it — no further clicks needed

GitHub will now automatically build and deploy your site.
Watch for a green tick ✅ to appear on the repo's main page (takes 2–3 minutes).

---

### STEP 6 — Visit your live website 🎉

Go to: **https://mingshanlzh.github.io**

You should see your homepage with the dark sidebar, your name, research statement,
stats, and all 15 pages in the navigation.

---

## Optional: Connect the backend (Supabase) — ~20 min

This unlocks: collaborator login for Working Projects, file uploads,
contact form storage, and CV request approvals.

### 7a — Create a Supabase account
1. Go to **https://supabase.com** → Sign up (use "Continue with GitHub" for easy login)
2. Click **New project**
3. Name: `shan-website` (or anything)
4. Set a strong password (save it somewhere)
5. Region: **Southeast Asia (Sydney)** — closest to Australia
6. Click **Create new project** — wait ~2 minutes

### 7b — Set up the database
1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Open the file `supabase/schema.sql` from your website folder (open in Notepad)
3. Select all the text → copy → paste into the SQL Editor
4. Click **Run**
5. You should see "Success. No rows returned" ✅

### 7c — Get your API keys
1. Go to **Settings** (gear icon, bottom left) → **API**
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`)
3. Copy the **anon public** key (long string of letters/numbers)

### 7d — Add keys to GitHub
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** — add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: your Project URL
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your anon key
3. Go to the **Actions** tab in your repo → click the most recent workflow run → **Re-run all jobs**

Your site will redeploy in ~2 minutes with all dynamic features active.

---

## How to update your website after today

Once live, you never need to touch code. Just tell Claude what you want:

| You say | Claude does |
|---|---|
| "New paper accepted: [title], [journal], [authors]" | Updates `data/publications.json` |
| "I presented at AHES 2025 in Melbourne, title was X" | Updates `data/talks.json` + news |
| "Update the genomics project to milestone 6 (submitted)" | Updates the projects page |
| "Write a blog post about DCEA for policymakers" | Creates the post file |
| "Change my title to Research Fellow" | Updates `data/profile.json` |

Then run these two lines in Command Prompt from your website folder:
```cmd
git add .
git commit -m "describe what you changed"
git push
```
GitHub deploys the update automatically within 2–3 minutes.

---

## Quick reference

| Thing | Location |
|---|---|
| Your website folder | `C:\Users\MQ10007557\Dropbox\personal website` |
| Your live website | https://mingshanlzh.github.io |
| Your GitHub repo | https://github.com/mingshanlzh/mingshanlzh.github.io |
| Your Supabase dashboard | https://app.supabase.com |
| Content data files | `data/` folder (JSON files) |
| Page code | `app/` folder (one subfolder per page) |
| Claude maintenance skills | `skills/` folder |

---

*Last updated: March 2026 — built with Next.js 16, Tailwind CSS, Supabase*
