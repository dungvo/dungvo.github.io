# Selflo — Tầm nhìn nội dung, phong cách kể và kho ý tưởng (01/11/2026)

> **Tài liệu phân tích và tham khảo biên tập; không phải lệnh publish story.** Đã chốt các nguyên tắc chiến lược trong trao đổi; các ví dụ/phong cách bổ sung và style mapping từng truyện là đề xuất để review, không tự động mang nghĩa owner đã phê duyệt từng truyện.

## 0. Nguồn và phạm vi kiểm kê

- Nhánh nguồn: `dungvo/dungvo.github.io` / `main`, tại thời điểm kiểm kê 2026-11-01.
- Manifest authoritative: [Release](../perspective-library/release/vi/manifest.json), [Authoring](../perspective-library/authoring/vi/manifest.json).
- Snapshot: **22 Release; 68 Authoring tổng cộng; 46 Authoring-only**. Nguồn có thể thay đổi về sau; không dùng con số này làm realtime.
- Repo khác: [sổ Knowledge](../content-workspace/KNOWLEDGE_CONTENT_INVENTORY.vi.md), [trạng thái backlog](../content-workspace/REPO_WORK_IN_PROGRESS.vi.md), [các concept trong source/vi/stories](../perspective-library/source/vi/stories), [Story Series](../content-workspace/story-series).
- Ý tưởng từ cuộc thảo luận Selflo đến ngày 2026-11-01 được ghi riêng ở §7. Ý tưởng chat không tìm thấy manifest phải đánh dấu IDEA; không tự ghi thành approved complete story hoặc released.
- Dữ liệu `metadata.story_style` của hệ thống hiện có khác **taxonomy biên tập mới**; không âm thầm ghi đè nội dung canonical.

## 1. Triết lý đã chốt

**Selflo là thư viện những cách nhìn và trải nghiệm đọc, không giới hạn ở truyện nội tâm.** Một câu chuyện có thể vui, hồi hộp, phi lý, xúc động, kỳ bí, giàu kiến thức hoặc chỉ đơn thuần đáng đọc. Thông điệp **nảy sinh từ sự kiện và trải nghiệm**, không cần lời dạy, tổng kết đạo đức hay nhân vật giải thích hộ tác giả. Không phải tác phẩm nào cũng cần đưa ra bài học, kết luận hoặc thay đổi nhân vật.

Nguyên tắc:
1. Tác phẩm đủ hấp dẫn **ngay cả khi bỏ đoạn Nhìn lại / thông điệp**: có nhân vật, phát hiện, hành động, mâu thuẫn, nhịp, sự bất ngờ, tiếng cười hoặc những chi tiết chân thực.
2. Tôn trọng tính không chắc chắn, nhiều góc nhìn, sự phức tạp của cuộc sống; không ép một lựa chọn là đúng cho tất cả.
3. Hạn chế công thức đồng loạt nội tâm → nhận ra → bài học; không áp đặt quote cuối. Cấu trúc kết nên tùy tác phẩm. Nếu consumer hiện bắt buộc reflection thì đó là ràng buộc sản phẩm riêng cần giải quyết, không phải nguyên tắc sáng tác.
4. Quan sát đời thường trước, có nghiên cứu cơ chế, nguồn và phản ví dụ khi đưa claim khoa học; không bịa chứng cứ, không gán giả tưởng thành khoa học.
5. Tôn trọng bản gốc các truyện được owner khóa. Metadata/editorial supplement phải tuân thủ quy trình phê duyệt hiện tại.
6. Nội dung có thể bắt đầu từ câu hỏi, một khoảnh khắc, cơ chế xã hội, thế giới giả tưởng, sự kiện tự nhiên, thực tế đã kiểm chứng, *hoặc* một chuyến phiêu lưu thuần túy.

**Phi lý đời thường (Absurdist Allegory):** Thế giới tưởng tượng có một quy tắc nghe vô lý; từng nhân vật có thể hành động hợp lý trong hệ thống ấy; khi quy tắc được đẩy đến hệ quả, độc giả tự nhận ra nghịch lý đang tồn tại ở thế giới thật. Không chế giễu cá nhân. Đặc biệt lưu ý các quy tắc được duy trì bởi lợi ích, chỉ số, thói quen và chuẩn mực; người trong cuộc không nhất thiết ngu ngốc. Có thể hài hoặc nghiêm túc. Phân biệt với hài châm biếm (mục tiêu gây cười và phê phán).

## 2. Nội dung không chỉ là truyện hư cấu: các trục phân loại

**Quyết định mới 01/11/2026:** Ngay từ giai đoạn đầu, cả truyện, bài phân tích, quan sát đời thường, kiến thức hợp lý có nguồn, bài khám phá và sự kiện có thật đều có thể xuất hiện trong cùng khu vực Story/Reader của Selflo. Nhưng về biên tập và dữ liệu phải tách ít nhất 5 trục:

