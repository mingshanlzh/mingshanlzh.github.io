#!/usr/bin/env python3
"""
Google Scholar scraper using SerpApi — works reliably from GitHub Actions.

Requires:
  pip install requests

  Environment variables (set as GitHub Actions secrets):
    SERPAPI_KEY      — SerpApi API key (free tier: 100 searches/month)
      SCHOLAR_USER_ID  — Google Scholar user ID (default: TeSuUycAAAAJ)
      """

import json
import os
import sys
import time
import requests
from pathlib import Path
from datetime import datetime

SERPAPI_KEY = os.environ.get("SERPAPI_KEY", "")
SCHOLAR_USER_ID = os.environ.get("SCHOLAR_USER_ID", "TeSuUycAAAAJ")
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "publications.json"

SERPAPI_URL = "https://serpapi.com/search"


def fetch_author_publications(user_id: str) -> list[dict]:
      """Fetch all publications for a Google Scholar author via SerpApi."""
      print(f"Fetching publications for Scholar ID: {user_id}")

    publications = []
    start = 0
    page_size = 100

    while True:
              params = {
                            "engine": "google_scholar_author",
                            "author_id": user_id,
                            "api_key": SERPAPI_KEY,
                            "num": page_size,
                            "start": start,
                            "sort": "pubdate",
              }

        try:
                      resp = requests.get(SERPAPI_URL, params=params, timeout=30)
                      resp.raise_for_status()
                      data = resp.json()
except Exception as e:
              print(f"  Error fetching page starting at {start}: {e}")
              break

        if "error" in data:
                      print(f"  SerpApi error: {data['error']}")
                      break

        articles = data.get("articles", [])
        if not articles:
                      break

        for article in articles:
                      year_raw = article.get("year", "") or ""
                      try:
                                        year = int(str(year_raw).strip())
except (ValueError, TypeError):
                year = 0

            pub = {
                              "id": (article.get("title", "") or "").lower().replace(" ", "-")[:40].strip("-"),
                              "title": article.get("title", ""),
                              "authors": article.get("authors", ""),
                              "journal": article.get("publication", ""),
                              "year": year,
                              "volume": "",
                              "pages": "",
                              "doi": "",
                              "url": article.get("link", ""),
                              "pdf": "",
                              "tags": [],
                              "featured": False,
                              "pub_type": "journal",
                              "status": "published",
                              "sort_order": 0,
                              "citedBy": article.get("cited_by", {}).get("value", 0),
                              "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            }
            publications.append(pub)

        print(f"  Fetched {len(articles)} publications (start={start})")

        # Check if there are more pages
        if len(articles) < page_size:
                      break
                  start += page_size
        time.sleep(1)  # polite delay

    publications.sort(key=lambda p: p["year"], reverse=True)
    print(f"Total fetched: {len(publications)} publications")
    return publications


def merge_with_existing(new_pubs: list[dict], existing_pubs: list[dict]) -> list[dict]:
      """
          Merge new data from Scholar with existing curated data.
              Preserves manually-set fields: pdf, tags, featured, pub_type,
                  doi, volume, pages, status, sort_order, highlight fields.
                      Adds new publications and updates citedBy counts.
                          """
      existing_map = {p["title"].strip().lower(): p for p in existing_pubs}
      result = []

    for pub in new_pubs:
              key = pub["title"].strip().lower()
              if key in existing_map:
                            old = existing_map[key]
                            # Preserve all manual curation fields
                            pub["pdf"] = old.get("pdf", "")
            pub["tags"] = old.get("tags", [])
            pub["featured"] = old.get("featured", False)
            pub["pub_type"] = old.get("pub_type", old.get("type", "journal"))
            pub["doi"] = old.get("doi", "")
            pub["volume"] = old.get("volume", pub.get("volume", ""))
            pub["pages"] = old.get("pages", pub.get("pages", ""))
            pub["status"] = old.get("status", "published")
            pub["sort_order"] = old.get("sort_order", 0)
            # Preserve highlight fields if they exist
            if "highlight_text" in old:
                              pub["highlight_text"] = old["highlight_text"]
                          if "highlight_labels" in old:
                                            pub["highlight_labels"] = old["highlight_labels"]
                                        if "highlight_pdf" in old:
                                                          pub["highlight_pdf"] = old["highlight_pdf"]
                                                      # Keep old id if it was manually set and is more descriptive
                                                      if old.get("id") and len(old["id"]) > 5:
                                                                        pub["id"] = old["id"]
                                                                    # Use existing URL if we don't have one from Scholar
                                                                    if not pub.get("url") and old.get("url"):
                                                                                      pub["url"] = old["url"]
else:
            print(f"  New publication found: {pub['title'][:60]}")

        result.append(pub)

    return result


def main():
      if not SERPAPI_KEY:
                print("ERROR: SERPAPI_KEY environment variable is not set.")
                print("Get a free API key at https://serpapi.com (100 searches/month free).")
                print("Add it as a GitHub Actions secret named SERPAPI_KEY.")
                sys.exit(1)

    # Load existing publications
    existing = []
    if OUTPUT_PATH.exists():
              with open(OUTPUT_PATH, encoding="utf-8") as f:
                            existing = json.load(f)
                        print(f"Loaded {len(existing)} existing publications from {OUTPUT_PATH}")

    # Fetch from Scholar via SerpApi
    new_pubs = fetch_author_publications(SCHOLAR_USER_ID)

    if not new_pubs:
              print("No publications fetched — aborting to avoid overwriting existing data.")
        sys.exit(1)

    # Merge preserving manual curation
    merged = merge_with_existing(new_pubs, existing)

    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
              json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {OUTPUT_PATH} with {len(merged)} publications.")


if __name__ == "__main__":
      main()
