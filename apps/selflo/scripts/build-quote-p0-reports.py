#!/usr/bin/env python3
import json
import re
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
MATRIX = ROOT / 'studio/review-matrix/data.json'
OUT = ROOT / 'content-workspace/programs/quote-library-p0/reports'

def write(name, data):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def compact(row):
    keys = ('id','canonical_id','research_id','text_vi','author','work','theme','pipeline','rights','verification','confidence','review','ai_review_status','pm_status','pm_next_action_vi','exact_duplicate','near_duplicate','source_url','story_id')
    return {key: row.get(key) for key in keys if row.get(key) not in (None, '')}

def normalized_text(value):
    value = unicodedata.normalize('NFC', (value or '').lower())
    value = re.sub(r'[^\w\s]', ' ', value, flags=re.UNICODE)
    return re.sub(r'\s+', ' ', value).strip()

def source_host(value):
    return urlparse(value or '').netloc.lower()

def route_source_group(group):
    """Operational routing only; this never grants publication rights."""
    host = source_host(group.get('source_url'))
    author = group.get('author') or ''
    work = group.get('work') or ''
    rights = group.get('rights_counts') or {}
    if author == 'Paulo Coelho' and work == 'Nhà giả kim':
        return ('blocked_copyright', 'Giữ ngoài Release; chỉ mở lại khi có permission hoặc cơ sở quyền phù hợp.')
    if rights and set(rights) == {'selflo_owned'}:
        return ('selflo_provenance_check', 'Kiểm tra provenance nội bộ và nội dung trước owner review.')
    if not host:
        return ('missing_source', 'Bổ sung nguồn/locator hoặc kết luận giữ nghiên cứu/loại.')
    if host.endswith('wikisource.org'):
        return ('item_license_and_attribution_check', 'Kiểm tra license/template của từng trang, attribution và bản Việt.')
    if host == 'www.gutenberg.org' or host.endswith('.gutenberg.org'):
        return ('ebook_header_and_edition_check', 'Kiểm tra ebook cụ thể, header quyền, edition/translator và bản Việt.')
    if host == 'ctext.org':
        return ('alternate_source_or_item_rights', 'Tìm nguồn public-domain thay thế hoặc xác minh quyền của item cụ thể.')
    if host.endswith('perseus.tufts.edu'):
        return ('alternate_source_or_object_license', 'Kiểm tra license của object cụ thể hoặc thay bằng edition public-domain.')
    research_hosts = ('pubmed.ncbi.nlm.nih.gov','www.ncbi.nlm.nih.gov','pmc.ncbi.nlm.nih.gov','doi.org','www.sciencedirect.com','link.springer.com','www.nber.org','plato.stanford.edu','www.who.int','www.ilo.org')
    if host in research_hosts:
        return ('research_evidence_reclassification', 'Xác định đây là quote, diễn giải Selflo hay research digest trước khi xét quyền.')
    return ('manual_source_review', 'Kiểm tra item, locator, edition/bản dịch và quyền theo nguồn cụ thể.')

