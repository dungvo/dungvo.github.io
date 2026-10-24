#!/usr/bin/env python3
"""Reproducible corpus triage. Suggestions never confer source/rights approval.

Reads the rebuilt matrix and canonical source; writes a separate research report.
Canonical taxonomy and Release payloads are never modified by this command.
"""
import hashlib
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'content-workspace/programs/quote-library-p0/reports'
THEMES = {'attention', 'emotion', 'self_understanding', 'relationships',
          'adversity_resilience', 'change_growth', 'work_achievement',
          'rest_wellbeing', 'meaning_values'}
ALIASES = {
    'judgment': 'attention', 'control': 'self_understanding',
    'agency': 'self_understanding', 'identity': 'self_understanding',
    'self_worth': 'self_understanding', 'comparison': 'self_understanding',
    'choice': 'self_understanding', 'uncertainty': 'self_understanding',
    'compassion': 'relationships', 'connection': 'relationships', 'trust': 'relationships',
    'values': 'meaning_values', 'meaning': 'meaning_values', 'mortality': 'meaning_values',
    'responsibility': 'meaning_values', 'karma': 'meaning_values',
    'rest': 'rest_wellbeing', 'recovery': 'rest_wellbeing',
    'change': 'change_growth', 'learning': 'change_growth',
    'fear': 'emotion', 'grief': 'emotion', 'acceptance': 'adversity_resilience',
    'failure': 'adversity_resilience',
}
# Transparent lexical suggestions, not semantic or scientific verification.
WORDS = {
 'attention': ['attention','mindful','heedful','thought','perception','judgment','concentrat','distract','notice','observe','chú ý','tập trung','hiện tại','quan sát','suy nghĩ','phán đoán','nhận thức'],
 'emotion': ['emotion','anger','angry','fear','anxiety','sorrow','grief','joy','sadness','hatred','cảm xúc','giận','sợ hãi','lo âu','buồn','vui','đau buồn','thù hận'],
 'self_understanding': ['self-knowledge','self-reliance','self-esteem','identity','oneself','yourself','comparison','choice','decision','tự hiểu','bản thân','bản sắc','so sánh','lựa chọn','quyết định','tự chủ'],
 'relationships': ['friend','companion','relationship','kindness','compassion','love','family','neighbour','neighbor','fellow','trust','bạn bè','đồng hành','quan hệ','yêu thương','gia đình','tử tế','lòng tốt','lòng trắc ẩn','tin cậy'],
 'adversity_resilience': ['adversity','resilien','obstacle','difficulty','difficulties','failure','hardship','endure','persever','suffering','khó khăn','nghịch cảnh','thất bại','kiên trì','vượt qua','chịu đựng','đau khổ'],
 'change_growth': ['learn','practice','habit','growth','change','impermanen','experience','knowledge','education','học','luyện tập','thói quen','thay đổi','trưởng thành','kinh nghiệm','kiến thức','vô thường'],
 'work_achievement': ['work','labour','labor','achievement','success','profession','business','industry','effort','công việc','lao động','thành công','nghề','nỗ lực','thành tựu'],
 'rest_wellbeing': ['rest','sleep','fatigue','health','leisure','repose','tired','nghỉ ngơi','giấc ngủ','mệt','sức khỏe','hồi phục','kiệt sức'],
 'meaning_values': ['virtue','truth','honest','justice','death','mortal','purpose','meaning','value','wisdom','goodness','duty','wealth','contentment','đức hạnh','chân lý','trung thực','công bằng','cái chết','ý nghĩa','giá trị','trí tuệ','biết đủ','trách nhiệm'],
}
def norm(t):
    return ' '.join(unicodedata.normalize('NFKC', t or '').casefold().split())

def suggest(row, canonical):
    theme = canonical.get('primary_theme')
    if theme in THEMES:
        return theme, 'canonical_existing', [theme]
    existing = row.get('theme') or ''
    if existing in THEMES:
        return existing, 'research_existing', [existing]
    aliases = list(dict.fromkeys(ALIASES[x.strip()] for x in existing.split('|') if x.strip() in ALIASES))
    if len(aliases) == 1:
        return aliases[0], 'research_alias_mapping', [existing]
    text = norm(row.get('text_vi'))
    evidence = {t: [w for w in words if re.search(r'(?<!\w)' + re.escape(w), text)] for t, words in WORDS.items()}
    ranked = sorted(evidence, key=lambda t: (-len(evidence[t]), t))
    best, second = ranked[:2]
    if len(evidence[best]) >= 2 and len(evidence[best]) > len(evidence[second]):
        return best, 'lexical_suggestion_needs_semantic_review', evidence[best]
    return None, 'needs_semantic_classification', list(dict.fromkeys(aliases + [t for t in ranked if evidence[t]]))[:3]

