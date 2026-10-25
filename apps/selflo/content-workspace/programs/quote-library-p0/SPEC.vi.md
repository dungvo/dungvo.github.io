# Specification — Khép kín 5.471 dòng quote

**Phạm vi:** content-compatible; không đổi app, UI hoặc shared contract. **Owner:** Dũng. **Reviewer:** ai:codex theo policy chương trình.

## Vấn đề và kết quả cần đạt

Corpus có 5.471 dòng nhưng nhiều dòng còn raw/Research/chưa dịch, không thể gọi là hoàn tất chỉ vì có nhãn phân luồng. Owner yêu cầu làm xong phần quote trước, chưa chuyển sang story hoặc feature khác.

### User stories

- US-01: Owner biết từng dòng đã lên Release hay không đạt vì sao, không bị bỏ lại trong hàng chờ vô thời hạn.
- US-02: Người dùng đọc tiếng Việt tự nhiên, tên nguồn nhất quán; vẫn có hồ sơ nguyên bản để kiểm tra.
- US-03: Có thể tiếp tục qua nhiều session theo đợt 100–200 dòng mà không mất dấu hoặc làm lại việc đã đóng.

## Yêu cầu và acceptance

| ID | Yêu cầu | Điều kiện nghiệm thu |
|---|---|---|
| Q-01 | Phạm vi cố định | 5.471 baseline ID duy nhất; không thêm corpus vào mẫu số |
| Q-02 | Một kết luận cuối/dòng | released hoặc not_accepted có bằng chứng; pending=0 khi đóng chương trình |
| Q-03 | Dịch và Việt hóa | Không loại chỉ vì ngoại ngữ; văn bản reader-facing được dịch/biên tập và đối chiếu |
| Q-04 | Tên hiển thị | Ưu tiên tên Việt có cách gọi thông dụng đáng tin cậy; giữ tên gốc/provenance |
| Q-05 | Nguồn/quyền | Truy được tác phẩm/edition/locator và cơ sở quyền trước Release; không suy quyền từ tuổi tác giả |
| Q-06 | Quote đứng độc lập | Dễ hiểu, đúng nghĩa, phù hợp Selflo; không ép mảnh truyện thành quote |
| Q-07 | Khử trùng nguồn/ý | Có canonical winner và duplicate_of; không chỉ so trùng chữ |
| Q-08 | Giữ quyết định đóng | Không tự đưa rejected/exclusion lại hàng review; giữ 10 owner-rejected |
| Q-09 | Phát hành thật | Chỉ đếm released sau publisher, manifest/checksum và public verification |
| Q-10 | Story ngoài phạm vi | Không review/sửa/promote story; quote phụ thuộc story được kết luận cho vai trò quote độc lập |
| Q-11 | Đợt hữu hạn | 100–200 baseline dòng/đợt, mục tiêu 150; từng dòng có review, không bulk-approve |
| Q-12 | Tiếp nối và truy vết | Mỗi batch có ID/hash/evidence/checkpoint; tổng completed+remaining=5.471 |

## Ngoài phạm vi

Không mở rộng nguồn quote mới ngoài baseline; được tra nguồn để xác minh dòng đã có. Không review story, xây UI, mở Knowledge/Series/animation, hoặc migration tooling không cần trực tiếp để khép kín quote.

## 2. Chỉ hai kết luận cuối

- **released:** có canonical ID, đã qua đủ gate, nằm trong manifest Release hiện hành và được kiểm tra trên endpoint công khai.
- **not_accepted:** không đưa vào quote Release trong phạm vi chương trình; có mã lý do, ghi chú và bằng chứng đủ để không tự đề xuất lại.

Trong lúc làm có thể dùng đang dịch/đang xác minh/đang biên tập, nhưng đó là trạng thái tạm, không được tính là xong. Kết thúc không còn ready_for_review, pending, needs_edit, needs_source hoặc “để Research review sau” trong tập baseline.

Mã lý do không đạt tối thiểu:

| Mã | Khi dùng |
|---|---|
| duplicate | Cùng passage/ý với bản canonical được giữ; ghi duplicate_of, không chỉ so trùng chữ |
| context_required | Chỉ hiểu khi đọc story/đoạn trước; không cố bịa thêm ngữ cảnh để thành quote |
| not_reader_quote | Ghi chú biên tập, hướng nghiên cứu, tiểu sử, lời tựa hoặc đoạn không có giá trị độc lập cho người đọc |
| weak_or_misleading | Mơ hồ, sáo rỗng, dễ hiểu ngược, khái quát sai; đã đánh giá khả năng sửa trung thực |
| too_narrow_for_selflo | Quá chuyên biệt, không phù hợp trải nghiệm Selflo |
| source_unverified | Không xác định được tác giả/tác phẩm/đoạn sau bước truy nguồn có ghi nhận |
| rights_not_cleared | Không đủ cơ sở sử dụng tác phẩm, edition hoặc bản dịch; không chờ quyền vô thời hạn trong chương trình |
| translation_not_reliable | Chưa đạt độ tin cậy sau khi đối chiếu; không phải vì bản gốc dùng ngoại ngữ |
| owner_rejected | Owner đã yêu cầu đóng rõ ràng |

“Không đạt” là không đủ điều kiện cho bộ quote này tại thời điểm kết luận; không biến thành tuyên bố tác phẩm sai hoặc nguồn không tồn tại. Giữ nguyên hồ sơ/provenance, không xóa tài sản nghiên cứu. Chỉ mở lại khi owner yêu cầu, không tự đưa vào vòng review tiếp theo.

