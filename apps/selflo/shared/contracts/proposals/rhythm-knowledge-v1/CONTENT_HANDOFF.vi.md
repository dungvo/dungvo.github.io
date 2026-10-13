# Rhythm Knowledge — Research, Authoring and Content Handoff

**Trạng thái:** Draft for owner review  
**Ngày:** 2026-10-12  
**Đối tượng nhận:** Selflo content repo / research-editorial workflow  
**Liên quan:** [Rhythm Knowledge proposal](PROPOSAL.vi.md), [K2 Pilot Content Brief](K2_PILOT_CONTENT_BRIEF.vi.md)

## 1. Mục đích của handoff

Tài liệu này giúp content repo hiểu đầy đủ feature `Hiểu nhịp của mình`, nghiên cứu đúng câu hỏi, viết Knowledge Explanation đáng tin và bàn giao một article có thể review trước khi app tích hợp.

Knowledge là selling point quan trọng của Rhythm Reading. Giá trị không nằm ở việc lặp lại rằng user đã chọn `Công việc + Lo lắng`, mà ở việc giúp họ:

1. hiểu một cơ chế tâm lý/nhận thức có thể liên quan;
2. phân biệt điều đã xảy ra với cách mình diễn giải điều đó;
3. thấy cảm xúc và hành vi có thể hình thành qua nhiều bước, không phải từ một nguyên nhân duy nhất;
4. nhận ra chỗ mình có thể quan sát, kiểm tra hoặc thử thay đổi;
5. giữ quyền xác nhận hoặc bác bỏ cách giải thích đối với trải nghiệm của chính mình.

Content không được tạo cảm giác Selflo đọc được suy nghĩ, biết nguyên nhân thật hoặc đang chẩn đoán user.

## 2. Bối cảnh sản phẩm

Flow đích:

```text
Structured check-in
→ deterministic Rhythm pattern
→ Bản đọc + evidence
→ Knowledge card: Khám phá cơ chế này
→ contextual Knowledge Reader
→ user hiểu mô hình, ví dụ, giới hạn và cách tự kiểm tra
→ quay lại Bản đọc
```

Input hiện có:

- ngày/giờ check-in;
- topic;
- emotion;
- headspace khi có;
- cửa sổ 7/30 ngày và signal/facts do engine tạo.

Input không được dùng trong V1:

- raw title/note;
- suy nghĩ tự do;
- hành vi tự do;
- dữ liệu cloud/AI inference;
- chẩn đoán hoặc hồ sơ tâm lý.

Vì vậy article phải là **kiến thức chung được chọn vì có liên quan**, không phải bản phân tích cá nhân chắc chắn.

## 3. Quan hệ giữa Rhythm và Knowledge

Rhythm engine trả lời:

> Trong dữ liệu có cấu trúc, điều gì đang lặp lại, tương phản hoặc thay đổi?

Knowledge article trả lời:

> Có cơ chế nào đáng tin giúp một người hiểu hiện tượng này rõ hơn, giới hạn của cách giải thích đó là gì, và họ có thể tự kiểm tra điều gì?

Knowledge không được sửa hoặc kéo dài claim của engine. Một bài có thể mô tả candidate mechanism nhưng không được biến candidate thành fact về user.

### Ba lớp phải phân biệt

| Lớp | Ví dụ | Owner |
|---|---|---|
| Observed fact | `Công việc + Lo lắng` xuất hiện ở hai ngày ghi nhận | App engine |
| General mechanism | Cách diễn giải và dự đoán có thể góp phần định hình cảm xúc/phản ứng | Knowledge content |
| Personal truth | `Tôi lo vì nghĩ mình sẽ bị đánh giá` | Chỉ user có quyền xác nhận |

## 4. Product promise của Knowledge

Sau khi đọc, user nên có thể nói bằng lời của mình:

- “Selflo biết điều gì và chưa biết điều gì từ check-in của tôi.”
- “Sự việc không nhất thiết đi thẳng đến một cảm xúc duy nhất.”
- “Cách chú ý, diễn giải và dự đoán có thể là một phần của chuỗi.”
- “Cơ thể, môi trường, lịch sử, quan hệ và nguồn lực cũng có thể góp phần.”
- “Tôi có thể tách fact khỏi interpretation, tìm cách nhìn khác và kiểm tra dự đoán bằng một hành động nhỏ.”
- “Một cách giải thích không đúng với tôi thì tôi có thể bỏ qua hoặc sửa lại.”

Article thất bại nếu user chỉ nhớ một slogan, cảm thấy bị phân tích thay, hoặc tin rằng mọi cảm xúc khó đều do “suy nghĩ sai”.

## 5. Scientific and epistemic standard

### 5.1. Source hierarchy

Ưu tiên theo thứ tự:

