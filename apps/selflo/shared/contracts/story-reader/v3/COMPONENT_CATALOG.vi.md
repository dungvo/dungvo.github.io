# Story Reader Component Catalog

**Contract ID:** `selflo.story-reader.components.v1`  
**Owner:** Selflo app + Selflo content  
**Trạng thái:** Gate 2.5 contract freeze  
**Canonical parent:** [`CONTRACT.vi.md`](CONTRACT.vi.md)  
**Machine support matrix:** [`component-support.json`](component-support.json)

Catalog này là ngôn ngữ chung để content chọn đúng semantic block và app render đúng vai trò đọc. Content không chọn font, màu, padding hoặc ornament; app không suy semantic từ câu chữ.

## 0. Content parity và giới hạn của renderer

App và Web có thể dùng typography, kích thước responsive và spacing cụ thể khác nhau, nhưng phải render **cùng nội dung nhìn thấy** từ cùng payload:

- `text_vi`, `runs[].text_vi`, title, subtitle, speaker `label_vi`, attribution, caption, takeaway và reflection phải giữ nguyên chữ, thứ tự và nghĩa;
- renderer không thêm từ mô tả như “NÓI”, “SUY NGHĨ”, “TRÍCH DẪN” hoặc một heading giải thích nếu payload không chứa text đó và catalog không định nghĩa nó là UI label;
- delivery `spoken|thought|remembered|written` là semantic để chọn treatment và accessibility. Baseline không sinh visible text label từ enum; VoiceOver vẫn phải nêu đúng context. Nếu sau này cần label nhìn thấy, label mapping phải được thêm vào contract chung và áp dụng đồng nhất trên App/Web;
- renderer không thêm divider, rule, card, background, quote mark hoặc decorative region giữa các block chỉ vì trang “trống” hoặc để làm đẹp;
- ornament chỉ hợp lệ khi thuộc presentation mapping của **chính component đang render**, được catalog mô tả ở mục tương ứng. Ornament không được hoạt động như một block mới hoặc thay đổi quan hệ giữa hai block;
- khoảng cách là renderer responsibility nhưng phải đi theo semantic pair ở mục “Spacing parity” bên dưới; không cộng dồn margin độc lập khiến opening, part và section bị tách rời quá mức.

Nguyên tắc kiểm tra parity: ẩn font, màu và kích thước đi thì người đọc App và Web vẫn phải thấy cùng text, cùng hierarchy, cùng component order và cùng loại nhấn. Screenshot so sánh không được dùng hai câu/nhãn khác nhau để minh họa cùng một payload.

## 1. Quy tắc ổn định

1. Block/style đã Release trong Classic hoặc Editorial V2 không bị đổi tên, đổi shape hoặc reinterpret khi app thêm V3.
2. App mới phải tiếp tục dispatch theo `reader_format`; không tự nâng story cũ sang format mới.
3. UI polish không tạo block/style mới. Chỉ thêm semantic mới khi cấu trúc hoặc editorial intent thật sự khác.
4. Tên semantic diễn đạt vai trò (`exchange`, `inner_monologue`, `rail`), không dùng tên kỹ thuật như `dialog_v3`, `new_dialog` hoặc `style_2`.
5. Content chỉ được publish component có `release_status = allowed` trong support matrix.
6. App chỉ quảng bá capability khi mọi component bắt buộc của capability đã pass fixture, mockup, decode, render và accessibility acceptance.

## 2. Minimum rendering promise

Minimum promise là phần app phải giữ dù visual được redesign. Typography, màu, khoảng cách, ornament và hình học cụ thể vẫn thuộc renderer.

### 2.1 Shell và heading