| Trục | Ví dụ | Ghi chú |
|---|---|---|
| **content_form** (dạng nội dung) | fiction_story, adapted_classic, everyday_observation, analytical_essay, evidence_based_knowledge, true_event_narrative, thought_experiment, dialogue | Không gọi mọi nội dung là hư cấu |
| **narrative_style** (cách thể hiện) | một hoặc nhiều style ở §3, có primary/secondary | Hài/ly kỳ có thể áp dụng cho bài giải thích, không chỉ truyện |
| **topic/theme** (nội dung) | thời gian, tình thân, lựa chọn, học tập, công nghệ, thiên nhiên, nghịch lý xã hội | Chủ đề ≠ phong cách |
| **lifecycle** | idea → research → draft → reviewed → owner_approved → authoring → release | Authoring-only không mặc định owner-approved; có content ≠ đã phát hành |
| **provenance / rights** | original, adapted_from_classic, public_domain_checked, licensed, reference_only, source_needed | Xác nhận nguồn và quyền trước publish |

Tương lai có thể mở các category riêng như Stories, Góc nhìn/Quan sát, Phân tích, Khám phá, Kiến thức. **Chưa chốt tên UI hay schema migration.** Chỉ tách metadata từ bây giờ để không phải phân loại lại khi tách sản phẩm. Một câu chuyện/nghiên cứu có thể có nhiều style; style và chủ đề là các trục khác nhau.

### 2.1. Lộ trình trải nghiệm

- Hiện tại: vẫn dùng Story/Reader; tránh sửa contract/release gate khi chưa có design và consumer tương thích.
- Song song: làm catalog nội bộ giúp search/filter theo form/style/theme/status/provenance; owner review mapping.
- Khi chín muồi: quyết định UI/category riêng bằng tác phẩm thật và hành vi đọc, không mở tính năng chỉ vì có tên danh mục.

## 3. 12 phong cách khởi đầu — **không phải giới hạn**

| # | Phong cách |
|---:|---|
| 1 | Nội tâm & chiêm nghiệm / Reflective Fiction |
| 2 | Truyện thiếu nhi / Children's Fable |
| 3 | Hài châm biếm / Satirical Comedy |
| 4 | Khám phá kỳ bí / Mystery & Discovery |
| 5 | Du hành thời gian / Time Travel |
| 6 | Cinematic ly kỳ / Cinematic Thriller |
| 7 | Chuyện đời thường / Slice of Life |
| 8 | Quy luật tự nhiên / Nature & Life |
| 9 | Trinh thám tâm lý / Psychological Mystery |
| 10 | Phiêu lưu sinh tồn / Survival Adventure |
| 11 | Khoa học giả tưởng xã hội / Social Speculative Fiction |
| 12 | Phi lý đời thường / Absurdist Allegory |
 
Phân biệt:
- **Chuyện đời thường**: cuộc sống và quan hệ là chất liệu.
- **Nội tâm**: xung đột cảm xúc/suy nghĩ là động lực.
- **Phi lý đời thường**: quy tắc tưởng tượng soi chiếu nghịch lý đời thật.
- **Hài châm biếm**: tiếng cười qua phóng đại/trào phúng.
- **Khám phá kỳ bí**: manh mối và điều chưa biết thúc đẩy việc đọc.
- **Cinematic**: cảnh giàu hình ảnh, xung đột và sức ép.
- **Quy luật tự nhiên**: thay đổi, nhân quả, thích nghi được quan sát chính xác; tránh diễn giải quy luật thành chân lý vũ trụ không có kiểm chứng.

**Phong cách bổ sung được đề xuất để xem xét, CHƯA coi là 6 nhãn chính thức:** (13) Ngụ ngôn ẩn dụ / Allegorical Fable; (14) Hiện thực huyền ảo / Magical Realism; (15) Hài tình huống / Situational Comedy; (16) Lịch sử giả định / Alternate History; (17) Phiên tòa đạo đức / Moral Courtroom; (18) Truyện dựa trên sự kiện thật / Real-event Narrative. Ngụ ngôn ẩn dụ đã có nhiều tác phẩm thực tế trong Selflo, xứng đáng đánh giá bổ sung; các nhãn có thể giao thoa.

## 4. Độ dài và nguyên tắc không làm mất truyện

| Gợi ý | Dung lượng | Cảm nhận đọc |
|---|---|---|
| Micro Story | 300–600 từ | 2–4 phút |
| Short Story | 700–1.500 từ | 4–8 phút |
| Extended Story | 1.500–3.000 từ | 8–15 phút |
| Series | nhiều phần có nhịp/kết riêng | tùy nội dung |

Không phải quota/cap: không kéo dài để có vẻ sâu sắc; không rút gọn tác phẩm hay đến mất nhân vật, xung đột và cấu trúc. Tiểu thuyết/truyện vừa là nguồn **học cơ chế**, không mặc định lấy nguyên tác lên Reader.

## 5. Ba nguồn sản xuất nội dung đã chốt