def main():
    matrix_path = ROOT / 'studio/review-matrix/data.json'
    matrix = json.loads(matrix_path.read_text())
    canonical = {}
    base = ROOT / 'perspective-library/source/vi'
    for entry in json.loads((base/'source.json').read_text())['files']:
        if entry['kind'] in ('quote_fragment', 'quote_pack'):
            for q in json.loads((base/entry['path']).read_text()).get('quotes', []):
                assert q['id'] not in canonical, q['id']
                canonical[q['id']] = q
    rows = matrix['rows']
    semantic_path = OUT/'q9-semantic-theme-review.json'
    semantic = {x['id']: x for x in json.loads(semantic_path.read_text())['items']} if semantic_path.exists() else {}
    assert len({r['id'] for r in rows}) == len(rows)
    grouped = defaultdict(list)
    for r in rows:
        if len(norm(r.get('text_vi'))) >= 20:
            grouped[norm(r['text_vi'])].append(r)
    duplicates = {}
    clusters = []
    for text, group in grouped.items():
        if len(group) < 2:
            continue
        group.sort(key=lambda r: (r['pipeline'] != 'release', r['id'] not in canonical, r['id']))
        winner = group[0]['id']
        clusters.append({'preferred_id': winner, 'member_ids': [r['id'] for r in group], 'text': group[0]['text_vi']})
        for r in group[1:]:
            duplicates[r['id']] = winner
    report = []
    groups = defaultdict(list)
    for row in rows:
        q = canonical.get(row['id'], {})
        theme, basis, evidence = suggest(row, q)
        reviewed = semantic.get(row['id'])
        if reviewed:
            assert hashlib.sha256(row['text_vi'].encode()).hexdigest() == reviewed['text_sha256'], 'Stale semantic review: ' + row['id']
            theme, basis, evidence = reviewed['theme'], 'ai_semantic_theme_review', [reviewed['note_vi']]
        status = row.get('pm_status')
        rights = (q.get('rights') or {}).get('status', row.get('rights'))
        if row['pipeline'] == 'release':
            route = 'already_released'
        elif row['id'] in duplicates or status == 'duplicate_hold':
            route = 'duplicate_review'
        elif status == 'blocked_rights':
            route = 'rights_blocked'
        elif status in ('needs_edit','held_not_passed'):
            route = 'editorial_revision'
        elif status == 'needs_source_verification':
            route = 'source_verification'
        elif status == 'needs_normalization':
            route = 'raw_translation_and_context_review'
        elif q.get('story_id'):
            route = 'quote_and_story_review'
        elif rights not in ('selflo_owned','public_domain','licensed','permission_granted'):
            route = 'source_edition_translation_rights_review'
        else:
            route = 'editorial_and_dependency_review'
        item = {
            'id': row['id'], 'canonical_id': row.get('canonical_id'),
            'research_id': row.get('research_id'), 'text': row.get('text_vi'),
            'author': row.get('author'), 'work': row.get('work'),
            'source_url': row.get('source_url'), 'source_family': row.get('source_family'),
            'pipeline': row.get('pipeline'), 'existing_status': status,
            'existing_theme': row.get('theme'), 'proposed_theme': theme,
            'theme_basis': basis, 'theme_evidence': evidence,
            'reviewed_content_role': reviewed['content_role'] if reviewed else None,
            'content_handling': {
                'internal_editorial_note': 'keep_internal_not_reader_quote',
                'context_required': 'restore_source_context_before_editing',
                'narrative_or_historical_context': 'consider_story_or_reflection_after_source_review',
                'preface_dedication_or_biography': 'exclude_from_quote_queue_pending_context_review',
                'multiple_passages_in_one_capture': 'split_capture_and_review_each_passage',
                'religious_or_ethical_context': 'preserve_tradition_and_qualify_interpretation',
                'historical_scientific_prose': 'historical_context_not_current_science',
                'research_definition_or_finding': 'verify_evidence_and_scope',
                'overgeneralized_claim': 'narrow_claim_before_release_review',
                'perspective_candidate': 'continue_source_rights_and_editorial_review',
            }.get(reviewed['content_role'], 'needs_content_role_review') if reviewed else 'needs_content_role_review',
            'route': route, 'rights_status_observed': rights,
            'exact_text_duplicate_of': duplicates.get(row['id']),
            'new_release_approval': False,
        }
        report.append(item)
        groups[(row.get('author') or '', row.get('work') or '', row.get('source_url') or '')].append(item)
    summary = {
        'total': len(report), 'matrix_revisions': [matrix['authoring_revision'], matrix['release_revision']],
        'route_counts': dict(Counter(x['route'] for x in report)),
        'theme_basis_counts': dict(Counter(x['theme_basis'] for x in report)),
        'content_handling_counts': dict(Counter(x['content_handling'] for x in report)),
        'proposed_theme_counts': dict(Counter(x['proposed_theme'] or 'not_assigned' for x in report)),
        'exact_duplicate_clusters': len(clusters), 'exact_duplicate_extra_rows': len(duplicates),
        'source_groups': len(groups), 'new_release_approvals_from_classifier': 0,
    }
    payload = {'schema_version': 'selflo.quote-corpus-triage.v1', 'review_date': max((x['review_date'] for x in semantic.values()), default='2026-10-21'),
               'input_sha256': hashlib.sha256(matrix_path.read_bytes()).hexdigest(),
               'scope': 'Mechanical triage and suggested research taxonomy; not full item-level semantic, source or rights review.',
               'summary': summary, 'rows': report, 'exact_text_clusters': clusters}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT/'q9-corpus-classification.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n')
    queue = [{'author': k[0], 'work': k[1], 'source_url': k[2], 'count': len(v),
              'routes': dict(Counter(x['route'] for x in v)), 'ids': [x['id'] for x in v]}
             for k,v in sorted(groups.items(), key=lambda pair: (-len(pair[1]), pair[0]))]
    (OUT/'q9-source-work-queue.json').write_text(json.dumps(queue, ensure_ascii=False, indent=2)+'\n')
    assert sum(summary['route_counts'].values()) == len(rows)
    assert all(x['proposed_theme'] is None or x['proposed_theme'] in THEMES for x in report)
    print(json.dumps(summary, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
