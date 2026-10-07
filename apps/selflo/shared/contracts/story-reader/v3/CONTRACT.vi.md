# Selflo Story Format V3 Contract

**Contract ID:** `selflo.story-reader.editorial-v3`  
**Trạng thái:** Production; Core, extended text và figure đã được app/publisher hỗ trợ và cho phép Release
**Contract hub:** [`../../README.md`](../../README.md)  
**Vai trò:** Canonical design contract cho Content, Publisher, Web Reference Renderer và Selflo app  
**Phạm vi:** Cấu trúc dữ liệu và presentation semantics của Story Reader V3; executable schema `1.2` đang được publisher và app production consume
**Không thuộc phạm vi:** Moment, audio/video, timed reveal, branching, persistence, bookmark và progress semantics

## 1. Mục tiêu

V3 cho phép tác giả mô tả đúng vai trò của nội dung mà không cấu hình UI tự do. App và Web quyết định typography, màu, spacing và accessibility từ semantic contract này.

Nguyên tắc:

1. Content khai báo **đây là gì**, renderer quyết định **nó trông như thế nào**.
2. Không lưu font, cỡ chữ, mã màu, padding hoặc animation trong Story JSON.
3. Mỗi block có một vai trò chính; không trộn narration, dialogue và statement trong cùng một text.
4. `text_vi` luôn là plain-text fallback. Rich text chỉ là lớp nhấn bổ sung.
5. V3 giữ nguyên thứ tự section và block; renderer không hoist, reorder hoặc tự suy diễn từ câu chữ.
6. Unknown format/semantic không được âm thầm render sai. Package capability và quarantine tiếp tục theo ADR-0004.
7. `classic_v1` giữ presentation đã phát hành; `editorial_v2` giữ nguyên wire semantics và renderer default, nhưng app mới được cải thiện visual mà không yêu cầu content migration.
8. App/Web được khác typography và responsive geometry, nhưng không được khác visible content, block order, hierarchy hoặc presentation identity. Quy tắc normative nằm trong [`COMPONENT_CATALOG.vi.md`](COMPONENT_CATALOG.vi.md).
9. Renderer không tự sinh semantic hoặc pseudo-component để “làm đẹp”. Divider chỉ tồn tại khi payload có `divider`; ornament chỉ được nằm trong mapping đã document của chính component.

## 2. Version và compatibility

Story V3 khai báo:

```json
{
  "reader_format": "editorial_v3"
}
```

Quy tắc:

- thiếu `reader_format` hoặc `classic_v1` → Classic Reader;
- `editorial_v2` → cùng semantic payload V2; app cũ dùng reader cũ, app mới được map sang modern renderer theo default policy bên dưới;
- `editorial_v2_5` → Editorial V2.5 production renderer, schema `1.2`, tương thích cấu trúc V2 và hỗ trợ quote presentation/rich-text runs;
- `editorial_v3` → V3 semantic presentation policy;
- app không hỗ trợ capability V3 → không activate package revision mới;
- package tương thích nhưng một story V3 sai → quarantine riêng story đó;
- không fallback V3 sang V2/Classic vì có thể làm mất semantics mà vẫn trông như đã đọc được.

App được phép dùng chung Reader shell và component nền giữa V2/V3, nhưng phải giữ presentation policy riêng.

### Editorial V2 modern presentation và V2.5 semantic boundary

