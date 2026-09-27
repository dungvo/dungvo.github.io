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

SOURCE_FAMILIES = [
    {'id':'selflo','name_vi':'Nội dung gốc Selflo','scope_vi':'Góc nhìn do Selflo biên soạn','status_vi':'Nhiều ở Release','priority':'maintain','examples':'Selflo','targets':'Giữ chất lượng; không dùng để thay thế nguồn có thể kiểm chứng.'},
    {'id':'chinese_classics','name_vi':'Kinh điển Trung Hoa','scope_vi':'Đạo gia, Nho gia và cổ thư Trung Hoa','status_vi':'Rất nhiều','priority':'deprioritize','examples':'Lão Tử, Trang Tử, Liệt Tử, Hoài Nam Tử, Khổng Tử, Mạnh Tử','targets':'Tạm giảm bổ sung; ưu tiên xử lý trùng ý và đa dạng góc nhìn.'},
    {'id':'vietnamese_heritage','name_vi':'Di sản Việt Nam','scope_vi':'Tục ngữ, ca dao và tác giả Việt Nam','status_vi':'Có nhưng mỏng','priority':'research','examples':'Tục ngữ Việt Nam, Nguyễn Trãi, Nguyễn Du, Nguyễn Bỉnh Khiêm','targets':'Bổ sung có nguồn văn bản rõ; tránh attribution truyền miệng không kiểm chứng.'},
    {'id':'japanese_zen','name_vi':'Nhật Bản & Thiền','scope_vi':'Thiền, thơ và tục ngữ Nhật','status_vi':'Có nhưng mỏng','priority':'research','examples':'Dōgen, Bashō, tục ngữ Nhật','targets':'Bổ sung chọn lọc; phân biệt bản dịch, thơ và diễn giải.'},
    {'id':'south_asian_buddhist','name_vi':'Nam Á & Phật học','scope_vi':'Kinh Phật, Ấn Độ giáo và ngụ ngôn Nam Á','status_vi':'Nhiều trong research, ít Release','priority':'curate','examples':'Dhammapada, Nikāya, Bhagavad Gītā, Upanishad, Panchatantra','targets':'Ưu tiên tuyển chọn và xác minh bản dịch trước khi nghiên cứu thêm.'},
    {'id':'western_ancient_stoic','name_vi':'Phương Tây cổ đại & Khắc kỷ','scope_vi':'Hy–La, Khắc kỷ và Epicurean','status_vi':'Nhiều','priority':'deprioritize','examples':'Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, Plato, Aristotle, Epicurus','targets':'Tạm giảm bổ sung Khắc kỷ; cân bằng bằng các truyền thống phương Tây khác.'},
    {'id':'western_renaissance_early_modern','name_vi':'Phục Hưng & cận đại phương Tây','scope_vi':'Thế kỷ 4–18, tiểu luận và triết học cận đại','status_vi':'Thiếu','priority':'high_research','examples':'Montaigne','targets':'Augustine, Boethius, Aquinas, Shakespeare, Pascal, Spinoza, Hume, Kant, Rousseau, Voltaire, Adam Smith.'},
    {'id':'western_19c','name_vi':'Phương Tây thế kỷ 19','scope_vi':'Siêu nghiệm, hiện sinh sơ kỳ và văn học thế kỷ 19','status_vi':'Thiếu','priority':'high_research','examples':'Kierkegaard','targets':'Emerson, Thoreau, Nietzsche, Schopenhauer, Whitman, Dickinson.'},
    {'id':'western_20c_literature_existential','name_vi':'Văn học & hiện sinh thế kỷ 20','scope_vi':'Tiểu luận, văn học và hiện sinh hiện đại','status_vi':'Có trong Authoring, gần như chưa Release','priority':'curate','examples':'Virginia Woolf, Simone Weil, Rilke, Tolstoy, Hesse, Arendt, Dostoevsky, Kafka, Chekhov, Camus','targets':'Ưu tiên review nguồn sẵn có; sau đó cân nhắc Beauvoir, Baldwin, Morrison, Le Guin, Didion, Mary Oliver, bell hooks.'},
    {'id':'pragmatism_humanistic','name_vi':'Thực dụng & tâm lý nhân văn','scope_vi':'Pragmatism, ý nghĩa và trị liệu nhân văn','status_vi':'Thiếu','priority':'high_research','examples':'William James, Viktor Frankl, Carl Rogers','targets':'John Dewey, C. S. Peirce, Erich Fromm, Rollo May, Irvin Yalom; bổ sung sâu hơn James/Frankl/Rogers.'},
    {'id':'modern_psych_behavior','name_vi':'Tâm lý học & hành vi hiện đại','scope_vi':'Nghiên cứu thực nghiệm về nhận thức, động lực và hành vi','status_vi':'Có research, chưa Release','priority':'curate','examples':'Kristin Neff và các research findings','targets':'Kahneman, Tversky, Bandura, Deci & Ryan, Csikszentmihalyi; ưu tiên primary/official sources.'},
    {'id':'neuroscience_habits','name_vi':'Não bộ, thói quen & thần kinh học','scope_vi':'Neuroplasticity, cảm xúc, học tập và thói quen','status_vi':'Thiếu','priority':'high_research','examples':'Một số research findings rời rạc','targets':'Wendy Wood, Antonio Damasio, Lisa Feldman Barrett, Stanislas Dehaene; nguồn sách/bài báo chính thức.'},
    {'id':'modern_laws_effects','name_vi':'Quy luật & hiệu ứng hiện đại','scope_vi':'Hiệu ứng tâm lý, quy luật tổ chức và mô hình quyết định','status_vi':'Gần như trống','priority':'high_research','examples':'Sunk cost xuất hiện rải rác','targets':'Murphy, Parkinson, Peter, Goodhart, planning fallacy, hedonic adaptation, habituation, peak-end, mere exposure.'},
    {'id':'middle_east_jewish','name_vi':'Trung Đông, Ba Tư & Do Thái','scope_vi':'Tục ngữ, thơ và truyền thống tư tưởng khu vực','status_vi':'Có nhưng mỏng','priority':'research','examples':'Rumi, Saadi, tục ngữ Do Thái/Ả Rập','targets':'Mở rộng có kiểm chứng; đặc biệt lưu ý bản dịch hiện đại và attribution giả.'},
    {'id':'african_global_indigenous','name_vi':'Châu Phi & bản địa toàn cầu','scope_vi':'Tục ngữ và tri thức bản địa','status_vi':'Thiếu','priority':'research','examples':'Một số tục ngữ Châu Phi','targets':'Chỉ dùng nguồn có provenance; tránh gán quốc gia/tộc người chung chung.'},
    {'id':'european_folk','name_vi':'Dân gian châu Âu','scope_vi':'Truyện, tục ngữ và ngụ ngôn dân gian','status_vi':'Có nhưng mỏng','priority':'research','examples':'Tục ngữ và dân gian châu Âu','targets':'Bổ sung chọn lọc, ghi rõ vùng/ngôn ngữ khi có thể.'},
    {'id':'other_unmapped','name_vi':'Khác / chưa ánh xạ','scope_vi':'Nguồn chưa đủ dữ liệu để xếp nhóm','status_vi':'Cần làm sạch','priority':'normalize','examples':'Attribution chung hoặc thiếu nguồn','targets':'Bổ sung metadata; không suy đoán nhóm nguồn.'},
]