def main():
    matrix = json.loads(MATRIX.read_text())
    rows = matrix['rows']
    generated_at = datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
    base = {
        'schema_version': 'selflo.quote-p0-report.v1',
        'generated_at': generated_at,
        'matrix_generated_at': matrix.get('generated_at'),
        'authoring_revision': matrix.get('authoring_revision'),
        'release_revision': matrix.get('release_revision'),
    }

    exact, near, computed_exact = defaultdict(list), defaultdict(list), defaultdict(list)
    for row in rows:
        if row.get('exact_duplicate'): exact[row['exact_duplicate']].append(compact(row))
        if row.get('near_duplicate'): near[row['near_duplicate']].append(compact(row))
        key = normalized_text(row.get('text_vi'))
        if key: computed_exact[key].append(compact(row))
    computed_exact = {k:v for k,v in computed_exact.items() if len(v) > 1}
    suspicious_exact = []
    for cluster_id, group in exact.items():
        distinct = len({normalized_text(row.get('text_vi')) for row in group})
        if distinct > 1:
            suspicious_exact.append({'cluster_id':cluster_id,'row_count':len(group),'distinct_normalized_text_count':distinct})
    write('q1-duplicate-clusters.json', {**base,
        'summary': {'legacy_exact_cluster_count':len(exact),'legacy_exact_row_count':sum(map(len,exact.values())),'suspicious_legacy_exact_cluster_count':len(suspicious_exact),'computed_exact_cluster_count':len(computed_exact),'computed_exact_row_count':sum(map(len,computed_exact.values())),'near_cluster_count':len(near),'near_row_count':sum(map(len,near.values()))},
        'warning_vi':'Không dùng legacy exact cluster để tự động loại. Một số cluster chứa nhiều văn bản khác nhau; computed exact chỉ so văn bản tiếng Việt sau chuẩn hóa cơ bản.',
        'suspicious_legacy_exact_clusters':suspicious_exact,
        'legacy_exact_clusters':[{'cluster_id':k,'rows':v} for k,v in sorted(exact.items())],
        'computed_exact_clusters':[{'normalized_text':k,'rows':v} for k,v in sorted(computed_exact.items())],
        'near_clusters':[{'cluster_id':k,'rows':v} for k,v in sorted(near.items())],
    })

    themes = defaultdict(lambda: Counter())
    for row in rows:
        theme = row.get('theme') or 'unresolved'
        themes[theme]['total'] += 1
        themes[theme][row.get('pipeline') or 'missing'] += 1
        themes[theme][row.get('pm_status') or 'missing'] += 1
    write('q2-theme-coverage.json', {**base,
        'summary': {'theme_count':len(themes),'unresolved_count':themes['unresolved']['total']},
        'themes':[{'theme':k,**dict(v)} for k,v in sorted(themes.items(), key=lambda x:(-x[1]['total'],x[0]))],
        'source_coverage':matrix.get('source_coverage',[]),
    })

    source_rows = [compact(r) for r in rows if r['pm_status'] in ('needs_source_verification','blocked_rights')]
    write('q3-source-rights-queue.json', {**base,
        'summary':dict(Counter(r['pm_status'] for r in source_rows)),
        'rows':source_rows,
    })
    source_groups = defaultdict(list)
    for row in rows:
        if row.get('pipeline') != 'authoring': continue
        key = (row.get('author') or '', row.get('work') or '', row.get('source_url') or '')
        source_groups[key].append(row)
    grouped = []
    for (author, work, source_url), group in source_groups.items():
        grouped.append({
            'author':author,'work':work,'source_url':source_url,'quote_count':len(group),
            'rights_counts':dict(Counter((r.get('rights') or 'missing') for r in group)),
            'confidence_counts':dict(Counter((r.get('confidence') or 'missing') for r in group)),
            'pm_status_counts':dict(Counter(r.get('pm_status') for r in group)),
            'quote_ids':[r['id'] for r in group],
        })
    grouped.sort(key=lambda g:(-g['quote_count'],g['author'],g['work']))
    write('q3-authoring-source-groups.json', {**base,
        'summary': {'source_group_count':len(grouped),'authoring_quote_count':sum(g['quote_count'] for g in grouped)},
        'groups':grouped,
    })

    routed_groups = []
    for group in grouped:
        route, next_action = route_source_group(group)
        routed_groups.append({
            **group,
            'source_host': source_host(group.get('source_url')) or '(missing)',
            'q3_route': route,
            'q3_next_action_vi': next_action,
            'rights_verdict': 'not_yet_decided',
        })
    route_group_counts = Counter(g['q3_route'] for g in routed_groups)
    route_quote_counts = Counter()
    for group in routed_groups:
        route_quote_counts[group['q3_route']] += group['quote_count']
    write('q3-source-rights-routing.json', {**base,
        'warning_vi':'Đây là phân luồng công việc, không phải phán quyết quyền và không được dùng để tự động Release.',
        'summary': {
            'source_group_count':len(routed_groups),
            'authoring_quote_count':sum(g['quote_count'] for g in routed_groups),
            'route_group_counts':dict(route_group_counts),
            'route_quote_counts':dict(route_quote_counts),
            'undecided_rights_group_count':sum(1 for g in routed_groups if g['rights_verdict'] == 'not_yet_decided'),
        },
        'groups':routed_groups,
    })

    review_order = {'ready_for_ai_review':0,'needs_story_review':1,'needs_round1_review':2,'needs_edit':3}
    review_rows = [compact(r) for r in rows if r['pm_status'] in review_order]
    review_rows.sort(key=lambda r:(review_order[r['pm_status']], r.get('theme',''), r['id']))
    write('q4-review-queue.json', {**base,
        'summary':dict(Counter(r['pm_status'] for r in review_rows)),
        'rows':review_rows,
    })

    print(json.dumps({
        'q1': {'legacy_exact_clusters':len(exact),'legacy_exact_rows':sum(map(len,exact.values())),'suspicious_legacy_exact_clusters':len(suspicious_exact),'computed_exact_clusters':len(computed_exact),'computed_exact_rows':sum(map(len,computed_exact.values())),'near_clusters':len(near),'near_rows':sum(map(len,near.values()))},
        'q2': {'themes':len(themes),'unresolved':themes['unresolved']['total']},
        'q3': dict(Counter(r['pm_status'] for r in source_rows)),
        'q4': dict(Counter(r['pm_status'] for r in review_rows)),
    }, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