1. **Selflo Originals:** sáng tác độc lập từ câu hỏi, quan sát, tri thức, ý tưởng; có cấu trúc/nhân vật/lời văn nguyên bản, không đổi tên nhân vật của một tác phẩm khác.
2. **Selflo Classics:** tuyển chọn **từng tác phẩm** đủ quyền sử dụng, ghi tên tác giả/nguyên tác/nguồn/bản dịch/người dịch/cấp phép; không mặc nhiên coi sách internet miễn phí là được tái bản.
3. **Selflo Reference Library:** nguồn đọc và phân tích nội bộ, có thể gồm tác phẩm còn bản quyền; chỉ lưu link, thông tin, nhận xét tự viết và trích dẫn phù hợp, không public nguyên văn nếu không có quyền.

Không copy-phóng tác truyện được bảo hộ bằng cách thay tên nhân vật, đổi bối cảnh hoặc tóm tắt rồi đưa lên như Originals. Học cách dựng xung đột, góc nhìn, quy tắc thế giới, bố cục cảnh, nhịp và cú chuyển hướng; viết tác phẩm mới độc lập.

## 6. Tác giả, truyện/sách tham khảo và đường dẫn

Đây là **reference set** đã bàn, KHÔNG phải danh sách truyện đã được cấp phép cho Selflo. Link là đường dẫn nguồn tham khảo/bản đọc/tác giả/nhà xuất bản; tình trạng quyền dịch và quyền phát hành tại Việt Nam cần kiểm tra riêng. Một số link ở Wikipedia/Wikisource chỉ là điểm bắt đầu tra cứu nguồn cụ thể, **chưa chứng nhận phiên bản văn bản đó**.