1. Systematic review, meta-analysis hoặc evidence synthesis peer-reviewed.
2. Guideline/consensus/report từ tổ chức chuyên môn hoặc cơ quan nghiên cứu có thẩm quyền.
3. Handbook/textbook học thuật từ publisher hoặc university press có reputation rõ.
4. Primary peer-reviewed study quan trọng để minh họa phạm vi hẹp, không dùng một study đơn lẻ để tuyên bố phổ quát.
5. Tài liệu học thuật chính thức của university/research institute để diễn giải cho người mới, sau khi claim gốc đã được kiểm tra.

Chỉ dùng làm lead, không làm nền duy nhất cho claim:

- bài báo phổ thông;
- blog chuyên gia;
- website tổng hợp;
- Wikipedia;
- câu trả lời AI;
- social media;
- nội dung SEO hoặc coaching.

Không dùng citation do AI tạo nếu chưa mở và xác minh source thật. Không trích dẫn một paper chỉ từ abstract nếu claim phụ thuộc method, population hoặc limitation trong full text.

### 5.2. Claim–source matrix bắt buộc

Mỗi claim quan trọng cần record:

| Field | Yêu cầu |
|---|---|
| Claim ID | Stable ID nội bộ |
| Claim tiếng Việt | Câu article dự định nói |
| Source | DOI/PMID/ISBN/stable URL |
| Evidence type | Meta-analysis, review, experiment, observational, theory… |
| Population/context | Ai, ở đâu, bối cảnh nào |
| What source supports | Phần nào được nguồn hỗ trợ trực tiếp |
| What source does not support | Suy rộng nào bị cấm |
| Limitations | Hạn chế cần giữ trong article/review note |
| Confidence | established_for_scope / supported / interpretation / hypothesis |
| Editorial use | Main text, aside, example, limit hoặc không dùng |

Mọi con số phải lần được tới bảng/kết quả của source. Không dùng số liệu chỉ để tạo authority hoặc gây ấn tượng.

### 5.3. Không dùng neuroscience trang trí

Chỉ nói “não”, vùng não, hormone hoặc neural pathway khi:

- thông tin cần thiết để trả lời câu hỏi của bài;
- có source phù hợp và claim nằm đúng phạm vi evidence;
- cách nói không biến correlation thành nguyên nhân chắc chắn;
- giải thích đó giúp user hiểu hoặc tự quan sát tốt hơn.

Không dùng các câu kiểu:

- “Não nguyên thủy chiếm quyền điều khiển.”
- “Amygdala bật chế độ sinh tồn nên bạn phản ứng như vậy.”
- “Dopamine khiến bạn…”
- “Não không phân biệt thật và tưởng tượng.”

trừ khi được định nghĩa rất hẹp, có bằng chứng và có giới hạn. Với feature này, cơ chế nhận thức–cảm xúc–hành vi là core; neuroscience là optional supporting layer, không phải dấu chứng nhận khoa học.

## 6. Claim policy

### Được phép

- `có thể`, `đôi khi`, `một khả năng`, `một cách để quan sát` khi evidence chỉ hỗ trợ candidate mechanism.
- Mô tả general process có source và phạm vi rõ.
- So sánh nhiều cách diễn giải cùng một tình huống.
- Nêu uncertainty, alternative explanation và contextual factors.
- Mời user kiểm tra cơ chế có gần với trải nghiệm hay không.
- Đề xuất skill tự quan sát hoặc behavioral experiment nhỏ, reversible, non-clinical.

### Không được phép

- “Bạn lo vì…” khi user chưa xác nhận.
- “Công việc làm bạn lo lắng.”
- “Bạn đang overthinking/né tránh/tự phá hoại.”
- “Suy nghĩ của bạn sai/phi lý/tiêu cực.”
- “Chỉ cần đổi suy nghĩ là cảm xúc sẽ thay đổi.”
- “Đây là cơ chế bộ não của bạn.”
- Diagnosis, personality claim, trauma inference hoặc medical advice.
- Hứa chữa lành, kiểm soát hoàn toàn cảm xúc hoặc thay đổi nhanh.
- Biến structural constraint thành lỗi mindset của cá nhân.

## 7. Cách nói về “thay đổi suy nghĩ”

Mục tiêu không phải thay một “suy nghĩ xấu” bằng một “suy nghĩ tích cực”. Mục tiêu là tăng **cognitive flexibility và khả năng kiểm tra diễn giải**.

Một sequence hợp lý:

```text
1. Dừng và ghi lại sự việc quan sát được
2. Nhận ra câu diễn giải/dự đoán đang xuất hiện
3. Phân biệt fact, interpretation, prediction và judgment
4. Đánh giá mức chắc chắn và bằng chứng đang có
5. Tạo thêm một hoặc hai cách diễn giải hợp lý
6. Nhận ra emotion, body response và urge đi cùng
7. Chọn một hành động nhỏ giúp lấy thêm thông tin hoặc giảm vòng lặp
8. Nhìn lại kết quả thay vì ép mình phải nghĩ tích cực
```

