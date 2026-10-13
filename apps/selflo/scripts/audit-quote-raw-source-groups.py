#!/usr/bin/env python3
"""Audit raw quote captures by work and verify Project Gutenberg catalog rights."""

import argparse
import html
import json
import re
import subprocess
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "content-workspace/curated/quote-research/raw-capture/source-batches-b001-b030.json"
OUT = ROOT / "content-workspace/programs/quote-library-p0/reports/q8-raw-source-groups.json"


def clean_html(value):
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def metadata_cell(page, heading):
    pattern = rf"<th[^>]*>\s*{re.escape(heading)}\s*</th>\s*<td[^>]*>(.*?)</td>"
    match = re.search(pattern, page, re.I | re.S)
    return clean_html(match.group(1)) if match else None


def fetch_gutenberg(url):
    page = ""
    for attempt in range(3):
        result = subprocess.run(
            ["curl", "-L", "--max-time", "30", "-sS", url],
            check=True,
            capture_output=True,
            text=True,
        )
        page = result.stdout
        if metadata_cell(page, "Title"):
            break
        time.sleep(attempt + 1)
    if not metadata_cell(page, "Title"):
        raise ValueError("Catalog page did not contain expected metadata")
    return {
        "title": metadata_cell(page, "Title"),
        "author": metadata_cell(page, "Author"),
        "translator": metadata_cell(page, "Translator"),
        "credits": metadata_cell(page, "Credits"),
        "language": metadata_cell(page, "Language"),
        "catalog_rights": metadata_cell(page, "Copyright"),
        "catalog_checked": True,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--offline", action="store_true")
    args = parser.parse_args()
    payload = json.loads(RAW.read_text())
    grouped = defaultdict(list)
    for item in payload["items"]:
        key = (item.get("source_url") or "", item.get("work_or_page_title") or "")
        grouped[key].append(item)

    groups = []
    for (source_url, work), items in sorted(grouped.items()):
        host = urlparse(source_url).netloc.lower()
        remote = {"catalog_checked": False}
        error = None
        if host.endswith("gutenberg.org") and not args.offline:
            try:
                remote = fetch_gutenberg(source_url)
            except Exception as exc:  # report failure without granting rights
                error = f"{type(exc).__name__}: {exc}"
        groups.append(
            {
                "source_url": source_url,
                "source_host": host,
                "work": work,
                "capture_count": len(items),
                "authors": sorted({x.get("author_or_attribution_as_source_states") or "" for x in items}),
                "source_tiers": dict(Counter(x.get("source_tier") or "missing" for x in items)),
                "capture_statuses": dict(Counter(x.get("capture_status") or "missing" for x in items)),
                "rights_notes": sorted({x.get("rights_note") or "" for x in items}),
                "remote_catalog": remote,
                "remote_error": error,
                "rights_verdict": "needs_jurisdiction_and_contributor_review",
                "editorial_verdict": "needs_item_screening",
            }
        )

    report = {
        "schema_version": "selflo.quote-p0-raw-source-groups.v1",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "raw_item_count": sum(x["capture_count"] for x in groups),
        "source_group_count": len(groups),
        "remote_catalog_checked_count": sum(bool(x["remote_catalog"].get("catalog_checked")) for x in groups),
        "remote_catalog_public_domain_usa_count": sum(
            x["remote_catalog"].get("catalog_rights") == "Public domain in the USA."
            for x in groups
        ),
        "groups": groups,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: report[k] for k in report if k != "groups"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