| Component ID | Content dùng khi | Minimum promise | Content không dùng khi |
|---|---|---|---|
| `story.opening` | Metadata mở đầu story | Title là heading chính; subtitle/quote/metadata giữ đúng thứ tự và không trộn vào body | Không dùng body block để giả opening |
| `story.part_heading` | Chuyển một phần lớn trong story dài | Tạo ngắt cấp cao hơn section; part number/title được đọc thành một heading | Section nhỏ hoặc một câu nhấn |
| `story.section_heading` | Mở một section có marker/title | Marker, unit, title và subtitle là một accessibility heading; không ghép text ngược vào content | Ngắt cảnh không cần tên |

Hierarchy bắt buộc của renderer: `story.opening` > `story.part_heading` > `story.section_heading` > body. `part_heading` và `section_heading` không phải hai skin ngang hàng: part tạo ngắt lớn của cấu trúc, còn section tiếp tục mạch đọc và phải có visual weight nhỏ hơn. Content chọn đúng semantic type; không có field font-size để ép một section trông như part.

Baseline presentation chung:

- opening, part heading và section heading dùng typography cùng khoảng trắng để thể hiện hierarchy;
- `part_heading` không tự sinh một scene divider. Baseline không đặt rule dài phía trên/dưới part; nếu nội dung cần ngắt cảnh độc lập, payload phải có `divider`;
- section heading không có card, nền hoặc rule mặc định;
- renderer được thay đổi cỡ chữ/line wrapping theo thiết bị nhưng không được đẩy part/section ra khỏi document order.

Opening metadata promise đã được owner chốt từ ba full-story sample:

- `hero_image` là opt-in; có thì app render như lớp mở đầu hòa vào reader background, không coi là body card; không có thì không dựng placeholder;
- theme label lấy từ `primary_theme`/catalog, story kind lấy từ `metadata.story_style` và reading time do app tính từ document;
- `authorship`/nguồn dành cho người đọc nằm trong opening metadata; app không suy tên tác giả và không đặt attribution mặc định ở cuối truyện;
- chỉ render khi có `author_name`, hoặc `source_label` đi cùng `source_url`; `source_label` đứng một mình là provenance nội bộ và phải ẩn khỏi reader;
- provenance nội bộ thuộc `editorial`/`rights`; `source_note` trong body là semantic content riêng và vẫn hiện tại đúng vị trí content chọn.

### 2.2 Paragraph

| Component ID | Editorial intent | Minimum promise |
|---|---|---|
| `story.paragraph.narrative` | Văn xuôi chính | Leading reading flow; không tự biến thành quote/card |
| `story.paragraph.lead_in` | Câu dẫn phụ thuộc block kế tiếp | Giữ gần block kế tiếp hơn narrative thông thường; không đứng cuối section |
| `story.paragraph.transition` | Chuyển thời gian, địa điểm hoặc beat | Có ngắt nhịp nhận biết được trước nội dung tiếp theo; không tự biến thành heading |
| `story.paragraph.beat` | Câu ngắn đứng riêng để đổi nhịp | Được đọc như một đơn vị riêng; không gộp ngược vào paragraph lân cận |

### 2.3 Dialogue

| Component ID | Editorial intent | Minimum promise |
|---|---|---|
| `story.dialogue.exchange` | Hai hoặc nhiều lượt trao đổi | Giữ turn order, speaker/delivery context và paragraph grouping; không flatten thành một paragraph |
| `story.dialogue.monologue` | Một người nói nhiều paragraph | Giữ các paragraph trong cùng một voice unit; speaker chỉ lặp khi cần |
| `story.dialogue.inner_monologue` | Suy nghĩ bên trong | Phân biệt được với spoken dialogue; VoiceOver nêu context suy nghĩ |
| `story.dialogue.delivery.spoken` | Lời nói trực tiếp | Không thêm quote attribution hoặc suy thành narration |
| `story.dialogue.delivery.thought` | Suy nghĩ ở thời điểm kể | Phân biệt semantic với spoken; không bắt buộc quote wrapper |
| `story.dialogue.delivery.remembered` | Lời nói hiện lại từ ký ức | Có context nhớ lại trong visual hoặc accessibility; không đổi speaker identity |
| `story.dialogue.delivery.written` | Nội dung được đọc từ chữ viết | Có context written trong visual hoặc accessibility; không render như speaker đang nói trực tiếp |

