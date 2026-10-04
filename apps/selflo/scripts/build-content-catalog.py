#!/usr/bin/env python3
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve()
LIBRARY = ROOT / "perspective-library"
SOURCE = LIBRARY / "source" / "vi"
API = ROOT / "api"

def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def plain_text(story):
    values = [story.get("title_vi"), story.get("subtitle_vi"), story.get("opening_quote_vi")]
    for section in story.get("sections", []):
        values += [section.get("marker_vi"), section.get("title_vi"), section.get("subtitle_vi")]
        for block in section.get("blocks", []):
            values += [block.get("title_vi"), block.get("text_vi"), block.get("subtitle_vi")]
            values += [item.get("text_vi") for item in block.get("items", [])]
            for turn in block.get("turns", []):
                values.append((turn.get("speaker") or {}).get("label_vi"))
                values += [item.get("text_vi") for item in turn.get("paragraphs", [])]
    values += [(story.get("takeaway") or {}).get("title_vi"), (story.get("takeaway") or {}).get("text_vi")]
    values += [item.get("text_vi") for item in (story.get("reflection") or {}).get("prompts", [])]
    values.append((story.get("reflection") or {}).get("closing_vi"))
    return re.sub(r"\s+", " ", " ".join(str(value) for value in values if value)).strip()

def classify(story):
    editorial = story.get("editorial") or {}
    keywords = (story.get("metadata") or {}).get("keywords") or []
    if editorial.get("source_collection_id") == "knowledge_insight" or "knowledge insight" in keywords:
        return "knowledge_insight", "editorial.source_collection_id"
    return "story", "runtime_entity_default"

source_index = read(SOURCE / "source.json")
items = []
for descriptor in source_index["files"]:
    if descriptor["kind"] != "story":
        continue
    story = read(SOURCE / descriptor["path"])
    content_type, classification_source = classify(story)
    block_counter = Counter()
    mark_counter = Counter()
    for section in story.get("sections", []):
        for block in section.get("blocks", []):
            selector = block.get("type", "unknown")
            variant = block.get("style") or block.get("presentation")
            block_counter[f"{selector}:{variant}" if variant else selector] += 1
            for run in block.get("runs", []):
                mark_counter.update(run.get("marks", []))
    metadata = story.get("metadata") or {}
    editorial = story.get("editorial") or {}
    item = {
        "id": story["id"],
        "title_vi": story["title_vi"],
        "subtitle_vi": story.get("subtitle_vi"),
        "content_type": content_type,
        "content_type_label_vi": "Knowledge / Insight" if content_type == "knowledge_insight" else "Story",
        "runtime_entity": story.get("entity"),
        "classification_source": classification_source,
        "schema_version": story.get("schema_version"),
        "reader_format": story.get("reader_format", "classic_v1"),
        "revision": story.get("revision"),
        "status": story.get("status"),
        "language": story.get("language"),
        "primary_theme": story.get("primary_theme"),
        "story_style": metadata.get("story_style"),
        "concept_ids": metadata.get("concept_ids", []),
        "emotion_tags": metadata.get("emotion_tags", []),
        "keywords": metadata.get("keywords", []),
        "origin_type": editorial.get("origin_type"),
        "source_collection_id": editorial.get("source_collection_id"),
        "rights_status": (story.get("rights") or {}).get("status"),
        "review_status": (story.get("review") or {}).get("status"),
        "section_count": len(story.get("sections", [])),
        "block_count": sum(block_counter.values()),
        "block_inventory": dict(sorted(block_counter.items())),
        "rich_text_marks": dict(sorted(mark_counter.items())),
        "source_path": descriptor["path"],
        "reader_url": f"../story/?source=authoring&id={story['id']}",
        "search_document_vi": plain_text(story),
    }
    items.append(item)

items.sort(key=lambda item: (item["content_type"], item["title_vi"].casefold(), item["id"]))
type_counts = Counter(item["content_type"] for item in items)
format_counts = Counter(item["reader_format"] for item in items)
theme_counts = Counter(item["primary_theme"] for item in items)
content_api = {
    "schema_version": "selflo.content-index.v1",
    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    "source": {
        "kind": "canonical_authoring_source",
        "path": "perspective-library/source/vi/source.json",
        "source_revision": source_index["source_revision"],
        "content_version": source_index["content_version"],
    },
    "semantics": {
        "content_type": "Editorial semantic type used by catalog/search.",
        "runtime_entity": "Current wire entity decoded by the app. Knowledge may temporarily use perspective_story.",
        "projection_rule": "Generated only; never edit API output by hand."
    },
    "summary": {
        "total": len(items),
        "by_content_type": dict(sorted(type_counts.items())),
        "by_reader_format": dict(sorted(format_counts.items())),
        "by_theme": dict(sorted(theme_counts.items())),
    },
    "items": items,
}
write(API / "content-index.v1.json", content_api)

authoring_catalog = read(LIBRARY / "contracts" / "story-reader" / "v3" / "component-authoring-catalog.json")
support = read(LIBRARY / "contracts" / "story-reader" / "v3" / "component-support.json")
support_by_selector = {item["wire_selector"]: item for item in support["components"]}
components = []
for item in authoring_catalog["components"]:
    support_selector = "block.type=paragraph;style=narrative" if item["id"] == "rich_text" else item["wire_selector"]
    matrix = support_by_selector.get(support_selector, {})
    merged = dict(item)
    merged["support"] = {
        "contract_status": matrix.get("contract_status"),
        "mockup_status": matrix.get("mockup_status"),
        "app_status": matrix.get("app_status"),
        "publisher_status": matrix.get("publisher_status"),
        "release_status": matrix.get("release_status"),
    }
    components.append(merged)
component_api = {
    "schema_version": "selflo.component-catalog-api.v1",
    "generated_at": content_api["generated_at"],
    "source": {
        "authoring_catalog": "perspective-library/contracts/story-reader/v3/component-authoring-catalog.json",
        "support_matrix": "perspective-library/contracts/story-reader/v3/component-support.json",
        "contract": "perspective-library/contracts/story-reader/v3/CONTRACT.vi.md",
    },
    "components": components,
}
write(API / "component-catalog.v1.json", component_api)
