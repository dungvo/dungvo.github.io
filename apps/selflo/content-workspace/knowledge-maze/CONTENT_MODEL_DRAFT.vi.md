# Mê cung kiến thức — Mô hình content nháp

**Trạng thái:** Draft để thử authoring; chưa phải JSON schema hay shared contract.

## 1. Đơn vị cơ bản

Mỗi mê cung gồm:

- một `topic` đại diện cho câu hỏi/hành trình;
- nhiều `node` là đơn vị nội dung có thể đọc độc lập;
- nhiều `link` có nhãn, nối từ một vị trí cụ thể trong node tới node khác;
- các `return_anchor` để quay lại đúng đoạn;
- metadata về nguồn, trạng thái và review.

## 2. Topic

```yaml
id: understanding-vs-familiarity
title: Đọc thấy hợp lý có phải là đã hiểu?
root_node_id: understanding-root
status: outline
audience: general
promise: Nhận ra khác biệt giữa theo được một lời giải và tự sử dụng được điều vừa học.
```

Topic không chứa toàn bộ bài. Nó giữ bản đồ, mục tiêu biên tập và entry point.

## 3. Node

Front matter đề xuất cho bản nháp Markdown:

```yaml
id: recognition-vs-generation
type: concept
title: Nhận ra khác với tự tạo như thế nào?
status: draft
summary: Nhận ra một câu trả lời khi nhìn thấy và tự tạo nó khi không có mẫu là hai nhiệm vụ khác nhau.
confidence: supported
source_notes:
  - research-note-id-or-url
review:
  content: pending
  source: pending
```

Phần thân node:

```text
# Câu hỏi của node

## Câu trả lời ngắn
## Ví dụ
## Điều dễ hiểu nhầm
## Giới hạn / điều chưa biết
## Các hướng khám phá tiếp
## Nguồn và ghi chú biên tập
```

## 4. Link

Một link cần nhiều hơn `target_node_id`:

```yaml
id: root-to-recognition
from_node_id: understanding-root
from_anchor: familiar-but-cannot-explain
to_node_id: recognition-vs-generation
relation: defines
label: Vì sao nhìn ra đáp án khác với tự tạo đáp án?
preview: Hai nhiệm vụ có vẻ giống nhau nhưng đòi hỏi mức chủ động khác nhau.
return_label: Quay lại phần “Cảm giác đã hiểu”
priority: primary
```

`preview` giúp người dùng biết giá trị trước khi rời bài. `from_anchor` và `return_label` giữ mạch quay lại.

## 5. Quick explanation

Nếu một thuật ngữ chỉ cần giải thích ngắn, không tạo node mới:

```yaml
term: retrieval practice
label_vi: luyện tập truy hồi
quick_explanation: Cố lấy kiến thức ra khỏi trí nhớ thay vì chỉ đọc lại nguồn đang mở.
deep_node_id: retrieval-and-transfer
```

`deep_node_id` là tùy chọn.

## 6. Mức độ bằng chứng

Đề xuất nhãn biên tập, không hiển thị nguyên dạng nếu UI chưa phù hợp:

- `established_for_scope`: bằng chứng tương đối vững trong phạm vi được mô tả.
- `supported`: có nghiên cứu hỗ trợ nhưng cần giữ điều kiện/giới hạn.
- `interpretation`: tổng hợp hoặc cách diễn giải của Selflo.
- `hypothesis`: giả thuyết cần kiểm tra thêm.
- `open_question`: chưa có câu trả lời đủ chắc.

Không dùng `fact` như một nhãn chung cho mọi câu có citation.

## 7. Quy tắc tái sử dụng node

Một node có thể được liên kết từ nhiều topic nếu:

- câu hỏi và nội dung thực sự giống nhau;
- node đọc độc lập mà không lệ thuộc một mạch trước đó;
- mỗi topic cung cấp `preview` và `return_label` riêng.

Không tái sử dụng chỉ vì cùng có một từ khóa. Nếu hai truyền thống dùng cùng thuật ngữ với nghĩa khác nhau, cần node riêng hoặc phần phân biệt rõ.

## 8. Những gì chưa khóa

- Markdown front matter hay JSON làm canonical source.
- Một node có được nhúng trực tiếp vào nhiều topic hay chỉ tham chiếu.
- Cách version link và anchor khi nội dung thay đổi.
- Mô hình multilingual.
- Cách app lưu lịch sử khám phá và vị trí đọc.
- Mức granularity phù hợp cho một node.

Các quyết định này chỉ nên thành contract sau khi có ít nhất hai topic prototype khác loại.

