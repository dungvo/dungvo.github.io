#!/usr/bin/env python3
import argparse, json, re
from pathlib import Path
from openpyxl import load_workbook

CURATED = {
    'research.dhammapada.day11.v019': (94, 'Hình ảnh mạnh; phân biệt biết và sống; source verse rõ.'),
    'research.dhammapada.day11.v064': (92, 'Độc lập tốt; dễ nhớ; chiều sâu về trải nghiệm và tri thức.'),
    'research.mn.day12.mn22_02': (90, 'Perspective sâu về công cụ và sự buông bỏ; cần kiểm tra overlap story.'),
    'research.laozi.ch12.034': (89, 'Rất hợp attention overload; nguyên văn rõ; đọc độc lập tốt.'),
    'research.dhammapada.day11.v276': (88, 'Khớp triết lý Selflo: người khác chỉ đường nhưng không bước thay.'),
    'research.laozi.ch02.007': (87, 'Góc nhìn mạnh về hành động không chiếm hữu; primary text rõ.'),
    'research.laozi.ch13.037': (86, 'Ngắn, độc lập và liên quan trực tiếp tới đánh giá bên ngoài.'),
    'research.laozi.ch17.054': (85, 'Perspective khác biệt về leadership và agency; cần giữ ngữ cảnh chương.'),
    'research.laozi.ch20.061': (84, 'Có chiều sâu về bất định và cảm giác không theo kịp số đông.'),
    'research.dhammapada.day11.v043': (83, 'Source verse rõ; cần review bản chuyển ngữ Selflo.'),
    'research.dhammapada.day11.v223': (82, 'Hữu ích cho giận dữ và agency; wording là chuyển ý một phần kệ.'),
    'research.mn.day12.mn20_01': (81, 'Perspective thực tế về chuyển hướng chú ý; tránh diễn đạt như lời khuyên lâm sàng.'),
    'research.laozi.ch05.014': (80, 'Ngắn và hợp attention; bản Việt hiện mang tính diễn giải.'),
}

def clean(v):
    return '' if v is None else str(v).strip()

def sheet_records(wb, name):
    rows = wb[name].iter_rows(values_only=True)
    headers = [clean(v) for v in next(rows)]
    out = []
    for values in rows:
        record = {headers[i]: values[i] for i in range(min(len(headers), len(values))) if headers[i]}
        if any(v is not None and clean(v) for v in values): out.append(record)
    return out

def load_quotes(channel_dir):
    manifest = json.loads((channel_dir/'manifest.json').read_text())
    quotes = []
    for f in manifest.get('files', []):
        if f.get('kind') != 'quote_pack': continue
        doc = json.loads((channel_dir/f['path']).read_text())
        quotes.extend(doc.get('quotes', []))
    return manifest, quotes

def confidence(value):
    v = clean(value).lower()
    if v.startswith('a') or 'verified' in v or v in {'public_domain','selflo_owned','licensed','permission_granted'}: return 'high'
    if v.startswith('b') or 'likely' in v: return 'medium'
    return 'low'

