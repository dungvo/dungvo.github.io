#!/usr/bin/env python3
"""Build the final, exhaustive P0 disposition ledger for all quote rows."""

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MATRIX = ROOT / "studio/review-matrix/data.json"
OUT = (
    ROOT
    / "content-workspace/programs/quote-library-p0/reports"
    / "p0-final-dispositions.json"
)


AUTHORING_STATUSES = {
    "ready_for_ai_review": (
        "owner_review_content_or_rights",
        "Đã qua tuyển chọn AI nhưng còn ít nhất một quyết định về quyền, bản dịch, ngữ cảnh hoặc mức hợp Selflo; giữ trong Authoring để owner xem khi muốn.",
    ),
    "needs_story_review": (
        "owner_review_with_story",
        "Cần đọc cùng story liên kết trước khi quyết định; giữ trong Authoring.",
    ),
    "needs_round1_review": (
        "owner_review_editorial_candidate",
        "Là candidate đã được chuẩn hóa nhưng chưa có kết luận biên tập đủ chắc để Release; giữ trong Authoring.",
    ),
    "needs_edit": (
        "owner_review_after_edit",
        "Có tiềm năng nhưng câu hiện tại cần sửa; giữ trong Authoring và không Release.",
    ),
}

RESEARCH_STATUSES = {
    "needs_normalization": (
        "raw_not_normalized",
        "Nguyên liệu thô chưa được dịch/chuẩn hóa và chưa đủ để đưa cho owner duyệt.",
    ),
    "held_research": (
        "research_only_not_selected",
        "Đã xem xét ở mức corpus nhưng chưa đạt ngưỡng tuyển chọn Selflo; giữ làm nghiên cứu.",
    ),
    "needs_source_verification": (
        "research_source_not_verified",
        "Chưa truy đủ nguồn gốc, locator, edition hoặc bản dịch; không vào Authoring/Release.",
    ),
    "blocked_rights": (
        "excluded_rights_blocked",
        "Quyền sử dụng đang bị chặn hoặc chưa có cơ sở phù hợp; loại khỏi Authoring/Release hiện hành.",
    ),
    "held_not_passed": (
        "excluded_editorial_not_passed",
        "Không đạt review biên tập hiện tại; chỉ mở lại khi nội dung hoặc bằng chứng thay đổi.",
    ),
    "duplicate_hold": (
        "excluded_duplicate",
        "Là bản trùng thua; giữ provenance trong Research nhưng không đưa vào Authoring/Release.",
    ),
    "needs_authoring_review": (
        "research_not_promoted",
        "Chưa đủ cơ sở để promote khỏi Research; đóng ở Research trong baseline P0.",
    ),
}


def classify(row):
    status = row.get("pm_status")
    if status == "released":
        return (
            "release",
            "released_ai_or_owner_approved",
            "Đã qua Release gate và có trong Release hiện hành.",
        )
    if status in AUTHORING_STATUSES:
        disposition, reason = AUTHORING_STATUSES[status]
        return "authoring", disposition, reason
    if status in RESEARCH_STATUSES:
        disposition, reason = RESEARCH_STATUSES[status]
        return "research_raw", disposition, reason
    raise ValueError(f"Unmapped pm_status for {row.get('id')}: {status!r}")


def main():
    matrix = json.loads(MATRIX.read_text())
    rows = []
    for source in matrix["rows"]:
        bucket, disposition, reason = classify(source)
        rows.append(
            {
                "id": source["id"],
                "canonical_id": source.get("canonical_id"),
                "research_id": source.get("research_id"),
                "text_vi": source.get("text_vi"),
                "author": source.get("author"),
                "theme": source.get("theme"),
                "source_url": source.get("source_url"),
                "previous_pm_status": source.get("pm_status"),
                "final_bucket": bucket,
                "final_disposition": disposition,
                "final_reason_vi": reason,
            }
        )

    bucket_counts = Counter(row["final_bucket"] for row in rows)
    disposition_counts = Counter(row["final_disposition"] for row in rows)
    previous_counts = Counter(row["previous_pm_status"] for row in rows)
    total = len(rows)
    if total != 5470 or sum(bucket_counts.values()) != total:
        raise ValueError(
            f"P0 reconciliation failed: total={total}, buckets={sum(bucket_counts.values())}"
        )

    payload = {
        "schema_version": "selflo.quote-p0-final-dispositions.v1",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "matrix_generated_at": matrix.get("generated_at"),
        "authoring_revision": matrix.get("authoring_revision"),
        "release_revision": matrix.get("release_revision"),
        "policy_vi": (
            "Mỗi dòng baseline có đúng một nơi kết thúc: Release, Authoring để owner review, "
            "hoặc Research/Raw. Research/Raw giữ provenance nhưng không nằm trong hàng duyệt của owner."
        ),
        "summary": {
            "total": total,
            "bucket_counts": dict(bucket_counts),
            "disposition_counts": dict(disposition_counts),
            "previous_status_counts": dict(previous_counts),
            "reconciled": True,
        },
        "rows": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
