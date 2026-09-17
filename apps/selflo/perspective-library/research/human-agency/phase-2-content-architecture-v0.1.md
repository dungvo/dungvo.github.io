# Kiến trúc nội dung Selflo phiên bản 0.1

Trạng thái: Bản dùng để kiểm chứng trên lát cắt 25%  
Ngày: 2026-09-17  
Phạm vi: Tầng nghiên cứu, chưa phải hợp đồng dữ liệu dùng khi sản phẩm vận hành

## Mục đích

Kiến trúc này giúp trả lời năm câu hỏi khác nhau về một nội dung:

1. Người đọc có thể đang đối diện hoàn cảnh nào?
2. Nội dung trực tiếp nói về điều gì?
3. Nội dung có thể hỗ trợ năng lực nào của con người?
4. Nội dung mời người đọc thay đổi sự chú ý, cách nhìn hoặc lựa chọn theo hướng nào?
5. Góc nhìn đến từ dòng tri thức hoặc nguồn biên soạn nào?

Năm câu hỏi này không được gộp thành một danh sách nhãn phẳng.

## Quy tắc chung

- Phân loại ý nghĩa của nội dung, không suy diễn trạng thái thật của người dùng.
- Một câu có thể có nhiều nhãn, nhưng chỉ dùng nhãn có bằng chứng trực tiếp từ câu chữ hoặc ngữ cảnh biên tập đã được duyệt.
- Mỗi trục nên có tối đa hai nhãn chính trong giai đoạn kiểm chứng. Nếu thường xuyên cần nhiều hơn, định nghĩa đang quá rộng hoặc nội dung cần được tách ngữ cảnh.
- Không dùng chủ đề hiện tại để suy ra năng lực được hỗ trợ.
- Không dùng loại nội dung để suy ra dòng tri thức.
- Không xem điểm độ sâu là thước đo giá trị tuyệt đối. Một lời nhắc đơn giản vẫn có thể phù hợp khi người đọc đang quá tải.
- Khi không đủ bằng chứng, ghi `chưa_xác_định` và đưa vào hàng đợi xem xét; không đoán.

## Trục 1 — Hoàn cảnh con người

Hoàn cảnh mô tả tình thế mà nội dung có thể trở nên liên quan. Nó không tuyên bố người đọc đang thật sự ở trong tình thế đó.

