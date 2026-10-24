#!/usr/bin/env python3
"""Deliberately refresh the canonical quote text/authorship integrity lock."""

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "perspective-library/source/vi/quotes"
LOCK = ROOT / "perspective-library/tooling/locked-quote-content.json"


def digest(value):
    raw = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reason', required=True, help='Editorial batch/evidence explaining this intentional lock refresh')
    args = parser.parse_args()
    if not args.reason.strip():
        parser.error('--reason must not be blank')
    quotes = []
    for path in sorted(SOURCE.glob("*/*.vi.json")):
        quotes.extend(json.loads(path.read_text())["quotes"])
    quotes.sort(key=lambda quote: quote["id"])
    payload = {
        "schema_version": "selflo.locked-quote-content.v1",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "reason": args.reason.strip(),
        "quote_count": len(quotes),
        "quote_text_sha256": digest([[quote["id"], quote["text_vi"]] for quote in quotes]),
        "authorship_sha256": digest([[quote["id"], quote["authorship"]] for quote in quotes]),
    }
    LOCK.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
