import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
from review_eligibility import ReviewEligibility

spec=importlib.util.spec_from_file_location('daily_guards',Path(__file__).with_name('daily-content-review.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
spec2=importlib.util.spec_from_file_location('prepare_guards',Path(__file__).with_name('prepare-perspective.py'))
prepare=importlib.util.module_from_spec(spec2);spec2.loader.exec_module(prepare)

class ReviewGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        self.queue=self.root/'content-workspace/curated/quote-research/review-pipeline'
        self.source=self.root/'perspective-library/source/vi'
        self.candidate={'id':'new','text_vi':'Một câu mới.','source_row':1,'theme':'attention','verification':'A - Primary source'}
        self.quote={'id':'q','review':{'status':'needs_owner_review'},'text_vi':'Một câu đang review.'}
        self.save(self.queue/'review-candidates.json',{'candidates':[self.candidate]})
        self.save(self.queue/'canonical-ai-review.json',{'decisions':[]})
        self.save(self.source/'decisions.json',{'release_quote_exclusions':[]})
        self.save(self.source/'q.json',{'quotes':[self.quote]})
        self.save(self.source/'theme.json',{'primary_theme':'attention','quote_fragment_ids':['fragment.attention']})
        self.save(self.source/'source.json',{'source_revision':1,'canonical_quote_count':1,'files':[
            {'id':'fragment.attention','kind':'quote_fragment','path':'q.json'},
            {'id':'theme.attention','kind':'quote_pack','path':'theme.json'},
            {'id':'decisions','kind':'authoring_decisions','path':'decisions.json'}]})
        self.ledger=self.root/'ledger.json'
        self.args=SimpleNamespace(root=self.root,ledger=self.ledger,count=5,date='2026-10-25',push=False,
                                  rights=None,rights_note=None,confirm_knowledge_checked=False)
    def save(self,p,value):
        p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value))
    def ledger_for(self,ident,stage='candidate',decision='approved'):
        self.save(self.ledger,{'library_id':f'selflo.perspective.{stage}.vi','decisions':[{'quote_id':ident,'decision':decision}]})
    def fingerprint(self):
        return {str(p.relative_to(self.root)):p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
    def alias(self):
        self.candidate.update(id='alias',research_id_original='q')
        self.save(self.queue/'review-candidates.json',{'candidates':[self.candidate]})
    def state(self,rec):
        self.save(self.queue/'state.json',{'batch_sequence':0,'history':[],'candidates':rec})

    def test_select_never_requeues_rejected_canonical_through_alias(self):
        self.alias();self.quote['review']['status']='rejected';self.save(self.source/'q.json',{'quotes':[self.quote]})
        before=self.fingerprint();module.select(self.args);self.assertEqual(before,self.fingerprint())
    def test_select_never_reimports_existing_canonical_without_state(self):
        self.alias();before=self.fingerprint();module.select(self.args);self.assertEqual(before,self.fingerprint())
    def test_select_skips_state_rejection_on_original_id(self):
        self.candidate['research_id_original']='old';self.save(self.queue/'review-candidates.json',{'candidates':[self.candidate]})
        self.state({'old':{'second_review':'rejected'}})
        before=self.fingerprint();module.select(self.args);self.assertEqual(before,self.fingerprint())
    def test_select_valid_new_candidate_remains_available(self):
        module.select(self.args)
        state=module.read(self.queue/'state.json');self.assertEqual(state['candidates']['new']['first_review'],'queued')
    def test_old_approval_cannot_override_closed_ledger(self):
        self.alias();self.save(self.queue/'canonical-ai-review.json',{'decisions':[{'quote_id':'q','decision':'round1_not_pass'}]})
        self.ledger_for('alias');before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'Closed review'):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_rights_block_applies_to_alias(self):
        self.alias();self.save(self.queue/'canonical-ai-review.json',{'decisions':[{'quote_id':'q','decision':'source_rights_blocked'}]})
        with self.assertRaisesRegex(ValueError,'source_rights_blocked'):ReviewEligibility(self.root).require_open('alias')
    def test_unknown_candidate_fails_without_state_write(self):
        self.ledger_for('unknown');before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'Unknown candidate'):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_existing_canonical_is_not_imported_twice_if_state_missing(self):
        self.alias();self.ledger_for('alias')
        with patch.object(module,'staged_publish') as publisher:
            module.promote_authoring(self.args);publisher.assert_not_called()
        self.assertEqual(len(module.read(self.source/'q.json')['quotes']),1)
    def test_authoring_publisher_failure_does_not_record_approval(self):
        self.ledger_for('new');before=self.fingerprint()
        with patch.object(module,'staged_publish',side_effect=ValueError('publisher failed')):
            with self.assertRaisesRegex(ValueError,'publisher failed'):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_valid_authoring_import_records_state_after_publication(self):
        self.ledger_for('new')
        with patch.object(module,'staged_publish') as publisher:
            module.promote_authoring(self.args);publisher.assert_called_once()
            changes=publisher.call_args.args[1]
            self.assertEqual([q['id'] for q in changes[Path('perspective-library/source/vi/q.json')]['quotes']],['q','new'])
        self.assertEqual(module.read(self.queue/'state.json')['candidates']['new']['authoring'],'imported')
    def test_release_exclusion_blocks_stale_approval_without_writes(self):
        self.alias();self.save(self.source/'decisions.json',{'release_quote_exclusions':[{'quote_id':'q'}]})
        self.ledger_for('alias','authoring');before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'explicitly excluded'):module.promote_release(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_release_publisher_failure_keeps_state_unchanged(self):
        self.alias();self.ledger_for('alias','authoring');self.state({'alias':{'authoring':'imported'}});before=self.fingerprint()
        with patch.object(module,'run',side_effect=ValueError('publisher failed')):
            with self.assertRaisesRegex(ValueError,'publisher failed'):module.promote_release(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_release_resolves_alias_and_uses_current_manifest_not_old_state(self):
        self.alias();self.ledger_for('alias','authoring');self.state({'alias':{'release':'released'}})
        def publish(cmd):
            self.assertIn('q',cmd);self.assertNotIn('alias',cmd)
            self.assertEqual(cmd[cmd.index('--reviewer')+1],'ai:codex')
            self.save(self.root/'perspective-library/release/vi/manifest.json',{'files':[{'kind':'quote_pack','path':'q.json'}]})
            self.save(self.root/'perspective-library/release/vi/q.json',{'quotes':[self.quote]})
        with patch.object(module,'run',side_effect=publish) as publisher:
            module.promote_release(self.args);publisher.assert_called_once()
        state=module.read(self.queue/'state.json')
        self.assertEqual(state['candidates']['alias']['release'],'released')
        self.assertEqual(state['candidates']['q']['release'],'released')
    def test_missing_quote_after_publish_does_not_record_release(self):
        self.ledger_for('q','authoring');self.save(self.root/'perspective-library/release/vi/manifest.json',{'files':[]});before=self.fingerprint()
        with patch.object(module,'run'):
            with self.assertRaisesRegex(ValueError,'absent from published'):module.promote_release(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_ambiguous_identity_is_not_silently_resolved(self):
        self.alias();self.save(self.source/'q.json',{'quotes':[self.quote,{'id':'alias','review':{'status':'approved'}}]})
        self.ledger_for('alias','authoring');before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'ambiguous'):module.promote_release(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_prepare_cannot_silently_reapprove_rejected_quote(self):
        self.quote['review']['status']='rejected';self.save(self.source/'q.json',{'quotes':[self.quote]})
        self.args.quote=['q'];self.args.list=False;self.args.channel='release';before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'canonical rejected'):prepare.prepare(self.root,self.args)
        self.assertEqual(before,self.fingerprint())

    def test_conflicting_duplicate_ledger_entries_are_not_last_writer_wins(self):
        self.ledger_for('new')
        ledger=module.read(self.ledger)
        ledger['decisions'].append({'quote_id':'new','decision':'rejected'})
        self.save(self.ledger,ledger);before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'Duplicate quote ID'):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_select_queues_only_one_alias_of_the_same_research_capture(self):
        other={**self.candidate,'id':'other','research_id_original':'capture'}
        self.candidate['research_id_original']='capture'
        self.save(self.queue/'review-candidates.json',{'candidates':[self.candidate,other]})
        module.select(self.args)
        state=module.read(self.queue/'state.json')
        self.assertEqual(len(state['candidates']),1)
    def test_two_approved_aliases_cannot_become_two_new_canonical_quotes(self):
        other={**self.candidate,'id':'other','research_id_original':'capture'}
        self.candidate['research_id_original']='capture'
        self.save(self.queue/'review-candidates.json',{'candidates':[self.candidate,other]})
        self.save(self.ledger,{'library_id':'selflo.perspective.candidate.vi','decisions':[
            {'quote_id':'new','decision':'approved'},{'quote_id':'other','decision':'approved'}]})
        before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'share one quote identity'):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())
    def test_real_publisher_failure_keeps_source_and_state_unchanged(self):
        self.ledger_for('new')
        scripts=self.root/'scripts';scripts.mkdir()
        (scripts/'publish-perspective-library').write_text('abort("simulated daily publisher failure")\n')
        before=self.fingerprint()
        with self.assertRaises(module.subprocess.CalledProcessError):module.promote_authoring(self.args)
        self.assertEqual(before,self.fingerprint())

    def test_prepare_respects_candidate_rejection_under_old_identity(self):
        self.alias();self.state({'alias':{'second_review':'rejected'}})
        self.args.quote=['q'];self.args.list=False;self.args.channel='release';before=self.fingerprint()
        with self.assertRaisesRegex(ValueError,'candidate review rejected'):prepare.prepare(self.root,self.args)
        self.assertEqual(before,self.fingerprint())