- Modern visual không phải content capability: app mới được render `editorial_v2` bằng modern components, còn app cũ tiếp tục dùng reader V2 cũ.
- Adapter không đổi story ID, revision, prose, section/block order hoặc persisted wire format.
- Khi V2 không có selector modern: paragraph thiếu style → `narrative`; heading → `leading`; pull quote → `centerpiece`; thiếu runs → plain text; thiếu hero/authorship/reflection → bỏ component tương ứng, không suy tạo content.
- App không suy `rail`/`inset` từ vị trí hoặc độ dài quote V2. Default `centerpiece` bảo toàn minimum promise của V2 cũ.
- V2.5 chỉ còn là opt-in cho semantic field additive bằng `reader_format = editorial_v2_5`; không phải điều kiện để nhận modern typography/layout.
- V2.5 giữ block family V2: `paragraph`, `part_heading`, `heading`, `pull_quote`, `divider`, cùng `takeaway` và `reflection`.
- `pull_quote.presentation` nhận `rail`, `inset`, `centerpiece`; thiếu presentation fallback `centerpiece`. Content V2.5 mới nên khai báo rõ khi muốn `rail` hoặc `inset`.
- `runs` chỉ dùng cho span ngắn trong paragraph với `plain`, `strong`, `emphasis`, `accent`, `strong_accent`; V2 renderer được phép bỏ qua runs và tiếp tục dùng `text_vi`.
- Dialogue tiếp tục dùng cặp `paragraph/dialogue_lead` + các `paragraph/dialogue` liên tiếp; app gom cùng speaker thành một turn, không đổi source order.
- Unknown `reader_format`, block type, style hoặc presentation fail closed tại package load; không fallback âm thầm sang Classic.

## 3. Cấu trúc một Story

```text
Story
├── Identity & metadata
├── Opening
├── Sections
│   ├── optional part_heading blocks
│   ├── section heading metadata
│   └── ordered body blocks
├── Takeaway
├── Reflection
└── Authorship, editorial, rights, review
```

Các vùng top-level hiện hành tiếp tục được giữ: stable ID, revision, lifecycle, language, hero, primary theme, metadata, authorship, editorial, rights và review.

### 3.1 Opening

Opening có thể gồm hero artwork, category/theme, title, subtitle, metadata và optional `opening_quote_vi`. Opening quote không được lặp lại ngay trong block đầu nếu không có motif đã được review.

Owner-approved V2/V2.5 presentation contract:

- `hero_image` có thì app render ở đầu story, full reading width và có thể fade/composite vào paper background; đây là renderer policy, không phải content layout field;
- không có `hero_image` thì app bỏ hẳn image region;
- reading time do app derive từ nội dung; không lưu số phút cố định trong payload;
- theme và story kind lấy từ stable metadata/catalog;
- public author/source dùng `authorship` và xuất hiện trong opening metadata, không đặt mặc định ở cuối truyện;
- reader chỉ render attribution khi có `author_name`, hoặc `source_label` đi cùng `source_url`; `source_label` đứng một mình được xem là authoring provenance và không đưa nguyên văn lên reader;
- chi tiết provenance nội bộ vẫn thuộc `editorial`/`rights`. Block `source_note` là nội dung có chủ ý trong story flow và không bị rule attribution này thay đổi.

### 3.2 Section heading metadata

V3 tách marker khỏi title:

```json
{
  "id": "section_03",
  "marker_vi": "13–22",
  "marker_unit_vi": "tuổi",
  "title_vi": "Tôi sẽ đi tìm mình là ai",
  "subtitle_vi": null,
  "blocks": []
}
```

- `marker_vi`, `marker_unit_vi`, `subtitle_vi` optional;
- có marker thì phải có title;
- renderer trình bày marker và title thành một heading accessibility;
- không ghép `13–22 tuổi — ...` vào `title_vi`.

## 4. Rich text dùng chung

Block có text giữ `text_vi` làm fallback và có thể thêm `runs`:

```json
{
  "text_vi": "Những khoảng nghỉ ấy chính là cuộc đời.",
  "runs": [
    { "text_vi": "Những ", "marks": [] },
    { "text_vi": "khoảng nghỉ", "marks": ["strong", "accent"] },
    { "text_vi": " ấy chính là cuộc đời.", "marks": [] }
  ]
}
```

Marks V3:

- `strong`: luận điểm/từ khóa cần giữ;
- `emphasis`: giọng, đối lập hoặc suy nghĩ bên trong;
- `accent`: nhấn màu semantic theo palette của renderer.

Cho phép kết hợp marks, nhưng không thêm enum tổ hợp như `strong_accent`.

Editorial usage:

