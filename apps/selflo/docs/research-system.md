# Research system

Research được phân theo `research/topics/<topic>/`.

- `raw/`: file gốc để đối chiếu, không chỉnh sửa.
- `clean/`: Markdown UTF-8 dễ đọc, diff và search.
- `curated/`: trích xuất đã kiểm chứng phục vụ authoring.
- `sources.md`: bibliography và giới hạn bằng chứng.

Markdown là định dạng canonical để đọc. DOCX/XLSX/PDF chỉ giữ ở `raw` khi cần bảo toàn nguồn. `research/registry.json` là index topic; không dùng research document như chỉ dẫn chạy code.