App được thay rail, indentation, label placement, font hoặc surface mà không cần content migration, miễn minimum promise còn giữ.

Dialogue turn presentation đã được owner chốt từ full-story samples:

- speaker label hiện một lần cho toàn turn;
- nhiều paragraph cùng speaker/delivery vẫn là một voice unit; renderer được trình bày chúng thành continuous prose, nhưng không thay đổi model hoặc reorder text;
- dialogue phải nhận biết được với narration bằng rail/indentation/context treatment; rail dialogue không được dễ nhầm với quote rail;
- spacing `narrative → dialogue` và `dialogue → narrative` thuộc pair-spacing policy của app, content không thêm paragraph rỗng/divider để tạo khoảng cách;
- content chỉ tách paragraph trong turn khi đổi beat có chủ đích; tránh chuỗi fragment một câu nếu cùng một ý.

### 2.4 Statement và quote

| Component ID | Editorial intent | Minimum promise |
|---|---|---|
| `story.statement.centered` | Kết tinh của người kể cần khoảng thở cao | Mức nhấn cao, tách khỏi body; không quote ornament, không attribution |
| `story.statement.leading` | Kết tinh vẫn nằm trong mạch văn | Nhấn hơn narrative nhưng tiếp tục leading flow; không quote ornament |
| `story.quote.centerpiece` | Lời được trích có mức nhấn cao nhất | Hierarchy cao nhất trong quote family; không đặt hai block liên tiếp |
| `story.quote.inset` | Lời trích gần body | Giữ attribution nếu có và mức nhấn vừa; không hoist khỏi vị trí payload |
| `story.quote.rail` | Lời trích leading, nhấn theo trục đọc | Giữ leading alignment và quote identity; rail cụ thể là renderer choice, không phải wire guarantee |

`centered`, `leading`, `centerpiece`, `inset`, `rail` là stable editorial intent, không phải lệnh CSS. Nếu app chỉ đổi cách vẽ nhưng giữ hierarchy/flow promise, không cần sửa content.

#### Cách chọn quote presentation

| Presentation | Chọn khi | Không chọn khi |
|---|---|---|
| `centerpiece` | Một lời trích là điểm nhớ chính sau khi kết thúc một lập luận, section lớn hoặc part; người đọc cần khoảng dừng rõ | Chỉ vì câu ngắn/đẹp, hoặc nhiều câu liên tiếp cùng cần nhấn |
| `inset` | Lời trích, chữ viết hay hồi ức cần được nhận ra như một đơn vị riêng nhưng vẫn gần body | Câu chốt cao nhất của part |
| `rail` | Lời trích nằm trong mạch đọc, cần quote identity nhưng không làm dừng toàn trang | Câu duy nhất cần người đọc mang theo sau một phần lớn |

Baseline presentation chung để App/Web không diễn giải lệch bản chất:

- `centerpiece`: serif bold hoặc bold-italic, mức nhấn cao nhất trong quote family, không dùng nền/card; có thể có quote mark và **một rule ngắn phía dưới** như ornament cục bộ của quote;
- `rail`: luôn có rail dọc nhìn thấy ở trước text, căn theo trục đọc; không dùng nền/card mặc định;
- `inset`: căn trái, thụt nhẹ và có thể dùng surface rất nhẹ; không được có visual weight cao hơn `centerpiece`;
- quote text và attribution phải giống hệt trên App/Web. Renderer không thêm attribution hoặc nhãn “quote” khi payload không có;
- không dùng rule dài theo reading column cho quote; rule ngắn của `centerpiece` không có semantic divider và không tách hai block lân cận.

`centerpiece` có thể được renderer thể hiện bằng chữ serif/italic lớn, quote mark và rule như visual reference; ornament cụ thể không phải dữ liệu content. Mặc định ưu tiên `rail`/`inset`; thông thường không quá một `centerpiece` trong một part và nên đặt sau khi ý lớn đã hoàn tất. Nếu câu là kết tinh của người kể chứ không phải lời được trích, dùng `statement.centered`, không đổi thành quote chỉ để nhận visual này.