- plain text là mặc định; rich text không phải yêu cầu để paragraph trông hoàn thiện;
- `strong` dành cho luận điểm/từ khóa cần giữ, `emphasis` dành cho giọng hoặc đối lập, `accent` dành cho điểm nhìn semantic hiếm;
- thông thường một paragraph có tối đa một span ngắn cần nhấn; tránh phủ nhiều câu hoặc lặp mark qua các paragraph liên tiếp;
- không dùng cả ba mark cùng lúc nếu chưa có editorial review;
- khi toàn câu cần mức nhấn cao, chọn đúng `beat`, `statement` hoặc `pull_quote`, không biến toàn paragraph thành rich text.

Không hỗ trợ trong V3: mã màu, font family, font size, underline, strike-through, background highlight, inline image, inline animation hoặc URL tùy ý.

Validation:

- `runs` optional;
- mỗi run có text khác rỗng và marks duy nhất;
- nối toàn bộ `runs[].text_vi` phải bằng chính xác `text_vi`;
- bỏ runs thì nội dung vẫn phải hiểu đầy đủ;
- accent không được phủ toàn paragraph thông thường;
- validator cảnh báo khi một paragraph có quá nhiều vùng nhấn.

## 5. Block catalog V3

### 5.1 `part_heading`

Chuyển một phần lớn của story dài.

```json
{
  "id": "part_2",
  "type": "part_heading",
  "part_number": 2,
  "title_vi": "Khi cuộc đời không đi theo kế hoạch",
  "subtitle_vi": "Một cuộc đời không còn giống bản nháp ban đầu."
}
```

Không dùng cho section nhỏ hoặc để làm đẹp một câu.

`part_heading` luôn có hierarchy cao hơn section heading metadata. Renderer phải làm section title nhỏ/tiết chế hơn part title; content không thêm style/font-size để đảo hierarchy. Marker như độ tuổi là metadata optional của section, không phải part và không bắt buộc phải được vẽ thành badge hoặc hình tròn.

### 5.2 `paragraph`

```json
{
  "id": "paragraph_01",
  "type": "paragraph",
  "style": "narrative",
  "text_vi": "...",
  "runs": []
}
```

Styles:

- `narrative`: văn xuôi thông thường, chiếm phần lớn story;
- `lead_in`: câu dẫn gắn với block kế tiếp;
- `transition`: chuyển thời gian, địa điểm hoặc beat thật sự;
- `beat`: câu ngắn đứng riêng để đổi nhịp.

Rules:

- một paragraph thường chứa 1–4 câu cùng một beat;
- không tách từng câu nếu không đổi vai trò;
- không trộn lời thoại trực tiếp với narration;
- `lead_in` không được đứng cuối section;
- `beat` không tự động shareable và không phải mọi câu ngắn đều là beat;
- `transition` không được gắn máy móc cho paragraph đầu section.

### 5.3 `dialogue`

Dialogue là một semantic block hoàn chỉnh, không phụ thuộc adjacency của nhiều paragraph blocks.

```json
{
  "id": "dialogue_01",
  "type": "dialogue",
  "style": "exchange",
  "turns": [
    {
      "id": "turn_01",
      "speaker": { "id": "father", "label_vi": "Cha" },
      "delivery": "spoken",
      "paragraphs": [
        { "text_vi": "Cuối tuần về ăn cơm không?" }
      ]
    },
    {
      "id": "turn_02",
      "speaker": { "id": "self", "label_vi": "Tôi" },
      "delivery": "spoken",
      "paragraphs": [
        {
          "text_vi": "Tuần này con bận, tuần sau con về.",
          "runs": [
            { "text_vi": "Tuần này con bận, ", "marks": [] },
            { "text_vi": "tuần sau", "marks": ["emphasis"] },
            { "text_vi": " con về.", "marks": [] }
          ]
        }
      ]
    }
  ]
}
```

Dialogue styles:

- `exchange`: nhiều người trao đổi;
- `monologue`: một người nói nhiều paragraph;
- `inner_monologue`: suy nghĩ bên trong.

Turn delivery:

- `spoken`;
- `thought`;
- `remembered`;
- `written`.

`speaker` optional. `speaker.id` là stable semantic ID; `label_vi` là nhãn hiển thị/VoiceOver. Không dùng `author` cho người nói.

Validation:

