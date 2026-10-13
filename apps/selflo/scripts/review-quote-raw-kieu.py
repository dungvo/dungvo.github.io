#!/usr/bin/env python3
"""Record the item-level editorial review of the 100 raw Truyện Kiều captures."""

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "content-workspace/curated/quote-research/raw-capture/source-batches-b001-b030.json"
OUT = ROOT / "content-workspace/programs/quote-library-p0/reports/q8-kieu-item-review.json"

# These pairs can stand alone and add a recognizable perspective without
# pretending that every narrative couplet is a general-purpose quote.
AUTHORING = {
    "research.10k.b009.kieu.0003-0004": "Góc nhìn cô đọng về biến động và điều mắt thấy; cần owner quyết định tone đau buồn.",
    "research.10k.b009.kieu.0039-0040": "Hình ảnh thời gian trôi dễ hiểu; cần review cách dùng ngoài văn cảnh mùa xuân.",
    "research.10k.b009.kieu.0041-0042": "Hình ảnh thiên nhiên đứng độc lập tốt; phù hợp nhịp nghỉ và chú ý.",
    "research.10k.b009.kieu.0163-0164": "Diễn tả khoảng cách giữa cảm xúc bên trong và biểu hiện bên ngoài; cần giữ văn cảnh tình cảm.",
    "research.10k.b009.kieu.0181-0182": "Câu hỏi về gặp gỡ và bất định đứng độc lập; cần owner review mức cổ điển.",
    "research.10k.b009.kieu.0183-0184": "Cho thấy cảm xúc có thể đi vào sáng tạo; cần owner review cách diễn giải đi kèm.",
}


def main():
    source = json.loads(RAW.read_text())
    items = [
        item
        for item in source["items"]
        if "vi.wikisource.org/wiki/Truyện_Kiều" in (item.get("source_url") or "")
    ]
    rows = []
    for item in items:
        ident = item["candidate_id"]
        if ident in AUTHORING:
            disposition = "authoring_owner_review"
            reason = AUTHORING[ident]
        else:
            disposition = "research_only_contextual_narrative"
            reason = (
                "Đã đọc trong chuỗi 200 câu đầu; cặp câu chủ yếu kể nhân vật/cảnh/diễn biến "
                "hoặc phụ thuộc lời thoại, không đứng độc lập đủ tốt cho quote Selflo."
            )
        rows.append(
            {
                "id": ident,
                "text_vi": item.get("original_text"),
                "source_location": item.get("source_location"),
                "source_url": item.get("source_url"),
                "rights_basis": item.get("rights_note"),
                "reviewer": "ai:codex",
                "disposition": disposition,
                "reason_vi": reason,
            }
        )
    counts = Counter(row["disposition"] for row in rows)
    if len(rows) != 100:
        raise ValueError(f"Expected 100 Kiều captures, found {len(rows)}")
    payload = {
        "schema_version": "selflo.quote-p0-item-review.v1",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source_work": "Truyện Kiều (Đoạn Trường Tân Thanh)",
        "review_scope_vi": "100 cặp câu đầu được raw capture; review khả năng đứng độc lập làm quote, không đánh giá toàn tác phẩm.",
        "summary": {"total": len(rows), "counts": dict(counts), "reconciled": sum(counts.values()) == len(rows)},
        "rows": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
