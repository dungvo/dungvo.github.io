# Selflo Knowledge Maze Workspace

Workspace phát triển **Mê cung kiến thức**: trải nghiệm đọc có nhánh, trong đó người dùng bắt đầu từ một câu hỏi, mở các khái niệm chưa hiểu, đi sâu theo nhu cầu và quay lại đúng mạch đọc ban đầu.

Đây là khu vực thử nghiệm, **chưa phải content canonical, chưa public và chưa phải contract của app**.

## Mục tiêu

- Lưu mọi ý tưởng product và content liên quan feature ở một nơi.
- Phát triển nội dung trước khi quyết định UI/implementation.
- Kiểm tra xem mỗi nhánh có thật sự giúp hiểu thêm hay chỉ tạo thêm chữ để đọc.
- Chuẩn bị cấu trúc đủ rõ để sau này có thể chuyển thành dữ liệu cho app.

## Không phải

- Không phải game tình huống “Tin nhắn chưa có lời đáp”.
- Không phải knowledge graph tự động chứa mọi liên hệ có thể có.
- Không phải bài viết dài được chia thành nhiều trang bằng nút “Tiếp theo”.
- Không phải production source. Không publish trực tiếp từ workspace này.

## Cấu trúc

```text
knowledge-maze/
├── README.md
├── HANDOFF_2026-10-11.vi.md
├── PRODUCT_DIRECTION.vi.md
├── CONTENT_MODEL_DRAFT.vi.md
├── AUTHORING_WORKFLOW.vi.md
├── TOPIC_BACKLOG.vi.md
└── topics/
    └── hieu-hay-chi-thay-hop-ly/
        ├── README.md
        ├── topic-map.draft.json
        └── nodes/
            ├── root.vi.md
            ├── nhan-ra-va-tu-tao.vi.md
            ├── cam-giac-troi-chay.vi.md
            ├── tu-giai-thich.vi.md
            ├── thu-hoi-va-chuyen-giao.vi.md
            └── hoc-cung-ai.vi.md
```

## Quy ước trạng thái

- `seed`: mới là câu hỏi hoặc ý tưởng.
- `outline`: đã có vai trò trong bản đồ nhưng nội dung chưa hoàn chỉnh.
- `draft`: đã có thể đọc và review.
- `reviewed`: đã review logic, nguồn và liên kết; vẫn chưa production.
- `candidate`: đủ điều kiện đề xuất sang canonical pipeline.

## Nguyên tắc quan trọng

1. Bài gốc phải tự đứng được một mình.
2. Link mở rộng là tùy chọn, không phải phần bắt buộc để hiểu ý chính.
3. Mỗi node trả lời một câu hỏi rõ ràng.
4. Mỗi đường link phải nói trước người dùng sẽ hiểu thêm điều gì.
5. Luôn giữ đường quay lại bài gốc và đúng vị trí đã rời đi.
6. Không biến sự liên quan thành quan hệ nhân quả.
7. Phân biệt nội dung có nguồn, diễn giải biên tập và câu hỏi còn mở.
8. Không mở nhánh chỉ vì có thể; chỉ mở khi nhánh giúp giải quyết một khoảng trống thật.

## Prototype hiện tại

Workspace hiện có hai prototype ở hai mức khác nhau:

### Prototype content model

Chủ đề **“Đọc thấy hợp lý có phải là đã hiểu?”** dùng để thử cấu trúc topic, node, link và anchor vì:

- đã có research nền trong Selflo;
- chính quá trình khám phá có thể minh họa cho luận điểm của nội dung;
- có nhiều loại nhánh: khái niệm, cơ chế, thực hành, giới hạn và ứng dụng với AI;
- có thể kiểm tra khả năng quay lại bài gốc sau khi mở một khái niệm.

### Prototype web

Chủ đề **“Thái cực là gì?”** đã có trang tương tác ở `apps/selflo/studio/knowledge-maze/`. Prototype kiểm tra:

- ba lối vào một chủ đề;
- bài gốc có thể tự đứng;
- giải thích nhanh ngay trong bài;
- chuyển sang node đọc sâu;
- breadcrumb và đường đã khám phá;
- quay lại bài trước hoặc bài gốc.

Nội dung Thái cực hiện chỉ ở mức draft để thử trải nghiệm, chưa phải bài chuyên sâu hoàn chỉnh và chưa qua source review đầy đủ.

## Handoff gần nhất

Đọc [`HANDOFF_2026-10-11.vi.md`](HANDOFF_2026-10-11.vi.md) trước khi tiếp tục. File này lưu đánh giá nên/không nên xây, quan hệ với ChatGPT và Wikipedia, phạm vi MVP Thái cực, chi phí content, tiêu chí validation và trạng thái prototype web.

## Đường đi từ workspace đến sản phẩm

```text
seed → topic map → node drafts → content/source review
     → thử nghiệm cách đọc → chỉnh cấu trúc → candidate
     → đề xuất contract/canonical source → Authoring → Release
```

Không bỏ qua content/source review chỉ vì prototype đọc tốt.
