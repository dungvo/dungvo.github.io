#!/usr/bin/env python3
"""Prepare selected canonical quotes and linked stories, validate, then publish locally."""
import argparse
import copy
import datetime as dt
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

RIGHTS = ('selflo_owned', 'public_domain', 'licensed', 'permission_granted')


def read(path):
    return json.loads(path.read_text())


def fingerprint(root):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in root.rglob('*') if p.is_file()}


def dependencies(knowledge, quotes, stories):
    groups = {g: {x['id']: x for x in knowledge[g]}
              for g in ('concepts', 'theories', 'frameworks', 'references')}
    needed = {g: set() for g in groups}
    truths = {t['id']: x['id'] for x in knowledge['theories'] for t in x['core_truths']}
    for q in quotes:
        m = q.get('metadata') or {}
        for g in ('concepts', 'theories', 'frameworks'):
            needed[g].update(m.get(g) or [])
        basis = q.get('knowledge_basis') or {}
        needed['references'].update(basis.get('reference_ids') or [])
        for truth in basis.get('core_truth_ids') or []:
            if truth not in truths:
                raise ValueError('Missing core truth: ' + truth)
            needed['theories'].add(truths[truth])
    for s in stories:
        needed['concepts'].update((s.get('metadata') or {}).get('concept_ids') or [])
    for g in groups:
        for ident in sorted(needed[g]):
            if ident not in groups[g]:
                raise ValueError('Missing knowledge dependency: ' + ident)
            item = groups[g][ident]
            if g == 'concepts':
                needed['theories'].update(item.get('related_theory_ids') or [])
                needed['frameworks'].update(item.get('related_framework_ids') or [])
            elif g in ('theories', 'frameworks'):
                needed['references'].update(item.get('reference_ids') or [])
    return [(g, groups[g][ident]) for g in groups for ident in sorted(needed[g])]


def prepare(root, args):
    source = root / 'perspective-library/source/vi'
    index = read(source / 'source.json')
    docs = {}
    def load(entry):
        path = (source / entry['path']).resolve()
        if not path.is_relative_to(source.resolve()):
            raise ValueError('Source path escapes canonical directory')
        if path not in docs:
            docs[path] = read(path)
        return path, docs[path]
    quotes, stories = {}, {}
    knowledge = None
    exclusions = set()
    for entry in index['files']:
        kind = entry['kind']
        if kind not in ('quote_fragment', 'quote_pack', 'story', 'knowledge_catalog', 'authoring_decisions'):
            continue
        path, doc = load(entry)
        if kind in ('quote_fragment', 'quote_pack'):
            for quote in doc.get('quotes', []):
                if quote['id'] in quotes:
                    raise ValueError('Duplicate quote ID: ' + quote['id'])
                quotes[quote['id']] = quote
        elif kind == 'story':
            if doc['id'] in stories:
                raise ValueError('Duplicate story ID: ' + doc['id'])
            stories[doc['id']] = doc
        elif kind == 'knowledge_catalog':
            knowledge = doc
        else:
            exclusions.update(x['quote_id'] for x in doc.get('release_quote_exclusions', []))
    originals = copy.deepcopy(docs)
    if args.list:
        for ident, q in quotes.items():
            text = (q.get('title_vi') or q.get('text_vi') or '').replace('\n', ' ')[:90]
            print(f"{ident}\t{q.get('story_id') or '-'}\t{q['review']['status']}\t{text}")
        return {}
    if not args.quote:
        raise ValueError('Supply --quote ID (repeatable), or use --list.')
    selected = []
    linked = {}
    for ident in dict.fromkeys(args.quote):
        if ident not in quotes:
            raise ValueError('Unknown quote ID: ' + ident + '; use --list.')
        if args.channel == 'release' and ident in exclusions:
            raise ValueError('Quote is explicitly excluded by owner: ' + ident + '. Resolve the decision ledger first.')
        q = quotes[ident]
        selected.append(q)
        sid = q.get('story_id')
        if sid:
            if sid not in stories:
                raise ValueError('Missing linked story: ' + sid)
            owners = [x['id'] for x in quotes.values() if x.get('story_id') == sid]
            if len(owners) != 1:
                raise ValueError(f'Story {sid} has multiple quote owners: {owners}')
            if stories[sid]['primary_theme'] != q['primary_theme']:
                raise ValueError('Quote/story theme mismatch: ' + ident)
            linked[sid] = stories[sid]
        print(f"{ident} -> {sid or '(quote only)'} -> {args.channel}")
    now = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    for entity in selected + list(linked.values()):
        rights = entity.setdefault('rights', {})
        if args.rights:
            rights['status'] = args.rights
            if args.rights_note:
                rights['note'] = args.rights_note
        if args.channel == 'release':
            if rights.get('status') not in RIGHTS:
                raise ValueError(f"{entity['id']}: rights unverified. Supply --rights and --rights-note after checking rights.")
            review = entity.get('review') or {}
            valid_date = False
            try:
                value = review.get('reviewed_at') or ''
                valid_date = value.endswith(('Z', '+00:00')) and dt.datetime.fromisoformat(value.replace('Z', '+00:00')).utcoffset() == dt.timedelta(0)
            except ValueError:
                pass
            if review.get('status') != 'approved' or not str(review.get('reviewed_by') or '').strip() or not valid_date:
                entity['review'] = {'status': 'approved', 'reviewed_by': args.reviewer, 'reviewed_at': now}
        else:
            entity['review'] = {'status': 'needs_owner_review', 'reviewed_by': None, 'reviewed_at': None}
    for story in linked.values():
        story['status'] = 'active' if args.channel == 'release' else 'draft'
    if args.channel == 'release':
        if knowledge is None:
            raise ValueError('Missing knowledge catalog')
        blocked = []
        for group, item in dependencies(knowledge, selected, list(linked.values())):
            changes = {}
            if group != 'references' and item.get('status') != 'approved':
                changes['status'] = 'approved'
            if group != 'concepts' and item.get('validation_status') != 'source_checked':
                changes['validation_status'] = 'source_checked'
            if changes:
                blocked.append(item['id'])
                if args.confirm_knowledge_checked:
                    item.update(changes)
        if blocked:
            print('Knowledge requiring review: ' + ', '.join(blocked))
            if not args.confirm_knowledge_checked:
                raise ValueError('Check these sources first, then use --confirm-knowledge-checked. No files changed.')
    changes = {path: value for path, value in docs.items() if value != originals[path]}
    if changes:
        index['source_revision'] += 1
        index['content_version'] = f"{args.channel}-selected-quotes-{index['source_revision']}"
        changes[source / 'source.json'] = index
    return changes