| Nhãn | Định nghĩa | Đưa vào khi | Không đưa vào khi |
|---|---|---|---|
| `quá_tải` | Nhiều yêu cầu cùng lúc vượt quá khả năng xử lý hoặc năng lượng hiện có | câu nói về quá nhiều việc, quá nhiều kích thích hoặc sức chứa hữu hạn | chỉ có một việc khó nhưng không có dấu hiệu quá tải |
| `xao_lãng` | Sự chú ý rời khỏi điều đang hiện diện hoặc điều thực sự quan trọng | câu đối chiếu màn hình, người khác, quá khứ hoặc tương lai với điều trước mắt | nội dung chỉ nói chung về nghỉ ngơi |
| `do_dự` | Có lựa chọn nhưng khó quyết định giữa các hướng | có nhiều đường đi, giá trị hoặc điều phải đánh đổi | chỉ chưa biết kết quả nhưng không có lựa chọn rõ |
| `bất_định` | Kết quả hoặc ý nghĩa của sự việc chưa thể biết chắc | câu giữ lại điều chưa biết hoặc cảnh báo việc kết luận quá sớm | chỉ nói về khó khăn đã rõ nguyên nhân và kết quả |
| `thất_bại` | Một hành động, nỗ lực hoặc kết quả không đạt điều mong muốn | có sai sót, vấp ngã, kết quả không thành | chỉ có khó khăn chưa dẫn đến thất bại |
| `mất_mát` | Một người, vật, vai trò hoặc khả năng có ý nghĩa không còn như trước | câu trực tiếp đối diện sự vắng mặt hoặc kết thúc | chỉ nói về thay đổi nói chung |
| `thay_đổi` | Hoàn cảnh, vai trò, phương pháp hoặc bản thân đang chuyển dịch | trọng tâm nằm ở chuyển hướng, thích nghi hoặc lớn lên | chỉ là dao động cảm xúc ngắn hạn |
| `khủng_hoảng_bản_sắc` | Thước đo từng dùng để hiểu giá trị bản thân không còn phù hợp | câu hỏi mình là ai, có ích thế nào hoặc còn giá trị gì | chỉ có so sánh nhất thời với người khác |
| `mâu_thuẫn_quan_hệ` | Có tổn thương, bất đồng hoặc giằng co giữa người với người | câu nói về đáp trả, tha thứ, ranh giới hoặc bất đồng | chỉ nói về sự đồng hành không có mâu thuẫn |
| `cô_đơn` | Thiếu cảm giác được nhìn thấy, thuộc về hoặc đồng hành | sự vắng kết nối là trọng tâm | chỉ ở một mình để nghỉ ngơi hoặc suy nghĩ |
| `so_sánh` | Đánh giá bản thân hoặc cuộc sống bằng đường đi, thước đo của người khác | câu trực tiếp đặt mình cạnh người khác | chỉ học hỏi phẩm chất tốt của người khác |
| `cạn_năng_lượng` | Cơ thể hoặc tinh thần cần hồi phục, giới hạn sức lực trở thành trọng tâm | câu nói về mệt, nghỉ, nhịp cơ thể hoặc sức chứa | quá tải nhận thức nhưng chưa có yếu tố hồi phục |
| `áp_lực_công_việc` | Công việc chiếm quá mức sự chú ý, giá trị bản thân hoặc thời gian nghỉ | ranh giới, hiệu suất, tay nghề hoặc kỳ vọng nghề nghiệp là trọng tâm | công việc chỉ là bối cảnh phụ |
| `tìm_ý_nghĩa` | Người đọc đang cân nhắc điều gì đáng sống, theo đuổi hoặc gìn giữ | câu nói về giá trị, mục đích hoặc ý nghĩa vượt khỏi kết quả trước mắt | chỉ động viên hoàn thành nhiệm vụ |
| `tổn_thương_cảm_xúc` | Cảm xúc khó chịu còn tác động hoặc được hoàn cảnh làm lộ ra | câu mô tả dư âm, vết thương hoặc phản ứng cảm xúc | chỉ là một nhận xét triết học không có trải nghiệm cảm xúc |
| `hồi_phục` | Một quá trình trở lại cân bằng sau khó khăn hoặc tổn thương | câu nhấn mạnh độ trễ, nhịp hoặc sự phục hồi | chỉ kêu gọi tiếp tục tiến lên mà không có quá trình hồi phục |

## Trục 2 — Chủ đề

Chủ đề là mô tả ngắn về điều câu chữ trực tiếp nói tới. Trong phiên bản 0.1, đây là danh sách mở nhằm quan sát ngôn ngữ tự nhiên của thư viện trước khi chuẩn hóa.

Quy tắc:

- dùng danh từ hoặc cụm danh từ ngắn bằng tiếng Việt;
- tối đa ba chủ đề;
- không dùng tên năng lực làm chủ đề nếu câu chữ không trực tiếp nói tới năng lực đó;
- không dùng tên trường phái làm chủ đề; trường phái thuộc dòng tri thức;
- hợp nhất từ đồng nghĩa trong bước đối chiếu, không tự động hợp nhất khi đang đánh giá.

## Trục 3 — Năng lực được hỗ trợ

Năng lực mô tả khả năng con người mà nội dung có thể nuôi dưỡng. Đây không phải tuyên bố rằng chỉ cần đọc nội dung thì năng lực đã tăng.

