# Selflo content repo — Kiểm kê phần đang làm dở

**Trạng thái:** Bảng theo dõi đang dùng
**Ngày kiểm kê:** 2026-10-15
**Phạm vi:** Repo content/web `apps/selflo`; không đánh giá hoặc thay đổi repo app.

## 1. Cách hiểu các trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| `Cần hoàn thành` | Hướng đã có giá trị rõ và còn việc cụ thể để đưa đến mốc nghiệm thu |
| `Cần owner review` | Không được tự động đưa tiếp; owner cần đọc/chọn/duyệt |
| `Thử nghiệm` | Đang kiểm chứng nội dung hoặc trải nghiệm; chưa phải sản phẩm public |
| `Đề xuất` | Có mô hình/tài liệu nhưng chưa thành contract hoặc capability phát hành |
| `Tạm dừng có chủ đích` | Đã quyết định chưa tiếp tục; không tính là việc cần “làm cho xong” ở thời điểm này |
| `Cần đồng bộ lại` | Dữ liệu theo dõi hoặc tài liệu không còn phản ánh trạng thái hiện tại |

## 2. Kết luận nhanh

Ba phần owner nhớ đều đúng:

1. Authoring còn nhiều story chưa lên Release.
2. Mê cung kiến thức trên web đang là prototype chưa hoàn thành.
3. Studio là môi trường phát triển/nghiệm thu đầy đủ; web công khai là tập con production được chọn để Release. Hiện pipeline này chưa thể hiện trọn trạng thái/gate và chưa khép kín quy trình phát hành.

Ngoài ra còn bốn nhóm đáng theo dõi:

4. `Phân tích` mới là lớp nội bộ trong Studio, chưa thành content public.
5. `Series câu chuyện` mới có mô hình và preview; series đầu tiên chưa có nội dung tập.
6. Story Reader metadata đã được duyệt nhưng tài liệu vẫn ghi đang triển khai.
7. Dữ liệu Review Matrix đang cũ so với manifest hiện tại.

Lần rà soát mở rộng bổ sung thêm:

8. Kho quote nghiên cứu 5.470 dòng cần một chương trình review riêng trước khi đưa mọi quote **đủ điều kiện** lên Release.
9. Chuyển động/hoạt ảnh website hiện chưa có brief, backlog hay mốc nghiệm thu riêng; repo chỉ còn các chuyển động nhỏ rải trong CSS/JavaScript nên chưa thể xác định phần đã làm đến đâu.
10. Kho research và taxonomy còn thiếu độ phủ: 3.050/5.465 dòng trong matrix đang có chủ đề `unresolved`.
11. Trạng thái pipeline quote chưa thống nhất: lệnh trạng thái hiện báo 1.432 item đều là `imported`, trong khi AI review ledger đã có 1.577 quyết định và matrix có nhiều stage chi tiết.
12. Nghiên cứu Human Agency đã hoàn thành phần audit nhưng còn hàng đợi owner: candidate Release, câu cần biên tập, cụm trùng và các gap nội dung.

Rhythm → Knowledge cũng còn nhiều file, nhưng đã **tạm dừng có chủ đích** theo ADR-0002; không đưa vào hàng việc cần hoàn thành ngay.

## 3. Feature và hệ thống đang làm giữa chừng