| Tác phẩm | Tác giả | Phong cách đối chiếu | Kỹ thuật / góc nhìn học được | Nguồn |
|---|---|---|---|---|
| *The Death of Ivan Ilyich* | Lev Tolstoy | Nội tâm & chiêm nghiệm | Địa vị xã hội so với đời sống thực; tác phẩm dài, dùng làm tham chiếu, không mặc định đăng | [Tham khảo](https://www.gutenberg.org/ebooks/49713) |
| *The Happy Prince* | Oscar Wilde | Thiếu nhi | Giá trị bên trong và giúp đỡ người khác | [Tham khảo](https://www.gutenberg.org/ebooks/30120) |
| *The Emperor's New Clothes* | Hans Christian Andersen | Hài châm biếm | Sự đồng thuận giả vì sợ đánh giá | [Tham khảo](https://www.gutenberg.org/ebooks/1597) |
| *The City of Ember* | Jeanne DuPrau | Khám phá kỳ bí | Giới hạn nhận thức của cộng đồng; **truyện dài, bản quyền** | [Tham khảo](https://www.penguinrandomhouse.com/books/44101/the-city-of-ember-by-jeanne-duprau/) |
| *The Time Machine* | H. G. Wells | Du hành thời gian | Phóng đại bất bình đẳng qua tương lai | [Tham khảo](https://www.gutenberg.org/ebooks/35) |
| *The Interlopers* | Saki (H. H. Munro) | Cinematic ly kỳ | Một biến cố thay đổi ý nghĩa của mối thù | [Tham khảo](https://www.gutenberg.org/ebooks/1477) |
| *The Gift of the Magi* | O. Henry | Đời thường | Đảo chiều giá trị món quà và hành động yêu thương | [Tham khảo](https://www.gutenberg.org/ebooks/7256) |
| *The Man Who Planted Trees* | Jean Giono | Quy luật tự nhiên | Hành động nhỏ tạo hệ quả qua nhiều năm; **kiểm tra quyền trước đăng** | [Tham khảo](https://en.wikipedia.org/wiki/The_Man_Who_Planted_Trees) |
| *In a Grove* | Ryūnosuke Akutagawa | Trinh thám tâm lý | Nhiều lời kể xung đột, không ép một đáp án | [Tham khảo](https://en.wikipedia.org/wiki/In_a_Grove) |
| *To Build a Fire* | Jack London | Sinh tồn | Giới hạn kiểm soát và phán đoán trước thiên nhiên | [Tham khảo](https://www.gutenberg.org/ebooks/2415) |
| *The Machine Stops* | E. M. Forster | Giả tưởng xã hội | Sự tiện lợi và kết nối trung gian tạo cô lập | [Tham khảo](https://www.gutenberg.org/ebooks/72890) |
| *A City of Churches* | Donald Barthelme | Phi lý đời thường | Một cộng đồng cần duy trì vai trò dù không có nhu cầu thực; **bản quyền** | [Tham khảo](https://www.newyorker.com/magazine/1972/04/22/a-city-of-churches) |
| *The Nose* | Nikolai Gogol | Phi lý châm biếm | Bộ phận cơ thể mang địa vị cao hơn con người | [Tham khảo](https://en.wikisource.org/wiki/The_Nose_(Gogol)) |
| *The Lottery* | Shirley Jackson | Phi lý xã hội / ly kỳ | Tập tục được xem là bình thường dù gây tổn hại; **bản quyền** | [Tham khảo](https://www.newyorker.com/magazine/1948/06/26/the-lottery) |
| *The Ones Who Walk Away from Omelas* | Ursula K. Le Guin | Giả tưởng đạo đức | Hạnh phúc số đông phụ thuộc khổ đau thiểu số; **bản quyền** | [Tham khảo](https://www.ursulakleguin.com/the-ones-who-walk-away-from-omelas) |
| *The Metamorphosis* | Franz Kafka | Phi lý / tâm lý | Giá trị cá nhân có bị đồng nhất với khả năng chu cấp? | [Tham khảo](https://www.gutenberg.org/ebooks/5200) |
| *The Open Window* | Saki | Hài tình huống | Trí tưởng tượng, hiểu lầm và cú đảo chiều; nguồn truyện trong tuyển tập | [Tham khảo](https://www.gutenberg.org/ebooks/1477) |
| *The Last Leaf* | O. Henry | Đời thường | Hy vọng, chăm sóc và hy sinh; tìm trong tuyển tập | [Tham khảo](https://www.gutenberg.org/ebooks/2776) |

Nguồn truyện mở: [Project Gutenberg](https://www.gutenberg.org/), [Standard Ebooks](https://standardebooks.org/), [Wikisource](https://en.wikisource.org/) / [Wikisource tiếng Việt](https://vi.wikisource.org/). Tìm truyện ngắn độc lập/tuyển tập, không chỉ sách dài. [Quy định Project Gutenberg](https://www.gutenberg.org/policy/license), [Wikisource copyright policy](https://en.wikisource.org/wiki/Wikisource:Licensing), [Standard Ebooks collections policy](https://standardebooks.org/contribute/collections-policy), [WIPO — luật Việt Nam](https://www.wipo.int/wipolex/en/legislation/details/18010). Chú ý: tình trạng public domain ở Hoa Kỳ **không tự động** cho phép tái bản/dịch tại Việt Nam, bản dịch hiện đại có thể có bản quyền riêng; attribution và quyền nhân thân cần được tôn trọng.

### Mẫu record cho reference
```yaml
work_title:
author:
source_url:
original_language:
original_publication:
content_form:
style_primary:
style_secondary: []
selflo_mapping:
story_mechanism:
length_estimate:
rights_status: unchecked
translation_rights_status: unchecked
reuse_mode: reference_only
reviewer:
reviewed_at:
```

## 7. Ý tưởng và phác thảo ngoài manifest: phải giữ, không giả định đã viết đủ

Gồm các ý tưởng vừa trao đổi và một số chủ đề từng được lưu trong Selflo Knowledge backlog. Đây là **backlog** không đồng nghĩa hoàn thành. Nếu có trùng với canonical story, link lại và đánh dấu tránh tạo đôi.

| # | Ý tưởng | Hình thức/phong cách | Mức độ hiện biết | Ghi chú bảo tồn ý định |
|---:|---|---|---|---|
| 1 | Vương quốc những món đồ bị bỏ quên | Thiếu nhi + phiêu lưu | Ý tưởng, đã có synopsis | Robot mất tay đi tìm pin; giá trị không chỉ là công dụng |
| 2 | Bộ Đo Lường Hạnh Phúc | Hài châm biếm + phi lý đời thường | Ý tưởng, đã có synopsis | Chỉ số hạnh phúc triệt tiêu khả năng bộc lộ nỗi buồn |
| 3 | Thư viện của những điều chưa từng xảy ra | Khám phá kỳ bí | Ý tưởng, đã có synopsis | Thay đổi một biến cố làm thay đổi những cuốn sách |
| 4 | Người vay một giờ | Du hành thời gian + giả tưởng xã hội | Ý tưởng, đã có synopsis | Vay trước thời gian rảnh của tương lai |
| 5 | 47 giây | Cinematic ly kỳ | Ý tưởng, đã có synopsis | Kỹ sư có 47 giây quyết định trước cảnh báo trái ngược |
| 6 | Bữa cơm lúc chín giờ | Đời thường | Ý tưởng, đã có synopsis | Gia đình và một bữa cơm muộn; không đồng nhất với truyện đang Release |
| 7 | Khoảng trống trong khu rừng | Quy luật tự nhiên | Ý tưởng, đã có synopsis | Cây cổ thụ đổ tạo điều kiện cho sự sống mới |
| 8 | Ngôi làng chuyên chở đá | Phi lý đời thường | Ý tưởng, đã có synopsis | Khiêng đá lên rồi xuống mỗi ngày; nhầm bận rộn với hiệu quả |
| 9 | Thành phố của những khung tranh | Phi lý đời thường | Ý tưởng, đã có synopsis | Thi đua làm khung đẹp mà không có tranh |
| 10 | Hiệp hội những người leo thang | Phi lý đời thường + hài châm biếm | Ý tưởng, có diễn biến phát triển | Có cổng không khóa nhưng leo thang mới được công nhận |
| 11 | Người làm vườn xuất sắc nhất | Hài châm biếm + phi lý đời thường | Ý tưởng, đã có synopsis | Thi tưới nước nhiều nên cả cây giả cũng được tưới |
| 12 | Người ngoài hành tinh quan sát thời gian | Phi lý đời thường + giả tưởng xã hội | Motif minh hoạ, chưa phải truyện hoàn chỉnh | Con người mua thiết bị tiết kiệm thời gian rồi làm việc thêm |
| 13 | Câu chuyện thứ ba về các hành trình chưa trải nghiệm | Giả tưởng / phiêu lưu + đời thường | Concept/quote được duyệt trong trao đổi; chưa xác nhận có file canonical | Khó khăn thấy trước có thể che khuất niềm vui/gắn bó/trưởng thành không thể biết trước; quote đã chốt: “Đôi khi, điều khiến một hành trình đáng nhớ lại là những gì ta không hề lên đường để tìm kiếm.” |
| 14 | Hối tiếc trong thương lượng lương | Đời thường + nội tâm / phi lý đời thường | Tình huống và hướng phân tích, chưa chốt truyện | Cơ hội thu nhập đã bỏ lỡ và sự thiếu mạnh dạn trong hoàn cảnh bất an |
| 15 | Hai phiên bản màu sắc cuộc đời từ lời ca | Ngụ ngôn + đời thường | Ý tưởng trước đây; đối chiếu với hai truyện đã Release trước khi tạo thêm | Không sao chép lời ca còn bảo hộ; đã có Người họa sĩ và Tiệm bán màu |
| 16 | Kết quả cuối che mất quá trình | Quan sát / kiến thức | Idea Knowledge backlog | Tại sao kết quả không thể hiện đầy đủ nỗ lực phía sau |
| 17 | Công cụ làm nhanh hơn có lấy mất cơ hội học không? | Phân tích kiến thức | Idea Knowledge backlog | Phân biệt hoàn thành công việc với luyện năng lực |
| 18 | Cảm giác hiểu nhưng chưa tự giải được | Phân tích kiến thức / tình huống | Idea + research queue | Đọc thấy hiểu khác với tự giải và chuyển giao |
| 19 | Vì sao người mới không biết nên hỏi gì? | Quan sát / kiến thức | Idea Knowledge backlog | Khoảng cách kiến thức làm khó việc đặt câu hỏi |
| 20 | So sánh xã hội, ghen tị, thành công người khác | Phân tích / đời thường | Đã có research + draft cạnh tranh, chưa chốt public | Đừng nhầm bản nháp với truyện duyệt |
| 21 | Từ 'tôi không thích' đến 'có gì hay đâu?' | Phân tích / quan sát | Bản nháp chưa canonical | Hiểu phản ứng hạ thấp thành quả của người khác |
| 22 | Kỳ vọng càng nhiều càng đau khổ? | Phân tích / đời thường | Idea | Cần xác định cơ chế và phản ví dụ |
| 23 | Tri túc có phải ngừng cố gắng? | Phân tích triết học | Idea / cần nghiên cứu nguồn | Không đồng nhất biết đủ với từ bỏ phát triển |
| 24 | Vô vi có phải không làm gì? | Phân tích triết học | Idea / cần nghiên cứu nguồn | Cần kiểm tra văn bản gốc và quan điểm diễn giải |
| 25 | Thái cực và những mặt đối lập | Kiến thức / khám phá | Đã có bài Release và backlog sâu hơn | Tách phần đã xuất bản và ý tưởng nghiên cứu tiếp |
| 26 | Truyện thiếu nhi cho học sinh lớp 1–5 | Thiếu nhi | Hướng chương trình, chưa phải truyện cụ thể | Cần nhóm tuổi, từ vựng, thử đọc hiểu |
| 27 | Truyện vui, nhân văn không bắt đầu từ triết lý | Hài / đời thường | Hướng biên tập, chưa phải truyện cụ thể | Lấy xung đột/hành động làm trước, không ép bài học |
| 28 | Truyện ẩn dụ về người ngoài hành tinh, công nghệ và kết nối | Phi lý + giả tưởng xã hội | Nhóm ý tưởng mở | Không mặc định một story đã duyệt |

Những seed khác từ repo phải xem thêm tại [Knowledge inventory](../content-workspace/KNOWLEDGE_CONTENT_INVENTORY.vi.md) và [story-series](../content-workspace/story-series). Riêng bộ ba chủ đề **quá khứ–hiện tại–tương lai** cần đối chiếu truyện đã release (Những ngày đẹp nhất, Nhà ga một chiều) và concept truyện 3; không ép nội dung truyện 3 thành 'sợ rủi ro nên không dám chọn'. Chủ đề đúng là *khó khăn/trách nhiệm tưởng tượng trước khi đi có thể che khuất những niềm vui, gắn bó và sự trưởng thành chỉ xuất hiện trong chính hành trình*. Quote đã khóa ở dòng ý tưởng 13.

## 8. Inventory đúng theo manifest: không trộn trạng thái

Bảng dưới là **toàn bộ 68 story record trong Authoring** ở snapshot. 'RELEASE' nghĩa là ID có mặt trong Release manifest; 'AUTHORING ONLY' là có content payload nhưng chưa có trong Release. Phong cách là mapping sơ bộ và cần owner review; slugs ghi nguyên để không mất bất cứ record nào. Tình trạng hoàn chỉnh/owner-approved cần đọc riêng review field từng story.

| Slug (ID thư mục) | Publish status | Mapping sơ bộ | Nguồn canonical/descriptor |
|---|---|---|---|
| `after-the-alarm-went-silent` | AUTHORING ONLY | Đời thường + tâm lý | [JSON](../perspective-library/authoring/vi/stories/after-the-alarm-went-silent/story.vi.r1.json) |
| `baker-and-black-mark` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/baker-and-black-mark/story.vi.r1.json) |
| `blue-eraser` | AUTHORING ONLY | Truyện thiếu nhi + đời thường | [JSON](../perspective-library/authoring/vi/stories/blue-eraser/story.vi.r1.json) |
| `boatman-and-second-mountain` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/boatman-and-second-mountain/story.vi.r1.json) |
| `builder-and-shapeless-stones` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/builder-and-shapeless-stones/story.vi.r1.json) |
| `cafe-and-smoke-in-curtain` | AUTHORING ONLY | Đời thường + ký ức cảm xúc | [JSON](../perspective-library/authoring/vi/stories/cafe-and-smoke-in-curtain/story.vi.r1.json) |
| `cake-for-the-sixth-floor` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/cake-for-the-sixth-floor/story.vi.r1.json) |
| `cake-that-leaned-left` | AUTHORING ONLY | Hài tình huống + đời thường | [JSON](../perspective-library/authoring/vi/stories/cake-that-leaned-left/story.vi.r1.json) |
| `call-me-at-the-last-stop` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/call-me-at-the-last-stop/story.vi.r1.json) |
| `chair-across-three-homes` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/chair-across-three-homes/story.vi.r1.json) |
| `courier-and-waterline` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/courier-and-waterline/story.vi.r1.json) |
| `cup-with-less-sugar` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/cup-with-less-sugar/story.vi.r1.json) |
| `driver-and-last-stop-light` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/driver-and-last-stop-light/story.vi.r1.json) |
| `empty-boat-on-the-river` | RELEASE | Ngụ ngôn cổ điển (Trang Tử) | [JSON](../perspective-library/authoring/vi/stories/empty-boat-on-the-river/story.vi.r6.json) |
| `envelope-that-could-not-hold-strength` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/envelope-that-could-not-hold-strength/story.vi.r1.json) |
| `first-root-in-the-dark` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/first-root-in-the-dark/story.vi.r1.json) |
| `forest-still-dripping` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/forest-still-dripping/story.vi.r1.json) |
| `four-pots-on-the-balcony` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/four-pots-on-the-balcony/story.vi.r1.json) |
| `garden-with-a-new-patch-of-sun` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/garden-with-a-new-patch-of-sun/story.vi.r1.json) |
| `half-a-wet-shoulder` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/half-a-wet-shoulder/story.vi.r1.json) |
| `half-glass-two-views` | RELEASE | Quan sát đời thường | [JSON](../perspective-library/authoring/vi/stories/half-glass-two-views/story.vi.r1.json) |
| `if-i-am-wrong-but-chatgpt-agrees` | RELEASE | Bài phân tích / kiến thức | [JSON](../perspective-library/authoring/vi/stories/if-i-am-wrong-but-chatgpt-agrees/story.vi.r4.json) |
| `large-tree-beyond-the-carpenters-measure` | RELEASE | Ngụ ngôn cổ điển (Trang Tử) | [JSON](../perspective-library/authoring/vi/stories/large-tree-beyond-the-carpenters-measure/story.vi.r6.json) |
| `last-time` | RELEASE | Chuyện đời thường + nội tâm | [JSON](../perspective-library/authoring/vi/stories/last-time/story.vi.r3.json) |
| `last-window-in-the-building` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/last-window-in-the-building/story.vi.r1.json) |
| `laundry-and-two-bells` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/laundry-and-two-bells/story.vi.r1.json) |
| `morning-after-the-lantern-festival` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/morning-after-the-lantern-festival/story.vi.r1.json) |
| `nguoi-hoa-si-va-buc-tranh-chua-hoan-thanh` | RELEASE | Ngụ ngôn ẩn dụ + nội tâm; **đã release** | [JSON](../perspective-library/authoring/vi/stories/nguoi-hoa-si-va-buc-tranh-chua-hoan-thanh/story.vi.r4.json) |
| `nha-ga-mot-chieu` | RELEASE | Khám phá kỳ bí + hài châm biếm + phiêu lưu; **đã release** | [JSON](../perspective-library/authoring/vi/stories/nha-ga-mot-chieu/story.vi.r1.json) |
| `nhung-ngay-dep-nhat` | RELEASE | Chuyện đời thường + chiêm nghiệm; **đã release** | [JSON](../perspective-library/authoring/vi/stories/nhung-ngay-dep-nhat/story.vi.r1.json) |
| `nine-oclock-morning` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/nine-oclock-morning/story.vi.r1.json) |
| `note-in-measure-seventeen` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/note-in-measure-seventeen/story.vi.r1.json) |
| `old-man-and-returning-horse` | RELEASE | Ngụ ngôn cổ điển (Hoài Nam Tử) | [JSON](../perspective-library/authoring/vi/stories/old-man-and-returning-horse/story.vi.r6.json) |
| `one-event-two-perspectives` | RELEASE | Quan sát đời thường | [JSON](../perspective-library/authoring/vi/stories/one-event-two-perspectives/story.vi.r1.json) |
| `operator-and-one-beat` | AUTHORING ONLY | Đời thường + quan sát | [JSON](../perspective-library/authoring/vi/stories/operator-and-one-beat/story.vi.r1.json) |
| `original-an-and-lamp-held-too-close` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-an-and-lamp-held-too-close/story.vi.r1.json) |
| `original-between-two-banks` | RELEASE | Ngụ ngôn + nội tâm | [JSON](../perspective-library/authoring/vi/stories/original-between-two-banks/story.vi.r5.json) |
| `original-boatman-and-second-mountain` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-boatman-and-second-mountain/story.vi.r2.json) |
| `original-builder-and-shapeless-stones` | RELEASE | Ngụ ngôn + nội tâm | [JSON](../perspective-library/authoring/vi/stories/original-builder-and-shapeless-stones/story.vi.r6.json) |
| `original-chair-beside-window` | RELEASE | Chuyện đời thường + chiêm nghiệm | [JSON](../perspective-library/authoring/vi/stories/original-chair-beside-window/story.vi.r6.json) |
| `original-if-i-lived-a-human-life` | RELEASE | Nội tâm + giả tưởng | [JSON](../perspective-library/authoring/vi/stories/original-if-i-lived-a-human-life/story.vi.r13.json) |
| `original-keeper-of-the-lamp` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-keeper-of-the-lamp/story.vi.r2.json) |
| `original-lam-and-tomorrow-passenger` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-lam-and-tomorrow-passenger/story.vi.r2.json) |
| `original-stone-that-loved-stormy-days` | RELEASE | Quy luật tự nhiên + ngụ ngôn | [JSON](../perspective-library/authoring/vi/stories/original-stone-that-loved-stormy-days/story.vi.r4.json) |
| `original-thanh-and-one-more-meter` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-thanh-and-one-more-meter/story.vi.r2.json) |
| `original-water-carrier-and-tomorrow-stone` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/original-water-carrier-and-tomorrow-stone/story.vi.r2.json) |
| `photograph-missing-a-corner` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/photograph-missing-a-corner/story.vi.r7.json) |
| `potter-and-two-hands` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/potter-and-two-hands/story.vi.r1.json) |
| `rails-that-diverge` | RELEASE | Nội tâm + ngụ ngôn | [JSON](../perspective-library/authoring/vi/stories/rails-that-diverge/story.vi.r7.json) |
| `rain-arrives-downstream-late` | AUTHORING ONLY | Quy luật tự nhiên | [JSON](../perspective-library/authoring/vi/stories/rain-arrives-downstream-late/story.vi.r1.json) |
| `recordist-and-room-not-silent` | AUTHORING ONLY | Đời thường + chú ý | [JSON](../perspective-library/authoring/vi/stories/recordist-and-room-not-silent/story.vi.r1.json) |
| `roof-of-many-hands` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/roof-of-many-hands/story.vi.r1.json) |
| `saturday-without-a-highlight` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/saturday-without-a-highlight/story.vi.r1.json) |
| `seam-opened-three-times` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/seam-opened-three-times/story.vi.r1.json) |
| `shoes-that-went-to-work-twice` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/shoes-that-went-to-work-twice/story.vi.r1.json) |
| `signmaker-and-first-square` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/signmaker-and-first-square/story.vi.r1.json) |
| `taiji-from-one-to-ten-thousand-things` | RELEASE | Bài giải thích kiến thức + quy luật tự nhiên | [JSON](../perspective-library/authoring/vi/stories/taiji-from-one-to-ten-thousand-things/story.vi.r1.json) |
| `thanh-pho-cua-nhung-chiec-dong-ho` | RELEASE | Phi lý đời thường + giả tưởng xã hội; **đã release** | [JSON](../perspective-library/authoring/vi/stories/thanh-pho-cua-nhung-chiec-dong-ho/story.vi.r4.json) |
| `the-compass-does-not-walk-for-you` | RELEASE | Nội tâm + khám phá ẩn dụ | [JSON](../perspective-library/authoring/vi/stories/the-compass-does-not-walk-for-you/story.vi.r11.json) |
| `three-dots-on-the-screen` | AUTHORING ONLY | Đời thường + nội tâm | [JSON](../perspective-library/authoring/vi/stories/three-dots-on-the-screen/story.vi.r1.json) |
| `three-numbers-at-the-atm` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/three-numbers-at-the-atm/story.vi.r1.json) |
| `ticket-printed-for-tuesday` | AUTHORING ONLY | Chưa thẩm định phong cách | [JSON](../perspective-library/authoring/vi/stories/ticket-printed-for-tuesday/story.vi.r1.json) |
| `tiem-ban-mau-cua-cuoc-doi` | RELEASE | Ngụ ngôn ẩn dụ + nội tâm; **đã release** | [JSON](../perspective-library/authoring/vi/stories/tiem-ban-mau-cua-cuoc-doi/story.vi.r4.json) |
| `tree-and-silent-goose` | RELEASE | Ngụ ngôn cổ điển (Trang Tử) | [JSON](../perspective-library/authoring/vi/stories/tree-and-silent-goose/story.vi.r6.json) |
| `two-sides-of-one-mountain` | AUTHORING ONLY | Quy luật tự nhiên + ngụ ngôn | [JSON](../perspective-library/authoring/vi/stories/two-sides-of-one-mountain/story.vi.r1.json) |
| `two-tailors-and-one-measure` | AUTHORING ONLY | Ngụ ngôn + phi lý đời thường | [JSON](../perspective-library/authoring/vi/stories/two-tailors-and-one-measure/story.vi.r1.json) |
| `warehouse-path-between-boxes` | AUTHORING ONLY | Ngụ ngôn đời thường | [JSON](../perspective-library/authoring/vi/stories/warehouse-path-between-boxes/story.vi.r1.json) |
| `why-ai-feels-easier-to-ask` | RELEASE | Bài phân tích / kiến thức | [JSON](../perspective-library/authoring/vi/stories/why-ai-feels-easier-to-ask/story.vi.r5.json) |