def publish_transaction(root, changes, args, baseline):
    library = root / 'perspective-library'
    if args.dry_run:
        for path in changes:
            print('Would update: ' + str(path.relative_to(root)))
        print('Dry run: no files changed; publisher not run.')
        return
    publisher = root / 'scripts/publish-perspective-library'
    if not publisher.is_file():
        raise ValueError('Missing publisher: ' + str(publisher))
    with tempfile.TemporaryDirectory(prefix='selflo-prepare-') as directory:
        staged = Path(directory)
        shutil.copytree(library, staged / 'perspective-library')
        for path, value in changes.items():
            (staged / path.relative_to(root)).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
        # Authoring demotion must also refresh an existing Release to withdraw the pair.
        channels = ['authoring']
        if args.channel == 'release' or (library / 'release/vi/manifest.json').exists():
            channels.append('release')
        for channel in channels:
            print('Validating/publishing staged ' + channel + '...', flush=True)
            subprocess.run(['ruby', str(publisher), '--repo-root', str(staged), '--channel', channel], check=True)
        release_root = staged / 'perspective-library/release/vi'
        if 'release' in channels:
            manifest = read(release_root / 'manifest.json')
            released = {q['id']: q for entry in manifest['files'] if entry['kind'] == 'quote_pack'
                        for q in read(release_root / entry['path'])['quotes']}
            for ident in args.quote:
                if (ident in released) != (args.channel == 'release'):
                    raise ValueError('Publisher output does not match requested mode: ' + ident)
        staged_library = staged / 'perspective-library'
        current = fingerprint(staged_library)
        changed = [name for name, digest in current.items() if baseline.get(name) != digest]
        # Install payloads before manifests so readers never see missing revisions.
        changed.sort(key=lambda name: (Path(name).name == 'manifest.json', name))
        if fingerprint(library) != baseline:
            raise ValueError('Library changed during validation. Nothing installed; rerun against latest content.')
        # Preserve originals for rollback if a filesystem write fails.
        backups = {name: (library / name).read_bytes() if (library / name).exists() else None for name in changed}
        installed = []
        try:
            for name in changed:
                target = library / name
                target.parent.mkdir(parents=True, exist_ok=True)
                installed.append(name)
                target.write_bytes((staged_library / name).read_bytes())
        except BaseException:
            for name in reversed(installed):
                target = library / name
                if backups[name] is None:
                    target.unlink(missing_ok=True)
                else:
                    target.write_bytes(backups[name])
            raise
        print(f'Done: {len(changed)} files updated locally. No commit, push or app configuration change.')


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent, help='Selflo website root')
    parser.add_argument('--channel', choices=('authoring', 'release'))
    parser.add_argument('--quote', action='append', help='Exact quote ID; repeat for a batch')
    parser.add_argument('--list', action='store_true', help='List quote IDs, linked stories and status')
    parser.add_argument('--reviewer', default='owner:dungvo')
    parser.add_argument('--rights', choices=RIGHTS, help='Explicit rights assertion for ALL selected quotes and stories; otherwise retain current rights')
    parser.add_argument('--rights-note', help='Evidence/reason for the rights assertion')
    parser.add_argument('--confirm-knowledge-checked', action='store_true', help='Assert you reviewed the selected pair dependencies; approve only those dependencies')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args(argv)
    try:
        if not args.list and not args.channel:
            raise ValueError('Supply --channel authoring or --channel release explicitly')
        if not args.reviewer.strip():
            raise ValueError('Reviewer must not be empty')
        if bool(args.rights) != bool(args.rights_note and args.rights_note.strip()):
            raise ValueError('--rights and a nonempty --rights-note must be supplied together')
        if args.channel == 'authoring' and args.confirm_knowledge_checked:
            raise ValueError('--confirm-knowledge-checked applies only to release')
        args.root = args.root.resolve()
        baseline = fingerprint(args.root / 'perspective-library')
        changes = prepare(args.root, args)
        if not args.list:
            publish_transaction(args.root, changes, args, baseline)
        return 0
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        print('ERROR: ' + str(error), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
