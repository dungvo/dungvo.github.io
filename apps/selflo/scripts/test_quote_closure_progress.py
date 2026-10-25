import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('closure',Path(__file__).with_name('build-quote-closure-progress.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class ClosureProgressTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        self.home=self.root/'content-workspace/programs/quote-library-p0'
        self.source=self.root/'perspective-library/source/vi';self.release=self.root/'perspective-library/release/vi'
        self.ledger=self.root/'content-workspace/curated/quote-research/review-pipeline/canonical-ai-review.json'
        self.save(self.home/'reports/quote-closure-baseline-2026-10-25.json',{'baseline_count':2,'baseline_rows':[{'id':'q'},{'id':'raw'}]})
        self.save(self.source/'source.json',{'files':[{'kind':'quote_fragment','path':'q.json'}]})
        self.save(self.source/'q.json',{'quotes':[{'id':'q','text_vi':'Một câu.','review':{'status':'approved'}}]})
        self.save(self.release/'pack.json',{'quotes':[{'id':'q','text_vi':'Một câu.','review':{'status':'approved'}}]})
        pack=(self.release/'pack.json').read_bytes()
        self.save(self.release/'manifest.json',{'library_revision':49,'files':[{'kind':'quote_pack','path':'pack.json','sha256':module.sha(pack),'byte_count':len(pack)}]})
        self.save(self.root/'studio/review-matrix/data.json',{'rows':[{'id':'raw','text_vi':'Raw original'}]})
        self.save(self.root/'evidence.json',{'reviewed':True})
        self.decisions=[self.decision('q','accepted','Một câu.'),self.decision('raw','not_accepted','Raw original')]
        self.save(self.ledger,{'decisions':self.decisions})
        self.proof=self.root/'public.json';self.save(self.proof,{'manifest_sha256':module.sha((self.release/'manifest.json').read_bytes()),'quote_packs_sha256':{'pack.json':module.sha(pack)},'verified_at':'2026-10-25T00:00:00Z'})
    def save(self,p,obj):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj))
    def decision(self,ident,verdict,text):
        return {'quote_id':ident,'decision':'release_ready_ai_approved' if verdict=='accepted' else 'round1_not_pass','note_vi':'Đã đọc và kết luận.',
                'closure':{'program_id':module.PROGRAM,'batch_id':'B001','canonical_id':ident,'verdict':verdict,'reason_code':'context_required','reviewed_text_sha256':module.sha(text.encode()),'evidence_path':'evidence.json'}}
    def test_public_verified_and_rejected_raw_are_counted_once(self):
        self.assertEqual(module.project(self.root,self.proof)['counts'],{'released':1,'not_accepted':1,'remaining':0})
    def test_local_acceptance_is_not_public_completion(self):
        result=module.project(self.root)
        self.assertEqual(result['counts'],{'released':0,'not_accepted':1,'remaining':1})
    def test_changed_text_requires_new_review(self):
        self.save(self.source/'q.json',{'quotes':[{'id':'q','text_vi':'Một câu khác.'}]})
        self.assertEqual(module.project(self.root,self.proof)['rows'][0]['issue'],'review_text_changed_or_missing')
    def test_rejected_quote_still_active_does_not_count_complete(self):
        self.decisions[0]=self.decision('q','not_accepted','Một câu.');self.save(self.ledger,{'decisions':self.decisions})
        self.assertEqual(module.project(self.root,self.proof)['rows'][0]['issue'],'rejected_still_in_release')
    def test_missing_reason_does_not_close_raw(self):
        self.decisions[1]['closure']['reason_code']='pending';self.save(self.ledger,{'decisions':self.decisions})
        self.assertEqual(module.project(self.root,self.proof)['counts']['remaining'],1)
    def test_old_review_without_program_marker_does_not_claim_completed(self):
        del self.decisions[1]['closure'];self.save(self.ledger,{'decisions':self.decisions})
        self.assertEqual(module.project(self.root,self.proof)['counts']['remaining'],1)
    def test_duplicate_ledger_ids_are_rejected(self):
        self.save(self.ledger,{'decisions':self.decisions+[self.decisions[0]]})
        with self.assertRaisesRegex(ValueError,'Duplicate decision'):module.project(self.root,self.proof)
    def test_wrong_public_revision_does_not_count_accepted(self):
        self.save(self.proof,{'manifest_sha256':'old','verified_at':'2026-10-25'})
        self.assertFalse(module.project(self.root,self.proof)['public_verified'])
    def test_missing_evidence_does_not_count_complete(self):
        (self.root/'evidence.json').unlink()
        self.assertEqual(module.project(self.root,self.proof)['counts']['remaining'],2)

    def test_modified_release_payload_is_not_silently_counted(self):
        self.save(self.release/'pack.json',{'quotes':[{'id':'q','text_vi':'Changed behind manifest'}]})
        with self.assertRaisesRegex(ValueError,'checksum mismatch'):module.project(self.root,self.proof)