**Không tính các ý tưởng chưa có payload vào 68.** Source/vi/stories có thể có hồ sơ seed chưa hiện trong manifest; đối chiếu riêng trước khi tự nhận là 'đã có truyện'. Cần audit title/body đầy đủ và owner decisions cho từng Authoring-only trước khi publish.

## 9. Quy trình áp dụng

1. **Intake:** ghi nguồn ý tưởng, câu hỏi, tình huống, content_form, topic, style, tình trạng nội dung và rights.
2. **Phân loại:** một primary style + 0–N secondary; form độc lập với style. Cách kể có thể được đánh giá lại sau khi đọc full story.
3. **Nguồn:** với bài phân tích/kiến thức: Observation → Question → Research → Evidence → Counterevidence → Mechanism → Scope → Selflo content; tách claim có nguồn và diễn giải cá nhân. Với fiction, minh bạch tính hư cấu, tránh ngụy khoa học.
4. **Thử bản thảo:** kiểm tra câu chuyện còn hấp dẫn nếu bỏ reflection; lời thoại có chức năng, tình tiết có hệ quả, không lặp kết triết lý.
5. **Editor review + owner approval:** tránh bulk promote; giữ nguyên bản gốc đã khóa; Review/Authoring/Release khác nhau.
6. **Publish:** qua schema, publisher, integrity lock, build/test, UI review; không coi một PR là đã release.
7. **Catalog UI:** trang [story-landscape](../story-landscape/) tham chiếu manifest; các nhãn mới chỉ là editorial suggestions, không sửa dữ liệu Release.