| Hạng mục | Trạng thái | Hiện đã có | Còn thiếu để hoàn thành | Đề xuất xử lý |
|---|---|---|---|---|
| Pipeline Candidate → Authoring → Release | Cần owner review | Source, publisher, trang review và ba channel đã có | Review nội dung, nguồn, quyền và promotion có chủ đích | Ưu tiên vận hành theo batch nhỏ; không bulk-release |
| Mê cung kiến thức | Thử nghiệm | Prototype web chủ đề “Thái cực là gì?”, mô hình topic/node/link và một prototype nội dung về “Đọc thấy hợp lý có phải đã hiểu?” | Source review, bài Thái cực hoàn chỉnh, hình/sơ đồ, ví dụ, kiểm tra từ khó, bài tự giải thích và user test | Hoàn thành một đường đọc duy nhất trước khi mở thêm topic |
| Studio → web công khai | Thử nghiệm | Studio có giao diện đầy đủ hơn cho Story, Series, Phân tích và Knowledge; public web đã tiêu thụ nội dung Release | Chưa có catalog/trạng thái/gate thống nhất và quy trình chọn tập con từ Studio để Release; rollback/audit chưa khép kín | Phát triển một hệ thống: Studio là môi trường dev/nghiệm thu, web công khai là production subset; không xây hai bản song song |
| Phân tích nội dung | Thử nghiệm, chỉ dùng trong Authoring | Contract active cho Studio; có 2 companion analysis | Chưa có app consumer; chưa quyết định có public độc lập hay là phần đọc sâu; proposal nội dung ghép còn chưa duyệt | Dùng hai bài hiện tại để chốt hình thức public trước khi mở rộng |
| Series câu chuyện | Đề xuất | Proposal, catalog preview và UI trong Website Preview | Series “Tầng không tồn tại” có 10/10 tập đang chờ nội dung; thiếu contract active, publisher và consumer | Chỉ tiếp tục khi owner có nội dung series thật và muốn ưu tiên feature này |
| Story Reader metadata | Cần xác minh hoàn tất | Đề xuất đã được owner duyệt: thời gian đọc, ảnh hero và nội dung liên quan | Tài liệu vẫn ghi `implementing`; cần đối chiếu schema, publisher, web/app và Release gate rồi đóng proposal | Làm một lượt kiểm tra đồng bộ và ghi trạng thái cuối |
| Ma trận review Studio | Hoàn thành Q0 | Trang review matrix đã rebuild ở Authoring 81/Release 43 | Cần tiếp tục rebuild khi nguồn thay đổi | Dùng làm dashboard vận hành; snapshot Q0 được lưu trong program workspace |
| Chương trình review toàn bộ quote | Đang thực hiện | 5.470 dòng tổng hợp; 1.844 quote canonical Authoring; 318 quote Release | Khử trùng lặp, phân loại, kiểm tra nguyên văn/bản dịch/nguồn/quyền, review chất lượng và owner duyệt | Đưa mọi quote đủ điều kiện lên Release; không ép dòng trùng, yếu hoặc không xác minh được vào production |
| Độ phủ chủ đề quote | Cần hoàn thành | 9 theme chính đang có và một số theme mở rộng | 3.050 dòng còn `unresolved`; cần taxonomy, phân loại và chủ động bổ sung nguồn cho theme thiếu | Audit theo theme trước khi đặt quota bổ sung content |
| Trạng thái review quote | Cần hợp nhất | Có state file, AI ledger, shortlist và Review Matrix | Các nguồn đang báo số/stage khác nhau; CLI chỉ thấy 1.432 item `imported` | Chọn một nguồn trạng thái vận hành chính và tạo các view còn lại từ nguồn đó |
| Human Agency / content coverage | Nghiên cứu hoàn tất, còn owner queue | Đã audit toàn bộ baseline cũ, có coverage/gap và candidate packages | Còn candidate Release, edit candidate, duplicate cluster và gap chưa được owner xử lý | Nhập các queue còn hiệu lực vào chương trình quote mới, đánh dấu phần lỗi thời theo revision |
| Chuyển động/hoạt ảnh website | Cần khôi phục phạm vi | Có một số hover, loading, reveal và chuyển động nhỏ rải trong public web/Studio | Không tìm thấy brief, danh sách màn hình, asset animation chuyên biệt hoặc tiêu chí nghiệm thu; chưa rõ phần user nhớ nằm ở đâu | Lập brief riêng sau khi owner xác nhận phạm vi; kiểm tra hiệu năng, accessibility và chế độ giảm chuyển động |
| Rhythm pattern → Knowledge | Tạm dừng có chủ đích | Handoff, K2 brief, K1–K9 draft và mapping thử | Check-in chưa có tình huống đủ cụ thể; kho Knowledge chưa đủ để match an toàn | Không tiếp tục cho đến khi đạt điều kiện mở lại trong ADR-0002 |

## 4. Nội dung đang làm dở cần hoàn thành

### 4.1. Story trong Authoring chưa Release

- Manifest Authoring hiện có **62 story**.
- Manifest Release hiện có **16 story**.
- Có **46 story xuất hiện trong Authoring nhưng chưa có trong Release**.
- Nguồn canonical hiện có **16 story `active` và 52 story `draft`**.

Hai con số 46 và 52 không mâu thuẫn: một số draft trong source chưa được đưa vào Authoring hiện hành. Đây cũng là lý do không nên đồng nhất “có file” với “đang chờ release”.

