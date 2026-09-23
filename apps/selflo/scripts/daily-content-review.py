#!/usr/bin/env python3
"""Daily Selflo candidate → Authoring → Release review workflow.

The browser review ledger remains the owner's decision input. This script never
interprets a missing decision as approval and never bypasses rights/source gates.
"""
import argparse, copy, datetime as dt, hashlib, json, re, shutil, subprocess, sys, tempfile
from pathlib import Path

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
def run(cmd,cwd=None): subprocess.run(cmd,cwd=cwd,check=True)
def git(root,*args): run(['git','-C',str(root),*args])
def state_paths(root):
    q=root/'quote-research/review-pipeline'
    return q,q/'review-candidates.json',q/'state.json',q/'batches'
def load_state(p):
    if p.exists(): return read(p)
    return {'schema_version':'selflo.daily-review-state.v1','batch_sequence':0,'candidates':{},'history':[]}
def ledger_decisions(path):
    doc=read(path);out={}
    for x in doc.get('decisions',[]):
        q=x.get('quote_id'); d=x.get('quote_decision') or x.get('decision')
        if q and d in VALID_DECISIONS: out[q]={'decision':d,'note':x.get('note') or '','updated_at':x.get('updated_at')}
    return doc,out
def theme_for(c): return THEME_MAP.get(c.get('life_area'),'self_understanding')
def canonical_quote(c,status='draft'):
    theme=theme_for(c); author=c.get('author') or None; work=c.get('work') or None; url=c.get('source_url') or None
    return {
      'id':c['id'],'revision':1,'kind':'adapted_wisdom','title_vi':None,'text_vi':c['text_vi'],'subtitle_vi':None,
      'story_id':None,'primary_theme':theme,
      'selection':{'source_type':'philosophy','reflection_kind':None,'thought_match_keys':[],'presentation_tags':[x for x in [c.get('life_area'),c.get('human_experience'),c.get('theme')] if x and ' | ' not in x and x!='unresolved'],'tie_break_order':0},
      'authorship':{'author_id':None,'author_name':author,'work':work,'source_url':url,'source_language':None,'source_label':author or 'Research candidate','source_detail':f"Research corpus row {c.get('source_row')}; content_nature={c.get('content_nature')}; verification={c.get('verification')}."},
      'metadata':{'concepts':[],'theories':[],'frameworks':[],'emotion_tags':[],'keywords':[x for x in [c.get('human_experience'),c.get('theme')] if x and ' | ' not in x and x!='unresolved']},
      'rights':{'status':'unverified','note':c.get('rights_research_note') or None},
      'review':{'status':status,'reviewed_by':None,'reviewed_at':None},
      'writing':{'semantic_intent':c['text_vi'],'observation_key':None,'structure_pattern':'research_candidate'},
      'display':{'mode':'poster','priority':0,'featured':False,'style':'paper_quote','attribution_vi':author or 'Nguồn đang xác minh'},
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
    seen=state['candidates']; available=[c for c in catalog['candidates'] if seen.get(c['id'],{}).get('first_review') not in ('queued','approved','rejected')]
    rank={'A - Primary source':0,'B - Authoritative secondary':1,'C - Plausible / needs primary':2}
    available.sort(key=lambda c:(rank.get(c.get('verification'),9),bool(c.get('duplicate_cluster_ids')),c['source_row']))
    chosen=available[:args.count]
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
    changed=[]
    for ident,d in decisions.items():
        rec=state['candidates'].setdefault(ident,{})
        rec['first_review' if stage=='candidate' else 'second_review']=d['decision'];rec[f'{stage}_note']=d['note'];changed.append(ident)
    state['history'].append({'at':now(),'action':f'apply_{stage}_ledger','ledger':str(args.ledger),'quote_ids':changed});write(state_path,state);print(f'Applied {len(changed)} decision(s).')
    return state,decisions
def staged_publish(root,source_changes,channels):
    library=root/'perspective-library';publisher=root/'scripts/publish-perspective-library'
    with tempfile.TemporaryDirectory(prefix='selflo-daily-review-') as t:
        tmp=Path(t);shutil.copytree(library,tmp/'perspective-library')
        for rel,obj in source_changes.items(): write(tmp/rel,obj)
        for channel in channels:run(['ruby',str(publisher),'--repo-root',str(tmp),'--channel',channel])
        # Install whole canonical and generated channel files that changed, preserving candidate package.
        for sub in ['source/vi']+channels:
            src=tmp/'perspective-library'/sub;dst=library/sub
            if dst.exists():shutil.rmtree(dst)
            shutil.copytree(src,dst)
def promote_authoring(args):
    root=args.root;q,catalog_path,state_path,batches=state_paths(root);catalog={x['id']:x for x in read(catalog_path)['candidates']};state,decisions=apply_ledger(args,'candidate')
    ids=[i for i,d in decisions.items() if d['decision']=='approved' and state['candidates'].get(i,{}).get('authoring')!='imported']
    if not ids:print('No newly approved candidate to import.');return
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
    root=args.root;state,decisions=apply_ledger(args,'authoring');ids=[i for i,d in decisions.items() if d['decision']=='approved' and state['candidates'].get(i,{}).get('authoring')=='imported' and state['candidates'].get(i,{}).get('release')!='released']
    if not ids:print('No newly approved Authoring quote to release.');return
    cmd=[sys.executable,str(root/'scripts/prepare-perspective.py'),'--root',str(root),'--channel','release']
    for i in ids:cmd+=['--quote',i]
    if args.rights:cmd+=['--rights',args.rights,'--rights-note',args.rights_note]
    if args.confirm_knowledge_checked:cmd+=['--confirm-knowledge-checked']
    run(cmd)
    for i in ids:state['candidates'][i]['release']='released'
    _,_,state_path,_=state_paths(root);write(state_path,state);paths=[state_path,root/'perspective-library/source/vi',root/'perspective-library/authoring/vi',root/'perspective-library/release/vi'];commit_push(root,paths,f'Release {len(ids)} owner-approved perspective(s)',args.push);print(f'Released {len(ids)} quote(s).')
def status(args):
    _,catalog_path,state_path,_=state_paths(args.root);cat=read(catalog_path);st=load_state(state_path);counts={}
    for c in cat['candidates']:
        r=st['candidates'].get(c['id'],{});key=r.get('release') or r.get('second_review') or r.get('authoring') or r.get('first_review') or 'unseen';counts[key]=counts.get(key,0)+1
    print(json.dumps({'catalog':len(cat['candidates']),'batch_sequence':st['batch_sequence'],'states':counts},ensure_ascii=False,indent=2))
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
