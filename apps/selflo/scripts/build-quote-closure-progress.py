#!/usr/bin/env python3
"""Project closure progress from the existing decision ledger; never approve content."""
import argparse
import hashlib
import json
from pathlib import Path

PROGRAM='quote-closure-5471-2026-10-25'
REASONS={'duplicate','context_required','not_reader_quote','weak_or_misleading','too_narrow_for_selflo','source_unverified','rights_not_cleared','translation_not_reliable','owner_rejected'}

def read(path):return json.loads(path.read_text())
def sha(data):return hashlib.sha256(data).hexdigest()

def project(root, public_proof=None):
    home=root/'content-workspace/programs/quote-library-p0'
    baseline=read(home/'reports/quote-closure-baseline-2026-10-25.json')
    baseline_ids=[r['id'] for r in baseline['baseline_rows']]
    if len(baseline_ids)!=baseline['baseline_count'] or len(set(baseline_ids))!=len(baseline_ids):
        raise ValueError('Baseline IDs missing or duplicated')
    source=root/'perspective-library/source/vi';canonical={}
    for f in read(source/'source.json')['files']:
        if f['kind'] in ('quote_pack','quote_fragment'):
            for q in read(source/f['path']).get('quotes',[]):
                if q['id'] in canonical:raise ValueError('Duplicate canonical ID: '+q['id'])
                canonical[q['id']]=q
    matrix=read(root/'studio/review-matrix/data.json')
    raw={r['id']:r for r in matrix['rows']}
    ledger=read(root/'content-workspace/curated/quote-research/review-pipeline/canonical-ai-review.json')
    decisions={}
    for item in ledger['decisions']:
        if item['quote_id'] in decisions:raise ValueError('Duplicate decision ID: '+item['quote_id'])
        decisions[item['quote_id']]=item
    release=root/'perspective-library/release/vi';manifest=read(release/'manifest.json');released=set();released_quotes={}
    packs=[f for f in manifest['files'] if f['kind']=='quote_pack']
    for f in packs:
        data=(release/f['path']).read_bytes()
        if sha(data)!=f['sha256']:raise ValueError('Release pack checksum mismatch: '+f['path'])
        for q in json.loads(data)['quotes']:
            if q['id'] in released_quotes:raise ValueError('Duplicate Release quote ID: '+q['id'])
            released.add(q['id']);released_quotes[q['id']]=q
    proof=read(public_proof) if public_proof else {}
    public_ok=(proof.get('manifest_sha256')==sha((release/'manifest.json').read_bytes()) and
               proof.get('quote_packs_sha256')=={f['path']:f['sha256'] for f in packs} and bool(proof.get('verified_at')))
    counts={'released':0,'not_accepted':0,'remaining':0};reasons={};rows=[]
    for ident in baseline_ids:
        decision=decisions.get(ident,{})
        closure=decision.get('closure',{})
        state='remaining';issue=None
        if closure.get('program_id')==PROGRAM:
            canonical_id=closure.get('canonical_id') or ident
            quote=canonical.get(canonical_id)
            text=quote.get('text_vi') if quote else raw.get(ident,{}).get('text_vi')
            if text is None or closure.get('reviewed_text_sha256')!=sha(text.encode()):issue='review_text_changed_or_missing'
            elif not closure.get('evidence_path') or not (root/closure['evidence_path']).is_file():issue='missing_review_evidence'
            elif closure.get('verdict')=='accepted':
                if decision.get('decision')!='release_ready_ai_approved':issue='missing_editorial_approval'
                elif canonical_id not in released:issue='accepted_not_in_release'
                elif quote.get('review',{}).get('status')!='approved':issue='canonical_not_approved'
                elif released_quotes[canonical_id].get('text_vi')!=text:issue='release_text_differs_from_review'
                elif not public_ok:issue='public_verification_pending'
                else:state='released'
            elif closure.get('verdict')=='not_accepted':
                reason=closure.get('reason_code')
                if reason not in REASONS or not decision.get('note_vi'):issue='missing_or_invalid_rejection_reason'
                elif decision.get('decision')!='round1_not_pass':issue='missing_closed_decision'
                elif canonical_id in released:issue='rejected_still_in_release'
                else:state='not_accepted';reasons[reason]=reasons.get(reason,0)+1
            else:issue='unknown_closure_verdict'
        counts[state]+=1
        rows.append({'baseline_id':ident,'status':state,'batch_id':closure.get('batch_id'),'issue':issue})
    assert sum(counts.values())==len(baseline_ids)
    return {'schema_version':'selflo.quote-closure-progress.v1','program_id':PROGRAM,'baseline_count':len(baseline_ids),
            'release_revision':manifest['library_revision'],'public_verified':public_ok,'counts':counts,
            'not_accepted_by_reason':reasons,'rows':rows}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--public-proof',type=Path)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args();result=project(args.root.resolve(),args.public_proof)
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='rows'},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