Danh sách 46 story Authoring-only được lấy trực tiếp từ hai manifest tại thời điểm kiểm kê. Chúng cần được xử lý theo batch nhỏ:

1. đọc toàn bài như user;
2. kiểm tra source, attribution và quyền;
3. kiểm tra nội dung có phù hợp triết lý Selflo;
4. sửa tại canonical source nếu cần;
5. owner duyệt rõ;
6. mới promote sang Release.

Không đặt mục tiêu đưa cả 46 bài lên Release chỉ để hai số bằng nhau. Bài chưa đạt nên tiếp tục ở Authoring hoặc loại khỏi hàng chờ.

### 4.2. Knowledge và bài phân tích chưa chốt

Theo `KNOWLEDGE_CONTENT_INVENTORY.vi.md`, nhóm nên hoàn thành trước là:

| Chủ đề | Hiện trạng | Đúng bước tiếp theo |
|---|---|---|
| Thành công của người khác / so sánh xã hội / ghen tị | Có assessment, source audit và direction pack; parked sau pilot spec-driven | Mở session content riêng rồi owner chọn direction; chưa viết consolidated draft hoặc Release |
| Kỳ vọng và cảm xúc khó chịu | Mới là câu hỏi ngắn | Làm rõ “kỳ vọng” nào và người đọc cần hiểu cơ chế gì |
| Một cuộc đời “chỉ cần đủ” nhưng vẫn phải cố | Có bản nháp Facebook | Quyết định là Góc nhìn hay Knowledge và xác minh trạng thái đăng |
| Vì sao chú ý điều tiêu cực hơn điều tích cực? | Ý tưởng | Giữ ở backlog cho đến khi hoàn thành một chủ đề đang có nền mạnh hơn |

Các bài K1–K9 của Rhythm Knowledge là tài liệu lịch sử đang tạm dừng, không nằm trong nhóm cần hoàn thành tiếp lúc này.

### 4.3. Tài sản Facebook chưa xác minh

Repo có nhiều thư mục bài/ảnh Facebook, nhưng chưa có bằng chứng đủ để ghi `Đã đăng`. Cần owner bổ sung một trong hai:

- ngày đăng và đường dẫn bài thật;
- xác nhận rõ bài nào đã đăng.

Sau đó cập nhật cùng một dòng trong `KNOWLEDGE_CONTENT_INVENTORY.vi.md`.

### 4.4. Kho quote khoảng 5.000 dòng

#### Số liệu hiện nhìn thấy

Baseline Q0 mới trong `studio/review-matrix/data.json` ghi:

| Lớp dữ liệu | Số lượng | Cách hiểu |
|---|---:|---|
| Tổng dòng hợp nhất | 5.470 | Có thể gồm research provenance, raw capture, canonical và Release; không phải 5.470 quote production duy nhất |
| Research source rows | 2.039 | Dòng nghiên cứu có nguồn trong workbook/corpus |
| Supplemental raw captures | 2.989 | Thu thập bổ sung, còn cần chuẩn hóa và xác minh |
| Canonical Authoring quotes | 1.844 | Quote đã vào nguồn Authoring ở revision 81 |
| Release quotes | 318 | Quote đã Release ở revision 43 |
| Excluded/not Authoring | 3.626 | Dòng bị loại, trùng, chưa đủ điều kiện hoặc chỉ giữ làm provenance |

Matrix đã được đồng bộ tại Q0 và có trường thời gian/revision. Khi Authoring hoặc Release đổi, phải rebuild trước khi tiếp tục dùng số liệu để ra quyết định.

Ngoài ra, `daily-content-review.py status` hiện báo 1.432 item đều ở trạng thái `imported`. Trạng thái này không phản ánh AI ledger và matrix. Đây là lỗi quản trị dữ liệu cần xử lý ở Q0; nếu không, owner review xong vẫn có nguy cơ dashboard khác không biết quyết định đó.

#### Trạng thái review hiện có

Trong 5.465 dòng của matrix cũ:

- 2.805 dòng còn `collection_review_pending`;
- 1.224 dòng `ready_for_owner_review`;
- 98 dòng trong `release_shortlist`;
- 193 dòng cần xác minh nguồn;
- 83 dòng bị chặn nguồn/quyền;
- 40 dòng cần review cùng story;
- 23 dòng không đạt vòng một;
- 3 dòng cần biên tập;
- 996 dòng chưa có trạng thái review thống nhất.

