#!/usr/bin/env python3
"""Executable tests for Story Reader V3 fixtures and semantic capability contract."""

from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from story_v3_validator import (
    CORE_CAPABILITY,
    EXTENDED_TEXT_CAPABILITY,
    FIGURE_CAPABILITY,
    required_capabilities,
    validate_package,
    validate_story,
)


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = ROOT / "perspective-library/tooling/fixtures/StoryV3"
CORE_PATH = FIXTURE_ROOT / "valid/core-story.valid.json"
EXTENDED_PATH = FIXTURE_ROOT / "valid/extended-story.valid.json"
INVALID_PATH = FIXTURE_ROOT / "invalid/invalid-cases.json"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_pointer(document: object, pointer: str) -> tuple[object, str | int]:
    parts = [part.replace("~1", "/").replace("~0", "~") for part in pointer.split("/")[1:]]
    target = document
    for part in parts[:-1]:
        target = target[int(part)] if isinstance(target, list) else target[part]
    final = int(parts[-1]) if isinstance(target, list) else parts[-1]
    return target, final


def apply_case(base: dict, case: dict) -> dict:
    mutated = copy.deepcopy(base)
    target, key = resolve_pointer(mutated, case["path"])
    if case["operation"] == "set":
        target[key] = copy.deepcopy(case["value"])
    elif case["operation"] == "remove":
        del target[key]
    else:
        raise AssertionError(f"Unsupported fixture operation: {case['operation']}")
    return mutated


class StoryV3ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.core = read_json(CORE_PATH)
        cls.extended = read_json(EXTENDED_PATH)
        cls.invalid = read_json(INVALID_PATH)

    def test_valid_fixtures_have_no_semantic_errors(self) -> None:
        for story in (self.core, self.extended):
            with self.subTest(story=story["id"]):
                errors = [finding for finding in validate_story(story) if finding.severity == "error"]
                self.assertEqual(errors, [])

    def test_core_fixture_covers_core_catalog(self) -> None:
        blocks = [block for section in self.core["sections"] for block in section["blocks"]]
        self.assertEqual(
            {block["type"] for block in blocks},
            {"part_heading", "paragraph", "dialogue", "statement", "pull_quote", "divider"},
        )
        self.assertEqual(
            {block["style"] for block in blocks if block["type"] == "paragraph"},
            {"narrative", "lead_in", "transition", "beat"},
        )
        self.assertEqual(
            {block["style"] for block in blocks if block["type"] == "dialogue"},
            {"exchange", "monologue", "inner_monologue"},
        )
        self.assertEqual(
            {
                turn["delivery"]
                for block in blocks if block["type"] == "dialogue"
                for turn in block["turns"]
            },
            {"spoken", "thought", "remembered", "written"},
        )
        self.assertEqual(
            {block["presentation"] for block in blocks if block["type"] == "statement"},
            {"centered", "leading"},
        )
        self.assertEqual(
            {block["presentation"] for block in blocks if block["type"] == "pull_quote"},
            {"centerpiece", "inset", "rail"},
        )

    def test_extended_fixture_covers_supported_catalog(self) -> None:
        block_types = {
            block["type"]
            for section in self.extended["sections"]
            for block in section["blocks"]
        }
        self.assertTrue({"sequence", "list", "verse", "aside", "figure", "source_note"} <= block_types)
        self.assertNotIn("flow", block_types)

    def test_flow_is_rejected_for_new_content(self) -> None:
        story = copy.deepcopy(self.extended)
        story["sections"][0]["blocks"][0] = {
            "id": "deprecated_flow",
            "type": "flow",
            "items": [{"text_vi": "A"}, {"text_vi": "B"}],
        }
        codes = {finding.code for finding in validate_story(story)}
        self.assertIn("deprecated_flow_block", codes)

    def test_capabilities_are_derived_from_used_blocks(self) -> None:
        self.assertEqual(required_capabilities(self.core), {CORE_CAPABILITY})
        self.assertEqual(
            required_capabilities(self.extended),
            {CORE_CAPABILITY, EXTENDED_TEXT_CAPABILITY, FIGURE_CAPABILITY},
        )

    def test_invalid_mutation_cases_emit_expected_semantic_code(self) -> None:
        for case in self.invalid["cases"]:
            with self.subTest(case=case["id"]):
                story = apply_case(self.core, case)
                codes = {finding.code for finding in validate_story(story)}
                self.assertIn(case["expected_semantic_code"], codes)

    def test_package_cases_emit_missing_capability(self) -> None:
        for case in self.invalid["package_cases"]:
            with self.subTest(case=case["id"]):
                fixture = (INVALID_PATH.parent / case["story_fixture"]).resolve()
                story = read_json(fixture)
                codes = {finding.code for finding in validate_package([story], case["required_capabilities"])}
                self.assertIn(case["expected_semantic_code"], codes)

    def test_complete_capability_set_has_no_package_error(self) -> None:
        findings = validate_package(
            [self.core, self.extended],
            [CORE_CAPABILITY, EXTENDED_TEXT_CAPABILITY, FIGURE_CAPABILITY],
        )
        self.assertEqual(findings, [])


if __name__ == "__main__":
    unittest.main()
