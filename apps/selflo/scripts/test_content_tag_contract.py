#!/usr/bin/env python3
"""Focused semantic tests for the quote-only public filter contract."""

from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
PUBLISHER = APP_ROOT / "scripts/publish-perspective-library"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def ruby_contract_source() -> str:
    source = PUBLISHER.read_text(encoding="utf-8")
    body = source.split("CONTENT_TAG_PATTERN =", 1)[1].split("def validate_references!", 1)[0]
    return 'require "json"\nrequire "set"\nCONTENT_TAG_PATTERN =' + body


def fixture(tags=...):
    quote = {"id": "quote.test"}
    if tags is not ...:
        quote["tags"] = tags
    return {
        "content_tag_catalog": [{
            "dimensions": [
                {"id": "intent", "selection": "multiple", "release_min_count": 1,
                 "values": [{"id": "calm"}, {"id": "meaning"}]},
                {"id": "origin", "selection": "single", "release_min_count": 1,
                 "values": [{"id": "selflo"}, {"id": "research"}]},
            ]
        }],
        "quote_pack": [{"quotes": [quote]}],
        "story": [],
    }


def validate(payloads: dict, channel: str) -> subprocess.CompletedProcess[str]:
    code = ruby_contract_source() + "\npayloads = JSON.parse(STDIN.read)\nvalidate_content_tags!(payloads, ARGV.fetch(0))\n"
    return subprocess.run(
        ["ruby", "-e", code, channel],
        input=json.dumps(payloads),
        text=True,
        capture_output=True,
        check=False,
    )


class ContentTagSemanticContractTests(unittest.TestCase):
    def test_legacy_authoring_without_catalog_remains_compatible(self) -> None:
        payloads = {"quote_pack": [{"quotes": [{"id": "quote.test"}]}]}
        self.assertEqual(validate(payloads, "authoring").returncode, 0)

    def test_new_release_without_catalog_is_rejected(self) -> None:
        payloads = {"quote_pack": [{"quotes": [{"id": "quote.test"}]}]}
        result = validate(payloads, "release")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("requires exactly one Content Tag Catalog", result.stderr)

    def test_authoring_catalog_allows_incremental_missing_tags(self) -> None:
        self.assertEqual(validate(fixture(), "authoring").returncode, 0)

    def test_release_catalog_fails_closed_for_missing_tags(self) -> None:
        result = validate(fixture(), "release")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing tags", result.stderr)

    def test_unknown_and_duplicate_tags_are_rejected(self) -> None:
        unknown = validate(fixture(["intent:calm", "origin:selflo", "topic:unknown"]), "authoring")
        duplicate = validate(fixture(["intent:calm", "origin:selflo", "origin:selflo"]), "authoring")
        self.assertIn("unknown tag", unknown.stderr)
        self.assertIn("duplicate tags", duplicate.stderr)

    def test_single_cardinality_and_release_minimum_are_enforced(self) -> None:
        multiple_origins = validate(
            fixture(["intent:calm", "origin:selflo", "origin:research"]), "release"
        )
        missing_intent = validate(fixture(["origin:selflo"]), "release")
        self.assertIn("single-value", multiple_origins.stderr)
        self.assertIn("insufficient tags", missing_intent.stderr)

    def test_valid_release_tags_pass(self) -> None:
        self.assertEqual(
            validate(fixture(["intent:calm", "origin:selflo"]), "release").returncode,
            0,
        )


class CanonicalReleaseBackfillTests(unittest.TestCase):
    def test_exact_active_release_quote_set_is_tagged(self) -> None:
        source_root = APP_ROOT / "perspective-library/source/vi"
        release_root = APP_ROOT / "perspective-library/release/vi"
        source_index = read_json(source_root / "source.json")
        release_manifest = read_json(release_root / "manifest.json")

        release_ids = set()
        for descriptor in release_manifest["files"]:
            if descriptor["kind"] == "quote_pack":
                release_ids.update(quote["id"] for quote in read_json(release_root / descriptor["path"])["quotes"])

        canonical_quotes = {}
        for entry in source_index["files"]:
            if entry["kind"] != "quote_fragment":
                continue
            for quote in read_json(source_root / entry["path"])["quotes"]:
                canonical_quotes[quote["id"]] = quote

        tagged_ids = {quote_id for quote_id, quote in canonical_quotes.items() if "tags" in quote}
        self.assertEqual(len(release_ids), 314)
        self.assertEqual(tagged_ids, release_ids)

        catalog_entry = next(entry for entry in source_index["files"] if entry["kind"] == "content_tag_catalog")
        catalog = read_json(source_root / catalog_entry["path"])
        dimensions = {dimension["id"]: dimension for dimension in catalog["dimensions"]}
        allowed = {
            f"{dimension['id']}:{value['id']}"
            for dimension in catalog["dimensions"]
            for value in dimension["values"]
        }
        coverage = set()
        for quote_id in release_ids:
            tags = canonical_quotes[quote_id]["tags"]
            self.assertEqual(len(tags), len(set(tags)), quote_id)
            self.assertTrue(set(tags) <= allowed, quote_id)
            coverage.update(tags)
            for dimension_id, dimension in dimensions.items():
                count = sum(tag.startswith(f"{dimension_id}:") for tag in tags)
                self.assertGreaterEqual(count, dimension["release_min_count"], quote_id)
                if dimension["selection"] == "single":
                    self.assertLessEqual(count, 1, quote_id)

        self.assertEqual(coverage, allowed)


if __name__ == "__main__":
    unittest.main()