- dialogue có ít nhất một turn;
- mỗi turn có ít nhất một paragraph;
- turn ID duy nhất trong block;
- `exchange` phải có ít nhất hai turn hoặc hai speaker/delivery distinct;
- `inner_monologue` không được có nhiều speaker khác nhau;
- dialogue text không chứa narration nối sau lời thoại;
- canonical dialogue text không cần dấu ngoặc kép bao ngoài;
- renderer không suy đoán speaker từ chuỗi text.

`remembered` là delivery, không phải dialogue style. Lời độc thoại hiện lại từ ký ức dùng `style = monologue` và `delivery = remembered`; một exchange được phép chứa các turn có delivery khác nhau.

Speaker-label policy thuộc renderer, không có field `show_speaker` trong payload:

- `exchange`: hiện visual label khi có từ hai speaker hữu hình; không lặp label ở các turn liên tiếp cùng speaker;
- `monologue`: hiện label một lần nếu content có speaker;
- `inner_monologue`: không hiện visual speaker label, nhưng VoiceOver vẫn nêu context suy nghĩ;
- `remembered` và `written` chỉ đổi delivery treatment, không thay speaker identity;
- VoiceOver luôn giữ speaker/delivery context kể cả khi visual label được rút gọn.

Paragraph grouping policy:

- một turn là một voice unit; speaker label không lặp cho từng paragraph;
- nhiều paragraph cùng turn có thể được renderer trình bày liền mạch, nhưng source order và accessibility sentence order phải giữ nguyên;
- content chỉ tạo paragraph mới khi có đổi beat/khoảng dừng có nghĩa, không tách máy móc mỗi câu thành một paragraph;
- dialogue visual phải phân biệt narration và quote. Rail/indent cụ thể thuộc renderer; content không chèn ký tự hoặc block rỗng để giả rail/spacing.

V2 `dialogue_lead + dialogue...` vẫn được V2 reader hỗ trợ. Authoring V3 không dùng `dialogue_lead`; migration gom chúng thành một dialogue block.

### 5.4 `statement`

Câu kết tinh của người kể/tác giả, không phải lời trích dẫn.

```json
{
  "id": "statement_01",
  "type": "statement",
  "presentation": "centered",
  "text_vi": "Nhưng bây giờ chẳng còn tuần sau nữa.",
  "runs": [],
  "shareable": true
}
```

Presentations:

- `centered`: câu chốt cần khoảng thở lớn;
- `leading`: câu nhấn vẫn nằm trong mạch văn.

Rules:

- không attribution;
- không quote ornament;
- không bọc toàn câu bằng ngoặc kép;
- không đặt nhiều statement liên tiếp;
- validator cảnh báo khi một section có hơn hai statement hoặc story có hơn tám statement.
- `centered` tối đa 24 từ và 140 Unicode scalar; validator cảnh báo từ 80% giới hạn và chặn publish khi vượt hard limit. Content phải đổi sang `leading`, renderer không truncate hoặc tự đổi preset.

### 5.5 `pull_quote`

Lời trích hoặc lời nhân vật đủ quan trọng để đứng riêng.

```json
{
  "id": "quote_01",
  "type": "pull_quote",
  "presentation": "rail",
  "text_vi": "Đừng đợi cuộc đời trở nên ổn rồi mới bắt đầu sống.",
  "runs": [],
  "attribution_vi": null,
  "shareable": true
}
```

Presentations hữu hạn:

- `centerpiece`: lớn, căn giữa, dùng rất tiết chế;
- `inset`: căn trái, thụt nhẹ, gần body;
- `rail`: căn trái với thanh dọc.

Content không cấu hình alignment, quote mark, font, size hoặc rail riêng lẻ; renderer ánh xạ presentation preset thành UI.

Editorial meaning:

- `centerpiece`: điểm nhớ quan trọng nhất sau một lập luận/section lớn/part; mặc định tối đa một lần trong một part;
- `inset`: quote có mức nhấn vừa, thường phù hợp chữ viết, hồi ức hoặc câu cần tách nhẹ khỏi body;
- `rail`: quote tiếp tục trục đọc canh trái và là lựa chọn mặc định cho quoted voice trong mạch truyện.

