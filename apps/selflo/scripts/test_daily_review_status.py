import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from review_status import status_input_digests, STATUS_INPUT_PATHS

spec=importlib.util.spec_from_file_location('daily_review',Path(__file__).with_name('daily-content-review.py'))
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class DailyReviewStatusTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        for name in STATUS_INPUT_PATHS:
            p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text('{}')
        self.path=self.root/'studio/review-matrix/data.json'
        self.path.parent.mkdir(parents=True)
        self.matrix={'generated_at':'2026-10-25T00:00:00Z','authoring_revision':87,'release_revision':48,
            'summary':{'release_quotes':1},'rows':[{'pm_status':'released'},{'pm_status':'held_not_passed'}],
            'status_inputs_sha256':status_input_digests(self.root)}
        self.save()
    def save(self):self.path.write_text(json.dumps(self.matrix))
    def test_fresh_snapshot_reports_editorial_decisions(self):
        result=module.editorial_status(self.root)
        self.assertEqual(result['availability'],'current')
        self.assertEqual(result['states'],{'released':1,'held_not_passed':1})
        self.assertEqual(result['release_revision'],48)
    def test_ledger_change_with_same_release_revision_invalidates_counts(self):
        p=self.root/STATUS_INPUT_PATHS[-2];p.write_text('{"decisions":[{"decision":"round1_not_pass"}]}')
        result=module.editorial_status(self.root)
        self.assertEqual(result['availability'],'stale')
        self.assertNotIn('states',result)
        self.assertIn(STATUS_INPUT_PATHS[-2],result['changed_inputs'])
    def test_new_manifest_invalidates_counts(self):
        (self.root/STATUS_INPUT_PATHS[1]).write_text('{"library_revision":49}')
        self.assertEqual(module.editorial_status(self.root)['availability'],'stale')
    def test_old_matrix_without_fingerprints_is_not_treated_as_current(self):
        del self.matrix['status_inputs_sha256'];self.save()
        self.assertEqual(module.editorial_status(self.root)['availability'],'stale')
    def test_missing_matrix_reports_action_without_guessing(self):
        self.path.unlink();result=module.editorial_status(self.root)
        self.assertEqual(result['availability'],'missing')
        self.assertNotIn('states',result)

    def test_raw_rejection_uses_existing_ledger_in_matrix_projection(self):
        from review_status import apply_closed_decisions
        rows=[{'id':'raw','pipeline':'excluded','why':'Raw chưa review','ai_review_status':'collection_review_pending'}]
        apply_closed_decisions(rows,{'raw':{'decision':'round1_not_pass','review_round':3,'note_vi':'Không đứng độc lập.'}})
        self.assertEqual(rows[0]['ai_review_status'],'round1_not_pass')
        self.assertEqual(rows[0]['why'],'Không đứng độc lập.')
    def test_matrix_never_silently_overrides_active_release_from_old_ledger(self):
        from review_status import apply_closed_decisions
        rows=[{'id':'q','pipeline':'release','why':'Đã phát hành.'}]
        apply_closed_decisions(rows,{'q':{'decision':'round1_not_pass','note_vi':'Phải gỡ qua publisher.'}})
        self.assertNotIn('ai_review_status',rows[0])
