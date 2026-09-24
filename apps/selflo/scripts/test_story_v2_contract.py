#!/usr/bin/env python3
"""Contract checks shared by canonical content, Web Reference, and future app fixtures."""

from __future__ import annotations

import hashlib
import json
import re
import unittest
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = APP_ROOT / "perspective-library/source/vi"
LOCK_FILE = APP_ROOT / "perspective-library/tooling/locked-story-prose.json"
RELEASED_STORY_IDS = {
    "story.empty_boat_on_the_river",
    "story.large_tree_beyond_the_carpenters_measure",
    "story.old_man_and_returning_horse",
    "story.original_between_two_banks",
    "story.original_builder_and_shapeless_stones",
    "story.original_chair_beside_window",
    "story.original_if_i_lived_a_human_life",
    "story.original_stone_that_loved_stormy_days",
    "story.photograph_missing_a_corner",
    "story.rails_that_diverge",
    "story.the_compass_does_not_walk_for_you",
    "story.tree_and_silent_goose",
}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_stories() -> list[dict]:
    return [read_json(path) for path in sorted((SOURCE_ROOT / "stories").glob("*/story.vi.json"))]


def body_blocks(story: dict) -> list[dict]:
    return [block for section in story["sections"] for block in section["blocks"]]


def manifested_stories(channel: str) -> dict[str, dict]:
    root = APP_ROOT / f"perspective-library/{channel}/vi"
    manifest = read_json(root / "manifest.json")
    return {
        entry["id"]: read_json(root / entry["path"])
        for entry in manifest["files"]
        if entry["kind"] == "story"
    }


def semantic_sequence(story: dict) -> list[str]:
    sequence = []
    for section in story["sections"]:
        if section.get("title_vi"):
            sequence.append(f"section_title:{section['id']}")
        sequence.extend(f"block:{block['id']}" for block in section["blocks"])
    return sequence


def locked_prose_digest(story: dict) -> str:
    texts = [
        block["text_vi"]
        for block in body_blocks(story)
        if block["type"] != "part_heading" and block.get("text_vi")
    ]
    normalized = re.sub(r"\s+", " ", " ".join(texts)).strip() + "\n"
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


class StoryV2ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.stories = canonical_stories()
        cls.by_id = {story["id"]: story for story in cls.stories}

    def test_locked_story_prose_is_unchanged(self) -> None:
        locks = read_json(LOCK_FILE)["stories"]
        for lock in locks:
            with self.subTest(story_id=lock["id"]):
                self.assertEqual(locked_prose_digest(self.by_id[lock["id"]]), lock["sha256"])

    def test_editorial_v2_semantics(self) -> None:
        for story in self.stories:
            if story.get("reader_format") != "editorial_v2":
                continue
            with self.subTest(story_id=story["id"]):
                self.assertEqual(story["schema_version"], "1.1")
                self.assertIn(len(story["reflection"]["prompts_vi"]), (1, 2))
                blocks = body_blocks(story)
                for block in blocks:
                    if block["type"] == "paragraph":
                        self.assertIn(block.get("style"), ("narrative", "dialogue_lead", "dialogue", "transition"))
                parts = [block["part_number"] for block in blocks if block["type"] == "part_heading"]
                self.assertEqual(parts, list(range(1, len(parts) + 1)))
                for left, right in zip(blocks, blocks[1:]):
                    self.assertFalse(left["type"] == right["type"] == "pull_quote")

    def test_released_story_order_survives_materialization(self) -> None:
        canonical = {story["id"]: story for story in self.stories}
        authoring = manifested_stories("authoring")
        release = manifested_stories("release")
        self.assertEqual(set(release), RELEASED_STORY_IDS)
        for story_id in RELEASED_STORY_IDS:
            with self.subTest(story_id=story_id):
                expected = semantic_sequence(canonical[story_id])
                self.assertEqual(semantic_sequence(authoring[story_id]), expected)
                self.assertEqual(semantic_sequence(release[story_id]), expected)

    def test_web_renderer_keeps_section_and_block_order(self) -> None:
        renderer = (APP_ROOT / "story/app.mjs").read_text(encoding="utf-8")
        self.assertNotIn("blocks.shift()", renderer)
        self.assertNotIn("section.blocks.sort", renderer)
        self.assertIn("(section.blocks||[]).forEach", renderer)

    def test_web_renderer_prefers_story_hero_over_theme_artwork(self) -> None:
        renderer = (APP_ROOT / "story/app.mjs").read_text(encoding="utf-8")
        story_hero = "descriptors.get(story.hero_image?.file_id)"
        theme_artwork = "artworkByTheme.get(story.primary_theme)"
        self.assertIn(story_hero, renderer)
        self.assertIn(theme_artwork, renderer)
        self.assertLess(renderer.index(story_hero), renderer.index(theme_artwork))

    def test_shared_artwork_references_canonical_files(self) -> None:
        source_index = read_json(SOURCE_ROOT / "source.json")
        entries = {entry["id"]: entry for entry in source_index["files"]}
        catalog = read_json(SOURCE_ROOT / "artwork/story-artwork-catalog.vi.json")
        for mapping in catalog["themes"]:
            with self.subTest(theme=mapping["theme_id"]):
                descriptor = entries[mapping["file_id"]]
                self.assertEqual(descriptor["kind"], "image")
                self.assertTrue((SOURCE_ROOT / descriptor["path"]).is_file())

    def test_selected_v2_story_shape(self) -> None:
        expected = {
            "story.old_man_and_returning_horse": (3, 8, 3, 0),
            "story.original_if_i_lived_a_human_life": (29, 205, 11, 3),
            "story.the_compass_does_not_walk_for_you": (12, 156, 4, 3),
            "story.empty_boat_on_the_river": (3, 8, 1, 0),
            "story.large_tree_beyond_the_carpenters_measure": (3, 8, 1, 0),
            "story.photograph_missing_a_corner": (4, 24, 1, 0),
            "story.tree_and_silent_goose": (3, 10, 2, 0),
        }
        for story_id, shape in expected.items():
            story = self.by_id[story_id]
            blocks = body_blocks(story)
            actual = (
                len(story["sections"]),
                len(blocks),
                sum(block["type"] == "pull_quote" for block in blocks),
                sum(block["type"] == "part_heading" for block in blocks),
            )
            with self.subTest(story_id=story_id):
                self.assertEqual(actual, shape)


if __name__ == "__main__":
    unittest.main()