AI review ledger riêng có 1.577 quyết định, gồm 1.419 dòng chờ owner review. Số này khác 1.224 trong matrix vì dashboard chưa được tạo lại cùng revision. Không dùng hai số thay thế cho nhau cho đến khi đồng bộ.

#### Mục tiêu đã chốt

> Review toàn bộ corpus và đưa **tất cả quote đủ điều kiện** lên Release.

“Đủ điều kiện” nghĩa là:

1. là một quote/câu diễn giải canonical duy nhất, không phải dòng provenance hoặc bản trùng;
2. văn bản và bản dịch/diễn giải được kiểm tra;
3. tác giả, tác phẩm, vị trí nguồn và mức xác minh đủ rõ;
4. quyền sử dụng phù hợp;
5. nội dung đứng độc lập, dễ hiểu và đúng tinh thần Selflo;
6. theme/tag được phân loại;
7. không tạo claim sai hoặc gán sai tác giả;
8. owner đã duyệt;
9. vượt qua schema, semantic và Release gate.

Những dòng trùng, không truy nguồn được, quyền không phù hợp hoặc chất lượng yếu phải được đánh dấu kết luận rõ và giữ ngoài Release. Đó vẫn được tính là **đã review xong**, không phải backlog bị bỏ quên.

#### Cách chia chương trình quote

| Giai đoạn | Việc cần làm | Đầu ra nghiệm thu |
|---|---|---|
| Q0 — Đồng bộ baseline | Tạo lại Review Matrix và đối chiếu workbook/canonical/Release | Một bộ số liệu không mâu thuẫn, có ngày và revision |
| Q1 — Chuẩn hóa corpus | Nhận diện bản trùng, dòng provenance, quote thật và bản diễn giải Selflo | Mỗi dòng có identity và disposition rõ |
| Q2 — Phân loại chủ đề | Xử lý 3.050 dòng `unresolved`; đo coverage/gap theo theme | Không còn dòng đủ điều kiện mà thiếu theme; có báo cáo theme thiếu |
| Q3 — Xác minh nguồn/quyền | Kiểm tra tác giả, tác phẩm, locator, bản dịch và rights | Mỗi candidate có source/rights verdict; blocker được ghi rõ |
| Q4 — Review nội dung | AI review hỗ trợ, sau đó owner review theo batch | Approve/edit/reject có lý do cho từng quote |
| Q5 — Bổ sung độ phủ | Chỉ nghiên cứu thêm sau coverage audit | Danh sách nguồn cần thêm theo theme, không thu thập đại trà |
| Q6 — Release theo đợt | Promote các quote đạt gate, kiểm tra web/app | Release manifest, audit report và rollback point cho từng đợt |
| Q7 — Đóng chương trình | Đối chiếu toàn bộ 5.465 dòng | Mỗi dòng có kết luận cuối; không còn trạng thái mơ hồ |

Không nên chờ review xong toàn bộ mới Release một lần. Nên phát hành theo các đợt nhỏ đã khép kín nguồn/quyền để dễ kiểm tra và rollback.

## 5. Những phần chưa nên mở rộng lúc này

- Không mở thêm nhiều topic Mê cung kiến thức trước khi hoàn thành và test một topic.
- Không tạo thêm proposal content type trước khi quyết định số phận của `Phân tích` và `Series` hiện có.
- Không viết tiếp K1–K9 hoặc mapping Rhythm → Knowledge.
- Không bulk-promote story chỉ vì Authoring đang nhiều hơn Release.
- Không coi Website Preview là công cụ publish; Release vẫn phải qua canonical source, validation và owner approval.

## 6. Thứ tự đề xuất để dọn hết phần dang dở

1. **Đồng bộ dashboard:** tạo lại Review Matrix để số liệu theo dõi đúng với Authoring/Release hiện tại.
2. **Dọn hàng content:** review 46 story Authoring-only theo batch nhỏ, quyết định bài nào sửa, giữ hoặc release.
3. **Chốt một Knowledge content:** ưu tiên nhóm so sánh xã hội/ghen tị vì đã có phân tích và hai draft.
4. **Hoàn thiện một prototype Knowledge:** chỉ sau khi bài content đã chạm, dùng chính bài đó hoặc tiếp tục Thái cực để test Mê cung kiến thức.
5. **Chốt vai trò Studio Website Preview:** bổ sung trạng thái feature, tiêu chí nghiệm thu và quy trình đề xuất public.
6. **Đóng hoặc tiếp tục các proposal:** kiểm tra Story Reader metadata; sau đó mới quyết định `Phân tích` và `Series`.