33 dòng hiện đang held_not_passed cần đối soát lý do và chứng cứ đã lưu; 10 ID owner đã loại ngày 25/10 giữ quyết định đóng, không dịch/sửa để đề xuất lại. Không tự coi 83 blocked_rights hoặc 634 held_research là đã review xong chỉ từ nhãn.

## 3. Chuẩn ngôn ngữ và tên hiển thị

1. Nội dung ngoại ngữ không là lý do loại. Đọc nguồn gốc, tìm ngữ cảnh, tạo bản Việt tự nhiên, đối chiếu lại rồi mới chấm chất lượng.
2. Không dịch sát từng từ nếu làm tối nghĩa; cũng không thêm triết lý hoặc kết luận mà nguồn không có. Nếu là diễn giải, dùng nhãn “Phỏng theo…”/“Selflo · dựa trên…” đúng bản chất.
3. Toàn bộ phần người đọc thấy — thân quote, tiêu đề/phụ đề, nguồn, tên tác phẩm và nhãn chủ đề — dùng tiếng Việt tự nhiên. Không kéo identifier kỹ thuật ra làm nhãn; không đổi stable ID chỉ để Việt hóa.
4. Tên có cách gọi tiếng Việt thông dụng, đã được xác minh, ưu tiên tên Việt: Laozi → Lão Tử; Zhuangzi → Trang Tử; Confucius → Khổng Tử; Mencius → Mạnh Tử. Không tự sáng tạo phiên âm khi chưa có cách gọi được dùng đáng tin cậy; các tên như Marcus Aurelius giữ dạng tên riêng quen dùng.
5. Tên tác phẩm tách khỏi tên người: Dhammapada là Kinh Pháp Cú, không phải tác giả. Không chuyển tên người dịch thành tác giả của câu gốc.
6. Lập bảng tên thống nhất: tên gốc, tên hiển thị Việt, loại người/tác phẩm/truyền thống, nguồn đối chiếu, cách ghi attribution. Không dịch tên khác nhau ở từng batch. Nguồn/bản dịch yêu cầu ghi công người dịch thì vẫn giữ đủ ghi công.
7. Bản gốc Anh/Hoa/Hy Lạp, edition, URL, locator và tên gốc vẫn được giữ ở hồ sơ nguồn để truy vết; không ép dịch metadata nội bộ hoặc URL.
8. Từ chuyên môn chỉ giữ khi cần và có giải nghĩa dễ hiểu; nếu câu thực chất chỉ là định nghĩa chuyên biệt, đánh giá phù hợp thay vì cố giữ vì đã dịch được.

## 5. Quy trình bắt buộc cho từng dòng

1. Resolve ID, alias, các review có sẵn và hash văn bản. Tái sử dụng bằng chứng cũ khi đúng đoạn/bản hiện tại; không coi phân loại từ khóa hoặc báo cáo triage là đã đọc.
2. Đọc đoạn và ngữ cảnh nguồn. Xác minh tác giả, tác phẩm, edition, locator; đối chiếu quyền của nguyên tác và bản dịch dùng làm đầu vào.
3. Dịch/biên tập bản Việt nếu cần; chuẩn hóa tên theo bảng tên. Giữ nguyên bản và phân biệt trích dịch với phỏng theo.
4. Review tính độc lập, ý nghĩa, độ chính xác, độ rộng phù hợp Selflo và trùng cùng passage. Không loại chỉ vì khó dịch; không approve chỉ vì nghe hay.
5. Chọn đúng một kết luận cuối; ghi reviewer ai:codex, ngày, hash trước/sau, nguồn, quyền, lý do và canonical/duplicate ID tương ứng.
6. Câu đạt: sửa canonical, kiểm tra rồi publish qua publisher. Câu không đạt: ghi quyết định đóng ở ledger và cơ chế chặn tương ứng; nếu đang Release thì gỡ qua publisher. Không sửa tay generated output.
7. Rebuild Review Matrix, kiểm tra CLI/Studio và manifest/checksum. Xác nhận public cho quote lên Release trước khi tính released. Nếu triển khai chưa xong thì batch chưa đóng.

Với tìm nguồn khó: ghi nhận lượt truy nguồn gốc và ít nhất một đường đối chiếu đáng tin cậy khi có thể. Nếu không tìm được locator/quyền sau các đường phù hợp, kết luận chưa đủ bằng chứng cho Release này với lý do cụ thể. Không lặp vô hạn và không bỏ qua xác minh chỉ để đủ tiến độ.

## 6. Không kéo story trở lại backlog đang làm

Không đọc duyệt, viết lại hoặc promote 46 story Authoring-only. Quote liên kết story vẫn được xét độc lập:

- Nếu tự đứng được: xử lý quote-only theo contract hiện có, không promote story chưa được owner đọc; chỉ giữ liên kết public khi story đã Release và hợp lệ.
- Nếu phụ thuộc story: kết luận not_accepted/context_required cho vai trò quote độc lập; giữ provenance/liên kết nghiên cứu. Không mở một nhánh “chờ review story” để né việc đóng quote.
- Không xóa hoặc đổi quyết định đối với bản thân story. Khi owner quay lại đọc story sau này, đó là phạm vi riêng.


## Định nghĩa hoàn thành chương trình

Đủ Q-01–Q-12; released+not_accepted=5.471; remaining=0; không còn approved chưa publish hoặc chờ dịch/nguồn/story. Toàn bộ phần được chấp nhận nằm trên Release public và owner có báo cáo/sample nghiệm thu cuối. AI đọc từng dòng, owner không bị yêu cầu đọc lại cả corpus. Chi tiết lịch và gate nằm trong PLAN.vi.md.