### 2.5 Structural và ending

| Component ID | Editorial intent | Minimum promise |
|---|---|---|
| `story.divider` | Ngắt cảnh không cần tên | Có một scene break nhận biết được; app chọn ornament |
| `story.takeaway` | Một điều để mang theo | Hiển thị đúng một ending region sau body; không sinh lại từ prose |
| `story.reflection` | Prompt tự nguyện và closing | Giữ prompt order; `private_text` không đồng nghĩa persistence đã được bật |

Baseline presentation chung:

- chỉ `story.divider` tạo một scene break độc lập; renderer không suy divider từ part, section, quote, takeaway hoặc khoảng trống;
- takeaway và reflection là ending regions trong document flow, không phải card mặc định;
- baseline dùng label, typography và khoảng trắng để phân cấp takeaway/reflection; không tự thêm nền, border, khung chữ nhật hoặc rule dài;
- nếu thiết kế sau này cần một surface riêng cho ending, đó là thay đổi presentation contract phải được owner review và cập nhật tại đây trước khi App/Web dùng.

### 2.6 Extended text và figure

| Component ID | Editorial intent | Minimum promise |
|---|---|---|
| `story.sequence` | Các item có nhịp/progression | Giữ item order và progression; không timed reveal |
| `story.flow` | Quan hệ tuyến tính nối tiếp | Giữ order và relation; separator do app chọn |
| `story.list` | Tập item ordered/unordered/plain | Giữ list semantics và item order |
| `story.verse` | Line break có chủ đích | Giữ từng line; không tự căn giữa hoặc đổi thành quote |
| `story.aside` | Bối cảnh phụ ngoài mạch chính | Thể hiện secondary hierarchy; không nhập vào narration |
| `story.source_note` | Nguồn/bản dịch/bối cảnh | Thể hiện note hierarchy và title; thường ở cuối flow |
| `story.figure` | Ảnh trong body | Resolve asset cùng immutable session, giữ alt text; caption optional |

#### Artwork/figure opt-in

- App chỉ render artwork trong body khi payload có `story.figure`; không tự thêm ảnh theo part, section title, theme hoặc keyword.
- `part_heading` không kéo theo figure. Một part có thể không có artwork; một figure cũng có thể xuất hiện giữa section nếu thứ tự content yêu cầu.
- `hero_image` chỉ thuộc opening và không thay thế `story.figure` trong body.
- Current executable V3 mới có một figure semantic. Các candidate style theo **vai trò nội dung** (`scene`, `memory`, `symbolic`) phải có mockup, schema và support-matrix gate riêng trước khi content dùng; không phát hành selector tự đặt hoặc selector thuần layout như kích thước/padding/vị trí.
- Dù style nào được bổ sung sau này, text phải đọc liền mạch khi asset không tải được; alt text vẫn bắt buộc và artwork không được chứa prose thay cho native text.

## 3. Legacy components được bảo toàn

### Editorial V2 modern default và V2.5 semantic opt-in

App mới được dùng modern renderer cho payload `editorial_v2` mà không migrate content. V2 giữ default paragraph `narrative`, heading `leading`, pull quote `centerpiece` và plain text khi thiếu runs. Component optional không có dữ liệu thì không xuất hiện.

V2.5 không còn là selector để bật visual mới. Content chỉ dùng `reader_format = editorial_v2_5` và `schema_version = 1.2` khi thật sự cần semantic field additive như quote presentation explicit hoặc rich-text runs. Nếu quote V2.5 vẫn thiếu presentation, renderer fallback `centerpiece`; `rail`/`inset` phải được khai báo rõ.