Visual quote mark lớn, italic, rule trên/dưới hoặc canh giữa là renderer mapping hợp lệ cho `centerpiece`, không phải field content. Không nâng một quote lên `centerpiece` chỉ vì câu ngắn hoặc vì muốn trang đẹp. Nếu text là kết tinh của narrator/author mà không phải quoted voice, dùng `statement`, không dùng `pull_quote`.

Rules:

- pull quote phải là lời được trích, không dùng cho statement;
- attribution optional;
- không lặp nguyên văn block liền kề;
- không đặt hai `centerpiece` liên tiếp;
- `centerpiece` có density/length gate nghiêm hơn `inset` và `rail`.
- `centerpiece` tối đa 32 từ và 180 Unicode scalar; validator cảnh báo từ 80% giới hạn và chặn publish khi vượt hard limit. Content phải đổi sang `inset`/`rail`, renderer không truncate hoặc tự đổi preset.

### 5.6 `divider`

Ngắt cảnh không cần heading.

```json
{ "id": "divider_01", "type": "divider" }
```

Renderer quyết định ornament; content không chọn line/dot/space. Không đặt đầu/cuối story hoặc hai divider liên tiếp.

### 5.7 `sequence`

Chuỗi cụm hoặc suy nghĩ có nhịp/progression.

```json
{
  "id": "sequence_01",
  "type": "sequence",
  "progression": "escalating",
  "items": [
    { "text_vi": "Hôm nay mình ghét đi làm." },
    { "text_vi": "Công việc của mình thật tệ." },
    { "text_vi": "Cuộc sống của mình thật tệ." }
  ]
}
```

`progression`: `neutral` hoặc `escalating`. V3 không timed reveal; items hiển thị cùng continuous scroll.

### 5.8 `flow`

> **Deprecated for new content and disabled at Release gate.** Existing app versions
> keep decoding/rendering `flow` for backward compatibility, but canonical source
> must migrate the same wording to `sequence` or `list` before a new Release.

Chuỗi tuyến tính có quan hệ nối tiếp.

```json
{
  "id": "flow_01",
  "type": "flow",
  "items": [
    { "text_vi": "Học giỏi" },
    { "text_vi": "Trường tốt" },
    { "text_vi": "Công ty tốt" },
    { "text_vi": "Nghỉ hưu" }
  ]
}
```

Renderer thêm separator/mũi tên và cung cấp accessibility label tự nhiên; content không chèn ký tự `→` vào một text dài.

Không author `flow` mới. Dùng `sequence` khi thứ tự/progression có ý nghĩa; dùng
`list` khi các item cùng cấp. Schema tiếp tục nhận `flow` chỉ để đọc package lịch sử.

### 5.9 `list`

```json
{
  "id": "list_01",
  "type": "list",
  "style": "plain",
  "items": [
    { "text_vi": "Một nghề nghiệp" },
    { "text_vi": "Một mái nhà" }
  ]
}
```

Styles: `ordered`, `unordered`, `plain`.

### 5.10 `verse`

Giữ line breaks có chủ đích cho thơ hoặc văn bản theo dòng.

```json
{
  "id": "verse_01",
  "type": "verse",
  "lines": [
    { "text_vi": "Dòng thứ nhất" },
    { "text_vi": "Dòng thứ hai" }
  ],
  "attribution_vi": null
}
```

Renderer không tự căn giữa và không biến verse thành pull quote.

### 5.11 `aside`

Ghi chú phụ/bối cảnh không thuộc mạch kể chính.

```json
{
  "id": "aside_01",
  "type": "aside",
  "text_vi": "Ở tuổi đó, tôi vẫn nghĩ mọi kế hoạch đều có thể kiểm soát được."
}
```

Aside dùng typography secondary; không phải nơi chứa emoji hoặc lời đùa tùy tiện.

### 5.12 `figure`

Hình ảnh trong body, khác hero.

```json
{
  "id": "figure_01",
  "type": "figure",
  "file_id": "image.story.memory_table.v1",
  "alt_text_vi": "Chiếc bàn ăn trong căn bếp vắng",
  "caption_vi": "Căn bếp cũ trong ký ức của người kể."
}
```