def source_family(author, work='', source_url=''):
    text = ' '.join([clean(author), clean(work), clean(source_url)]).lower()
    rules = [
        ('selflo', r'\bselflo\b'),
        ('chinese_classics', r'laozi|lão tử|zhuangzi|trang tử|liezi|liệt tử|huainanzi|hoài nam|confucius|khổng tử|mencius|mạnh tử|chinese|trung hoa'),
        ('vietnamese_heritage', r'vietnam|việt nam|nguyễn du|nguyễn trãi|nguyễn bỉnh khiêm|ca dao'),
        ('japanese_zen', r'dōgen|dogen|bashō|basho|japan|nhật bản|zen'),
        ('south_asian_buddhist', r'dhammapada|nik[aā]ya|buddh|phật|bhagavad|upanishad|panchatantra|vedic|hindu|ấn độ|india'),
        ('western_ancient_stoic', r'marcus aurelius|seneca|epictetus|musonius|plato|aristotle|epicurus|socrates|cicero|stoic'),
        ('western_renaissance_early_modern', r'montaigne|shakespeare|pascal|spinoza|\bhume\b|\bkant\b|rousseau|voltaire|adam smith|augustine|boethius|aquinas'),
        ('western_19c', r'emerson|thoreau|nietzsche|schopenhauer|kierkegaard|whitman|dickinson'),
        ('western_20c_literature_existential', r'virginia woolf|simone weil|rilke|tolstoy|hesse|arendt|dostoevsky|kafka|chekhov|camus|beauvoir|sartre|baldwin|morrison|le guin|didion|mary oliver|bell hooks|maya angelou|a.?dre lorde'),
        ('pragmatism_humanistic', r'william james|john dewey|peirce|viktor frankl|carl rogers|erich fromm|rollo may|yalom'),
        ('neuroscience_habits', r'wendy wood|fogg|damasio|lisa feldman barrett|dehaene|gazzaniga|davidson|hebb|neuro|brain|habit'),
        ('modern_laws_effects', r'murphy|parkinson|peter principle|goodhart|hofstadter|planning fallacy|sunk cost|hedonic|habituation|novelty|peak.end|mere exposure|45 định luật|định luật cuộc sống|ybox\.vn/gia-vi/45-dinh-luat'),
        ('modern_psych_behavior', r'kristin neff|kahneman|tversky|bandura|deci|ryan|csikszentmihalyi|baumeister|gollwitzer|psycholog|research|rumination|burnout|decision'),
        ('middle_east_jewish', r'rumi|hafez|saadi|jewish|do thái|arab|ả rập|persian|ba tư|middle east'),
        ('african_global_indigenous', r'africa|châu phi|indigenous|bản địa'),
        ('european_folk', r'european folk|dân gian châu âu|european proverb'),
    ]
    for ident, pattern in rules:
        if re.search(pattern, text, re.I): return ident
    return 'other_unmapped'

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

