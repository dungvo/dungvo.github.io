# Hai truyện màu sắc đã duyệt — chặn tại Release

## Phạm vi và quyết định của owner

Ngày 2026-10-27, owner cung cấp và duyệt nguyên văn hai truyện độc lập:

- NGƯỜI HỌA SĨ VÀ BỨC TRANH CHƯA HOÀN THÀNH
- TIỆM BÁN MÀU CỦA CUỘC ĐỜI

Owner xác nhận đây là truyện gốc, cho phép metadata và publication, yêu cầu giữ nguyên title, đoạn văn, thoại, dấu ⸻ và kết truyện; không thêm bình luận, lời bài hát hoặc credit nghệ sĩ. Chỉ commit/push nhánh riêng, không merge main.

## Đã thực hiện

- Thêm hai canonical story theo đúng slug owner đề xuất, `story_style: parable`, theme `meaning_values`, summaries và keywords do owner đề xuất.
- Giữ nguyên văn và thứ tự từng đoạn. Dùng `classic_v1` vì không yêu cầu thêm reflection. Closing region bắt buộc chứa đúng câu cuối và dấu ⸻ cuối; không có lời tổng kết hay câu hỏi mới.
- Thêm đúng một quote trích nguyên văn từ mỗi truyện để đáp ứng quy tắc quote/story 1:1; không tạo quote hoặc lời bài hát mới.
- Đăng ký source/fragment, tăng source revision 76 → 77, cập nhật integrity lock cho hai excerpt mới.
- Publisher tạo Authoring 94: 65 story / 1.853 quote. Các descriptor của 63 story Authoring cũ giữ nguyên. Không sửa renderer, schema hoặc nội dung cũ.

## Blocker: KHÔNG MERGE / CHƯA PUBLIC

Publisher Release dừng với:

```
Release stories must use editorial_v3: story.nguoi_hoa_si_va_buc_tranh_chua_hoan_thanh, story.tiem_ban_mau_cua_cuoc_doi
```

`shared/contracts/story-reader/v3/CONTRACT.vi.md` vẫn mô tả Classic/V2 compatibility, nhưng `scripts/publish-perspective-library` chặn mọi story Release không phải V3. Schema V3 bắt buộc takeaway và reflection có ít nhất một prompt. Bản duyệt không có phần này; tự thêm, chuyển lời thoại ra cuối hoặc dùng separator làm prompt sẽ thay đổi văn bản/semantics đã duyệt.

Theo `perspective-library/AGENTS.md`, không publish khi contract và implementation khác nhau. Không thay gate, sửa schema, dùng `--skip-schema`, hoặc giả lập reflection để vượt kiểm tra.

Release 53 giữ nguyên 17 story / 380 quote. Hai truyện chưa xuất hiện trên Góc nhìn public. Nhánh này là bản chuẩn bị để review; merge hiện tại sẽ khiến lần build Release kế tiếp bị chặn.

## Kiểm tra

- `./scripts/publish-perspective-library --channel authoring`: PASS, gồm AJV schema gate, không skip.
- `./scripts/publish-perspective-library --channel release`: BLOCKED như trên; không ghi thay đổi Release.
- `python -m unittest discover -s scripts -p 'test_*.py'`: 94 tests PASS sau khi cập nhật quote integrity lock cho đúng hai excerpt.
- Đối chiếu title + từng paragraph + closing giữa bản owner cung cấp, canonical source và Authoring output: khớp chính xác, bao gồm ngoặc kép và dấu ⸻.
- Tất cả descriptor story cũ trong Authoring/Release không đổi; không sửa bất kỳ canonical quote/story cũ nào.
- `git diff --check`: PASS.
- Chưa xác minh UI bằng trình duyệt: Playwright thiếu Chromium; tải runtime trả archive hỏng. Không tuyên bố kiểm tra trực quan hay mở bài public thành công.

Preview sau khi phục vụ nhánh này bằng HTTP:

- `/apps/selflo/studio/reader/?source=authoring&id=story.nguoi_hoa_si_va_buc_tranh_chua_hoan_thanh`
- `/apps/selflo/studio/reader/?source=authoring&id=story.tiem_ban_mau_cua_cuoc_doi`

## Một bước tiếp theo

Chốt cách hỗ trợ truyện nguyên văn không có reflection trong contract/app/publisher, rồi chạy lại Release và kiểm tra reader trước khi merge. Không cần duyệt lại câu chữ hai truyện.
