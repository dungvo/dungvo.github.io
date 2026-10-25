"""Resolve explicit quote identities and preserve closed editorial decisions."""
import json
from pathlib import Path

class ReviewEligibility:
    def __init__(self, root, candidates=None):
        root=Path(root)
        self.quotes={}
        self.aliases={}
        self.closed={}
        source=root/'perspective-library/source/vi'
        index=json.loads((source/'source.json').read_text())
        exclusions=[]
        for entry in index['files']:
            if entry['kind'] not in ('quote_fragment','quote_pack','authoring_decisions'):
                continue
            path=(source/entry['path']).resolve()
            if not path.is_relative_to(source.resolve()):
                raise ValueError('Canonical source path escapes source directory')
            doc=json.loads(path.read_text())
            if entry['kind']=='authoring_decisions':
                exclusions.extend(doc.get('release_quote_exclusions',[]))
            else:
                for quote in doc.get('quotes',[]):
                    if quote['id'] in self.quotes:
                        raise ValueError('Duplicate canonical quote ID: '+quote['id'])
                    self.quotes[quote['id']]=quote
                    if quote.get('review',{}).get('status')=='rejected':
                        self.closed[quote['id']]='canonical rejected'
        for item in exclusions:
            self.closed[item['quote_id']]='explicitly excluded by owner'
        queue=root/'content-workspace/curated/quote-research/review-pipeline'
        ledger=queue/'canonical-ai-review.json'
        if ledger.exists():
            # A later approval cannot erase a closed disposition implicitly.
            # Reopening requires deliberately resolving the decision record.
            for item in json.loads(ledger.read_text()).get('decisions',[]):
                if item.get('decision') in ('round1_not_pass','source_rights_blocked','rejected'):
                    self.closed[item['quote_id']]=item['decision']
        state_path=queue/'state.json'
        if state_path.exists():
            for ident,record in json.loads(state_path.read_text()).get('candidates',{}).items():
                if record.get('first_review')=='rejected' or record.get('second_review')=='rejected':
                    self.closed[ident]='candidate review rejected'
        if candidates is None:
            path=queue/'review-candidates.json'
            candidates=json.loads(path.read_text())['candidates'] if path.exists() else []
        candidate_ids=set()
        for candidate in candidates:
            if candidate['id'] in candidate_ids:raise ValueError('Duplicate candidate ID: '+candidate['id'])
            candidate_ids.add(candidate['id'])
            ids={candidate[key] for key in ('id','research_id_original','canonical_id') if candidate.get(key)}
            for ident in ids:
                self.aliases.setdefault(ident,set()).update(ids)

    def identities(self, ident):
        seen=set();pending=[ident]
        while pending:
            item=pending.pop()
            if item in seen:continue
            seen.add(item);pending.extend(self.aliases.get(item,set())-seen)
        return seen

    def canonical_ids(self, ident):
        return self.identities(ident) & self.quotes.keys()

    def canonical_id(self, ident):
        ids=self.canonical_ids(ident)
        if len(ids)!=1:
            raise ValueError(f'Unknown or ambiguous canonical identity: {ident}: {sorted(ids)}')
        return next(iter(ids))

    def require_open(self, ident):
        blocked={key:self.closed[key] for key in self.identities(ident) if key in self.closed}
        if blocked:
            raise ValueError(f'Closed review decision for {ident}: {blocked}. Resolve the decision ledger before reopening.')

    def is_open(self, ident):
        return not any(key in self.closed for key in self.identities(ident))