## 7. Tiêu chí xem repo đã “gọn” trở lại

- README dẫn đúng tới một bảng trạng thái chung và một sổ Knowledge.
- Review Matrix khớp manifest hiện tại.
- Mỗi story Authoring-only có quyết định: sửa, chờ, loại hoặc release.
- Mỗi feature thử nghiệm có owner, mục tiêu, trạng thái và đúng một bước tiếp theo.
- Không có feature bị hiểu nhầm là production chỉ vì đã có trang trong Studio.
- Mọi nội dung public đều đi qua canonical source, review và Release gate.

## 8. Backlog PM hợp nhất

### Quy ước ưu tiên

- `P0`: phải xử lý để số liệu/quy trình đáng tin hoặc để tiếp tục công việc khác.
- `P1`: giá trị chính đang được ưu tiên hoàn thành.
- `P2`: nên làm sau khi P0/P1 ổn định.
- `P3`: giữ ý tưởng, chưa cam kết lịch làm.

### Danh sách quản lý

| Mã | Hạng mục | Ưu tiên | Trạng thái | Phụ thuộc | Điều kiện hoàn thành |
|---|---|---:|---|---|---|
| PM-001 | Đồng bộ Review Matrix | P0 | Hoàn thành 2026-10-12 | Không | Matrix khớp Authoring 81/Release 43; có baseline và kiểm tra |
| PM-002 | Review quote corpus — fast lane | P0 | Hoàn thành 2026-10-13 | PM-001 | 5.470/5.470 đã scan; 313 candidate mới qua gate; Release 45 có 656 quote; 4.814 tạm bỏ qua |
| PM-003 | Phân loại 3.050 dòng chủ đề chưa rõ | Backlog | Audit xong; normalization hoãn | PM-001, taxonomy | Chỉ mở lại theo nhu cầu coverage |
| PM-004 | Xác minh nguồn và quyền quote | Backlog | Có routing 485 source groups; hoãn phần cần verify lâu | PM-001 | Không quote Release nào còn nguồn/quyền mơ hồ |
| PM-004A | Hợp nhất nguồn trạng thái review quote | P0 | Chưa làm | PM-001 | CLI, ledger, matrix và Studio hiển thị cùng lifecycle/decision |
| PM-005 | Review 46 story Authoring-only | P1 | Đang dở | Dashboard đúng | Mỗi story có quyết định sửa/chờ/loại/release |
| PM-006 | Hoàn thành một bài Knowledge | P1 | Parked sau pilot spec-driven | Mở session content riêng; owner chọn hướng tại `content-workspace/social-comparison-envy-v1-2026-10-13/OWNER_DECISION_PACK.md` | Một bài được owner đọc và chốt nội dung trước khi product hóa |
| PM-007 | Mê cung kiến thức | P2 | Prototype; tạm chưa mở rộng | PM-006 hoặc một topic được chốt | Một đường đọc hoàn chỉnh, source-reviewed và user-tested |
| PM-008 | Studio → web công khai + Knowledge Reader | P1 | S2 hoàn thành; chờ thảo luận feature tiếp theo | So sánh vị trí của Phân tích trước khi viết spec UI; không mặc định đặt trong Góc nhìn | Studio có Website/Developer tabs, shared implementation với public, feature lifecycle và Knowledge Reader; public chỉ nhận phần đã Release, có gate/audit/rollback |
| PM-009 | Chuyển động/hoạt ảnh website | P1 | Thiếu brief; cần khôi phục phạm vi | Owner xác nhận màn hình/ý tưởng cũ | Brief + prototype + kiểm tra mobile/hiệu năng/giảm chuyển động + owner duyệt |
| PM-010 | Phân tích nội dung thành public content | P2 | Thử nghiệm | Quyết định mô hình content ghép | Chốt public/không public; có contract và consumer nếu public |
| PM-011 | Series câu chuyện | P3 | Đề xuất, chờ content | Nội dung 10 tập và app/web contract | Series thật hoạt động end-to-end hoặc quyết định đóng |
| PM-012 | Story Reader metadata | P1 | Cần xác minh đóng | Schema/publisher/web/app | Bằng chứng tất cả consumer/gate đồng bộ; proposal đổi trạng thái hoàn thành |
| PM-013 | Tài sản Facebook | P2 | Chưa xác minh | Owner cung cấp link/xác nhận | Mỗi asset có trạng thái đã đăng/chưa đăng và liên kết bài gốc |
| PM-014 | Rhythm → Knowledge | — | Tạm dừng có chủ đích | Điều kiện ADR-0002 | Chỉ mở lại khi Knowledge inventory và Check-in input đủ |
| PM-015 | Dọn tài liệu và dữ liệu cũ | P2 | Đang dở | PM-001 | File status không mâu thuẫn; tài liệu lịch sử được đánh dấu rõ |
| PM-016 | Đóng hàng đợi Human Agency còn lại | P1 | Nghiên cứu xong, owner queue còn mở | PM-001, PM-002 | Candidate/edit/duplicate/gap còn hiệu lực được nhập backlog mới hoặc đóng có lý do |
| PM-017 | Thái Cực và phương pháp vấn–đáp | P2 | Đã lưu research intake + seed; chưa source-review | Owner chọn một câu hỏi trung tâm | Một research package có locator, evidence-against và một draft được owner đọc; không tự Release |
| PM-018 | Đa dạng giọng viết và cách kể | P2 | Đã lưu, chờ thảo luận | Chọn 4–6 story Release và chốt các chiều audit | 16 story Release được audit theo cách kể/giọng/lập luận/nhịp/kết; khoảng trống và profile được owner chấp nhận |

