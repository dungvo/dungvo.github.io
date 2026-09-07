#!/usr/bin/env python3
"""Index per-entity changes from immutable payload history and publish audits."""
import json
from pathlib import Path
import re
import sys


def normalized(value):
    if isinstance(value, dict):
        return {k: normalized(v) for k, v in value.items() if k != 'revision'}
    if isinstance(value, list):
        return [normalized(v) for v in value]
    return value


def build(root):
    manifest = json.loads((root / 'manifest.json').read_text())
    audits = [json.loads(p.read_text()) for p in (root / 'audit').glob('r*.json')]
    audits.sort(key=lambda a: a['library_revision'])
    entities = {}
    live_ids = set()
    for descriptor in manifest['files']:
        if descriptor['kind'] not in ('story', 'quote_pack'):
            continue
        current_path = root / descriptor['path']
        active = json.loads(current_path.read_text())
        live_ids.update(q['id'] for q in active['quotes']) if descriptor['kind'] == 'quote_pack' else live_ids.add(active['id'])
        stem = re.sub(r'\.r\d+\.json$', '', current_path.name)
        versions = []
        for p in current_path.parent.glob(stem + '.r*.json'):
            match = re.fullmatch(re.escape(stem) + r'\.r(\d+)\.json', p.name)
            if match and int(match[1]) <= descriptor['revision']:
                versions.append((int(match[1]), p))
        versions.sort()
        events = [a for a in audits if descriptor['id'] in a.get('changed_file_ids', [])]
        # Missing historical audits must not invent precise update dates.
        dates = {revision: event for (revision, _), event in zip(versions, events)} if len(versions) == len(events) else {}
        last_values = {}
        for revision, path in versions:
            payload = json.loads(path.read_text())
            members = payload['quotes'] if descriptor['kind'] == 'quote_pack' else [payload]
            for member in members:
                ident = member['id']
                content = normalized(member)
                if last_values.get(ident) != content:
                    entities[ident] = {'updated_at': dates.get(revision, {}).get('generated_at'), 'library_revision': dates.get(revision, {}).get('library_revision')}
            last_values = {member['id']: normalized(member) for member in members}
    result = {'library_revision': manifest['library_revision'], 'generated_at': manifest['generated_at'], 'entities': {k:v for k,v in entities.items() if k in live_ids}}
    (root / 'updates.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    build(Path(sys.argv[1]))
