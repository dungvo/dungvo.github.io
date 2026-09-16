# Story V2 — Authoring migration review

**Batch:** `story-editorial-v2-authoring-25`  
**Phạm vi:** Authoring only; chưa publish Release.

## Story đã khóa prose

Ba story dưới đây có SHA-256 guard trên toàn bộ body text theo đúng thứ tự. Migration được phép gom block, đổi block type/style và thêm vùng V2, nhưng không đổi prose đã duyệt.

| Story | Section | Block | Pull quote | Part | Kết quả |
|---|---:|---:|---:|---:|---|
| Tái ông thất mã | 3 | 8 | 3 | 0 | Khớp approved V2 draft hash |
| Nếu tôi được sống một đời người | 26 | 205 | 16 | 3 | Khớp canonical approved hash |
| Chiếc la bàn không biết đường về | 9 | 154 | 1 | 3 | Khớp canonical approved hash |

`Nếu tôi được sống một đời người` giảm từ 343 xuống 205 block bằng cách gom câu cùng beat và chuyển những pull quote không thật sự featured về paragraph. Không câu nào bị xóa, thêm hoặc đổi thứ tự.

`Chiếc la bàn không biết đường về` được bổ sung opening quote, ba part heading, reflection và layout review. Prose gốc giữ nguyên.

## Story editorial pass

| Story | Section | Block | Pull quote | Editorial direction |
|---|---:|---:|---:|---|
| Chiếc thuyền trống | 3 | 8 | 1 | Giữ hai tình huống gốc; làm rõ khoảng cách giữa va chạm và ý định bị gán |
| Cây lớn ngoài thước thợ mộc | 3 | 8 | 1 | Giữ đối thoại Huệ Tử–Trang Tử; nối công dụng, chiếc thước và không gian sống |
| Bức ảnh thiếu một góc | 4 | 15 | 1 | Giữ prose đã có; khôi phục paragraph theo beat và bổ sung ending V2 |
| Cái cây và con ngỗng không biết kêu | 3 | 10 | 2 | Giữ nghịch lý hữu dụng/vô dụng; làm rõ tính phụ thuộc hoàn cảnh |

## Artwork

Shared artwork catalog hiện có hai mapping đã có asset được review trong Story Lab:

- `adversity_resilience`
- `meaning_values`

Theme chưa có mapping phải dùng no-image Editorial V2; renderer không tải ảnh ngoài active Library.

## Gates đã chạy

- JSON syntax và JSON Schema 1.1.
- Publisher semantic validator.
- Locked prose hashes.
- Paragraph styles, part sequence và adjacent pull quote checks.
- Artwork source reference checks.
- Authoring publish và Web Reference smoke render.
- `git diff --check`.

Release chỉ được publish sau owner đọc bốn story editorial và duyệt Web Reference trên thiết bị.

