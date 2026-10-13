# Selflo — Sổ ý tưởng, phân tích và nội dung Knowledge

**Trạng thái:** Sổ theo dõi đang dùng  
**Cập nhật:** 2026-10-12  
**Mục đích:** Một nơi duy nhất để biết hiện có ý tưởng nào, bài phân tích nào, nội dung nào đã hoàn chỉnh, đã chuẩn bị cho Facebook và đã phát hành trong Selflo.

## 1. Cách đọc trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| `Ý tưởng` | Mới có câu hỏi hoặc hướng nội dung, chưa nghiên cứu đủ |
| `Đang nghiên cứu` | Đã có câu hỏi nghiên cứu hoặc nguồn, chưa có bản phân tích hoàn chỉnh |
| `Đã phân tích` | Có bản phân tích nền, nhưng luận điểm/nội dung public chưa được chốt |
| `Bản nháp nội dung` | Đã có bài để đọc thử, chưa được owner chấp nhận |
| `Nội dung hoàn chỉnh` | Bài đã được owner duyệt về nội dung |
| `Đã chuẩn bị Facebook` | Có bài/ảnh trong thư mục Facebook; không tự khẳng định đã đăng nếu repo không có bằng chứng |
| `Đã phát hành Selflo` | Nội dung có mặt trong manifest Release hiện hành của Selflo |
| `Tạm dừng` | Giữ để tham khảo, không tiếp tục trong hướng hiện tại |

Một chủ đề có thể có nhiều trạng thái ở các đầu ra khác nhau, ví dụ bài đã phát hành Selflo nhưng việc đăng Facebook chưa được xác minh.

## 2. Nội dung đã hoàn chỉnh hoặc đã phát hành

| Chủ đề | Dạng hiện có | Phân tích | Nội dung hoàn chỉnh | Facebook | Selflo Release | Nơi lưu |
|---|---|---:|---:|---:|---:|---|
| Vì sao có những câu ta dễ hỏi AI hơn hỏi một người? | Knowledge/Insight | Có research nguồn | Có | Đã chuẩn bị; chưa xác minh đã đăng | Có | `research/topics/ai-human-interaction/`, `perspective-library/source/vi/stories/why-ai-feels-easier-to-ask/`, `content-workspace/curated/facebook-post/20261002_AIask/` |
| Nếu tôi sai, nhưng ChatGPT lại đồng ý với tôi thì sao? | Knowledge/Insight | Có companion analysis | Có | Đã chuẩn bị; chưa xác minh đã đăng | Có | `perspective-library/source/vi/stories/if-i-am-wrong-but-chatgpt-agrees/`, `perspective-library/source/vi/analyses/if-i-am-wrong-but-chatgpt-agrees.analysis.vi.json`, `content-workspace/curated/facebook-post/20261008_phan_bien_chatgpt/` |
| Lần cuối làm thay đổi cách ta nhìn giá trị hiện tại như thế nào? | Story/Góc nhìn + phân tích biên tập | Có | Có | Đã chuẩn bị; chưa xác minh đã đăng | Có | `content-workspace/raw/content03_cau_chuyen_lan_cuoi.md`, `perspective-library/source/vi/stories/last-time/`, `perspective-library/source/vi/analyses/last-time.analysis.vi.json`, `content-workspace/curated/facebook-post/20261007_lan_cuoi/` |
| Cùng một ly nước, hai cách nhìn | Story/Góc nhìn | Chưa có research package riêng | Có | Đã chuẩn bị; chưa xác minh đã đăng | Có | `perspective-library/source/vi/stories/half-glass-two-views/`, `content-workspace/curated/facebook-post/20261011_MotLyNuoc_HaiGocNhin/` |
| Cùng một sự việc, hai góc nhìn | Góc nhìn | Chưa có research package riêng | Có | Đã chuẩn bị; chưa xác minh đã đăng | Có | `perspective-library/source/vi/stories/one-event-two-perspectives/`, `content-workspace/curated/facebook-post/20261011_MotSuViec_2GocNhin/` |

## 3. Đã có phân tích hoặc bản nháp, chưa chốt

