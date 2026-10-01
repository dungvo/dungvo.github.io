# Story Reader V3 Visual Reference

**Trạng thái:** Gate 3 in progress  
**Cập nhật:** 2026-10-01  
**Canonical semantics:** [`../COMPONENT_CATALOG.vi.md`](../COMPONENT_CATALOG.vi.md)

Visual reference giúp app và content cùng hiểu hierarchy, nhịp đọc và quan hệ tương đối giữa component. Ảnh không phải pixel contract: font file, kích thước tuyệt đối, padding, ornament và cách compositing asset vẫn thuộc renderer, miễn giữ minimum rendering promise.

## Approved — Gate 3B Round 1

Owner approved ngày 2026-10-01:

1. [`01-statements-and-quotes.png`](approved/gate-3b-round-1/01-statements-and-quotes.png): `statement.centered`, `statement.leading`, `quote.centerpiece`, `quote.inset`, `quote.rail`.
2. [`02-takeaway-and-reflection.png`](approved/gate-3b-round-1/02-takeaway-and-reflection.png): `divider`, `takeaway`, `reflection`.
3. [`03-extended-text-blocks.png`](approved/gate-3b-round-1/03-extended-text-blocks.png): `sequence`, `flow`, `list`, `verse`, `aside`, `source_note`.

Approval này chỉ chuyển `mockup_status` của các component trên sang `approved`. App vẫn `not_supported`, publisher vẫn `disabled` và content production vẫn `not_allowed` cho tới các gate sau.

## Approved — Gate 3C Round 1

Owner approved ngày 2026-10-01 cho composition của story canonical **Nếu tôi được sống một đời người**:

1. [`01-opening-and-body.png`](approved/gate-3c-round-1/01-opening-and-body.png): opening chuyển liên tục vào body đầu story.
2. [`02-body-and-ending.png`](approved/gate-3c-round-1/02-body-and-ending.png): section cuối, takeaway và reflection candidate.
3. [`03-continuous-scroll-composite.png`](approved/gate-3c-round-1/03-continuous-scroll-composite.png): kiểm tra hierarchy xuyên suốt hành trình đọc.

Gate 3C xác nhận composition direction, không thay prose canonical. Reflection trong ảnh 02 là candidate V3, chưa tồn tại trong source story và không được xem là content đã duyệt.

## Approved — Gate 4 V2+ Round 1

Owner approved ngày 2026-10-01 cho baseline native V2+:

1. [`01-v2-plus-reading-dialogue-quote.png`](approved/gate-4-v2-plus-round-1/01-v2-plus-reading-dialogue-quote.png): một content edge canh trái, typography sách, heading text-first, remembered speech gom paragraph theo turn và quote highlight tiết chế.

Approval này chốt presentation direction cho SwiftUI prototype, không đổi wire semantic, support matrix hoặc quyền phát hành content V3. App không được tự thêm marker tuổi hình tròn, illustration, sequence/flow hoặc decorative background khi content không yêu cầu semantic tương ứng.

## Approved — Gate 4 full-story V2/V2.5 rules

Owner approved ngày 2026-10-01 sau khi review ba full story:

- hero opt-in, full reading width và fade vào paper background theo V2/V2.5;
- opening có theme, derived reading time và story kind;
- dialogue là turn-based continuous prose, speaker một lần, có rail khác quote rail;
- part heading cao hơn section heading;
- source/authorship ở cuối khi payload có public value;
- không tự thêm figure, rich-text mark hoặc author khi content không khai báo.

Approval này là minimum presentation direction, không biến screenshot thành pixel contract và không cho content điều khiển font/size/padding cụ thể.

## Draft history

- [`Gate 4 V2+ Round 1`](drafts/gate-4-v2-plus-round-1/): nguồn ảnh trước khi owner approval; giữ lại để trace quyết định.
- [`Gate 3A Round 1`](drafts/gate-3a-round-1/): hierarchy, dialogue và story composition exploration.
- [`Gate 3B Round 1`](drafts/gate-3b-round-1/): nguồn ảnh trước khi owner approval; giữ lại để trace quyết định.
- [`Gate 3C Round 1`](drafts/gate-3c-round-1/): nguồn composition trước khi owner approval.
- [`Gate 3C Round 2`](drafts/gate-3c-round-2/): thử body prose dày hơn, giảm decoration; đang chờ owner review.

## Quy tắc sử dụng asset khi implement

- Typography, spacing, rail, divider, circle và simple ornament ưu tiên SwiftUI primitive.
- Botanical/still-life là decorative layer do app sở hữu, không phải field content tự chọn.
- Text phải đọc được khi decorative asset bị ẩn, crop hoặc giảm opacity.
- Content author chọn semantic component theo catalog, không chọn ảnh nền hoặc vị trí hoa lá.
- Native screenshot và accessibility acceptance thuộc app conformance, không thay canonical mockup.

## Gate 4 V2+ review constraint

V2+ không thay wire semantic đã freeze. Direction này yêu cầu app tái sử dụng V2 presentation và chỉ polish typography, remembered delivery cùng quote hierarchy. Ảnh không cho phép content chọn pixel layout, background hoặc vị trí text; app vẫn phải render native, responsive và accessible.
