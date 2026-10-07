import json
import unittest
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
MATRIX_PATH = APP_ROOT / "shared" / "contracts" / "story-reader" / "v3" / "component-support.json"


class StoryComponentContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.matrix = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))
        cls.components = cls.matrix["components"]
        cls.by_id = {item["component_id"]: item for item in cls.components}

    def test_component_ids_are_unique(self):
        ids = [item["component_id"] for item in self.components]
        self.assertEqual(len(ids), len(set(ids)))

    def test_every_status_uses_declared_vocabulary(self):
        fields = {"contract_status": "contract", "mockup_status": "mockup", "app_status": "app", "publisher_status": "publisher", "release_status": "release"}
        for component in self.components:
            for field, vocabulary in fields.items():
                with self.subTest(component=component["component_id"], field=field):
                    self.assertIn(component[field], self.matrix["status_values"][vocabulary])

    def test_released_formats_remain_supported_and_allowed(self):
        legacy = [item for item in self.components if item["reader_format"] in {"classic_v1", "editorial_v2"}]
        self.assertTrue(legacy)
        for component in legacy:
            with self.subTest(component=component["component_id"]):
                self.assertEqual((component["contract_status"], component["app_status"], component["publisher_status"], component["release_status"]), ("released", "supported", "enabled", "allowed"))

    def test_v3_production_baseline_is_released_supported_and_allowed(self):
        v3 = [
            item for item in self.components
            if item["reader_format"] == "editorial_v3" and item["component_id"] != "story.flow"
        ]
        self.assertTrue(v3)
        for component in v3:
            with self.subTest(component=component["component_id"]):
                self.assertEqual(component["contract_status"], "released")
                self.assertEqual(component["mockup_status"], "approved")
                self.assertEqual(component["app_status"], "supported")
                self.assertEqual((component["publisher_status"], component["release_status"]), ("enabled", "allowed"))

    def test_flow_is_decode_only_and_blocked_for_new_release(self):
        flow = self.by_id["story.flow"]
        self.assertEqual(flow["app_status"], "supported")
        self.assertEqual(flow["publisher_status"], "disabled")
        self.assertEqual(flow["release_status"], "deprecated")

    def test_approved_gate_3b_components_have_existing_visual_reference(self):
        approved_ids = {
            "story.statement.centered", "story.statement.leading",
            "story.quote.centerpiece", "story.quote.inset", "story.quote.rail",
            "story.divider", "story.takeaway", "story.reflection",
            "story.sequence", "story.flow", "story.list", "story.verse",
            "story.aside", "story.source_note",
        }
        for component_id in approved_ids:
            reference = self.by_id[component_id].get("visual_reference")
            with self.subTest(component=component_id):
                self.assertIsNotNone(reference)
                self.assertTrue((MATRIX_PATH.parent / reference).is_file())

    def test_v3_capabilities_are_known(self):
        known = {"story_reader.editorial_v3.core", "story_reader.editorial_v3.extended_text", "story_reader.editorial_v3.figure"}
        for component in self.components:
            if component["reader_format"] == "editorial_v3":
                self.assertIn(component["capability"], known)

    def test_required_component_surface_is_registered(self):
        required = {"story.classic.paragraph", "story.v2.paragraph.dialogue", "story.opening", "story.paragraph.narrative", "story.dialogue.exchange", "story.dialogue.monologue", "story.dialogue.inner_monologue", "story.dialogue.delivery.spoken", "story.dialogue.delivery.thought", "story.dialogue.delivery.remembered", "story.dialogue.delivery.written", "story.statement.centered", "story.quote.centerpiece", "story.sequence", "story.source_note", "story.figure"}
        self.assertTrue(required.issubset(self.by_id))

    def test_semantic_names_do_not_encode_ui_versions(self):
        for component in self.components:
            haystack = f'{component["component_id"]} {component["wire_selector"]}'
            for token in ("dialog_v3", "new_dialog", "style_2"):
                with self.subTest(component=component["component_id"], token=token):
                    self.assertNotIn(token, haystack)


if __name__ == "__main__":
    unittest.main()