| Nhãn | Định nghĩa | Dấu hiệu đưa vào | Ví dụ phản chứng |
|---|---|---|---|
| `sự_hiện_diện` | giữ sự chú ý ở trải nghiệm đang xảy ra | mời nhận ra hiện tại, cơ thể hoặc điều ở gần | một mệnh lệnh làm việc hiệu quả hơn |
| `hiểu_mình` | nhận ra nhu cầu, giới hạn, khuôn mẫu hoặc cách mình đang nhìn sự việc | nội dung giúp gọi tên điều bên trong hoặc thước đo mình đang dùng | một lời khuyên chung áp dụng giống nhau cho mọi người |
| `nhận_biết_cảm_xúc` | nhận ra cảm xúc, dư âm và quan hệ giữa sự việc với cách diễn giải | cảm xúc được quan sát thay vì chỉ bị loại bỏ | câu yêu cầu gạt bỏ ngay cảm xúc hoặc ý nghĩ khó chịu |
| `mở_rộng_góc_nhìn` | thấy thêm một cách hiểu hợp lý ngoài cách hiểu ban đầu | có đổi khung nhìn, nghịch lý hoặc đối chiếu nhiều mặt | thay một kết luận cứng bằng một kết luận cứng khác |
| `phán_đoán_độc_lập` | tự đánh giá bằng lý do, giá trị và bối cảnh thay vì nhận kết luận sẵn | nội dung giữ lại câu hỏi, tiêu chuẩn hoặc trách nhiệm đánh giá | chỉ bảo người đọc phải chọn phương án nào |
| `chịu_đựng_bất_định` | sống và hành động khi kết quả chưa rõ mà không vội ép thành chắc chắn | giữ lại điều chưa biết hoặc trì hoãn kết luận tốt/xấu | khẳng định chắc rằng mọi chuyện rồi sẽ tốt đẹp |
| `làm_rõ_giá_trị` | nhận ra điều gì đáng giữ vai trò phương hướng | phân biệt hướng đi với bước đi, giá trị với kết quả | chỉ nói về phần thưởng hoặc thành công |
| `quyền_tự_chủ` | giữ quyền lựa chọn và hành động thuộc về người đọc | mở lại lựa chọn, làm rõ điều phải đánh đổi, để ngỏ cách hành động | thúc đẩy hành động nhưng đã quyết định sẵn mục tiêu cho người đọc |
| `sức_bền` | tiếp tục, thích nghi hoặc hồi phục trước khó khăn | đặt khó khăn vào tiến trình dài hơn hoặc chia nhỏ bước đi | phủ nhận mệt mỏi và chỉ yêu cầu cố gắng hơn |
| `biết_đủ` | nhận ra giới hạn, mức vừa đủ hoặc giá trị không phụ thuộc tối đa hóa | chấp nhận sức chứa hữu hạn hoặc đặt lại thước đo hữu ích | dùng “đủ” để hợp thức hóa né tránh trách nhiệm |
| `kết_nối` | hiện diện, đồng hành và nhìn người khác như một chủ thể | lắng nghe, cùng bước, trân trọng hoặc không gây tổn hại | chỉ quản lý hành vi người khác để đạt mục tiêu của mình |
| `trách_nhiệm` | nhận phần lựa chọn, hành động và hậu quả thuộc về mình | tập trung vào cách mình ứng xử thay vì kiểm soát người khác | tự nhận lỗi cho điều hoàn toàn nằm ngoài quyền kiểm soát |

## Trục 4 — Chuyển động suy ngẫm

Chuyển động mô tả lời mời nhận thức mà nội dung tạo ra, không phải hành vi mà hệ thống bắt người đọc thực hiện.

