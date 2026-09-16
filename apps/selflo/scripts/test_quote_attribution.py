import hashlib
import json
import unittest
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = APP_ROOT / "perspective-library/source/vi"
LOCK_PATH = APP_ROOT / "perspective-library/tooling/locked-quote-content.json"


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def compact_sha(value):
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def canonical_quotes():
    quotes = []
    for path in sorted((SOURCE_ROOT / "quotes").glob("*/*.vi.json")):
        quotes.extend(read_json(path)["quotes"])
    return sorted(quotes, key=lambda quote: quote["id"])


def package_quotes(channel):
    root = APP_ROOT / f"perspective-library/{channel}/vi"
    manifest = read_json(root / "manifest.json")
    quotes = []
    for descriptor in manifest["files"]:
        if descriptor["kind"] == "quote_pack":
            quotes.extend(read_json(root / descriptor["path"])["quotes"])
    return sorted(quotes, key=lambda quote: quote["id"])


class QuoteAttributionTests(unittest.TestCase):
    def test_all_canonical_quotes_have_explicit_reader_attribution(self):
        quotes = canonical_quotes()
        self.assertTrue(quotes)
        for quote in quotes:
            attribution = quote["display"]["attribution_vi"]
            self.assertIsInstance(attribution, str, quote["id"])
            self.assertTrue(attribution.strip(), quote["id"])
            self.assertNotIn("Trang Tử · Trang Tử", attribution, quote["id"])

    def test_known_classical_attributions_are_editorially_explicit(self):
        quotes = {quote["id"]: quote for quote in canonical_quotes()}
        expected = {
            "attributed.zhuangzi.chapter_20.change_with_time": "Trang Tử · Sơn mộc (chương 20)",
            "attributed.zhuangzi.chapter_01.rest_beneath_tree": "Trang Tử · Tiêu dao du (chương 1)",
            "attributed.confucius.book_i_ch01.learning": "Khổng Tử · Luận Ngữ · I.1",
            "attributed.epictetus.ench_04.prepare": "Epictetus · Encheiridion · IV",
            "attributed.ma.iv_31.love_your_art": "Marcus Aurelius · Suy tưởng · Quyển IV, đoạn 31",
        }
        for quote_id, attribution in expected.items():
            self.assertEqual(quotes[quote_id]["display"]["attribution_vi"], attribution)

    def test_materialized_packages_preserve_display_attribution(self):
        canonical = {quote["id"]: quote for quote in canonical_quotes()}
        authoring = {quote["id"]: quote for quote in package_quotes("authoring")}
        release = {quote["id"]: quote for quote in package_quotes("release")}
        self.assertEqual(set(authoring), set(canonical))
        for quote_id, quote in authoring.items():
            self.assertEqual(
                quote["display"]["attribution_vi"],
                canonical[quote_id]["display"]["attribution_vi"],
            )
        for quote_id, quote in release.items():
            self.assertEqual(
                quote["display"]["attribution_vi"],
                canonical[quote_id]["display"]["attribution_vi"],
            )

    def test_quote_text_and_provenance_remain_locked(self):
        lock = read_json(LOCK_PATH)
        quotes = canonical_quotes()
        self.assertEqual(len(quotes), lock["quote_count"])
        self.assertEqual(
            compact_sha([[quote["id"], quote["text_vi"]] for quote in quotes]),
            lock["quote_text_sha256"],
        )
        self.assertEqual(
            compact_sha([[quote["id"], quote["authorship"]] for quote in quotes]),
            lock["authorship_sha256"],
        )


if __name__ == "__main__":
    unittest.main()
