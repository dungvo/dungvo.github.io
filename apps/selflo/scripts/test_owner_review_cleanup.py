"""Keep the owner's closed review decisions out of subsequent releases."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

def read(path):
    return json.loads((ROOT / path).read_text())

def quotes(channel):
    base = Path(f'perspective-library/{channel}/vi')
    manifest = read(base / 'manifest.json')
    return {q['id']: q for f in manifest['files'] if f['kind'] == 'quote_pack'
            for q in read(base / f['path'])['quotes']}

class OwnerReviewCleanupTests(unittest.TestCase):
    def test_rejected_items_are_closed_and_excluded_from_release(self):
        report = read('content-workspace/programs/quote-library-p0/reports/owner-review-cleanup-2026-10-25.json')
        exclusions = {x['quote_id'] for x in read('perspective-library/source/vi/decisions/canonical-decisions.json')['release_quote_exclusions']}
        ledger = {x['quote_id']: x for x in read('content-workspace/curated/quote-research/review-pipeline/canonical-ai-review.json')['decisions']}
        shortlist = set(read('content-workspace/curated/quote-research/review-pipeline/release-shortlist.json')['quote_ids'])
        authoring, release = quotes('authoring'), quotes('release')
        for ident in report['removed_ids']:
            with self.subTest(quote_id=ident):
                self.assertIn(ident, exclusions)
                self.assertNotIn(ident, release)
                self.assertNotIn(ident, shortlist)
                self.assertEqual(authoring[ident]['review']['status'], 'rejected')
                self.assertEqual(ledger[ident]['decision'], 'round1_not_pass')
        for verse in ['005.hatred', '050.own_deeds', '081.rock']:
            self.assertIn('attributed.dhammapada.verse_' + verse, release)

    def test_release_reader_attribution_has_no_internal_english_labels(self):
        for ident, quote in quotes('release').items():
            with self.subTest(quote_id=ident):
                self.assertNotRegex(quote['display']['attribution_vi'],
                    r'Inner Chapters attribution|Buddhist canonical verse tradition|Vietnamese oral tradition|Confucius tradition')
