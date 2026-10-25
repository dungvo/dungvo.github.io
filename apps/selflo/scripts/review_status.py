"""Freshness boundary for the editorial status shared by Studio and the CLI."""
import hashlib
from pathlib import Path

STATUS_INPUT_PATHS = (
    'perspective-library/authoring/vi/manifest.json',
    'perspective-library/release/vi/manifest.json',
    'perspective-library/source/vi/source.json',
    'perspective-library/source/vi/decisions/canonical-decisions.json',
    'content-workspace/curated/quote-research/review-pipeline/canonical-ai-review.json',
    'content-workspace/curated/quote-research/review-pipeline/release-shortlist.json',
)

def status_input_digests(root):
    return {name: hashlib.sha256((Path(root) / name).read_bytes()).hexdigest()
            if (Path(root) / name).is_file() else None for name in STATUS_INPUT_PATHS}

def apply_closed_decisions(rows, reviews):
    """Let the existing ledger close raw rows as well as canonical rows."""
    for row in rows:
        review=reviews.get(row['id'],{})
        if row['pipeline']!='release' and review.get('decision') in ('round1_not_pass','source_rights_blocked'):
            row.update(ai_review_status=review['decision'],ai_review_round=review.get('review_round'),
                       ai_review_note=review.get('note_vi'),why=review.get('note_vi') or row['why'])
