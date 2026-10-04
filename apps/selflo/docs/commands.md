# Lệnh vận hành

Chạy từ `apps/selflo/`.

```bash
python3 scripts/build-content-catalog.py .
python3 scripts/test_story_v3_contract.py
python3 scripts/test_story_component_contract.py
python3 scripts/test_content_tag_contract.py
```

Review/promotion dùng `scripts/daily-content-review.py`; publish dùng `scripts/publish-perspective-library`. Xem chi tiết tại [`../scripts/DAILY_CONTENT_REVIEW.vi.md`](../scripts/DAILY_CONTENT_REVIEW.vi.md) và [`../perspective-library/RELEASE_STORY_GUIDE.vi.md`](../perspective-library/RELEASE_STORY_GUIDE.vi.md).

Khi đổi contract: cập nhật `shared/contracts`, registry, schema/fixture/validator, tài liệu conformance bên app, rồi mới đổi source/publisher.
