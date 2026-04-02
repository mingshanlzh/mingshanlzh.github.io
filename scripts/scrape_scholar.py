#!/usr/bin/env python3
"""
Google Scholar scraper for Shan Jiang's academic website.
Runs weekly via GitHub Actions and updates data/publications.json.

Usage:
  python scripts/scrape_scholar.py

Requires:
  pip install scholarly

Environment:
  SCHOLAR_USER_ID — Google Scholar user ID (set in GitHub Actions env)
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from scholarly import scholarly, ProxyGenerator
except ImportError:
    print("scholarly not installed. Run: pip install scholarly")
    sys.exit(1)

SCHOLAR_USER_ID = os.environ.get("SCHOLAR_USER_ID", "TeSuUycAAAAJ")
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "publications.json"


def fetch_publications(user_id: str) -> list[dict]:
    """Fetch all publications for a Google Scholar user."""
    print(f"Fetching publications for Scholar ID: {user_id}")

    # Optional: use a proxy to avoid rate limits in CI
    # pg = ProxyGenerator()
    # pg.FreeProxies()
    # scholarly.use_proxy(pg)

    author = scholarly.search_author_id(user_id)
    scholarly.fill(author, sections=["publications"])

    publications = []
    for pub in author.get("publications", []):
        try:
            filled = scholarly.fill(pub)
            bib = filled.get("bib", {})

            # Build standardised record
            record = {
                "id":       bib.get("title", "").lower().replace(" ", "-")[:30],
                "title":    bib.get("title", ""),
                "authors":  bib.get("author", ""),
                "journal":  bib.get("journal") or bib.get("booktitle", ""),
                "year":     int(bib.get("pub_year", 0) or 0),
                "volume":   bib.get("volume", ""),
                "pages":    bib.get("pages", ""),
                "doi":      "",
                "url":      filled.get("pub_url", ""),
                "pdf":      "",
                "tags":     [],
                "featured": False,
                "type":     "journal",
                "citedBy":  filled.get("num_citations", 0),
                "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            }
            publications.append(record)
        except Exception as e:
            print(f"  Warning: could not fill pub — {e}")
            continue

    # Sort by year descending
    publications.sort(key=lambda p: p["year"], reverse=True)
    return publications


def preserve_manual_fields(new_pubs: list[dict], existing_pubs: list[dict]) -> list[dict]:
    """
    Merge new data with existing, preserving manually-set fields like
    pdf links, tags, featured flag, and type.
    """
    existing_map = {p["title"]: p for p in existing_pubs}
    for pub in new_pubs:
        if pub["title"] in existing_map:
            old = existing_map[pub["title"]]
            pub["pdf"]      = old.get("pdf", "")
            pub["tags"]     = old.get("tags", [])
            pub["featured"] = old.get("featured", False)
            pub["type"]     = old.get("type", "journal")
            pub["doi"]      = old.get("doi", "")
    return new_pubs


def main():
    # Load existing publications to preserve manual fields
    existing = []
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)

    # Fetch from Scholar
    new_pubs = fetch_publications(SCHOLAR_USER_ID)

    if not new_pubs:
        print("No publications fetched — aborting to avoid overwriting existing data.")
        sys.exit(0)

    # Merge
    merged = preserve_manual_fields(new_pubs, existing)

    # Write
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"Updated {OUTPUT_PATH} with {len(merged)} publications.")


if __name__ == "__main__":
    main()