def load_supplemental_captures(root):
    captures=[]
    capture_dir=root/'quote-research/raw-capture'
    if not capture_dir.exists(): return captures
    for path in sorted(capture_dir.glob('*.json')):
        doc=json.loads(path.read_text())
        for item in doc.get('items',[]):
            captures.append({**item,'_capture_file':path.name,'_capture_batch':doc.get('batch')})
    return captures

def confidence(value):
    v = clean(value).lower()
    if v.startswith('a') or re.search(r'verification\s*=\s*a',v) or v in {'verified','public_domain','selflo_owned','licensed','permission_granted'}: return 'high'
    if v.startswith('b') or re.search(r'verification\s*=\s*b',v) or 'likely' in v: return 'medium'
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

def exclusion_reason(q, n):
    if clean(q.get('Mức phù hợp Selflo')) != 'High':
        return 'selflo_fit_not_high', 'Chưa phù hợp Selflo ở mức High.'
    source_url = clean(q.get('Source URL'))
    if not source_url:
        return 'missing_source_url', 'Thiếu đường dẫn nguồn.'
    if not source_url.lower().startswith(('http://', 'https://')):
        return 'source_url_not_public_http', 'Nguồn không phải đường dẫn công khai có thể kiểm tra.'
    if not clean(q.get('Mức xác minh')).startswith(('A', 'B')):
        return 'source_below_B', 'Mức xác minh nguồn thấp hơn B.'
    if clean(q.get('Rủi ro giáo điều / directive')).lower().startswith(('high', 'cao')):
        return 'directive_risk_high', 'Rủi ro diễn đạt giáo điều hoặc ra lệnh cao.'
    text = clean(q.get('Bản dịch / bản làm việc tiếng Việt'))
    if not 15 <= len(text) <= 600:
        return 'text_length_outside_gate', 'Độ dài chưa phù hợp để biên tập thành quote.'
    if clean(n.get('Exact duplicate cluster ID')):
        return 'exact_duplicate_alternate', 'Biến thể trùng hoàn toàn; đang giữ lại để đối chiếu, không nhập Authoring.'
    return 'awaiting_authoring_review', 'Chưa được review vòng Canonical → Authoring.'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    ap.add_argument('--workbook', type=Path)
    args = ap.parse_args(); root = args.root.resolve()
    optimized = root/'quote-chatpgt/Selflo_Content_Master_Optimized.xlsx'
    source_coverage = root/'quote-chatpgt/Selflo_Content_Master_Post90_SourceCoverage.xlsx'
    book = args.workbook or (optimized if optimized.exists() else source_coverage if source_coverage.exists() else root/'quote-chatpgt/Selflo_Content_Master_Post90_Phase2_5.xlsx')
    wb = load_workbook(book, read_only=True, data_only=True)
    raw = sheet_records(wb, 'Quote Library v2')
    normalized = {clean(x.get('Quote ID')): x for x in sheet_records(wb, 'Normalized Corpus')}
    mapping = {clean(x.get('Research Quote ID')): x for x in sheet_records(wb, 'Research Repo Mapping')}
    ledger_path=root/'quote-research/review-pipeline/canonical-ai-review.json'
    ledger=json.loads(ledger_path.read_text()) if ledger_path.exists() else {'decisions':[]}
    ai_reviews={x['quote_id']:x for x in ledger.get('decisions',[])}
    shortlist_path=root/'quote-research/review-pipeline/release-shortlist.json'
    shortlist=json.loads(shortlist_path.read_text()) if shortlist_path.exists() else {'quote_ids':[]}
    shortlist_ids=set(shortlist.get('quote_ids',[]))
    authoring_manifest, authoring = load_quotes(root/'perspective-library/authoring/vi')
    release_manifest, release = load_quotes(root/'perspective-library/release/vi')
    release_ids = {clean(x.get('id')) for x in release}
    authoring_by_id = {clean(x.get('id')): x for x in authoring}
    research_by_id={clean(q.get('Quote ID')):q for q in raw}
    canonical_to_research={}
    for q in raw:
        ident=clean(q.get('Quote ID')); m=mapping.get(ident,{})
        mapped_id=clean(m.get('Canonical ID'))
        canonical_id=mapped_id or (ident if ident in authoring_by_id else '')
        if canonical_id in authoring_by_id:
            canonical_to_research.setdefault(canonical_id, ident)

    rows=[]
    for q in authoring:
        ident=clean(q.get('id')); a=q.get('authorship') or {}; rights=q.get('rights') or {}; review=q.get('review') or {}
        research_id=canonical_to_research.get(ident); rq=research_by_id.get(research_id,{}) if research_id else {}; n=normalized.get(research_id,{}) if research_id else {}
        ai=ai_reviews.get(ident,{}) if ident not in release_ids else {}
        if ident in shortlist_ids and ident not in release_ids:
            ai={**ai,'decision':'release_shortlist','review_round':2,'note_vi':shortlist.get('note_vi')}
        ai_score={'release_shortlist':96,'ready_for_owner_review':92,'story_review_required':84,'source_verification_required':80,'edit_required':70,'round1_not_pass':30,'source_rights_blocked':20}.get(ai.get('decision'),78)
        rows.append({'record_type':'quote','id':ident,'research_id':research_id,'canonical_id':ident,'text_vi':clean(q.get('text_vi')),'author':clean(a.get('author_name')),'work':clean(a.get('work')),'source_url':clean(a.get('source_url')),'theme':clean(q.get('primary_theme')),'human_experience':clean(n.get('Human experience canonical') or rq.get('Trải nghiệm con người (Human Experience)')),'content_nature':clean(q.get('kind')),'confidence':confidence(a.get('source_detail') or rights.get('status')),'verification':clean(a.get('source_detail')),'rights':clean(rights.get('status')),'selflo_fit':clean(rq.get('Mức phù hợp Selflo')),'release_readiness':'Released' if ident in release_ids else 'Needs owner review' if review.get('status')=='needs_owner_review' else clean(review.get('status')),'pipeline':'release' if ident in release_ids else 'authoring','review':clean(review.get('status')),'ai_review_status':ai.get('decision'),'ai_review_round':ai.get('review_round'),'ai_review_note':ai.get('note_vi'),'story_id':q.get('story_id'),'exact_duplicate':clean(n.get('Exact duplicate cluster ID')),'near_duplicate':clean(n.get('Near-duplicate cluster ID')),'issue_code':None,'score':100 if ident in release_ids else ai_score,'why':'Đã phát hành.' if ident in release_ids else ai.get('note_vi') or 'Đang ở Authoring; cần bạn review vòng 2 trước khi Release.'})

    matched_research=set(canonical_to_research.values())
    for q in raw:
        ident=clean(q.get('Quote ID'))
        if ident in matched_research: continue
        n=normalized.get(ident,{}); m=mapping.get(ident,{})
        issue_code,why=exclusion_reason(q,n)
        pipeline='canonical' if issue_code=='awaiting_authoring_review' else 'excluded'
        score,_=research_score(q,n,m)
        rows.append({'record_type':'quote','id':ident,'research_id':ident,'canonical_id':None,'text_vi':clean(q.get('Bản dịch / bản làm việc tiếng Việt')),'author':clean(n.get('Author canonical') or q.get('Tác giả / Attribution')),'work':clean(n.get('Source/work canonical') or q.get('Tên nguồn / tác phẩm')),'source_url':clean(q.get('Source URL')),'theme':clean(n.get('Theme canonical') or q.get('Chủ đề chính (Theme)')),'human_experience':clean(n.get('Human experience canonical') or q.get('Trải nghiệm con người (Human Experience)')),'content_nature':clean(n.get('content_nature canonical') or q.get('Hình thức nội dung (Content Form)')),'confidence':confidence(q.get('Mức xác minh')),'verification':clean(q.get('Mức xác minh')),'rights':clean(q.get('Quyền sử dụng')),'selflo_fit':clean(q.get('Mức phù hợp Selflo')),'release_readiness':clean(q.get('Release readiness')),'pipeline':pipeline,'review':clean(q.get('Owner review')),'ai_review_status':None,'story_id':clean(q.get('Story ID liên quan')) or None,'exact_duplicate':clean(n.get('Exact duplicate cluster ID')),'near_duplicate':clean(n.get('Near-duplicate cluster ID')),'issue_code':issue_code,'score':score,'why':why})
    known_ids={x['id'] for x in rows}
    supplemental=load_supplemental_captures(root)
    for item in supplemental:
        ident=clean(item.get('candidate_id'))
        if not ident or ident in known_ids: continue
        topics=item.get('provisional_topics') or []
        rows.append({'record_type':'quote','id':ident,'research_id':ident,'canonical_id':None,'text_vi':clean(item.get('vietnamese_working_text') or item.get('original_text')),'original_text':clean(item.get('original_text')),'author':clean(item.get('author_or_attribution_as_source_states')),'work':clean(item.get('work_or_page_title')),'source_url':clean(item.get('source_url')),'source_domain':clean(item.get('source_domain')),'source_tier':clean(item.get('source_tier')),'theme':clean(topics[0] if topics else 'unresolved'),'human_experience':'','content_nature':clean(item.get('content_nature')),'confidence':'low','verification':clean(item.get('capture_status')),'rights':clean(item.get('rights_note')),'selflo_fit':'','release_readiness':'Source verification required','pipeline':'excluded','review':'Research only','ai_review_status':'source_verification_required','ai_review_round':None,'ai_review_note':clean(item.get('context_note')),'story_id':None,'exact_duplicate':'','near_duplicate':clean(item.get('near_duplicate_cluster')),'issue_code':'source_below_B','score':35,'why':'Nguồn tổng hợp do owner cung cấp; đã giữ đúng câu chữ nhưng cần truy nguồn gốc trước Authoring.','collection_batch':f"{clean(item.get('_capture_batch'))} · nguồn owner gửi"})
        known_ids.add(ident)
    rows.sort(key=lambda x:(-x['score'],x['record_type'],x['id']))
    for i,x in enumerate(rows,1): x['rank']=i
    stage_counts={stage:sum(1 for x in rows if x['pipeline']==stage) for stage in ('canonical','excluded','authoring','release')}
    summary={'total_quotes':len(rows),'canonical_pending_authoring':stage_counts['canonical'],'excluded_not_authoring':stage_counts['excluded'],'authoring_pending_release':stage_counts['authoring'],'release_quotes':stage_counts['release'],'stage_sum':sum(stage_counts.values()),'research_source_rows':len(raw),'supplemental_raw_captures':len(supplemental),'canonical_authoring_quotes':len(authoring),'authoring_revision':authoring_manifest.get('library_revision'),'release_revision':release_manifest.get('library_revision')}
    coverage=[]
    for meta in SOURCE_FAMILIES:
        group=[x for x in rows if source_family(x.get('author'),x.get('work'),x.get('source_url'))==meta['id']]
        counts={stage:sum(1 for x in group if x['pipeline']==stage) for stage in ('canonical','excluded','authoring','release')}
        coverage.append({**meta,'total':len(group),**counts})
    out={'schema_version':'selflo.review-matrix.v5','generated_from':book.name,'summary':summary,'source_coverage':coverage,'rows':rows}
    target=root/'review-matrix/data.json';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
    print(json.dumps(summary,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
