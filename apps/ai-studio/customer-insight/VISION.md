# Customer Insight — Vision & Knowledge

2026-11-27 · Phân tích nền tảng từ cuộc trao đổi, không phải tài liệu nghiệp vụ đã được doanh nghiệp xác nhận. Không có kinh nghiệm vận hành trực tiếp; các ví dụ là giả lập.

## 1. Bản chất bảo hiểm nhân thọ

Bảo hiểm khác bán lẻ: nhu cầu có thể chưa được nhận thức rõ, giao dịch ít, vòng đời hàng chục năm, giá trị bảo vệ trước rủi ro tương lai. Người mua (PO), người được bảo hiểm (LA), người thụ hưởng (BEN) và đại lý có vai trò khác nhau. Sở hữu sản phẩm không chứng minh khách hàng yêu thích hoặc cần sản phẩm đó.

## 2. Agent-driven và Customer-driven

Đại lý có thể thúc đẩy giao dịch thông qua tư vấn, chuyên môn sản phẩm, hoa hồng và chỉ tiêu; nhu cầu thực của khách hàng vẫn có thể cùng tồn tại. Ví dụ giả lập: hai nhóm khách tương đồng, Agent A bán 80% sức khỏe và 20% tích lũy, Agent B bán 20% sức khỏe và 80% tích lũy. Model X-Sell có thể học hành vi bán của Agent thay vì nhu cầu. Selection bias, confounding và exposure bias: không mua có thể do chưa được giới thiệu. Không suy diễn quan hệ nhân quả từ tương quan.

## 3. Từ Data đến Intelligence

Data: đóng phí trễ ba lần. Information: có hai hợp đồng hiệu lực. Analytics: tần suất trễ tăng. Insight: dấu hiệu khó khăn duy trì nghĩa vụ, cần xác minh nguyên nhân. Intelligence: lựa chọn hỗ trợ phù hợp, đo kết quả và học lại. Dashboard nhiều biểu đồ hoặc AUC cao không đồng nghĩa với hiểu khách hàng. Phân biệt sự thật, giả thuyết và điều chưa biết.

## 4. Vì sao ngành bảo hiểm cần Customer Insight?

Càng phụ thuộc đại lý càng cần hiểu giới hạn dữ liệu, không chỉ bán thêm. Sáu mục tiêu: Customer Understanding (identity, PO/LA/BEN); Customer Protection (phạm vi bảo vệ); Retention (duy trì); Agent Intelligence (ảnh hưởng tư vấn); Customer Value (giá trị dài hạn); Engagement (quan hệ trực tiếp). Hỗ trợ đại lý phục vụ tốt hơn, không mặc định thay thế đại lý.

## 5. Bốn góc nhìn 360

Customer 360: danh tính, hợp đồng, hành vi, nhu cầu, trải nghiệm. Agent 360: hành vi bán, chăm sóc, chất lượng tư vấn. Protection 360: quyền lợi, phạm vi và khoảng trống tiềm năng. Relationship 360: PO, LA, BEN, Agent, hợp đồng và quan hệ gia đình đã xác minh. Số hợp đồng không đo được mức bảo vệ đầy đủ; cần quyền lợi, số tiền bảo hiểm, nghĩa vụ tài chính, người phụ thuộc và nhu cầu.

## 6. ML: dự báo không phải nhu cầu

X-Sell dự báo khả năng mua trong điều kiện lịch sử, không chứng minh nhu cầu. MA Recapture: giả định MA là maturity, dự báo tái đầu tư khoản đáo hạn, cần xác nhận định nghĩa nghiệp vụ. Churn: nguy cơ khách rời bỏ, không phải nguyên nhân. Lapse: nguy cơ hợp đồng mất hiệu lực, không phải không thích bảo hiểm. CLV: giá trị kinh tế dự kiến, không phải giá trị con người. Uplift: tác động tăng thêm của hành động, cần dữ liệu can thiệp và đối chứng. Ví dụ giả lập: A không tư vấn 75%, có tư vấn 80% (+5 điểm %); B 20% và 80% (+60 điểm %). Cùng propensity nhưng tác động khác nhau; vẫn phải kiểm tra phù hợp.

## 7. Agent Influence Intelligence

Cần customer features (age, tenure, history), agent features (specialization, sales mix), quan hệ customer-agent (duration, interactions), product exposure, response (quan tâm, từ chối, chủ động), treatment/control, post-sale (cancellation, complaint, persistency), nhu cầu được xác nhận. Phân tích sales mix theo agent trong cùng segment, thay đổi persistency khi agent nghỉ, chủ động mua hay được tiếp cận, bán nhiều nhưng hủy/khiếu nại cao, chất lượng danh mục. Kiểm soát khác biệt khách hàng, khu vực, thời điểm và sản phẩm.

## 8. Kiến trúc Customer Intelligence

Customer + Agent + Policy + Interaction signals → Unified Identity, Relationship Graph, Feature Store → Needs, Agent Influence, Protection Gap, Risk, Propensity/Uplift, Value → Decision Intelligence (evidence, eligibility, suitability, consent) → Protect, Retain, Grow → Measurement & Learning (customer outcomes, experiment, feedback). Không tối ưu doanh số đơn thuần; cân bằng kết quả khách hàng và doanh nghiệp.

## 9. Đánh giá V24

Identity, Overview và Lineage đúng hướng kỹ thuật; Customer 360 thiếu nhu cầu và quyền lợi; Relationship thiếu phân tích Agent; Segmentation thiên về hợp đồng; Feature Store thiếu Agent/Interaction; ML thiên về propensity; Next Best Action thiếu điều kiện quyết định. Agent Intelligence, Protection Intelligence và Customer Needs Intelligence chưa có. V24 là prototype, không phải nền tảng hoàn chỉnh.

## 10. Roadmap nghiệp vụ

V25 Insurance Business Framework; V26 Agent 360 & Agent Influence; V27 Protection & Coverage Intelligence; V28 Customer Needs Intelligence; V29 Customer Journey & Interaction; V30 Propensity, Uplift & Decision Intelligence; V31 Customer Outcome Measurement; V32 Premium UI & Integration QA. Đây là roadmap đề xuất, chưa phải tính năng đã triển khai.

## Nguyên tắc phát triển

- Đọc tài liệu này trước khi sửa Customer Insight; kiểm tra yêu cầu mới có phù hợp mục tiêu Protect, Retain, Grow và kết quả khách hàng.
- Phân biệt dữ liệu quan sát, suy luận, giả thuyết và dữ liệu chưa có; không biến score thành nhu cầu hoặc quyết định tự động.
- Không suy diễn quan hệ gia đình từ hợp đồng chung; phân biệt grain customer, policy, agent và role.
- Không dùng dữ liệu thật, tên hoặc hình ảnh nội bộ trên GitHub công khai. Chỉ dùng dữ liệu giả lập/ẩn danh phù hợp.
- Mỗi feature/model cần định nghĩa, grain, snapshot, lineage, giới hạn và bằng chứng; kiểm tra leakage và point-in-time.
- Giữ graph Customer 360 dạng 2D sáng, Relationship Explorer có 3D tùy chọn; ưu tiên responsive, dễ đọc và QA thực tế.
- Không tuyên bố model đã train, causal impact, deployment hoặc QA nếu chưa xác minh. MA là thuật ngữ cần xác nhận.

## Ba câu hỏi định hướng

- Hiểu khách hàng hay chỉ hiểu hợp đồng đã bán?
- Dự báo nhu cầu hay khả năng đại lý bán được sản phẩm?
- Tối ưu doanh số ngắn hạn hay giá trị quan hệ 10–20 năm?