def research_score(q, n, m):
    ident = clean(q.get('Quote ID'))
    if ident in CURATED: return CURATED[ident]
    score = {'high': 68, 'medium': 56, 'low': 42}[confidence(q.get('Mức xác minh'))]
    fit = clean(q.get('Mức phù hợp Selflo')).lower()
    score += 12 if fit == 'high' else 6 if fit == 'medium' else 0
    if clean(q.get('Source URL')): score += 4
    if clean(q.get('Release readiness')).lower() in {'ready','release ready','yes'}: score += 5
    if clean(n.get('Exact duplicate cluster ID')): score -= 15
    if clean(n.get('Near-duplicate cluster ID')): score -= 8
    text = clean(q.get('Bản dịch / bản làm việc tiếng Việt'))
    if re.search(r'đoạn|văn bản|theo đoạn này|hai mặt ấy', text, re.I): score -= 8
    why = 'Điểm sàng lọc từ source, Selflo fit, readiness và cảnh báo duplicate; cần editorial review trước khi chốt.'
    return max(0, min(99, score)), why

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    ap.add_argument('--workbook', type=Path)
    args = ap.parse_args(); root = args.root.resolve()
    book = args.workbook or root/'quote-chatpgt/Selflo_Content_Master_Post90_Phase2_5.xlsx'
    wb = load_workbook(book, read_only=True, data_only=True)
    raw = sheet_records(wb, 'Quote Library v2')
    normalized = {clean(x.get('Quote ID')): x for x in sheet_records(wb, 'Normalized Corpus')}
    mapping = {clean(x.get('Research Quote ID')): x for x in sheet_records(wb, 'Research Repo Mapping')}
    authoring_manifest, authoring = load_quotes(root/'perspective-library/authoring/vi')
    release_manifest, release = load_quotes(root/'perspective-library/release/vi')
    release_ids = {clean(x.get('id')) for x in release}
    authoring_by_id = {clean(x.get('id')): x for x in authoring}
    rows=[]
    for q in raw:
        ident=clean(q.get('Quote ID')); n=normalized.get(ident,{}); m=mapping.get(ident,{})
        canonical_id=clean(m.get('Canonical ID')); cq=authoring_by_id.get(canonical_id)
        pipeline='release' if canonical_id in release_ids else 'authoring' if cq else 'research'
        score,why=research_score(q,n,m)
        rows.append({'record_type':'research','id':ident,'canonical_id':canonical_id or None,'text_vi':clean(q.get('Bản dịch / bản làm việc tiếng Việt')),'author':clean(n.get('Author canonical') or q.get('Tác giả / Attribution')),'work':clean(n.get('Source/work canonical') or q.get('Tên nguồn / tác phẩm')),'source_url':clean(q.get('Source URL')),'theme':clean(n.get('Theme canonical') or q.get('Chủ đề chính (Theme)')),'human_experience':clean(n.get('Human experience canonical') or q.get('Trải nghiệm con người (Human Experience)')),'content_nature':clean(n.get('content_nature canonical') or q.get('Hình thức nội dung (Content Form)')),'confidence':confidence(q.get('Mức xác minh')),'verification':clean(q.get('Mức xác minh')),'rights':clean(q.get('Quyền sử dụng')),'selflo_fit':clean(q.get('Mức phù hợp Selflo')),'release_readiness':clean(q.get('Release readiness')),'pipeline':pipeline,'review':clean(q.get('Owner review')),'story_id':clean(q.get('Story ID liên quan')) or None,'exact_duplicate':clean(n.get('Exact duplicate cluster ID')),'near_duplicate':clean(n.get('Near-duplicate cluster ID')),'score':score,'why':why})
    for q in authoring:
        ident=clean(q.get('id')); a=q.get('authorship') or {}; rights=q.get('rights') or {}; review=q.get('review') or {}
        rows.append({'record_type':'canonical','id':ident,'canonical_id':ident,'text_vi':clean(q.get('text_vi')),'author':clean(a.get('author_name')),'work':clean(a.get('work')),'source_url':clean(a.get('source_url')),'theme':clean(q.get('primary_theme')),'human_experience':'','content_nature':clean(q.get('kind')),'confidence':confidence(rights.get('status')),'verification':clean(a.get('source_detail')),'rights':clean(rights.get('status')),'selflo_fit':'','release_readiness':'Released' if ident in release_ids else 'Needs owner review' if review.get('status')=='needs_owner_review' else clean(review.get('status')),'pipeline':'release' if ident in release_ids else 'authoring','review':clean(review.get('status')),'story_id':q.get('story_id'),'exact_duplicate':'','near_duplicate':'','score':100 if ident in release_ids else 78,'why':'Canonical quote trong Release.' if ident in release_ids else 'Canonical quote trong Authoring; kiểm tra review, rights và source trước Release.'})
    rows.sort(key=lambda x:(-x['score'],x['record_type'],x['id']))
    for i,x in enumerate(rows,1): x['rank']=i
    summary={'research_quotes':len(raw),'canonical_authoring_quotes':len(authoring),'release_quotes':len(release),'authoring_not_released':len(authoring)-len(release),'matrix_rows':len(rows),'research_with_canonical_match':sum(1 for x in rows if x['record_type']=='research' and x['canonical_id']),'authoring_revision':authoring_manifest.get('library_revision'),'release_revision':release_manifest.get('library_revision')}
    out={'schema_version':'selflo.review-matrix.v2','generated_from':book.name,'summary':summary,'rows':rows}
    target=root/'review-matrix/data.json';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
    print(json.dumps(summary,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