| Chủ đề | Hiện có | Trạng thái | Thiếu gì để đi tiếp | Nơi lưu |
|---|---|---|---|---|
| Vì sao thành công của người khác đôi khi chạm vào ta? | Bản phân tích về so sánh xã hội, ghen tị, bất công và hạ thấp người khác | Đã phân tích; parked sau pilot spec-driven | Mở session content riêng rồi owner chọn direction trong `content-workspace/social-comparison-envy-v1-2026-10-13/OWNER_DECISION_PACK.md` | `content-workspace/raw/content02_phantichhanhvi_envy.md` |
| Từ “tôi không thích” đến “có gì hay đâu?” | Bài Knowledge/Insight dạng đọc thử | Bản nháp cạnh tranh; chưa canonical | Giữ làm input, không biên tập riêng trước owner direction | `content-workspace/raw/Content 02 — Từ “tôi không thích” đến “có gì hay đâu_”.md` |
| Khi thành công của người khác chạm vào mình | Một bản viết khác cho cùng nhóm envy/comparison | Bản nháp cạnh tranh; direction pack khuyến nghị hợp nhất | Giữ làm input; sau owner decision mới viết một consolidated draft | `content-workspace/raw/content02_ghenti.md` |
| Vì sao người kỳ vọng nhiều có thể buồn hoặc khó chịu hơn? | Một câu hỏi ngắn | Ý tưởng | Làm rõ loại kỳ vọng, cơ chế, nguồn và phạm vi | `content-workspace/raw/contentxx_tai_sao_nguoi_thuong_ky_vong_nhieu_de_dau_kho_hon.md` |
| Một cuộc đời “chỉ cần đủ” nhưng vì sao vẫn phải cố? | Bài dài về khoảng cách giữa điều ta tin và áp lực khi sống bên trong hoàn cảnh | Bản nháp nội dung; đã chuẩn bị Facebook | Xác định đây là Góc nhìn hay Knowledge; kiểm tra trạng thái đăng | `content-workspace/curated/facebook-post/postB-20260930/content.txt` |
| Hai hướng phản ứng trước cùng một sự việc | Định dạng content: cách nghĩ → cảm xúc → hành vi | Ý tưởng định dạng | Cần lý thuyết, nguồn, ví dụ không áp đặt và bài thử | `docs/ideas/content-formats/CONTENT_FORMATS_BACKLOG_2026-10-11.vi.md` |

## 4. Backlog Knowledge về hiểu, học và suy luận

| Ưu tiên cũ | Ý tưởng | Trạng thái hiện tại | Ghi chú |
|---|---|---|---|
| P0 | Vì sao theo được lời giải chưa chắc tự giải được? | Ý tưởng + research queue | Liên quan cảm giác hiểu, tự tạo và khả năng chuyển giao |
| P0 | Làm sao biết mình đang biết hay đang đoán? | Ý tưởng | Tách dữ kiện, suy luận và điều chưa biết |
| P0 | Làm gì khi chưa hiểu ý định của người khác? | Ý tưởng trải nghiệm | Tránh chẩn đoán từ lựa chọn |
| P1 | Vì sao hỏi AI thoải mái hơn hỏi trước lớp? | Đã hoàn chỉnh và đã phát hành Selflo | Xem mục 2 |
| P1 | Kết quả cuối đã che mất quá trình như thế nào? | Ý tưởng | Cần trường hợp thật có nguồn hoặc công bố rõ là hư cấu |
| P1 | Công cụ làm nhanh hơn có lấy mất cơ hội học không? | Ý tưởng | Phân biệt ưu tiên kết quả và ưu tiên luyện năng lực |
| P1 | Tự giải thích có luôn giúp hiểu hơn không? | Ý tưởng + research queue | Cần giới hạn của tự giải thích và kiểm tra bằng ví dụ mới |
| P2 | Vì sao người mới không biết nên hỏi gì? | Ý tưởng | Có thể thành bản đồ câu hỏi |
| P2 | So sánh bản thân và cảm giác ghen tị liên quan gì đến cách diễn giải thông tin? | Đã phân tích + bản nháp | Xem nhóm envy/comparison ở mục 3 |
| P2 | Khi nào ký ức hữu ích, khi nào khiến ta kết luận sớm? | Ý tưởng | Có theory ký ức cảm xúc đã kiểm tra nguồn |

Nguồn backlog: `docs/ideas/understanding/UNDERSTANDING_CONTENT_BACKLOG.vi.md`.

## 5. Backlog Mê cung kiến thức

| Ý tưởng | Trạng thái | Ghi chú |
|---|---|---|
| Đọc thấy hợp lý có phải là đã hiểu? | Có prototype/content workspace | Chủ đề được phát triển nhiều nhất trong Knowledge Maze |
| Làm sao biết điều gì là dữ kiện và điều gì là suy đoán? | Ý tưởng prototype | Có thể nối với tình huống “tin nhắn chưa có lời đáp” nhưng không được suy thành trải nghiệm user |
| Vì sao hỏi AI dễ hơn hỏi trước người khác? | Đã có bài Release | Không cần tạo bài cạnh tranh mới |
| Vì sao kết quả cuối không kể hết quá trình? | Ý tưởng | Cần dữ liệu lịch sử hoặc trường hợp hư cấu minh bạch |
| Công cụ làm nhanh hơn có lấy mất cơ hội học không? | Ý tưởng | Cần research về chuyển giao và đưa việc nhận thức cho công cụ |
| Thái cực là gì? | Ý tưởng Knowledge | Cần chọn phạm vi: lịch sử tư tưởng, văn bản cổ điển, biểu tượng hay ứng dụng hiện đại |
| Lãi kép thực sự hoạt động thế nào? | Ý tưởng Knowledge | Chủ đề thực dụng để thử công thức và ví dụ số |
| Kỳ vọng khác thỏa thuận như thế nào? | Ý tưởng Knowledge | Cần giữ ranh giới giữa kiến thức, góc nhìn và trải nghiệm cá nhân |