| Component/style | Ý nghĩa | Dùng khi | Tránh dùng khi |
|---|---|---|---|
| `section.title_vi` | Heading nhỏ trong mạch đọc | Mở một section có tên thật sự | Chỉ để tạo khoảng cách |
| `part_heading` | Chuyển phần lớn | Story dài đổi giai đoạn/chủ đề lớn | Mỗi đoạn ngắn hoặc câu nhấn |
| `heading` | Heading cục bộ | Nhóm vài paragraph cùng ý | Thay cho part heading |
| `paragraph/narrative` | Văn xuôi mặc định | Hầu hết nội dung kể | Lời thoại hoặc câu trích |
| `paragraph/transition` | Chuyển thời gian/cảnh | Cần một nhịp chuyển nhẹ | Chỉ vì paragraph ngắn |
| `paragraph/dialogue_lead` | Nhãn người nói | Bắt đầu một turn đối thoại/hồi tưởng | Narration hoặc lặp trước từng câu |
| `paragraph/dialogue` | Nội dung cùng turn | Các paragraph liên tiếp của cùng người | Đổi speaker mà không có lead mới |
| `pull_quote/rail` | Quote trong dòng đọc | Cần nhận biết là quote nhưng không ngắt mạch | Câu nhớ chính cuối part |
| `pull_quote/inset` | Quote mức nhấn vừa | Thư, hồi ức hoặc trích dẫn cần surface riêng | Dùng dày đặc như card decoration |
| `pull_quote/centerpiece` | Quote cần nhớ nhất | Kết thúc một ý/part lớn; thường tối đa một lần mỗi part | Chỉ vì câu ngắn hoặc đẹp |
| `divider` | Ngắt cảnh không tên | Chuyển scene rõ nhưng không cần heading | Tạo padding thủ công |
| `takeaway` | Điều mang theo | Một kết tinh sau body | Lặp lại nguyên paragraph cuối |
| `reflection` | Câu hỏi tự nguyện | Story thực sự cần người đọc dừng suy ngẫm | Ép hành động hoặc kiểm tra hiểu bài |
| `runs/plain` | Span bình thường | Nối rich-text runs | Không cần khai báo nếu paragraph không có runs |
| `runs/strong` | Trọng tâm logic | Từ/cụm ngắn cần đọc mạnh | Cả câu hoặc nhiều paragraph |
| `runs/emphasis` | Nhấn giọng mềm | Nội tâm, sắc thái hoặc từ cần nghiêng | Thay quote/heading |
| `runs/accent` | Điểm neo thị giác | Một cụm rất ngắn có semantic rõ | Trang trí rải rác |
| `runs/strong_accent` | Mức nhấn span cao nhất | Trường hợp hiếm đã editorial review | Kết hợp mặc định cho mọi ý quan trọng |

Opening hỗ trợ optional hero, theme, title/subtitle, reading time, story kind, opening quote và public attribution. Không có hero/attribution thì không tạo placeholder. `source_label` đứng một mình là provenance nội bộ và không render.

### Classic V1

```text
section.title_vi
paragraph
heading
pull_quote
divider
takeaway
```

Classic không nhận V3 block. App tiếp tục dùng Classic presentation policy cho story thiếu `reader_format` hoặc có `classic_v1`.

### Editorial V2

```text
section.title_vi
part_heading
heading
paragraph/narrative
paragraph/dialogue_lead
paragraph/dialogue
paragraph/transition
pull_quote
divider
takeaway
reflection
```

V2 dialogue adjacency tiếp tục được hỗ trợ. App không reinterpret `paragraph/style=dialogue` thành V3 nested dialogue và content không phải migrate khi app thêm V3.

## 4. Optional/default behavior V3

