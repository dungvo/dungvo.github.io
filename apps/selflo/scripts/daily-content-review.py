#!/usr/bin/env python3
"""Daily Selflo candidate → Authoring → Release review workflow.

The browser review ledger remains the owner's decision input. This script never
interprets a missing decision as approval and never bypasses rights/source gates.
"""
import argparse, copy, datetime as dt, hashlib, json, re, shutil, subprocess, sys, tempfile
from pathlib import Path
from urllib.parse import quote, urlsplit, urlunsplit
from review_status import status_input_digests
from review_eligibility import ReviewEligibility

THEME_MAP={
 'inner_awareness':'self_understanding','meaning_identity':'meaning_values','work_purpose':'work_achievement',
 'relationships':'relationships','family_care':'relationships','rest_wellbeing':'rest_wellbeing',
 'change_transition':'change_growth','learning_growth':'change_growth','emotion_regulation':'emotion',
 'ai_future':'attention','society_culture':'relationships','choice_direction':'adversity_resilience'
}
THEME_INFO={
 'adversity_resilience':('Nghịch cảnh & sức bền','Khó khăn, chấp nhận, hồi phục và sức bền.'),
 'attention':('Sự chú ý','Tập trung, nhiễu, hiện diện và cách mình phân bổ sự chú ý.'),
 'change_growth':('Thay đổi & trưởng thành','Thay đổi, học hỏi, thất bại và phát triển.'),
 'emotion':('Cảm xúc','Nhận ra, gọi tên và cho cảm xúc đủ chỗ.'),
 'meaning_values':('Ý nghĩa & giá trị','Điều quan trọng, ý nghĩa, giá trị và lựa chọn.'),
 'relationships':('Quan hệ','Kết nối, ranh giới, thuộc về và đời sống cùng người khác.'),
 'rest_wellbeing':('Nghỉ ngơi & sức khỏe','Giới hạn, hồi phục, nghỉ ngơi và sức khỏe tinh thần.'),
 'self_understanding':('Hiểu bản thân','Bản sắc, khuôn mẫu và cách mình nhìn chính mình.'),
 'work_achievement':('Công việc & thành tựu','Công việc, đóng góp, thành tựu và áp lực.')
}
VALID_DECISIONS={'approved','needs_edit','rejected'}