Asset phải nằm trong cùng immutable Library session. Alt text bắt buộc; caption optional.

Figure là opt-in từ content: không có block thì app không tự chèn artwork, kể cả ở `part_heading`. Figure nằm đúng vị trí trong ordered blocks và không được chứa prose rasterized thay cho native text. `hero_image` chỉ điều khiển opening, không cho phép renderer suy ra body artwork.

Contract `1.2` hiện chưa có figure style. Ba candidate semantic cho gate sau là `scene` (thiết lập không gian/chuyển cảnh), `memory` (hình ảnh gắn với ký ức) và `symbolic` (hình ảnh ẩn dụ cho ý). Đây chưa phải wire selector được phép author/publish; phải duyệt mockup, bổ sung schema/fixture/support matrix và app capability trước khi freeze. Không thêm style thuần trang trí như `large`, `left` hoặc `pretty`.

### 5.13 `source_note`

Nguồn, bản dịch hoặc bối cảnh lịch sử; thường ở cuối section/story.

```json
{
  "id": "source_note_01",
  "type": "source_note",
  "title_vi": "Về câu chuyện",
  "text_vi": "Câu chuyện được kể lại từ..."
}
```

## 6. Vùng kết thúc

### 6.1 Takeaway

Takeaway là required trong V3 đầu tiên và có đúng một:

```json
{
  "title_vi": "Nhìn lại",
  "text_vi": "Ta thường vội kết luận về một cuộc đời khi câu chuyện của nó vẫn đang tiếp diễn."
}
```

Không tóm tắt cốt truyện, không lặp statement cuối và không thêm luận điểm hoàn toàn mới.

### 6.2 Reflection

```json
{
  "prompts": [
    {
      "id": "reflection_01",
      "text_vi": "Có một ‘tuần sau’ nào bạn vẫn đang trì hoãn không?",
      "response_mode": "private_text"
    }
  ],
  "closing_vi": "Không phải điều gì cũng có một lần khác."
}
```

`response_mode`: `none` hoặc `private_text`. App V3 đầu tiên có thể chỉ hiển thị prompt; persistence/input là feature riêng.

## 7. Presentation responsibility

Content quyết định:

- block type/style/presentation preset;
- thứ tự;
- text/runs;
- section marker/title;
- dialogue speaker, delivery và paragraphs;
- attribution;
- shareable intent;
- scene divider;
- takeaway/reflection.

Renderer quyết định:

- font và cỡ chữ;
- color concrete từ semantic marks/palette;
- line height và reading column;
- spacing giữa các block;
- quote ornament;
- rail shape;
- speaker label visibility;
- Dynamic Type, dark/sepia/light;
- VoiceOver grouping;
- Reduce Motion.

Giới hạn bắt buộc của renderer:

- giữ nguyên visible text từ payload; không thêm nhãn như “NÓI” từ enum delivery nếu catalog chưa định nghĩa visible-label mapping;
- không sinh divider/rule/card/background giữa các block ngoài presentation mapping normative trong Component Catalog;
- không dùng ornament cục bộ như một scene separator giả;
- resolve spacing theo semantic pair, không cộng dồn margin độc lập của hai block;
- App và Web phải dùng cùng presentation identity: `rail` có rail nhìn thấy, `centerpiece` giữ hierarchy cao nhất và baseline không có nền, `inset` giữ mức nhấn vừa;
- mọi thay đổi muốn thêm visible label, ornament hoặc region mới phải cập nhật contract chung và visual reference trước khi implementation.

## 8. Spacing contract

V3 không có `spacing.before/after` trong payload. Renderer tính spacing theo cặp semantic, tối thiểu phải thiết kế/test:

```text
narrative → narrative
narrative → lead_in
lead_in → dialogue
dialogue → dialogue
dialogue → narrative
narrative → beat
beat → narrative
dialogue → statement
statement → narrative
transition → narrative
divider → section/paragraph
```

