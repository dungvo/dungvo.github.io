#!/usr/bin/env python3
import json
import hashlib
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

def quote_item(quote, descriptor, fragment):
    metadata = quote.get("metadata") or {}
    selection = quote.get("selection") or {}
    text_vi = quote.get("text_vi") or ""
    keywords = metadata.get("keywords", [])
    search_values = [text_vi, quote.get("title_vi"), quote.get("subtitle_vi"),
                     (quote.get("authorship") or {}).get("author_name"),
                     fragment.get("primary_theme"), *keywords,
                     *selection.get("presentation_tags", [])]
    return {
        "id": quote["id"],
        "title_vi": quote.get("title_vi"),
        "text_vi": text_vi,
        "content_type": "quote",
        "content_type_label_vi": "Quote",
        "runtime_entity": "perspective_quote",
        "classification_source": "runtime_entity",
        "schema_version": fragment.get("schema_version"),
        "reader_format": "quote_card",
        "revision": quote.get("revision", 1),
        "status": (quote.get("review") or {}).get("status", "unknown"),
        "channel": "authoring",
        "language": "vi",
        "primary_theme": quote.get("primary_theme") or fragment.get("primary_theme"),
        "concept_ids": metadata.get("concepts", []),
        "emotion_tags": metadata.get("emotion_tags", []),
        "keywords": keywords,
        "rights_status": (quote.get("rights") or {}).get("status"),
        "review_status": (quote.get("review") or {}).get("status"),
        "source_path": descriptor["path"],
        "payload_ref": f"perspective-library/source/vi/{descriptor['path']}#{quote['id']}",
        "reader_url": None,
        "search_document_vi": re.sub(r"\s+", " ", " ".join(str(v) for v in search_values if v)).strip(),
    }

source_index = read(SOURCE / "source.json")
items = []
for descriptor in source_index["files"]:
    if descriptor["kind"] == "quote_fragment":
        fragment = read(SOURCE / descriptor["path"])
        items.extend(quote_item(quote, descriptor, fragment) for quote in fragment.get("quotes", []))
        continue
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
        "channel": "authoring",
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
        "payload_ref": f"perspective-library/source/vi/{descriptor['path']}",
        "reader_url": f"../reader/?source=authoring&id={story['id']}",
        "search_document_vi": plain_text(story),
    }
    items.append(item)

items.sort(key=lambda item: (item["content_type"], (item.get("title_vi") or item.get("text_vi") or "").casefold(), item["id"]))
type_counts = Counter(item["content_type"] for item in items)
format_counts = Counter(item["reader_format"] for item in items)
theme_counts = Counter(item["primary_theme"] for item in items)
content_api = {
    "schema_version": "selflo.content-index.v1",
    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    "channel": "authoring",
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

shard_dir = API / "content-index.v1"
shards = []
for content_type in ("quote", "story", "knowledge_insight"):
    selected = [item for item in items if item["content_type"] == content_type]
    for offset in range(0, len(selected), 500):
        number = offset // 500 + 1
        name = f"{content_type}-{number:04d}.json"
        payload = {
            "schema_version": "selflo.content-index.v1",
            "generated_at": content_api["generated_at"],
            "channel": "authoring",
            "content_type": content_type,
            "items": selected[offset:offset + 500],
        }
        encoded = (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        (shard_dir / name).parent.mkdir(parents=True, exist_ok=True)
        (shard_dir / name).write_bytes(encoded)
        shards.append({"path": name, "content_type": content_type, "item_count": len(payload["items"]),
                       "byte_count": len(encoded), "sha256": hashlib.sha256(encoded).hexdigest()})
write(shard_dir / "manifest.json", {
    "schema_version": "selflo.content-index-manifest.v1",
    "generated_at": content_api["generated_at"],
    "channel": "authoring",
    "item_count": len(items),
    "search_mode": "local_first",
    "shards": shards,
})

analysis_index_path = SOURCE / "analyses" / "index.json"
analysis_items = []
if analysis_index_path.exists():
    analysis_index = read(analysis_index_path)
    known_content_ids = {item["id"] for item in items}
    seen_analysis_ids = set()
    seen_content_ids = set()
    for descriptor in analysis_index.get("items", []):
        analysis = read(analysis_index_path.parent / descriptor["path"])
        if analysis["id"] != descriptor["id"] or analysis["content_id"] != descriptor["content_id"]:
            raise SystemExit(f"Analysis descriptor mismatch: {descriptor['path']}")
        if analysis["id"] in seen_analysis_ids:
            raise SystemExit(f"Duplicate analysis id: {analysis['id']}")
        if analysis["content_id"] in seen_content_ids:
            raise SystemExit(f"Content has more than one v1 analysis: {analysis['content_id']}")
        if analysis["content_id"] not in known_content_ids:
            raise SystemExit(f"Analysis references unknown content: {analysis['content_id']}")
        reference_ids = {reference["id"] for reference in analysis.get("references", [])}
        used_reference_ids = {
            reference_id
            for section in analysis.get("analysis_sections", [])
            for reference_id in section.get("reference_ids", [])
        }
        missing_reference_ids = used_reference_ids - reference_ids
        if missing_reference_ids:
            raise SystemExit(f"Analysis has unknown reference ids: {sorted(missing_reference_ids)}")
        seen_analysis_ids.add(analysis["id"])
        seen_content_ids.add(analysis["content_id"])
        analysis_items.append(analysis)

write(API / "content-analysis.v1.json", {
    "schema_version": "selflo.content-analysis-api.v1",
    "generated_at": content_api["generated_at"],
    "channel": "authoring",
    "source": "perspective-library/source/vi/analyses/index.json",
    "items": analysis_items,
})

authoring_catalog = read(ROOT / "shared" / "contracts" / "story-reader" / "v3" / "component-authoring-catalog.json")
support = read(ROOT / "shared" / "contracts" / "story-reader" / "v3" / "component-support.json")
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
        "authoring_catalog": "shared/contracts/story-reader/v3/component-authoring-catalog.json",
        "support_matrix": "shared/contracts/story-reader/v3/component-support.json",
        "contract": "shared/contracts/story-reader/v3/CONTRACT.vi.md",
    },
    "components": components,
}
write(API / "component-catalog.v1.json", component_api)