Các kỹ thuật có thể nghiên cứu/đề xuất nếu source phù hợp:

- cognitive reappraisal/reframing;
- decentering/cognitive defusion;
- distinguishing observation from interpretation;
- prediction testing/behavioral experiment;
- attention shifting/present-moment awareness;
- affect labeling;
- acceptance khi không thể giải quyết uncertainty ngay;
- problem solving khi vấn đề thực tế có thể hành động;
- psychological detachment/recovery khi work carryover phù hợp.

Article phải nói khi nào một kỹ thuật **không đủ**: vấn đề khách quan, workload thật, unsafe environment, thiếu nguồn lực, sức khỏe hoặc distress kéo dài không được thu nhỏ thành “hãy nghĩ khác”.

## 8. Authoring format mong muốn

Mỗi Knowledge root article cần tự đứng được, không buộc user mở nhánh.

### Anatomy tối thiểu

1. **Câu hỏi gốc theo ngôn ngữ user.**
2. **Câu trả lời ngắn:** 80–150 từ, đủ nắm luận điểm.
3. **Điều Selflo biết/chưa biết:** contextual bridge, không cá nhân hóa quá mức.
4. **Cơ chế chính:** diagram + giải thích từng bước.
5. **Hai ví dụ đối chiếu:** cùng sự việc/cách diễn giải khác hoặc cùng emotion/hành vi khác.
6. **Điều dễ hiểu nhầm:** ít nhất ba misconception.
7. **Điều user có thể thử:** skill/experiment nhỏ, không coaching cưỡng ép.
8. **Giới hạn và alternative explanations.**
9. **Câu hỏi tự kiểm tra:** không ép trả lời, không lưu mặc định.
10. **Nguồn và mức độ bằng chứng.**
11. **Related Knowledge:** tối đa 2–3 link có lời hứa cụ thể.

### Độ dài

- Root article mục tiêu: khoảng 1.200–2.500 từ tiếng Việt, tùy độ phức tạp.
- Câu trả lời ngắn phải đủ dùng nếu user không đọc tiếp.
- Mỗi section trả lời một câu hỏi; không kéo dài để tạo cảm giác “chuyên sâu”.
- Deep dive hoặc node riêng khi một khái niệm cần source/giới hạn riêng.

Con số này là authoring target, không phải schema contract.

## 9. Visual and learning requirements

Artwork không chỉ để làm đẹp. Mỗi visual cần có learning job rõ:

- diagram: làm quan hệ giữa các bước nhìn thấy được;
- compare paths: cho thấy cùng sự việc có thể có nhiều interpretation;
- loop: cho thấy hành vi/hệ quả có thể feed back vào vòng tiếp theo;
- timeline: phân biệt transition với trend;
- sampled days: cho thấy phần dữ liệu chưa quan sát được.

Yêu cầu:

- Không dùng brain illustration giả-khoa-học nếu bài không thật sự giải thích neuroscience.
- Mọi diagram có title, legend và alt text.
- Không dùng màu tốt/xấu tuyệt đối cho emotion.
- Visual vẫn hiểu được ở grayscale/contrast mode khi có thể.
- Text trong ảnh không chứa nội dung duy nhất không thể accessibility đọc.
- Hình ảnh/rights/provenance phải rõ và theo gate content repo.

## 10. Tone và tiếng Việt

- Tự nhiên, rõ, không lên lớp.
- Không văn chương hóa để che claim yếu.
- Không dùng thuật ngữ học thuật khi một câu phổ thông đủ chính xác.
- Khi cần thuật ngữ, giải thích ngay bằng ví dụ.
- Không anthropomorphize “bộ não” như một nhân vật tự quyết định thay user.
- Không dùng giọng trị liệu nếu product không cung cấp therapy.
- Không tạo shame vì user “nghĩ sai”.
- Luôn giữ user là người kiểm tra, sửa hoặc bác bỏ.

## 11. Research workflow yêu cầu

```text
Product question
→ search strategy + inclusion/exclusion criteria
→ source inventory
→ claim–source matrix
→ mechanism map
→ content outline
→ source review
→ first draft
→ logic/safety/editorial review
→ owner review
→ reader mockup with real content
→ revision
→ Authoring candidate
→ schema/semantic/source gates
→ Release only after app compatibility and owner approval
```

Research package cần lưu:

- câu hỏi nghiên cứu;
- database/search terms đã dùng;
- ngày tìm;
- source được chọn và loại;
- lý do chọn/loại;
- claim–source matrix;
- unresolved disagreements/open questions;
- rights/provenance cho artwork;
- editorial decisions.

