#!/usr/bin/env python3
"""Migrate only stories present in the current Release manifest to Editorial V3."""

from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rich_text(source: dict) -> dict:
    result = {"text_vi": source["text_vi"]}
    if "runs" in source:
        result["runs"] = copy.deepcopy(source["runs"])
    return result


def convert_blocks(blocks: list[dict]) -> list[dict]:
    result: list[dict] = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        is_lead = (
            block.get("type") == "paragraph"
            and block.get("style") == "dialogue_lead"
            and block["id"].endswith(".speaker")
        )
        if is_lead and index + 1 < len(blocks) and blocks[index + 1].get("style") == "dialogue":
            first_id = block["id"]
            turns: list[dict] = []
            cursor = index
            while cursor < len(blocks):
                lead = blocks[cursor]
                if not (
                    lead.get("type") == "paragraph"
                    and lead.get("style") == "dialogue_lead"
                    and lead["id"].endswith(".speaker")
                    and cursor + 1 < len(blocks)
                    and blocks[cursor + 1].get("type") == "paragraph"
                    and blocks[cursor + 1].get("style") == "dialogue"
                ):
                    break
                cursor += 1
                paragraphs: list[dict] = []
                while cursor < len(blocks) and blocks[cursor].get("type") == "paragraph" and blocks[cursor].get("style") == "dialogue":
                    paragraphs.append(rich_text(blocks[cursor]))
                    cursor += 1
                turns.append({
                    "id": f"{lead['id']}.turn",
                    "speaker": {"id": lead["id"], "label_vi": lead["text_vi"]},
                    "delivery": "spoken",
                    "paragraphs": paragraphs,
                })
            result.append({
                "id": f"{first_id}.group",
                "type": "dialogue",
                "style": "exchange" if len(turns) > 1 else "monologue",
                "turns": turns,
            })
            index = cursor
            continue

        if block.get("type") == "paragraph" and block.get("style") == "dialogue":
            first_id = block["id"]
            paragraphs: list[dict] = []
            cursor = index
            while cursor < len(blocks) and blocks[cursor].get("type") == "paragraph" and blocks[cursor].get("style") == "dialogue":
                paragraphs.append(rich_text(blocks[cursor]))
                cursor += 1
            result.append({
                "id": f"{first_id}.group",
                "type": "dialogue",
                "style": "monologue",
                "turns": [{
                    "id": f"{first_id}.turn",
                    "speaker": None,
                    "delivery": "spoken",
                    "paragraphs": paragraphs,
                }],
            })
            index = cursor
            continue

        converted = copy.deepcopy(block)
        block_type = converted["type"]
        if block_type == "paragraph":
            converted["style"] = {
                "narrative": "narrative",
                "transition": "transition",
                "dialogue_lead": "lead_in",
            }[converted["style"]]
        elif block_type == "heading":
            converted["type"] = "statement"
            converted["presentation"] = "leading"
            converted["shareable"] = False
        elif block_type == "pull_quote":
            converted["presentation"] = converted.get("presentation", "centerpiece")
            converted["shareable"] = False
        elif block_type == "part_heading":
            converted.setdefault("subtitle_vi", None)
        result.append(converted)
        index += 1
    return result


def convert_story(source: dict) -> dict:
    if source.get("reader_format") == "editorial_v3":
        return copy.deepcopy(source)
    if source.get("reader_format") != "editorial_v2":
        raise ValueError(f"{source.get('id')}: expected editorial_v2 Release source")

    result = copy.deepcopy(source)
    result["schema_version"] = "1.2"
    result["reader_format"] = "editorial_v3"
    result["sections"] = []
    for section in source["sections"]:
        converted = {
            "id": section["id"],
            "marker_vi": None,
            "marker_unit_vi": None,
            "title_vi": section.get("title_vi"),
            "subtitle_vi": None,
            "blocks": convert_blocks(section["blocks"]),
        }
        result["sections"].append(converted)

    reflection = source["reflection"]
    result["reflection"] = {
        "prompts": [
            {"id": f"reflection_{index}", "text_vi": text, "response_mode": "none"}
            for index, text in enumerate(reflection["prompts_vi"], start=1)
        ],
        "closing_vi": reflection.get("closing_vi"),
    }
    return result


def semantic_texts(story: dict) -> list[str]:
    values: list[str] = [story["title_vi"]]
    if story.get("subtitle_vi"):
        values.append(story["subtitle_vi"])
    if story.get("opening_quote_vi"):
        values.append(story["opening_quote_vi"])
    for section in story["sections"]:
        for key in ("marker_vi", "marker_unit_vi", "title_vi", "subtitle_vi"):
            if section.get(key):
                values.append(section[key])
        for block in section["blocks"]:
            if block.get("type") == "dialogue":
                for turn in block["turns"]:
                    if turn.get("speaker"):
                        values.append(turn["speaker"]["label_vi"])
                    values.extend(item["text_vi"] for item in turn["paragraphs"])
            else:
                for key in ("title_vi", "subtitle_vi", "text_vi", "attribution_vi"):
                    if block.get(key):
                        values.append(block[key])
    values.extend([story["takeaway"]["title_vi"], story["takeaway"]["text_vi"]])
    reflection = story["reflection"]
    prompts = reflection.get("prompts") or [{"text_vi": text} for text in reflection["prompts_vi"]]
    values.extend(item["text_vi"] for item in prompts)
    if reflection.get("closing_vi"):
        values.append(reflection["closing_vi"])
    return values


def migrate(root: Path, apply: bool) -> list[str]:
    source_root = root / "perspective-library/source/vi"
    release_manifest = read_json(root / "perspective-library/release/vi/manifest.json")
    source_index = read_json(source_root / "source.json")
    release_ids = {item["id"] for item in release_manifest["files"] if item["kind"] == "story"}
    source_entries = {item["id"]: item for item in source_index["files"] if item["kind"] == "story"}
    missing = sorted(release_ids - source_entries.keys())
    if missing:
        raise ValueError(f"Release stories missing from source index: {', '.join(missing)}")

    changed: list[str] = []
    for story_id in sorted(release_ids):
        path = source_root / source_entries[story_id]["path"]
        source = read_json(path)
        converted = convert_story(source)
        if semantic_texts(source) != semantic_texts(converted):
            raise ValueError(f"{story_id}: semantic text/order changed during migration")
        if converted != source:
            changed.append(story_id)
            if apply:
                write_json(path, converted)
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--apply", action="store_true", help="write migrated Release source stories")
    args = parser.parse_args()
    changed = migrate(args.repo_root.resolve(), args.apply)
    action = "migrated" if args.apply else "would migrate"
    print(f"{action} {len(changed)} Release stories")
    for story_id in changed:
        print(story_id)


if __name__ == "__main__":
    main()
