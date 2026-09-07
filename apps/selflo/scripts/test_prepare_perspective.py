import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('prepare', Path(__file__).with_name('prepare-perspective.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PrepareTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.source = self.root / 'perspective-library/source/vi'
        self.source.mkdir(parents=True)
        self.args = SimpleNamespace(quote=['q'], channel='release', list=False, rights=None,
                                   rights_note=None, reviewer='owner:test', confirm_knowledge_checked=False, dry_run=False)
        self.quote = {'id': 'q', 'story_id': 's', 'primary_theme': 'meaning',
                      'review': {'status': 'needs_owner_review'}, 'rights': {'status': 'selflo_owned'},
                      'metadata': {'concepts': ['c']}}
        self.story = {'id': 's', 'status': 'draft', 'primary_theme': 'meaning',
                      'review': {'status': 'needs_owner_review'}, 'rights': {'status': 'selflo_owned'}}
        self.knowledge = {'concepts': [{'id': 'c', 'status': 'draft', 'related_theory_ids': ['t']}],
                          'theories': [{'id': 't', 'status': 'draft', 'validation_status': 'pending_source_review',
                                        'reference_ids': ['r'], 'core_truths': []},
                                       {'id': 'unrelated', 'status': 'draft', 'core_truths': []}],
                          'references': [{'id': 'r', 'validation_status': 'pending_source_review'}], 'frameworks': []}
        self.write()

    def write(self):
        docs = [('q.json', 'quote_fragment', {'quotes': [self.quote]}), ('s.json', 'story', self.story),
                ('k.json', 'knowledge_catalog', self.knowledge)]
        for name, _, value in docs:
            (self.source / name).write_text(json.dumps(value))
        (self.source / 'source.json').write_text(json.dumps({'source_revision': 1, 'content_version': 'v1',
            'files': [{'path': name, 'kind': kind} for name, kind, _ in docs]}))

    def test_pending_knowledge_blocks_without_writes(self):
        before = module.fingerprint(self.root)
        with self.assertRaisesRegex(ValueError, 'Check these sources'):
            module.prepare(self.root, self.args)
        self.assertEqual(before, module.fingerprint(self.root))

    def test_explicit_confirmation_only_updates_dependencies(self):
        self.args.confirm_knowledge_checked = True
        changes = module.prepare(self.root, self.args)
        self.assertEqual(changes[self.source / 's.json']['status'], 'active')
        k = changes[self.source / 'k.json']
        self.assertEqual(k['theories'][0]['validation_status'], 'source_checked')
        self.assertEqual(k['theories'][1]['status'], 'draft')
        self.assertEqual(changes[self.source / 'source.json']['source_revision'], 2)

    def test_unknown_quote_and_rights_fail_without_writes(self):
        before = module.fingerprint(self.root)
        self.args.quote = ['unknown']
        with self.assertRaisesRegex(ValueError, 'Unknown quote'):
            module.prepare(self.root, self.args)
        self.args.quote = ['q']
        self.quote['rights']['status'] = 'unverified'
        self.write()
        before = module.fingerprint(self.root)
        with self.assertRaisesRegex(ValueError, 'rights unverified'):
            module.prepare(self.root, self.args)
        self.assertEqual(before, module.fingerprint(self.root))

    def test_shared_story_rejected(self):
        (self.source / 'q.json').write_text(json.dumps({'quotes': [self.quote, dict(self.quote, id='q2')]}))
        with self.assertRaisesRegex(ValueError, 'multiple quote owners'):
            module.prepare(self.root, self.args)

    def test_authoring_preserves_rights(self):
        self.story['status'] = 'active'
        self.story['review']['status'] = self.quote['review']['status'] = 'approved'
        self.write()
        self.args.channel = 'authoring'
        changes = module.prepare(self.root, self.args)
        self.assertEqual(changes[self.source / 's.json']['status'], 'draft')
        self.assertEqual(changes[self.source / 'q.json']['quotes'][0]['rights']['status'], 'selflo_owned')
        self.assertNotIn(self.source / 'k.json', changes)

    def test_dry_run_never_writes_or_runs_publisher(self):
        self.args.channel = 'authoring'
        self.args.dry_run = True
        changes = module.prepare(self.root, self.args)
        before = module.fingerprint(self.root / 'perspective-library')
        module.publish_transaction(self.root, changes, self.args, before)
        self.assertEqual(before, module.fingerprint(self.root / 'perspective-library'))

    def test_explicit_exclusion_is_not_silently_removed(self):
        path = self.source / 'source.json'
        index = module.read(path)
        index['files'].append({'kind': 'authoring_decisions', 'path': 'decisions.json'})
        path.write_text(json.dumps(index))
        (self.source / 'decisions.json').write_text(json.dumps({'release_quote_exclusions': [{'quote_id': 'q'}]}))
        with self.assertRaisesRegex(ValueError, 'explicitly excluded'):
            module.prepare(self.root, self.args)

    def test_publisher_failure_keeps_original_files(self):
        self.args.confirm_knowledge_checked = True
        changes = module.prepare(self.root, self.args)
        scripts = self.root / 'scripts'
        scripts.mkdir()
        (scripts / 'publish-perspective-library').write_text('abort("simulated validation failure")\n')
        before = module.fingerprint(self.root / 'perspective-library')
        with self.assertRaises(module.subprocess.CalledProcessError):
            module.publish_transaction(self.root, changes, self.args, before)
        self.assertEqual(before, module.fingerprint(self.root / 'perspective-library'))


class PublisherRevisionTests(unittest.TestCase):
    def test_reintroduced_entity_uses_highest_historical_revision(self):
        publisher = Path(__file__).with_name('publish-perspective-library').read_text()
        helper = 'def next_available_revision' + publisher.split('def next_available_revision', 1)[1].split('def without_revisions', 1)[0]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'stories').mkdir()
            for name in ['story.vi.r1.json', 'story.vi.r4.json', 'other.vi.r99.json']:
                (root / 'stories' / name).write_text('{}')
            code = helper + '\nputs next_available_revision(ARGV[0], "stories/story.vi.json", nil)\nputs next_available_revision(ARGV[0], "stories/story.vi.json", {"revision" => 7})\n'
            result = module.subprocess.run(['ruby', '-e', code, str(root)], check=True, capture_output=True, text=True)
            self.assertEqual(result.stdout.splitlines(), ['5', '8'])


if __name__ == '__main__':
    unittest.main()