## 12. Review rubric

Chấm 0–3 cho từng tiêu chí:

| Tiêu chí | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Scientific grounding | Không có/nguồn yếu | Có source nhưng claim vượt nguồn | Nguồn phù hợp, còn điểm cần sửa | Claim-source-limit rõ và mạnh |
| Epistemic honesty | Kết luận thay user | Hedging hình thức | Phân biệt fact/candidate khá rõ | User luôn giữ quyền xác nhận |
| Mechanism clarity | Slogan | Có mô tả nhưng thiếu bước | Cơ chế dễ theo | User có thể giải thích lại |
| Practical transfer | Lời khuyên chung | Một mẹo rời rạc | Có skill/experiment phù hợp | User biết khi nào/cách kiểm tra |
| Safety/scope | Diagnosis/therapy claim | Có risk đáng kể | Boundary đủ | Boundary rõ, không giảm nhẹ vấn đề thật |
| Vietnamese quality | Gượng/khó hiểu | Nhiều jargon | Tự nhiên | Chính xác, tự nhiên, có nhịp đọc tốt |
| Visual learning value | Trang trí | Có visual nhưng ít giúp hiểu | Visual làm rõ cơ chế | Visual giúp thấy quan hệ khó bằng chữ |
| Product fit | Bài giáo khoa chung | Liên hệ Rhythm yếu | Nối context hợp lý | Nâng Bản đọc thành hiểu biết có giá trị |
| Source transparency | Không trace được | Citation hình thức | Sources trace được | User/editor đều hiểu nguồn và giới hạn |

Gate đề xuất:

- Không tiêu chí nào dưới 2.
- Scientific grounding, epistemic honesty và safety/scope phải đạt 3.
- Tổng tối thiểu 24/27.
- Owner đọc toàn bài và duyệt human review; automated validation không thay thế editorial acceptance.

## 13. Deliverables content repo cần trả

Cho mỗi bài:

1. Research brief.
2. Source inventory.
3. Claim–source matrix.
4. Mechanism diagram specification.
5. Article outline.
6. Full Vietnamese draft.
7. Misconception/limitations section.
8. Practice/self-check section.
9. Mapping proposal từ typed Rhythm signals/facts.
10. Forbidden claims.
11. Review rubric score và reviewer notes.
12. Authoring preview hoặc payload candidate theo contract đã được duyệt.

Không publish Release, không bulk-approve Knowledge dependency và không sửa generated Authoring/Release output bằng tay.

## 14. Ownership và contract

Content repo sở hữu:

- article content;
- theory/concept/reference provenance;
- claim/source/limit;
- visual source/rights;
- mapping semantics khi được promote thành shared contract;
- editorial/release lifecycle.

App repo sở hữu:

- observed facts và signal trace;
- confidence;
- destination state;
- contextual navigation;
- fail-closed behavior;
- UI/accessibility/offline rendering;
- user-confirmed state nếu sau này được thiết kế.

Không copy canonical taxonomy, wire format hoặc content semantics sang app repo. Tài liệu này là product/editorial handoff, không phải executable shared contract.

## 15. Definition of ready để owner review

- Research question và scope rõ.
- Source hierarchy/gates đạt.
- Claim–source matrix hoàn chỉnh.
- Article trả lời câu hỏi gốc ngay cả khi không mở nhánh.
- Cơ chế có diagram và ví dụ đối chiếu.
- Không suy thoughts/behaviors của user.
- Có alternative explanation và structural/contextual limits.
- Có kỹ thuật tự quan sát/thử nghiệm, không hứa “đổi suy nghĩ là hết cảm xúc”.
- Vietnamese human-edited.
- Visual có learning job và rights rõ.
- Mapping proposal không dựa vào scenario fixture ID.
- Review rubric đạt gate.

## 16. Request ngắn có thể gửi cho content repo

> Hãy dùng `CONTENT_HANDOFF.vi.md` và `K2_PILOT_CONTENT_BRIEF.vi.md` trong proposal package này làm product/editorial input. Trước khi viết, đọc shared contract hub, content repo AGENTS, Selflo Product Philosophy và canonical Knowledge/source-review rules. Hãy nghiên cứu bằng nguồn ưu tiên, tạo research brief + claim–source matrix + outline trước; không publish và không sửa generated output. Bài cần giúp user hiểu cơ chế, giới hạn và cách tự kiểm tra, không suy đoán suy nghĩ/hành vi cá nhân. Trả lại research package và full Vietnamese draft để owner review.

## 17. Đúng một bước tiếp theo

Owner review hai brief; sau khi accept, gửi chúng sang content repo để content team/agent tạo research pack và outline K2 trước khi viết full draft hoặc thiết kế high-fidelity Knowledge Reader.