| Nhãn | Từ trạng thái | Đến lời mời |
|---|---|---|
| `chậm_lại` | phản ứng hoặc tiêu thụ liên tục | tạo một khoảng trước phản ứng tiếp theo |
| `nhận_ra` | điều quan trọng chưa được chú ý | nhìn thấy nó rõ hơn |
| `gọi_tên` | trải nghiệm mơ hồ | diễn đạt được giới hạn, cảm xúc hoặc giằng co |
| `đặt_lại_giả_định` | một tiền đề đang được coi là hiển nhiên | xem tiền đề đó có thật sự đúng không |
| `đổi_khung_nhìn` | một cách hiểu đang chi phối | thử một cách đặt vấn đề khác |
| `giữ_hai_mặt` | buộc phải chọn ngay một kết luận đơn giản | giữ đồng thời hai mặt có thể cùng đúng |
| `phân_biệt_kiểm_soát` | trộn lẫn điều mình làm được và không làm được | trở về phần thuộc trách nhiệm của mình |
| `chấp_nhận_giới_hạn` | chống lại sức chứa hoặc điều kiện hữu hạn | thừa nhận giới hạn mà không tự hạ thấp giá trị |
| `làm_rõ_giá_trị` | nhiều mục tiêu kéo theo các hướng khác nhau | nhận ra điều nên giữ vai trò phương hướng |
| `lựa_chọn` | các khả năng còn mở nhưng chưa có cam kết | tự chọn một hướng mà không giả vờ chắc chắn tuyệt đối |
| `buông` | tiếp tục giữ phương pháp, kết luận hoặc gánh nặng không còn phù hợp | cho phép nó rời đi |
| `kết_nối_lại` | xa cách bản thân, người khác hoặc đời sống gần bên | trở lại quan hệ và sự hiện diện |
| `hành_động` | hiểu nhưng chưa chuyển thành bước đi | chọn một bước trong khả năng hiện tại |

## Trục 5 — Dòng tri thức

Dòng tri thức phải lấy từ nguồn gốc đã được ghi nhận, không suy ra từ giọng văn.

Các nhóm tạm thời:

- `câu_gốc_selflo`;
- `đạo_gia`;
- `khắc_kỷ`;
- `phật_giáo`;
- `nho_gia`;
- `nguồn_văn_học`;
- `ngụ_ngôn_truyền_thống`;
- `tâm_lý_học`;
- `bản_thảo_xưởng_truyện`;
- `nguồn_chủ_sở_hữu_cung_cấp`;
- `chưa_xác_định`.

Nếu một bản ghi có loại `minh_triết_chuyển_thể` nhưng không có tác giả, tác phẩm hoặc nguồn rõ ràng, dùng dòng tri thức phù hợp với hồ sơ nguồn hiện có hoặc `chưa_xác_định`; không tự gán trường phái từ nội dung.

## Các trường chỉ dành cho nghiên cứu

Những trường sau chưa được phép đưa vào nội dung gốc hoặc dùng trực tiếp để xếp hạng khi sản phẩm vận hành:

- độ sâu suy ngẫm;
- mức độ tôn trọng quyền tự chủ;
- độ mở diễn giải;
- nguy cơ sáo mòn;
- độ chắc chắn khi phân loại;
- ghi chú mơ hồ;
- đề xuất giữ, điều chỉnh, giảm ưu tiên hoặc tạo mới.

Chúng là nhận định biên tập cần được xem xét, không phải sự thật cố định của nội dung.

## Điều kiện chuyển sang phiên bản 0.2

Phiên bản 0.1 chỉ được điều chỉnh sau khi:

1. đánh giá một lát cắt khoảng 25% từ các câu chưa có trong mẫu 36 câu;
2. ghi lại nhãn không dùng được, nhãn thường đi cùng nhau và nhãn có độ chắc chắn thấp;
3. kiểm tra xem giới hạn hai nhãn mỗi trục có thực tế không;
4. xem xét riêng các ẩn dụ có nhiều cách đọc và các câu mang tính chỉ dẫn;
5. bảo đảm không dùng hệ phân loại để sửa lại ý nghĩa hoặc nguồn gốc của câu trích dẫn.
