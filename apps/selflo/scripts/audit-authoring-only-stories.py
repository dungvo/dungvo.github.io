#!/usr/bin/env python3
"""Audit stories present in Authoring but absent from Release."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AUTHORING = ROOT / "perspective-library/authoring/vi"
RELEASE = ROOT / "perspective-library/release/vi"
SOURCE = ROOT / "perspective-library/source/vi"
OUTPUT = ROOT / "content-workspace/programs/story-authoring-review/reports/authoring-only-stories.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def files_of_kind(root: Path, kind: str):
    manifest = load(root / "manifest.json")
    return [load(root / item["path"]) for item in manifest["files"] if item["kind"] == kind]


def source_quotes():
    quotes = []
    for path in sorted((SOURCE / "quotes").glob("*/*.json")):
        payload = load(path)
        quotes.extend(payload.get("quotes", []))
    return quotes


def main():
    authoring_stories = {item["id"]: item for item in files_of_kind(AUTHORING, "story")}
    release_story_ids = {item["id"] for item in files_of_kind(RELEASE, "story")}
    release_quote_ids = {item["id"] for pack in files_of_kind(RELEASE, "quote_pack") for item in pack["quotes"]}
    quotes_by_story = {}
    for quote in source_quotes():
        story_id = quote.get("story_id")
        if story_id:
            quotes_by_story.setdefault(story_id, []).append(quote)

    rows = []
    for story_id, story in sorted(authoring_stories.items()):
        if story_id in release_story_ids:
            continue
        rights = story.get("rights") or {}
        review = story.get("review") or {}
        editorial = story.get("editorial") or {}
        linked_quotes = quotes_by_story.get(story_id, [])
        blockers = []
        if story.get("status") != "active":
            blockers.append("story_not_active")
        if rights.get("status") not in {"cleared", "public_domain", "selflo_owned"}:
            blockers.append("rights_not_cleared")
        if review.get("status") != "approved":
            blockers.append("owner_review_missing")
        if editorial.get("human_edited") is not True:
            blockers.append("human_edit_missing")
        if not story.get("hero_image"):
            blockers.append("hero_image_missing")
        if len(linked_quotes) != 1:
            blockers.append("linked_quote_count_not_one")
        if linked_quotes and not any(q["id"] in release_quote_ids for q in linked_quotes):
            blockers.append("linked_quote_not_released")
        rows.append(
            {
                "id": story_id,
                "title_vi": story.get("title_vi"),
                "primary_theme": story.get("primary_theme"),
                "schema_version": story.get("schema_version"),
                "story_status": story.get("status"),
                "rights_status": rights.get("status"),
                "review_status": review.get("status"),
                "human_edited": editorial.get("human_edited"),
                "has_hero_image": bool(story.get("hero_image")),
                "linked_quote_ids": [q["id"] for q in linked_quotes],
                "released_linked_quote_ids": [q["id"] for q in linked_quotes if q["id"] in release_quote_ids],
                "blockers": blockers,
                "preliminary_disposition": "needs_editorial_review" if blockers else "release_gate_candidate",
            }
        )

    blocker_counts = Counter(blocker for row in rows for blocker in row["blockers"])
    payload = {
        "schema_version": "selflo.story-authoring-audit.v1",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "authoring_revision": load(AUTHORING / "manifest.json")["library_revision"],
        "release_revision": load(RELEASE / "manifest.json")["library_revision"],
        "summary": {
            "authoring_story_count": len(authoring_stories),
            "release_story_count": len(release_story_ids),
            "authoring_only_story_count": len(rows),
            "release_gate_candidate_count": sum(not row["blockers"] for row in rows),
            "blocker_counts": dict(sorted(blocker_counts.items())),
        },
        "stories": rows,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
