# Proposal — Composable Content v1

- **Trạng thái:** Proposed; chưa thay đổi Release wire contract
- **Nguồn định hướng:** Bài ChatGPT, bài “Lần cuối” và nhu cầu mở rộng Knowledge
- **Mục tiêu:** cho phép một chủ đề có nhiều thành phần độc lập nhưng liên kết, không ép mọi nội dung vào Quote → Story → Reflection

## Mô hình biên tập

```text
Selflo Content
│
├── Main Content
│   └── Knowledge / Story / loại content phù hợp
│
├── Deep Dive (Optional)
│   ├── phân tích chuyên sâu
│   ├── nghiên cứu và bằng chứng
│   ├── ví dụ thực tế
│   └── góc nhìn phản biện và giới hạn
│
├── Reflection (Optional)
│   └── câu hỏi giúp người đọc tự quan sát
│
└── Related Content (Optional)
    └── các content liên quan có lifecycle riêng
```

## Nguyên tắc

1. Main Content đứng độc lập và không cần Deep Dive để hiểu được ý chính.
2. Mọi thành phần tùy chọn có stable `content_id`, lifecycle, rights và review riêng khi chúng là content có thể đọc.
3. Liên kết không đồng nghĩa sở hữu: xóa hoặc quarantine một Deep Dive không làm Main Content biến mất.
4. Consumer cũ bỏ qua metadata liên kết mới; đây là điều kiện tương thích ngược.
5. Reflection không bắt buộc. Nó có thể nằm trong Main Content khi gắn chặt với nhịp đọc, hoặc là thành phần riêng khi cần tái sử dụng/trạng thái người dùng.
6. Related Content là quan hệ biên tập có chủ ý, không phải danh sách tự động chỉ vì trùng keyword.

## Hướng dữ liệu ưu tiên

Không tạo production API mới trước khi có nhu cầu vận hành rõ. Hướng đầu tiên cần đánh giá là mở rộng content metadata/index hiện có bằng quan hệ additive:

```json
{
  "relations": [
    {
      "type": "deep_dive",
      "target_content_id": "knowledge.example.deep_dive",
      "order": 1
    }
  ]
}
```

Đây mới là shape minh họa, chưa phải wire contract. Trước khi active cần:

- xác định canonical owner của relation;
- schema và validator chống dangling reference/cycle không mong muốn;
- projection Authoring/Release;
- app/web conformance và fallback;
- lifecycle khi main hoặc target bị archive/quarantine;
- quyết định Deep Dive có searchable/discoverable độc lập hay chỉ mở từ bài chính.

## Trường hợp bài ChatGPT

- Main Content: bài đã chốt theo phương thức Khám phá.
- Deep Dive: vì sao ta thích thông tin thuận niềm tin; phản ứng khi bị phản đối; phân biệt phản biện ý tưởng với phủ nhận giá trị bản thân; giới hạn của ý kiến phản đối.
- Reflection: hai câu hỏi cuối bài hiện là một phần của nhịp bài chính.
- Related Content: chỉ thêm khi có content thực sự bổ sung, không tạo để lấp cấu trúc.

## Trường hợp “Lần cuối”

- Main Content: bài public giữ nhịp cảm xúc và perception twist.
- Deep Dive: khan hiếm, anticipated regret, thời gian hữu hạn, ký ức và cách nhận thức làm thay đổi đánh giá giá trị.
- Mô hình phân tích làm việc: `Sự kiện → Nhận thức → Cảm xúc → Đánh giá giá trị → Hành vi`.
- Không biến mô hình phân tích thành khẳng định quan hệ nhân quả khoa học nếu chưa có bằng chứng tương ứng.

## Quan hệ với Content Analysis v1

`content-analysis.v1` hiện lưu companion analysis cho Authoring và fact-check. Nó là nơi thử nghiệm nội dung Deep Dive, không phải kiến trúc production đã chốt. Khi proposal này được promote, dữ liệu phù hợp có thể migrate thành content độc lập + relation trong hệ thống hiện có; không bắt buộc giữ API analysis riêng.