def read(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def write(p,obj):
    p=Path(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha(b): return hashlib.sha256(b).hexdigest()
def now(): return dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def public_uri(value):
    if not value:return None
    part=urlsplit(value)
    return urlunsplit((part.scheme,part.netloc,quote(part.path,safe='/%'),quote(part.query,safe='=&;%:+,/?@'),quote(part.fragment,safe='')))
def run(cmd,cwd=None): subprocess.run(cmd,cwd=cwd,check=True)
def git(root,*args): run(['git','-C',str(root),*args])
def state_paths(root):
    q=root/'content-workspace/curated/quote-research/review-pipeline'
    return q,q/'review-candidates.json',q/'state.json',q/'batches'
def load_state(p):
    if p.exists(): return read(p)
    return {'schema_version':'selflo.daily-review-state.v1','batch_sequence':0,'candidates':{},'history':[]}
def ledger_decisions(path):
    doc=read(path);out={}
    for x in doc.get('decisions',[]):
        q=x.get('quote_id'); d=x.get('quote_decision') or x.get('decision')
        if q and d in VALID_DECISIONS:
            if q in out:raise ValueError('Duplicate quote ID in review ledger: '+q)
            out[q]={'decision':d,'note':x.get('note') or '','updated_at':x.get('updated_at')}
    return doc,out
def theme_for(c):
    area=(c.get('life_area') or '').strip()
    if area in THEME_MAP:return THEME_MAP[area]
    folded=' '.join(str(c.get(k) or '').lower() for k in ('theme','human_experience','life_area'))
    rules=(
      ('attention',('attention','chú ý','ai &','công nghệ','focus','noise')),
      ('work_achievement',('work','công việc','achievement','purpose','thành tựu')),
      ('relationships',('relationship','quan hệ','family','belong','connection','xã hội')),
      ('rest_wellbeing',('rest','nghỉ','sleep','burnout','wellbeing','recovery','hồi phục')),
      ('emotion',('emotion','cảm xúc','grief','fear','compassion','mất mát')),
      ('change_growth',('change','growth','learning','thay đổi','học tập','trưởng thành')),
      ('meaning_values',('meaning','values','ý nghĩa','giá trị','identity','bản sắc')),
      ('adversity_resilience',('adversity','resilience','uncertainty','choice','agency','lựa chọn','bất định')),
    )
    for theme,needles in rules:
        if any(x in folded for x in needles):return theme
    return 'self_understanding'
def canonical_quote(c,status='draft'):
    theme=theme_for(c); author=c.get('author') or None; work=c.get('work') or None; url=public_uri(c.get('source_url'))
    nature=(c.get('content_nature') or '').strip()
    source_is_wording=nature in ('direct_quote','translated_quote','passage','proverb')
    attribution=author if source_is_wording else ('Selflo · dựa trên '+author if author else 'Selflo · tổng hợp nghiên cứu')
    return {
      'id':c['id'],'revision':1,'kind':'adapted_wisdom','title_vi':None,'text_vi':c['text_vi'],'subtitle_vi':None,
      'story_id':None,'primary_theme':theme,
      'selection':{'source_type':'philosophy','reflection_kind':None,'thought_match_keys':[],'presentation_tags':[x for x in [c.get('life_area'),c.get('human_experience'),c.get('theme')] if x and ' | ' not in x and x!='unresolved'],'tie_break_order':0},
      'authorship':{'author_id':None,'author_name':author,'work':work,'source_url':url,'source_language':None,'source_label':attribution,'source_detail':f"Research ID {c.get('research_id_original') or c.get('id')}; corpus row {c.get('source_row')}; content_nature={nature}; verification={c.get('verification')}."},
      'metadata':{'concepts':[],'theories':[],'frameworks':[],'emotion_tags':[],'keywords':[x for x in [c.get('human_experience'),c.get('theme')] if x and ' | ' not in x and x!='unresolved']},
      'rights':{'status':'unverified','note':c.get('rights_research_note') or None},
      'review':{'status':status,'reviewed_by':None,'reviewed_at':None},
      'writing':{'semantic_intent':c['text_vi'],'observation_key':None,'structure_pattern':'research_candidate'},
      'display':{'mode':'poster','priority':0,'featured':False,'style':'paper_quote','attribution_vi':attribution},
      'knowledge_basis':None
    }
def candidate_package(root,batch,candidates):
    base=root/'perspective-library/candidate/vi'; shutil.rmtree(base,ignore_errors=True); (base/'themes').mkdir(parents=True)
    groups={}
    for c in candidates: groups.setdefault(theme_for(c),[]).append(canonical_quote(c,'draft'))
    files=[]
    for theme,quotes in sorted(groups.items()):
        name,desc=THEME_INFO[theme]; payload={'schema_version':'1.0','content_version':batch['id'],'entity':'perspective_theme','status':'content_preview','primary_theme':theme,'display_name_vi':name,'description_vi':desc,'language':'vi','quotes':quotes}
        raw=(json.dumps(payload,ensure_ascii=False,indent=2)+'\n').encode(); rel=f'themes/{theme}.daily.json'; (base/rel).write_bytes(raw)
        files.append({'id':f'candidate.{theme}.{batch["id"]}','kind':'quote_pack','revision':batch['sequence'],'path':rel,'media_type':'application/json','sha256':sha(raw),'byte_count':len(raw)})
    manifest={'schema_version':'1.0','entity':'perspective_library_manifest','library_id':'selflo.perspective.candidate.vi','library_revision':batch['sequence'],'content_version':batch['id'],'language':'vi','generated_at':now(),'files':files}
    write(base/'manifest.json',manifest);write(base/'updates.json',{'library_revision':batch['sequence'],'generated_at':manifest['generated_at'],'entities':{c['id']:{'updated_at':manifest['generated_at']} for c in candidates}})
def commit_push(root,paths,message,push):
    if not push:return
    git(root,'add','--',*[str(Path(p).relative_to(root)) for p in paths]);git(root,'commit','-m',message);git(root,'push')
def select(args):
    root=args.root;q,catalog_path,state_path,batches=state_paths(root);catalog=read(catalog_path);state=load_state(state_path)
    if args.count <= 0:raise ValueError('--count must be positive')
    gate=ReviewEligibility(root,catalog['candidates'])
    seen=state['candidates']
    def available_candidate(c):
        ident=c['id']
        if not gate.is_open(ident) or gate.canonical_ids(ident):return False
        for key in gate.identities(ident):
            rec=seen.get(key,{})
            if rec.get('first_review') in ('queued','approved','rejected') or rec.get('second_review')=='rejected' or rec.get('authoring')=='imported' or rec.get('release')=='released':return False
        return True
    available=[c for c in catalog['candidates'] if available_candidate(c)]
    rank={'A - Primary source':0,'B - Authoritative secondary':1,'C - Plausible / needs primary':2}
    available.sort(key=lambda c:(rank.get(c.get('verification'),9),bool(c.get('duplicate_cluster_ids')),c['source_row']))
    chosen=[];chosen_identities=set()
    for candidate in available:
        identities=gate.identities(candidate['id'])
        if identities & chosen_identities:continue
        chosen.append(candidate);chosen_identities.update(identities)
        if len(chosen)==args.count:break
    if not chosen: print('No unqueued candidate remains.');return
    state['batch_sequence']+=1;day=args.date or dt.date.today().isoformat();bid=f'daily-{day}-b{state["batch_sequence"]:03d}'
    batch={'schema_version':'selflo.daily-review-batch.v1','id':bid,'sequence':state['batch_sequence'],'created_at':now(),'stage':'candidate','quote_ids':[c['id'] for c in chosen]}
    for c in chosen: state['candidates'].setdefault(c['id'],{}).update({'first_review':'queued','candidate_batch':bid})
    state['history'].append({'at':now(),'action':'select','batch':bid,'quote_ids':batch['quote_ids']});write(batches/f'{bid}.json',batch);write(state_path,state);candidate_package(root,batch,chosen)
    paths=[state_path,batches/f'{bid}.json',root/'perspective-library/candidate/vi'];commit_push(root,paths,f'Selflo candidate review batch {bid}',args.push)
    print(f'{bid}: {len(chosen)} candidate(s)');print(f'/apps/selflo/preview/?channel=candidate&updated=latest')
def apply_ledger(args,stage):
    root=args.root;q,catalog_path,state_path,batches=state_paths(root);state=load_state(state_path);doc,decisions=ledger_decisions(args.ledger)
    expected='selflo.perspective.candidate.vi' if stage=='candidate' else 'selflo.perspective.authoring.vi'
    if doc.get('library_id')!=expected: raise ValueError(f'Ledger is {doc.get("library_id")}, expected {expected}')
    catalog=read(catalog_path)['candidates']
    gate=ReviewEligibility(root,catalog)
    candidate_ids={c['id'] for c in catalog}
    changed=[]
    # Validate the entire ledger before preparing any state change.
    for ident,d in decisions.items():
        if stage=='candidate' and ident not in candidate_ids:
            raise ValueError('Unknown candidate ID: '+ident)
        if stage=='authoring':gate.canonical_id(ident)
        if d['decision']=='approved':
            gate.require_open(ident)
            for key in gate.identities(ident):
                rec=state['candidates'].get(key,{})
                if rec.get('first_review')=='rejected' or rec.get('second_review')=='rejected':
                    raise ValueError('Closed candidate review decision: '+key)
    for ident,d in decisions.items():
        rec=state['candidates'].setdefault(ident,{})
        rec['first_review' if stage=='candidate' else 'second_review']=d['decision'];rec[f'{stage}_note']=d['note'];changed.append(ident)
    state['history'].append({'at':now(),'action':f'apply_{stage}_ledger','ledger':str(args.ledger),'quote_ids':changed})
    # Caller persists this prepared state only after successful publication.
    return state,decisions
def staged_publish(root,source_changes,channels):
    library=root/'perspective-library';publisher=root/'scripts/publish-perspective-library'
    with tempfile.TemporaryDirectory(prefix='selflo-daily-review-') as t:
        tmp=Path(t);shutil.copytree(library,tmp/'perspective-library')
        # The publisher invokes semantic validators relative to --repo-root.
        # Keep this transaction self-contained, as prepare-perspective does.
        shutil.copytree(root/'scripts',tmp/'scripts')
        for rel,obj in source_changes.items(): write(tmp/rel,obj)
        for channel in channels:run(['ruby',str(publisher),'--repo-root',str(tmp),'--channel',channel])
        # Install whole canonical and generated channel files that changed, preserving candidate package.
        for sub in ['source/vi']+channels:
            src=tmp/'perspective-library'/sub;dst=library/sub
            if dst.exists():shutil.rmtree(dst)
            shutil.copytree(src,dst)
def promote_authoring(args):
    root=args.root;q,catalog_path,state_path,batches=state_paths(root);catalog={x['id']:x for x in read(catalog_path)['candidates']};state,decisions=apply_ledger(args,'candidate')
    gate=ReviewEligibility(root,list(catalog.values()))
    ids=[i for i,d in decisions.items() if d['decision']=='approved' and state['candidates'].get(i,{}).get('authoring')!='imported' and not gate.canonical_ids(i)]
    if not ids:
        write(state_path,state)
        print('No newly approved candidate to import.');return
    identities_seen=set()
    for ident in ids:
        identities=gate.identities(ident)
        if identities & identities_seen:raise ValueError('Multiple candidates share one quote identity: '+ident)
        identities_seen.update(identities)
    source=root/'perspective-library/source/vi';idx=read(source/'source.json');changes={};descriptors={x['id']:x for x in idx['files']};themes={}
    for entry in idx['files']:
        if entry['kind']=='quote_pack':themes[read(source/entry['path'])['primary_theme']]=entry
    for ident in ids:
        c=catalog[ident];theme=theme_for(c);theme_entry=themes[theme];theme_path=source/theme_entry['path'];theme_doc=changes.get(theme_path.relative_to(root)) or read(theme_path)
        frag_ids=theme_doc['quote_fragment_ids'];frag_entry=descriptors[frag_ids[-1]];frag_path=source/frag_entry['path'];rel=frag_path.relative_to(root);frag=changes.get(rel) or read(frag_path)
        if len(frag['quotes'])>=12:
            num=int(re.search(r'(\d+)\.vi\.json$',frag_entry['path']).group(1))+1;fid=f'quote_fragment.{theme}.{num:03d}';fpath=f'quotes/{theme}/{num:03d}.vi.json';frag={'schema_version':'selflo.perspective.quote-fragment.v1','entity':'perspective_quote_fragment','fragment_id':fid,'primary_theme':theme,'quotes':[]};idx['files'].append({'id':fid,'kind':'quote_fragment','path':fpath,'media_type':'application/json'});descriptors[fid]=idx['files'][-1];theme_doc['quote_fragment_ids'].append(fid);rel=(source/fpath).relative_to(root)
        frag['quotes'].append(canonical_quote(c,'needs_owner_review'));changes[rel]=frag;changes[theme_path.relative_to(root)]=theme_doc
    idx['source_revision']+=1;idx['canonical_quote_count']+=len(ids);idx['content_version']=f'daily-review-authoring-{idx["source_revision"]}';changes[(source/'source.json').relative_to(root)]=idx
    staged_publish(root,changes,['authoring','release'])
    for ident in ids: state['candidates'][ident]['authoring']='imported'
    write(state_path,state);paths=[state_path,source,root/'perspective-library/authoring/vi',root/'perspective-library/release/vi'];commit_push(root,paths,f'Promote {len(ids)} reviewed perspective(s) to Authoring',args.push);print(f'Imported {len(ids)} quote(s) to Authoring.')
def promote_release(args):
    root=args.root;state,decisions=apply_ledger(args,'authoring')
    gate=ReviewEligibility(root)
    manifest_path=root/'perspective-library/release/vi/manifest.json'
    released=set()
    if manifest_path.exists():
        for entry in read(manifest_path)['files']:
            if entry['kind']=='quote_pack':
                released.update(q['id'] for q in read(manifest_path.parent/entry['path'])['quotes'])
    approved={ident:gate.canonical_id(ident) for ident,d in decisions.items() if d['decision']=='approved'}
    ids=sorted(set(approved.values())-released)
    _,_,state_path,_=state_paths(root)
    if ids:
        cmd=[sys.executable,str(root/'scripts/prepare-perspective.py'),'--root',str(root),'--channel','release','--reviewer','ai:codex']
        for i in ids:cmd+=['--quote',i]
        if args.rights:cmd+=['--rights',args.rights,'--rights-note',args.rights_note]
        if args.confirm_knowledge_checked:cmd+=['--confirm-knowledge-checked']
        run(cmd)
        # Do not record a successful release unless it is in the manifest.
        published=set()
        for entry in read(manifest_path)['files']:
            if entry['kind']=='quote_pack':
                published.update(q['id'] for q in read(manifest_path.parent/entry['path'])['quotes'])
        if not set(ids)<=published:raise ValueError('Requested quotes absent from published Release')
    for ident,canonical in approved.items():
        for key in {ident,canonical} | (gate.identities(ident) & state['candidates'].keys()):
            state['candidates'].setdefault(key,{})['release']='released'
    write(state_path,state)
    paths=[state_path,root/'perspective-library/source/vi',root/'perspective-library/authoring/vi',root/'perspective-library/release/vi'];commit_push(root,paths,f'Release {len(ids)} owner-approved perspective(s)',args.push)
    print(f'Released {len(ids)} newly approved quote(s).')
def editorial_status(root):
    matrix_path=root/'studio/review-matrix/data.json'
    if not matrix_path.exists():
        return {'availability':'missing', 'action_vi':'Tạo Review Matrix trước khi xem tiến độ biên tập.'}
    matrix=read(matrix_path)
    observed=matrix.get('status_inputs_sha256')
    current=status_input_digests(root)
    stale=[name for name,digest in current.items()
           if digest is None or not observed or observed.get(name)!=digest]
    if stale:
        return {'availability':'stale', 'changed_inputs':stale,
                'action_vi':'Chạy scripts/build-review-matrix.py để đồng bộ với manifest và review ledger hiện tại.'}
    counts={}
    for row in matrix['rows']:
        key=row['pm_status'];counts[key]=counts.get(key,0)+1
    return {'availability':'current', 'source':'studio/review-matrix/data.json',
            'generated_at':matrix['generated_at'],
            'authoring_revision':matrix['authoring_revision'],
            'release_revision':matrix['release_revision'],
            'total_quotes':len(matrix['rows']), 'states':counts,
            'summary':matrix['summary']}

def status(args):
    _,catalog_path,state_path,_=state_paths(args.root);cat=read(catalog_path);st=load_state(state_path);counts={}
    for c in cat['candidates']:
        r=st['candidates'].get(c['id'],{});key=r.get('release') or r.get('second_review') or r.get('authoring') or r.get('first_review') or 'unseen';counts[key]=counts.get(key,0)+1
    # Keep the original fields for callers tracking import batches. They do not
    # represent editorial approval or the active Release catalog.
    result={'catalog':len(cat['candidates']),'batch_sequence':st['batch_sequence'],'states':counts,
            'states_scope':'candidate_import_workflow_only',
            'states_note_vi':'Imported là lịch sử nhập candidate, không phải trạng thái review hoặc Release hiện tại.',
            'editorial_status':editorial_status(args.root)}
    print(json.dumps(result,ensure_ascii=False,indent=2))
def main():
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parent.parent);sp=p.add_subparsers(dest='cmd',required=True)
    a=sp.add_parser('select');a.add_argument('--count',type=int,default=5);a.add_argument('--date');a.add_argument('--push',action='store_true');a.set_defaults(fn=select)
    a=sp.add_parser('promote-authoring');a.add_argument('--ledger',type=Path,required=True);a.add_argument('--push',action='store_true');a.set_defaults(fn=promote_authoring)
    a=sp.add_parser('promote-release');a.add_argument('--ledger',type=Path,required=True);a.add_argument('--rights',choices=('selflo_owned','public_domain','licensed','permission_granted'));a.add_argument('--rights-note');a.add_argument('--confirm-knowledge-checked',action='store_true');a.add_argument('--push',action='store_true');a.set_defaults(fn=promote_release)
    a=sp.add_parser('status');a.set_defaults(fn=status)
    args=p.parse_args();args.root=args.root.resolve()
    if getattr(args,'rights',None) and not getattr(args,'rights_note',None):p.error('--rights requires --rights-note')
    try:args.fn(args);return 0
    except (ValueError,KeyError,OSError,subprocess.CalledProcessError) as e:print('ERROR:',e,file=sys.stderr);return 1
if __name__=='__main__':sys.exit(main())