### Snapshot content 2026-10-15

- Review Matrix hiện ghi Authoring revision **84**, Release revision **45**.
- Quote: **1.850 Authoring**, **656 Release**, **1.194 Authoring chờ Release** trên tổng **5.470** dòng hợp nhất.
- Story: **62** tổng trong matrix, gồm **16 Release** và **46 Authoring-only**.
- `daily-content-review.py status` báo **1.438 imported**; nguồn trạng thái này vẫn chưa thống nhất với Review Matrix, nên PM-004A còn mở.
- Knowledge inventory hiện xác nhận **2 Knowledge/Insight Release** và **3 Story/Góc nhìn Release**; đây là phân loại theo sổ Knowledge, không thay thế số story/quote toàn library.

## 9. Các quyết định đã chốt

| Quyết định | Trạng thái | Ghi chú |
|---|---|---|
| Release chỉ lấy nội dung qua canonical source và gate | Đã chốt | Không sửa tay Authoring/Release |
| Owner là người duyệt cuối | Đã chốt | AI review không thay owner acceptance |
| Review toàn bộ quote corpus | Đã chốt mục tiêu | Chỉ Release mọi quote đủ điều kiện, không Release mọi dòng raw |
| Bổ sung quote theo khoảng trống chủ đề | Đã chốt nguyên tắc | Coverage audit đi trước thu thập mới |
| Rhythm → Knowledge | Đã chốt tạm dừng | Theo ADR-0002 |
| Mê cung kiến thức | Đã chốt là prototype | Chưa public, chưa mở rộng hàng loạt |
| Studio và web công khai | Đã chốt kiến trúc dev → production | Studio là môi trường đầy đủ; web công khai là tập con đã Release từ cùng hệ thống, không xây hai bản song song và không có đường publish tắt |

## 10. Điểm chưa xác định cần owner bổ sung

### Chuyển động/hoạt ảnh website

Trong phạm vi repo hiện tại, chưa tìm thấy tài liệu riêng mô tả feature animation, asset Lottie/Rive, branch/stash liên quan hoặc checklist nghiệm thu. Chỉ thấy:

- hiệu ứng hover/loading/reveal nhỏ trong CSS và JavaScript;
- các layout/mockup tĩnh của public website;
- không có backlog nói rõ animation nào còn thiếu.

Vì vậy PM-009 được ghi là `Thiếu brief; cần khôi phục phạm vi`, không tự suy đoán rằng các hiệu ứng nhỏ hiện có chính là feature owner đang nhắc. Khi owner chỉ ra màn hình hoặc mô tả chuyển động mong muốn, cần ghi ngay vào backlog này trước khi tiếp tục code.
