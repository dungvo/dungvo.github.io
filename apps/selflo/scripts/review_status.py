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
