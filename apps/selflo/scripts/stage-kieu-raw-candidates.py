#!/usr/bin/env python3
"""Stage the six reviewed Kiều raw captures for the canonical Authoring workflow."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "content-workspace/curated/quote-research/raw-capture/source-batches-b001-b030.json"
REVIEW = ROOT / "content-workspace/programs/quote-library-p0/reports/q8-kieu-item-review.json"
CATALOG = ROOT / "content-workspace/curated/quote-research/review-pipeline/review-candidates.json"
LEDGER = ROOT / "content-workspace/programs/quote-library-p0/reports/q8-kieu-authoring-ledger.json"

THEMES = {
    "research.10k.b009.kieu.0003-0004": ("Đời sống & hiểu mình", "adversity", "change"),
    "research.10k.b009.kieu.0039-0040": ("Đời sống & hiểu mình", "attention", "time"),
    "research.10k.b009.kieu.0041-0042": ("Nghỉ ngơi & hiện diện", "attention", "nature"),
    "research.10k.b009.kieu.0163-0164": ("Quan hệ", "relationships", "emotion_expression"),
    "research.10k.b009.kieu.0181-0182": ("Quan hệ", "relationships", "uncertainty"),
    "research.10k.b009.kieu.0183-0184": ("Cảm xúc", "emotion", "creative_expression"),
}


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    raw = {item["candidate_id"]: item for item in json.loads(RAW.read_text())["items"]}
    reviewed = [
        row
        for row in json.loads(REVIEW.read_text())["rows"]
        if row["disposition"] == "authoring_owner_review"
    ]
    if {row["id"] for row in reviewed} != set(THEMES):
        raise ValueError("Reviewed Kiều selection and metadata mapping differ")
    catalog = json.loads(CATALOG.read_text())
    raw_ids = {row["id"] for row in reviewed}
    # Remove the first staging attempt whose raw range IDs contain a hyphen,
    # which the stable-id contract correctly rejects.
    catalog["candidates"] = [item for item in catalog["candidates"] if item["id"] not in raw_ids]
    by_id = {item["id"]: item for item in catalog["candidates"]}
    for index, row in enumerate(reviewed, start=1):
        item = raw[row["id"]]
        life_area, theme, experience = THEMES[row["id"]]
        canonical_id = row["id"].replace("-", ".")
        candidate = {
            "id": canonical_id,
            "research_id_original": row["id"],
            "text_vi": item["original_text"],
            "original_text": item["original_text"],
            "author": "Nguyễn Du",
            "work": "Truyện Kiều (Đoạn Trường Tân Thanh)",
            "source_url": item["source_url"],
            "content_nature": "direct_quote",
            "life_area": life_area,
            "human_experience": experience,
            "theme": theme,
            "verification": f"A - Wikisource witness; {item['source_location']}",
            "rights_research_note": item["rights_note"],
            "source_row": 20000 + index,
            "duplicate_cluster_ids": "",
            "near_duplicate_cluster_ids": "",
            "canonical_collision": False,
            "story_id": None,
        }
        if candidate["id"] in by_id:
            by_id[candidate["id"]].update(candidate)
        else:
            catalog["candidates"].append(candidate)
            by_id[candidate["id"]] = candidate
    ledger = {
        "schema_version": "selflo.content-review-ledger.v1",
        "library_id": "selflo.perspective.candidate.vi",
        "decisions": [
            {
                "quote_id": row["id"].replace("-", "."),
                "decision": "approved",
                "note": "Q8 item review: direct Kiều couplet can stand alone; promote to Authoring for owner decision.",
            }
            for row in reviewed
        ],
    }
    write(CATALOG, catalog)
    write(LEDGER, ledger)
    print(json.dumps({"staged": len(reviewed), "catalog_total": len(catalog["candidates"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