Nguồn backlog: `content-workspace/knowledge-maze/TOPIC_BACKLOG.vi.md`.

## 6. Ý tưởng cần bổ sung vào sổ

| Ý tưởng | Trạng thái | Lý do giữ |
|---|---|---|
| Vì sao con người thường chú ý đến điều tiêu cực hơn điều tích cực? | Ý tưởng | Câu hỏi Knowledge rõ; cần phân biệt thiên lệch chú ý, tác động mạnh của thông tin tiêu cực và việc một số tín hiệu tiêu cực có giá trị cảnh báo thật |

## 7. Nền lý thuyết đang có nhưng chưa phải bài Knowledge hoàn chỉnh

### Đã kiểm tra nguồn

- ký ức cảm xúc;
- theo dõi hiện tại và kiểm soát sự chú ý;
- suy nghĩ tiêu cực lặp lại;
- gọi tên cảm xúc;
- nhu cầu thuộc về;
- an toàn trong gắn kết;
- so sánh xã hội;
- lòng trắc ẩn với bản thân;
- tính tự động của thói quen;
- học từ sai sót;
- chấp nhận trải nghiệm;
- phục hồi qua những quá trình bình thường;
- tự quyết trong công việc;
- luyện tập có chủ đích;
- tách khỏi công việc để hồi phục;
- điều hòa giấc ngủ;
- linh hoạt tâm lý và giá trị;
- cảm nhận và tìm kiếm ý nghĩa.

### Chưa kiểm tra nguồn đầy đủ

- xử lý nhanh và cân nhắc;
- diễn giải và phản ứng;
- cơ chế phòng vệ và sự quy chiếu;
- bản sắc tự sự;
- bảo toàn nguồn lực;
- an lành đa thành phần;
- mở rộng và bồi đắp;
- né tránh và sự nhẹ nhõm làm hành vi dễ lặp lại.

Nguồn: `perspective-library/source/vi/knowledge/knowledge.vi.json`. Việc một lý thuyết có trong catalog không có nghĩa đã có bài public.

## 8. Tài sản Facebook chưa xác định đủ nội dung hoặc trạng thái

Các thư mục/tệp sau đang tồn tại nhưng repo chưa đủ thông tin để xác định chắc chủ đề, bài gốc hoặc việc đã đăng:

- `content-workspace/curated/facebook-post/postA-20260930/`;
- `content-workspace/curated/facebook-post/20261011_HaiGocNhin_MotLyNuoc.png`;
- các thư mục Facebook chỉ có ảnh, không có tệp nội dung hoặc đường dẫn bài đăng.

Giữ chúng trong inventory chờ owner xác nhận; không tự gán trạng thái `Đã đăng`.

## 9. Cách cập nhật sổ từ nay

Mỗi ý tưởng mới phải được thêm vào sổ trước khi nghiên cứu dài. Khi trạng thái thay đổi, cập nhật cùng một dòng thay vì tạo một danh sách cạnh tranh.

Các trường tối thiểu cần giữ:

```text
Câu hỏi/chủ đề
→ dạng nội dung dự kiến
→ trạng thái nghiên cứu
→ trạng thái bản phân tích
→ trạng thái bài public
→ Facebook
→ Selflo Authoring/Release
→ đường dẫn nguồn
→ đúng một bước tiếp theo
```

Repo không tự chứng minh một bài đã được đăng lên Facebook. Muốn ghi `Đã đăng Facebook`, cần bổ sung ngày đăng và đường dẫn bài thật hoặc một xác nhận rõ của owner.

## 10. Đề xuất thứ tự làm tiếp

Không nên bắt đầu bằng thu thập dữ liệu rộng cho mọi chủ đề, cũng không nên chọn ngẫu nhiên một chủ đề mới.

Thứ tự phù hợp:

1. Owner review sổ này để bổ sung idea bị thiếu và xác nhận bài Facebook nào đã đăng thật.
2. Chọn một chủ đề đã có nền mạnh nhưng chưa hoàn chỉnh.
3. Viết rõ câu hỏi, người đọc và điều mới họ cần hiểu.
4. Chỉ thu thập nguồn phục vụ đúng câu hỏi đó.
5. Viết một bài để owner đọc; nếu bài không chạm, sửa hoặc dừng trước khi mở chủ đề tiếp theo.

Candidate nên xem trước khi mở chủ đề hoàn toàn mới: nhóm `thành công của người khác / so sánh xã hội / ghen tị`, vì đã có bản phân tích và hai bản nháp. `Thái cực` và `thiên lệch chú ý tới điều tiêu cực` nên giữ ở trạng thái ý tưởng cho đến khi chọn phạm vi và câu hỏi trung tâm.