| Field/state | Renderer behavior |
|---|---|
| `runs` thiếu | Render nguyên `text_vi` plain semantic body |
| `speaker` thiếu | Không suy speaker từ text; VoiceOver chỉ nêu delivery/dialogue context có sẵn |
| attribution thiếu/null | Vẫn là quote; chỉ ẩn attribution line |
| caption thiếu/null | Render figure và alt text, không chừa caption gap |
| section không marker/title | Không tạo heading giả; chỉ render ordered blocks |
| `closing_vi = null` | Kết thúc reflection sau prompt cuối, không chừa closing gap |
| `shareable = false` | Không expose block-level share affordance |
| `shareable = true` nhưng app chưa có share capability | App phải decode/giữ intent nhưng được phép chưa expose action; publisher chỉ được hứa share UI khi capability riêng active |
| `response_mode = private_text` nhưng input/persistence chưa active | Hiển thị prompt như reflection text; không dựng input giả và không lưu dữ liệu |

## 4.1 Spacing parity

Payload không chứa pixel spacing, nhưng App/Web phải dùng cùng **quan hệ khoảng cách**, không tự cộng margin của từng component một cách độc lập:

| Semantic pair | Quan hệ bắt buộc |
|---|---|
| `narrative → narrative` | Nhịp body chuẩn |
| `lead_in → dependent block` | Chặt hơn body rõ rệt; hai block phải được cảm nhận như một cụm |
| `transition → next block` | Có khoảng nghỉ nhẹ, nhỏ hơn section break |
| `opening → first part/section/body` | Một lần chuyển vùng; không cộng đồng thời spacing lớn của cả opening và block kế tiếp |
| `part_heading → section/body` | Ngắt lớn nhất trong body nhưng vẫn cùng continuous scroll |
| `section_heading → first block` | Nhỏ hơn part break; heading phải gắn với nội dung sau |
| `centerpiece → adjacent body` | Có khoảng thở rõ, nhưng không tạo cảm giác sang trang hoặc card độc lập |
| `divider → next block` | Scene break do payload yêu cầu; không chồng thêm part/section separator |
| `takeaway → reflection` | Hai ending region liên tục; không mặc định biến mỗi vùng thành một card |

Implementation phải dùng pair-spacing/collapsing policy: tại một boundary chỉ áp dụng một khoảng cách đã resolve theo cặp semantic, không lấy `margin-bottom(A) + margin-top(B)`. App và Web được dùng giá trị cụ thể khác nhau để thích nghi màn hình, nhưng hierarchy `tight < body < section < part` phải giữ giống nhau.

## 5. Content selection checklist

Content author chọn block bằng câu hỏi theo thứ tự:

1. Đây là narration, direct dialogue, narrator statement hay quoted speech?
2. Có structure thật như turns/items/lines/figure hay chỉ cần paragraph?
3. Presentation preset có diễn đạt editorial hierarchy hay chỉ được chọn vì nhìn đẹp?
4. Component/capability có `release_status = allowed` không?
5. Nếu story đang V1/V2, migration sang V3 có thật sự cần semantic mới không?

Không đổi format chỉ để nhận font/màu/spacing mới. Không dùng block mới để “trang trí” prose không đổi vai trò.

### Rich-text mark checklist

Plain text là mặc định. Chỉ thêm `runs` khi một span thật sự cần mang vai trò mà paragraph thường không truyền đạt đủ:

- `strong`: luận điểm hoặc cụm từ khóa cần người đọc giữ lại;
- `emphasis`: đổi giọng, đối lập, hoặc một lớp suy nghĩ/nhấn giọng tự nhiên;
- `accent`: điểm nhìn semantic hiếm, được renderer ánh xạ sang màu palette; không phải công cụ tô màu trang trí.

Một paragraph thông thường nên có không hoặc một vùng nhấn ngắn. Không đánh dấu cả paragraph, không rải mark qua nhiều câu liên tiếp và không kết hợp `strong + emphasis + accent` nếu không có editorial review cụ thể. Nếu cả câu cần đứng riêng hoặc cần người đọc nhớ, author phải cân nhắc `beat`, `statement` hoặc `pull_quote` thay vì bôi nhiều mark. Bỏ toàn bộ marks vẫn phải giữ nguyên nghĩa và nối `runs[].text_vi` luôn phải bằng chính xác `text_vi`.
