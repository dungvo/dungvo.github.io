# Story Layout V2 — Data Contract

**Trạng thái:** Normative cho Authoring/Release mới  
**Phiên bản payload:** `1.1`  
**Reader format:** `editorial_v2`

Tài liệu này là nguồn sự thật duy nhất cho dữ liệu trình bày Story Reader V2. Web Reference Renderer và app phải render theo semantic trong payload; không được tự chọn lại `pull_quote`, tự tách paragraph hoặc suy diễn layout từ độ dài câu.

## 1. Compatibility

- Thiếu `reader_format` hoặc `reader_format = classic_v1`: dùng Classic V1.
- `reader_format = editorial_v2`: payload phải theo contract này.
- Format chưa hỗ trợ: runtime fail closed về Classic V1; Authoring validator cảnh báo.
- V2 giữ stable ID, lifecycle, rights, provenance và quote-to-story link hiện tại.
- Chỉ sửa canonical tại `perspective-library/source/vi/`. `authoring/` và `release/` là output của publisher.

## 2. Field cấp story

### Bắt buộc cho mọi story

`schema_version`, `entity`, `id`, `revision`, `status`, `language`, `title_vi`, `primary_theme`, `metadata`, `sections`, `takeaway`, `authorship`, `editorial`, `rights`, `review`.

### Bắt buộc thêm cho Editorial V2

- `schema_version = 1.1`
- `reader_format = editorial_v2`
- `reflection.prompts_vi`: một hoặc hai câu hỏi.
- Mọi block `paragraph` phải khai báo `style`.

### Optional

- `subtitle_vi`
- `opening_quote_vi`: một câu/ý ngắn, treatment nhẹ hơn body pull quote.
- `reflection.closing_vi`: một câu tạo dư âm, không thêm luận điểm mới.
- `hero_image`: legacy fallback; V2 ưu tiên shared artwork theo theme.
- `layout_review`: chỉ cần khi vượt density gate.

## 3. Block types

### `part_heading`

Mốc chuyển phần lớn trong cùng một luồng scroll. Không phải tab, navigation card, sticky header hoặc màn hình riêng.

```json
{
  "id": "part_02",
  "type": "part_heading",
  "part_number": 2,
  "title_vi": "Nếu đời không đẹp như kịch bản",
  "subtitle_vi": "Khi cuộc sống không đi theo đường thẳng ta từng hình dung."
}
```

Bắt buộc: `id`, `type`, `part_number`, `title_vi`. Optional: `subtitle_vi`. `part_number` bắt đầu từ 1, tăng liên tục và không lặp.

### `paragraph`

```json
{
  "id": "section_02.block_03",
  "type": "paragraph",
  "style": "narrative",
  "text_vi": "..."
}
```

`style` bắt buộc với V2:

| Style | Dùng khi | Presentation |
|---|---|---|
| `narrative` | Prose thông thường, thường 1–4 câu cùng beat | Serif body, spacing chuẩn |
| `dialogue_lead` | Câu dẫn ngắn ngay trước lời thoại hoặc pull quote | Giảm khoảng cách dưới |
| `transition` | Chuyển thời gian, bối cảnh hoặc bước ngoặt thật | Tăng khoảng thở phía trên |

Không có style `featured`, `emphasis` hoặc `reflection`. Điểm nhấn semantic dùng `pull_quote`; reflection thuộc vùng kết thúc.

### `pull_quote`

Chỉ dành cho lời thoại/câu bản lề thật sự đáng dừng lại. Canonical khai báo `pull_quote` thì mọi renderer phải trình bày như pull quote; không có `featured_quote_ids`.

Bắt buộc: `id`, `type`, `text_vi`, `attribution_vi` (`null` được phép).

### `heading`

Heading phụ bên trong section dài. Không thay thế `part_heading`; không dùng cho từng đoạn ngắn.

### `divider`

Ngắt cảnh nhẹ không cần heading. Không đặt đầu/cuối story hoặc hai divider liên tiếp.

## 4. Story ending

- `takeaway`: bắt buộc, là source of truth cho **Nhìn lại**; diễn giải ý nghĩa nhưng không lặp đoạn kết.
- `reflection.prompts_vi`: V2 bắt buộc 1–2 prompt, target là 2; câu hỏi mở, không chẩn đoán hoặc ra lệnh.
- `reflection.closing_vi`: optional; một câu ngắn tạo dư âm.
- Web/app dùng sans-serif cho takeaway và reflection để phân biệt tiếng nói Selflo với prose serif.

## 5. Density và editorial gates

Validator cảnh báo hoặc chặn khi:

- chuỗi paragraph một câu ngắn không có chuyển beat;
- hai pull quote liền nhau hoặc pull quote lặp block sát cạnh;
- takeaway trùng paragraph cuối;
- hơn 3 pull quote trong story thông thường;
- hơn 8 section hoặc 80 block mà thiếu `layout_review`;
- `part_number` thiếu, lặp hoặc không liên tục;
- `part_heading` nằm ở cuối story mà không có nội dung theo sau.

Ngoại lệ phải có dấu vết duyệt:

```json
{
  "layout_review": {
    "status": "approved_exception",
    "reason_vi": "Story có ba phần lớn và 26 chương nhỏ theo các giai đoạn đời người.",
    "reviewed_by": "owner:dungvo",
    "reviewed_at": "2026-09-16T00:00:00Z"
  }
}
```

## 6. Reading time

Đếm text trong `paragraph`, `heading`, `pull_quote`, `takeaway`, reflection prompts và reflection closing. Không đếm title/subtitle, theme, `part_heading`, attribution hoặc metadata. Web và app dùng cùng tokenization fixture và 220 token/phút, làm tròn lên, tối thiểu một phút.

## 7. Artwork resolution

```text
editorial_v2 + primary_theme
→ story_artwork_catalog
→ image descriptor trong cùng immutable snapshot
→ legacy hero_image
→ no-image Editorial V2
```

`preview_path` chỉ được dùng trong fixture/config của Story Lab, không thuộc canonical payload.

## 8. Rendering invariants

- Một mạch scroll từ đầu tới cuối.
- V2 chỉ hiển thị scroll progress, không hiển thị section counter.
- Renderer không tự đổi block type, nối/tách prose hoặc sinh reflection.
- `part_heading` có hierarchy cao hơn section title nhưng nằm trong document flow.
- Missing artwork collapse an toàn; story vẫn đọc được.
- Light/sepia/dark, Dynamic Type, VoiceOver và Reduce Motion phải giữ đúng content order.
