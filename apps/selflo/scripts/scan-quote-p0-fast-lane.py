#!/usr/bin/env python3
"""Conservative full-corpus scan for quotes releasable without owner item review."""
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
MATRIX = ROOT / 'studio/review-matrix/data.json'
OUT = ROOT / 'content-workspace/programs/quote-library-p0/reports/p0-fast-lane-full-scan.json'
TRUSTED_ORIGINAL_HOSTS = {'zh.wikisource.org', 'la.wikisource.org'}

def canonical_entities():
    source = ROOT / 'perspective-library/source/vi'
    index = json.loads((source / 'source.json').read_text())
    quotes, knowledge = {}, None
    for entry in index['files']:
        path = source / entry['path']
        if entry['kind'] in ('quote_fragment', 'quote_pack'):
            for quote in json.loads(path.read_text()).get('quotes', []):
                quotes[quote['id']] = quote
        elif entry['kind'] == 'knowledge_catalog':
            knowledge = json.loads(path.read_text())
    return quotes, knowledge

def dependencies_ready(quote, knowledge):
    groups = {g:{x['id']:x for x in knowledge[g]} for g in ('concepts','theories','frameworks','references')}
    needed = {g:set() for g in groups}
    metadata = quote.get('metadata') or {}
    for group in ('concepts','theories','frameworks'):
        needed[group].update(metadata.get(group) or [])
    needed['references'].update((quote.get('knowledge_basis') or {}).get('reference_ids') or [])
    changed = True
    while changed:
        before = sum(len(x) for x in needed.values())
        for ident in list(needed['concepts']):
            item = groups['concepts'].get(ident)
            if not item: return False
            needed['theories'].update(item.get('related_theory_ids') or [])
            needed['frameworks'].update(item.get('related_framework_ids') or [])
        for group in ('theories','frameworks'):
            for ident in list(needed[group]):
                item = groups[group].get(ident)
                if not item: return False
                needed['references'].update(item.get('reference_ids') or [])
        changed = before != sum(len(x) for x in needed.values())
    for ident in needed['concepts']:
        if groups['concepts'][ident].get('status') != 'approved': return False
    for group in ('theories','frameworks'):
        for ident in needed[group]:
            item = groups[group][ident]
            if item.get('status') != 'approved' or item.get('validation_status') != 'source_checked': return False
    for ident in needed['references']:
        if groups['references'].get(ident,{}).get('validation_status') != 'source_checked': return False
    return True

def main():
    matrix = json.loads(MATRIX.read_text())
    rows = matrix['rows']
    canonical, knowledge = canonical_entities()
    candidates = []
    reasons = Counter()
    for row in rows:
        if row.get('pipeline') == 'release':
            reasons['already_released'] += 1
            continue
        if row.get('pipeline') != 'authoring':
            reasons['not_canonical_authoring'] += 1
            continue
        if row.get('ai_review_status') not in ('ready_for_owner_review', 'release_shortlist'):
            reasons['editorial_ai_not_passed'] += 1
            continue
        if row.get('confidence') != 'high':
            reasons['source_confidence_not_high'] += 1
            continue
        verification = row.get('verification') or ''
        if not re.search(r'content_nature=(translated_quote|direct_quote|passage|proverb)', verification):
            reasons['not_direct_or_translated_text'] += 1
            continue
        if not re.search(r'verification=A(?:\s|\s*/|\s*-|$)', verification):
            reasons['verification_not_grade_a'] += 1
            continue
        host = urlparse(row.get('source_url') or '').netloc.lower()
        if host not in TRUSTED_ORIGINAL_HOSTS:
            reasons['rights_or_edition_needs_more_review'] += 1
            continue
        if row.get('story_id'):
            reasons['linked_story_needs_separate_gate'] += 1
            continue
        quote = canonical.get(row.get('id'))
        if not quote or knowledge is None or not dependencies_ready(quote, knowledge):
            reasons['knowledge_dependency_not_ready'] += 1
            continue
        candidates.append({k: row.get(k) for k in ('id','text_vi','author','work','source_url','theme','verification','ai_review_status')})
    result = {
        'schema_version':'selflo.quote-p0-fast-lane-scan.v1',
        'matrix_generated_at':matrix.get('generated_at'),
        'authoring_revision':matrix.get('authoring_revision'),
        'release_revision':matrix.get('release_revision'),
        'total_scanned':len(rows),
        'already_released_count':reasons['already_released'],
        'new_strict_candidate_count':len(candidates),
        'strict_release_pool_count':reasons['already_released'] + len(candidates),
        'deferred_count':len(rows) - reasons['already_released'] - len(candidates),
        'deferred_reason_counts':dict(reasons),
        'candidate_host_counts':dict(Counter(urlparse(x['source_url']).netloc for x in candidates)),
        'candidates':candidates,
        'policy_vi':'Scanner bảo thủ: thiếu bất kỳ bằng chứng nào thì hoãn; candidate vẫn phải qua dependency/tag/schema/publisher gate trước Release.'
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k:result[k] for k in ('total_scanned','already_released_count','new_strict_candidate_count','strict_release_pool_count','deferred_count','candidate_host_counts')}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
