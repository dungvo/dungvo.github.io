# Shared — điểm chung giữa Selflo app và content

Vào đây trước khi một thay đổi ảnh hưởng cả app và content.

- [`contracts/`](contracts/README.md): contract đang có hiệu lực và registry máy đọc được.
- `proposals/`: đề xuất chưa được duyệt; không phải production contract.
- `decisions/`: quyết định kiến trúc/biên tập đã chốt.
- `roadmap/`: ý tưởng có ảnh hưởng nhiều repo nhưng chưa thành cam kết.

Rule: semantics có một nơi sở hữu. App giữ tài liệu conformance và implementation; content giữ source/publisher; `shared` giữ điều hai bên phải hiểu giống nhau.