## 10. Quyết định vs đề xuất / việc tiếp theo

**ĐÃ CHỐT:** ba luồng Originals–Classics–Reference; mở rộng trải nghiệm đọc, không ép triết lý; 12 phong cách khởi đầu dạng tập mở; phi lý đời thường là hướng đáng ưu tiên; content form gồm fiction, analysis, everyday observation, sourced knowledge, real events; hiện có thể cùng Story UI và tương lai có thể tách; bảo toàn nguồn và quyền; mỗi ý tưởng cần tồn tại trong backlog và trạng thái chính xác.

**ĐỀ XUẤT ĐANG CHỜ REVIEW:** tên & số phong cách 13–18; tên category/đường dẫn UI; cấu trúc metadata cụ thể và schema; việc gán style cho từng truyện; danh sách Classics nào thực sự được dịch/đăng; việc bổ sung summary/quote cho tác phẩm đã khóa.

**Việc tiếp theo:** audit toàn bộ 46 Authoring-only theo từng nhóm; tìm mọi story seed/idea nằm ngoài manifest trong repo và phiên chat lịch sử để đưa vào bảng idea; owner duyệt taxonomy mapping; thêm record sources với tình trạng bản quyền cụ thể; chỉ sau đó cân nhắc tách danh mục ngoài Story.

---
*Soạn từ quyết định biên tập Selflo ngày 2026-11-01 và kiểm kê manifest main cùng thời điểm. Tài liệu này là snapshot để review, không thay thế manifest hoặc trạng thái pháp lý.*
