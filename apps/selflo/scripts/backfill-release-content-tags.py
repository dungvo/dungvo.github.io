#!/usr/bin/env python3
"""Backfill public filter tags for quotes in the currently active Release only."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


TOPIC_BY_THEME = {
    "adversity_resilience": "adversity_recovery",
    "attention": "attention_presence",
    "change_growth": "change_growth",
    "emotion": "emotions",
    "meaning_values": "meaning_values",
    "relationships": "relationships",
    "rest_wellbeing": "rest_wellbeing",
    "self_understanding": "self_understanding",
    "work_achievement": "work_choices",
}

INTENTS_BY_THEME = {
    "adversity_resilience": ["overcome_adversity"],
    "attention": ["calm"],
    "change_growth": ["personal_growth"],
    "emotion": ["understand_self", "calm"],
    "meaning_values": ["meaning"],
    "relationships": ["relationships"],
    "rest_wellbeing": ["calm", "reduce_anxiety"],
    "self_understanding": ["understand_self"],
    "work_achievement": ["work_direction"],
}

SUPPORT_BY_THEME = {
    "adversity_resilience": ["motivate", "new_perspective"],
    "attention": ["soothe", "clarify"],
    "change_growth": ["motivate", "small_action"],
    "emotion": ["soothe", "clarify"],
    "meaning_values": ["new_perspective"],
    "relationships": ["clarify", "new_perspective"],
    "rest_wellbeing": ["soothe", "small_action"],
    "self_understanding": ["clarify", "new_perspective"],
    "work_achievement": ["motivate", "clarify"],
}

CLASSICAL_AUTHORS = {
    "Bhagavad Gita (traditionally within Mahābhārata)",
    "Confucius",
    "Confucius tradition / 孔子",
    "Dhammapada",
    "Dhammapada (Buddhist canonical verse tradition)",
    "Epictetus",
    "Epicurus",
    "Laozi",
    "Laozi / 老子",
    "Lão Tử",
    "Majjhima Nikāya / Early Buddhist Pāḷi tradition",
    "Marcus Aurelius",
    "Mencius / 孟子",
    "Selected Upaniṣads / Vedic tradition",
    "Seneca",
    "Trang Tử",
}

FOLKLORE_AUTHORS = {
    "Vietnamese oral tradition / anonymous",
    "Vietnamese proverb tradition / anonymous",
}

RESEARCH_AUTHORS = {"William James"}

BOOK_OR_WORK_AUTHORS = {
    "Francis Bacon",
    "Henry David Thoreau",
    "Nguyễn Bỉnh Khiêm",
    "Nguyễn Du",
    "Ralph Waldo Emerson",
}

LEARNING_PATTERN = re.compile(
    r"(?:^|[^a-z_])(habit|learning|practice|routine)(?:$|[^a-z_])|"
    r"thói quen|học tập|học hỏi|thực hành|luyện tập|lặp lại|mỗi ngày",
    re.IGNORECASE,
)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def release_quotes(release_root: Path) -> dict[str, dict]:
    manifest = read_json(release_root / "manifest.json")
    result: dict[str, dict] = {}
    for descriptor in manifest["files"]:
        if descriptor["kind"] != "quote_pack":
            continue
        for quote in read_json(release_root / descriptor["path"])["quotes"]:
            if quote["id"] in result:
                raise ValueError(f"Duplicate Release quote ID: {quote['id']}")
            result[quote["id"]] = quote
    return result


def origin_for(quote: dict) -> str:
    if quote["kind"] == "selflo_original":
        if quote["authorship"]["author_id"] != "selflo":
            raise ValueError(f"Selflo quote has inconsistent author: {quote['id']}")
        return "selflo"

    author = quote["authorship"]["author_name"]
    if author in CLASSICAL_AUTHORS:
        return "classical_text"
    if author in FOLKLORE_AUTHORS:
        return "folklore"
    if author in RESEARCH_AUTHORS:
        return "research"
    if author in BOOK_OR_WORK_AUTHORS:
        return "book_or_work"
    raise ValueError(f"Origin needs owner review: {quote['id']} / {author!r}")


def is_learning_or_habit(quote: dict) -> bool:
    metadata = quote.get("metadata", {})
    evidence = " ".join(
        [quote["id"], quote.get("text_vi", ""), quote.get("writing", {}).get("semantic_intent", "")]
        + metadata.get("keywords", [])
        + metadata.get("concepts", [])
        + metadata.get("frameworks", [])
    )
    return bool(LEARNING_PATTERN.search(evidence))


def tags_for(quote: dict) -> list[str]:
    theme = quote["primary_theme"]
    try:
        intents = INTENTS_BY_THEME[theme]
        supports = SUPPORT_BY_THEME[theme]
        topics = [TOPIC_BY_THEME[theme]]
    except KeyError as error:
        raise ValueError(f"Unmapped primary theme: {quote['id']} / {theme}") from error

    if is_learning_or_habit(quote) and "learning_habits" not in topics:
        topics.append("learning_habits")

    return (
        [f"intent:{value}" for value in intents]
        + [f"support:{value}" for value in supports]
        + [f"topic:{value}" for value in topics]
        + [f"origin:{origin_for(quote)}"]
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--release", type=Path, required=True)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    source_root = args.source.resolve()
    release = release_quotes(args.release.resolve())
    source_index = read_json(source_root / "source.json")
    fragment_entries = [entry for entry in source_index["files"] if entry["kind"] == "quote_fragment"]

    locations: dict[str, tuple[Path, dict, dict]] = {}
    documents: dict[Path, dict] = {}
    for entry in fragment_entries:
        path = source_root / entry["path"]
        document = read_json(path)
        documents[path] = document
        for quote in document["quotes"]:
            if quote["id"] in locations:
                raise ValueError(f"Duplicate canonical quote ID: {quote['id']}")
            locations[quote["id"]] = (path, document, quote)

    missing = sorted(set(release) - set(locations))
    if missing:
        raise ValueError(f"Release quotes missing from canonical fragments: {missing}")

    changed_paths: set[Path] = set()
    release_fragment_paths: set[Path] = set()
    assignments = []
    for quote_id in sorted(release):
        path, _, quote = locations[quote_id]
        release_fragment_paths.add(path)
        tags = tags_for(quote)
        if quote.get("tags") != tags:
            quote["tags"] = tags
            changed_paths.add(path)
        assignments.append({
            "quote_id": quote_id,
            "primary_theme": quote["primary_theme"],
            "story_id": release[quote_id].get("story_id"),
            "tags": tags,
        })

    tagged_outside_release = sorted(
        quote_id for quote_id, (_, _, quote) in locations.items()
        if quote_id not in release and "tags" in quote
    )
    if tagged_outside_release:
        raise ValueError(f"Non-Release quotes already carry public tags: {tagged_outside_release[:20]}")

    if args.apply:
        for path in sorted(changed_paths):
            write_json(path, documents[path])

    report = {
        "schema_version": "selflo.content-tag-backfill-report.v1",
        "release_library_revision": read_json(args.release.resolve() / "manifest.json")["library_revision"],
        "release_quote_count": len(release),
        "tagged_fragment_count": len(release_fragment_paths),
        "changed_fragment_count": len(changed_paths),
        "applied": args.apply,
        "assignments": assignments,
    }
    if args.report:
        write_json(args.report.resolve(), report)
    print(json.dumps({key: report[key] for key in ("release_library_revision", "release_quote_count", "tagged_fragment_count", "changed_fragment_count", "applied")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
