# Story V2 — Web/App parity contract

Web Reference Renderer là chuẩn visual và behavior để app triển khai sau. Canonical payload vẫn là nguồn semantic; web không được chứa heuristic không có trong contract.

## Chung

- Cùng đọc Authoring/Release manifest và immutable payload.
- Cùng dispatch bằng `reader_format`.
- Cùng artwork resolution order.
- Cùng reading-time inputs và token fixtures.
- Cùng content order cho accessibility.
- Không tự đổi block type, nối/tách prose hoặc sinh reflection.

## Editorial V2 hierarchy

1. Shared artwork hoặc no-image opening.
2. Theme kicker.
3. Title, subtitle/source và metadata.
4. Optional opening quote.
5. Sections/blocks trong một mạch scroll.
6. Inline `part_heading` khi chuyển phần lớn.
7. Takeaway.
8. Reflection prompts.
9. Optional closing.

V2 có scroll progress nhưng không có section counter. Bookmark, theme và text-size preference dùng chung shell với V1.

## Design tokens cần đối chiếu

Web giữ file token machine-readable cạnh renderer. App map token sang SwiftUI tương đương:

- paper/background/ink/muted/sage/gold/line colors;
- serif/sans font roles;
- body line height và paragraph spacing;
- part/section heading scale;
- pull quote inset và border;
- takeaway/reflection spacing;
- content width và horizontal inset;
- artwork aspect/fade;
- Dynamic Type bounds.

Mục tiêu là hierarchy/spacing parity; không yêu cầu pixel-identical do CSS và SwiftUI render font khác nhau.

## Golden acceptance matrix

- Classic V1 regression.
- Editorial V2 with artwork.
- Editorial V2 missing catalog.
- Editorial V2 missing descriptor/binary.
- Light, sepia, dark.
- Standard và large text.
- Long story có `part_heading`.
- VoiceOver order và Reduce Motion.
- Reading-time fixtures giống nhau.