Normative spacing behavior và thứ tự tương đối `tight < body < section < part` nằm tại mục **Spacing parity** của [`COMPONENT_CATALOG.vi.md`](COMPONENT_CATALOG.vi.md). Một boundary chỉ resolve một spacing token; không cộng `after(A)` với `before(B)`. Opening nối part/section đầu tiên cũng chỉ có một transition spacing, tránh khoảng trống lớn do ba vùng cùng cộng margin.

Không để mỗi component tự cộng padding trên và dưới mà không có policy chung.

## 9. Block support levels

Core V3 — phải có mockup, schema, fixture, app và reference renderer trước release:

```text
part_heading
section heading metadata
paragraph: narrative, lead_in, transition, beat
dialogue: exchange, monologue, inner_monologue; delivery: spoken, thought, remembered, written
statement: centered, leading
pull_quote: centerpiece, inset, rail
divider
takeaway
reflection
```

Extended-text V3 — phải có contract và mockup; chỉ bật capability khi app/reference renderer/fixtures cùng hỗ trợ:

```text
sequence
flow
list
verse
aside
source_note
```

Capability contract:

```text
story_reader.editorial_v3.core
story_reader.editorial_v3.extended_text
story_reader.editorial_v3.figure
```

- Core capability bao phủ Core V3 ở trên, rich text, takeaway và reflection.
- Extended-text capability bao phủ `sequence`, `list`, `verse`, `aside` và `source_note` cho content mới. `flow` chỉ còn tương thích đọc package lịch sử và không được Release mới.
- Figure capability bao phủ `figure` và body asset resolution trong cùng immutable session.
- Manifest khai báo union capability thực sự được payload sử dụng.
- App thiếu required capability không activate candidate revision và giữ active snapshot cũ.
- Package capability tương thích nhưng một story sai shape/semantic phải quarantine riêng story; không fallback sang paragraph, V2 hoặc Classic.

Không thuộc V3:

```text
moment
audio/video
timed reveal
manual spacing
manual font/color/alignment
interactive branching
arbitrary HTML/Markdown
```

## 10. Authoring density gates

Validator cảnh báo, không tự sửa prose, khi gặp:

- hơn hai statement trong một section;
- hơn tám statement trong một story;
- hơn hai beat liên tiếp;
- pull quote lặp block gần đó;
- hai centerpiece quote liền nhau;
- nhiều paragraph một câu ngắn liên tiếp;
- section quá nhiều loại nhấn;
- opening quote lặp section đầu;
- takeaway lặp section cuối;
- emoji trong narrative/dialogue nghiêm túc;
- story dài chưa có `layout_review`.

Các lỗi shape/adjacency/rich-text mismatch phải chặn publish; density/editorial findings yêu cầu owner review.

## 11. Mockup acceptance trước implementation

Phải duyệt bốn component boards:

1. Typography/hierarchy: part, section marker, body, lead-in, beat, statement, quote.
2. Dialogue: one turn, multi-paragraph, exchange, inner thought, remembered, spoken + thought.
3. Quote/statement: centerpiece, inset, rail, centered statement, leading statement.
4. Special content: sequence, flow, list, verse, aside, figure, source note.

Và bốn màn hình story thật:

1. Opening + Part 1;
2. `13–22 tuổi` + prose + beat + inner voice;
3. `23–35 tuổi` + prose + flow;
4. đoạn “tuần sau” + exchange dialogue + statement.

Acceptance cuối phải dùng prototype SwiftUI thật và continuous scroll, không chỉ ảnh mockup. Kiểm tra iPhone nhỏ/lớn, Dynamic Type, light/sepia/dark, VoiceOver và Reduce Motion.

## 12. Implementation boundary

Contract này phải được chuyển thành:

1. canonical JSON Schema trong content repo;
2. valid/invalid fixtures;
3. publisher semantic validator;
4. Web Reference Renderer;
5. Swift raw/domain/presentation models;
6. SwiftUI components và spacing policy;
7. schema/loader/render/accessibility/snapshot tests.

Không implement từng bên từ tài liệu diễn giải riêng. Canonical schema và fixtures là executable contract; tài liệu này giải thích intent và authoring semantics.

## 13. Gate 1 decisions đã chốt trước schema freeze

1. `remembered` là turn delivery; dùng `monologue` hoặc `exchange` làm dialogue style.
2. Speaker-label visibility do renderer quyết định theo policy ở mục 5.3; payload không điều khiển trực tiếp.
3. `centerpiece` tối đa 32 từ/180 Unicode scalar; centered statement tối đa 24 từ/140 Unicode scalar; warning từ 80% giới hạn.
4. Takeaway required trong V3 đầu tiên.
5. Capability tách Core, extended text và figure; manifest khai báo union capability thực sự được sử dụng.

Gate 2 chỉ bắt đầu sau khi owner duyệt Gate 1 decision log phía app. Gate 2 chuyển các quyết định này thành canonical JSON Schema, valid/invalid fixtures và semantic validator; chưa migrate story production.

## 14. Gate 2 executable artifacts

Canonical executable contract được materialize tại các đường dẫn tính từ root `perspective-library/`:

```text
tooling/schema/perspective-story-v3.schema.json
tooling/schema/perspective-library-manifest.schema.json
tooling/fixtures/StoryV3/valid/core-story.valid.json
tooling/fixtures/StoryV3/valid/extended-story.valid.json
tooling/fixtures/StoryV3/invalid/invalid-cases.json
../scripts/story_v3_validator.py
../scripts/test_story_v3_contract.py
```

- V1/V2 tiếp tục dùng `perspective-story.schema.json`; V3 dùng schema `1.2` riêng để không nới acceptance của payload đã phát hành.
- `required_capabilities` optional cho legacy manifest, nhưng semantic package validator bắt buộc union capability khi package chứa story V3.
- Invalid mutation cases là executable fixtures: test materialize payload từ Core fixture rồi xác nhận semantic error code; các case shape-invalid cũng được AJV từ chối.
- Fixture không nằm trong canonical source index, không phải story production và không được publisher đưa vào Authoring/Release.
- Gate 2 không sửa publisher output, source story, revision hoặc manifest đang phát hành.

## 15. Gate 2.5 component contract và compatibility freeze

Gate 2.5 bổ sung ngôn ngữ chung để app và content phát triển độc lập:

- [`COMPONENT_CATALOG.vi.md`](COMPONENT_CATALOG.vi.md): semantic intent và minimum rendering promise;
- [`component-support.json`](component-support.json): trạng thái thật của từng component/capability ở contract, mockup, app, publisher và Release;
- [`COMPATIBILITY_POLICY.vi.md`](COMPATIBILITY_POLICY.vi.md): cách phân loại thay đổi và rollout additive;
- `../scripts/test_story_component_contract.py`: executable conformance cho support matrix.

Quy tắc freeze:

1. Classic V1 và Editorial V2 giữ nguyên raw value, shape và renderer dispatch đã phát hành.
2. App có thể cải thiện visual của component hiện hữu mà content không cần migration, miễn minimum rendering promise không đổi.
3. Semantic hoặc data structure mới phải app-first và additive; content chỉ opt-in sau khi matrix chuyển `release_status` sang `allowed`.
4. Không tạo selector theo version UI như `dialog_v3`; version thuộc `reader_format`, còn selector mô tả editorial intent.
5. App V3 và publisher V3 hiện vẫn disabled; Gate 2.5 không sửa source story, manifest production hoặc generated Authoring/Release output.

## 16. Gate 3 visual approval

Canonical visual index nằm tại [`visual-reference/VISUAL_REFERENCE.vi.md`](visual-reference/VISUAL_REFERENCE.vi.md).

- Gate 3B Round 1 được owner duyệt ngày 2026-10-01 cho statement, quote, divider, takeaway, reflection và extended-text ngoại trừ `figure`.
- Approval chỉ xác nhận visual intent/minimum hierarchy; không mở app capability, publisher hoặc content Release.
- Component chưa có mockup approved tiếp tục giữ `mockup_status = pending` trong support matrix.
- Gate 3C Round 1 được owner duyệt ngày 2026-10-01 cho opening/body, body/ending và continuous-scroll composition của story **Nếu tôi được sống một đời người**.
- Composition approval không tự thay prose/source story; reflection prompt xuất hiện trong mockup vẫn là candidate riêng cho content review.
