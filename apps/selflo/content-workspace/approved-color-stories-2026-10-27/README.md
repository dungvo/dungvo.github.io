# Ba truyện đã duyệt đã duyệt — chặn tại Release

## Phạm vi và quyết định của owner

Ngày 2026-10-27, owner cung cấp và duyệt nguyên văn ba truyện độc lập:

- NGƯỜI HỌA SĨ VÀ BỨC TRANH CHƯA HOÀN THÀNH
- TIỆM BÁN MÀU CỦA CUỘC ĐỜI
- THÀNH PHỐ CỦA NHỮNG CHIẾC ĐỒNG HỒ

Owner xác nhận đây là truyện gốc, cho phép metadata và publication, yêu cầu giữ nguyên title, đoạn văn, thoại, dấu ⸻ và kết truyện; không thêm bình luận, lời bài hát hoặc credit nghệ sĩ. Yêu cầu ban đầu chỉ commit/push nhánh riêng; yêu cầu tiếp theo cho phép review và merge main sau khi thêm truyện thứ ba. Merge đã được ủy quyền nhưng chưa thực hiện vì Release đang lỗi.

## Đã thực hiện

- Thêm ba canonical story theo đúng slug owner đề xuất, `story_style: parable`, theme `meaning_values`, summaries và keywords do owner đề xuất cho hai truyện đầu; truyện thứ ba giữ subtitle “Truyện ngụ ngôn”, các heading I–VII và “Hết.”.
- Giữ nguyên văn và thứ tự từng đoạn. Dùng `classic_v1` vì không yêu cầu thêm reflection. Closing region bắt buộc chứa đúng câu cuối và dấu ⸻ cuối; không có lời tổng kết hay câu hỏi mới.
- Thêm đúng một quote trích nguyên văn từ mỗi truyện để đáp ứng quy tắc quote/story 1:1; không tạo quote hoặc lời bài hát mới.
- Đăng ký source/fragment, tăng source revision 76 → 78, cập nhật integrity lock cho ba excerpt mới.
- Publisher tạo Authoring 94 rồi 95: 66 story / 1.854 quote. Các descriptor của 63 story Authoring cũ giữ nguyên. Không sửa renderer, schema hoặc nội dung cũ.

## Blocker: KHÔNG MERGE / CHƯA PUBLIC

Publisher Release dừng với:

```
Release stories must use editorial_v3: story.nguoi_hoa_si_va_buc_tranh_chua_hoan_thanh, story.thanh_pho_cua_nhung_chiec_dong_ho, story.tiem_ban_mau_cua_cuoc_doi
```

Đọc tiếp `shared/contracts/story-reader/v3/COMPATIBILITY_POLICY.vi.md` §2 xác nhận rõ: **“Production Release từ baseline 2026-10-03 chỉ nhận `editorial_v3`.”** Classic chỉ dùng cho Authoring/đọc dữ liệu lịch sử; đây là gate có chủ đích, không phải lỗi publisher. Nhận định ban đầu rằng có discrepancy đã được sửa sau khi đọc policy đầy đủ.

Schema V3 bắt buộc takeaway và reflection có ít nhất một prompt. Bản duyệt không có phần này; tự thêm, chuyển lời thoại ra cuối hoặc dùng separator làm prompt sẽ thay đổi văn bản/semantics đã duyệt. Giữ gate, schema và app nguyên trạng.

Release 53 giữ nguyên 17 story / 380 quote. Ba truyện chưa xuất hiện trên Góc nhìn public. Nhánh này là bản chuẩn bị để review; merge hiện tại sẽ khiến lần build Release kế tiếp bị chặn.

## Kiểm tra

- `./scripts/publish-perspective-library --channel authoring`: PASS, gồm AJV schema gate, không skip.
- `./scripts/publish-perspective-library --channel release`: BLOCKED như trên; không ghi thay đổi Release.
- `python -m unittest discover -s scripts -p 'test_*.py'`: 94 tests PASS sau khi cập nhật quote integrity lock cho đúng ba excerpt.
- Đối chiếu title + từng paragraph + closing giữa bản owner cung cấp, canonical source và Authoring output: khớp chính xác, bao gồm ngoặc kép và dấu ⸻.
- Tất cả descriptor story cũ trong Authoring/Release không đổi; không sửa bất kỳ canonical quote/story cũ nào.
- `git diff --check`: PASS.
- Chưa xác minh UI bằng trình duyệt: Playwright thiếu Chromium; tải runtime trả archive hỏng. Không tuyên bố kiểm tra trực quan hay mở bài public thành công.

Preview sau khi phục vụ nhánh này bằng HTTP:

- `/apps/selflo/studio/reader/?source=authoring&id=story.nguoi_hoa_si_va_buc_tranh_chua_hoan_thanh`
- `/apps/selflo/studio/reader/?source=authoring&id=story.tiem_ban_mau_cua_cuoc_doi`

- `/apps/selflo/studio/reader/?source=authoring&id=story.thanh_pho_cua_nhung_chiec_dong_ho`

## Một bước tiếp theo

Chốt cách hỗ trợ truyện nguyên văn không có reflection trong contract/app/publisher, rồi chạy lại Release và kiểm tra reader trước khi merge. Không cần duyệt lại câu chữ ba truyện.


## Phương án kỹ thuật đề xuất để giữ nguyên văn (chưa triển khai)

Cho phép kết thúc truyện mà không ép thêm takeaway/reflection, theo một capability được app hỗ trợ trước khi phát hành content:

1. Kiểm tra decoder, validator và reader native trong `dungvo/selflo`; xác định generation/capability phù hợp theo policy, không sửa required shape đang phát hành tại chỗ.
2. Contract đề xuất rõ: các ending region là tùy chọn; khi vắng mặt không render nhãn mặc định, card rỗng hay prompt; tất cả đoạn kết giữ trong body đúng thứ tự.
3. Thêm fixture cho story không ending supplement, kiểm tra app/web và khả năng reject trên app cũ; vẫn giữ V3 hiện tại và story cũ nguyên trạng.
4. Chỉ chuyển ba source sang format/capability đã được consumer hỗ trợ, rồi chạy publisher Release, kiểm tra DOM nguyên văn, review diff và merge theo ủy quyền hiện có.

Cần chốt scope contract/app này; không cần duyệt lại văn bản truyện. Không chọn cách thêm câu hỏi do AI viết vào bản owner đã khóa.

## Checkpoint để đóng session — 2026-10-28

Toàn bộ canonical source của ba truyện, excerpt links, Authoring payload/manifest và báo cáo này được lưu trên nhánh riêng. Riêng audit sinh tự động `authoring/vi/audit/r95.json` không upload vì automatic approval review từ chối bulk audit; không có nội dung truyện độc quyền nằm trong file audit này. Có thể sinh lại audit từ source bằng publisher trong checkout tạm bắt đầu từ Authoring 94 (commit `caeef780`), chép canonical source hiện tại vào rồi chạy publisher Authoring. Không cần giữ workspace phiên này để khôi phục nội dung. Chưa Release/merge main; blocker định dạng ở trên vẫn còn.


## Cập nhật 2026-10-28 — bổ sung phần kết theo yêu cầu mới

Owner yêu cầu giữ nguyên truyện và bổ sung “Nhìn lại” cùng câu hỏi suy ngẫm cho cả ba bài, tiếp tục yêu cầu release. Quyết định này thay thế hạn chế không thêm phần bổ sung ở checkpoint trước; lịch sử phía trên được giữ nguyên.

- Chuyển đúng ba canonical story sang Editorial V3 (content-compatible). Khôi phục hai dòng kết gốc từ vùng takeaway Classic vào cuối body, giữ nguyên từng chữ và thứ tự, bao gồm dấu ⸻ và “Hết.”. Mỗi đoạn thoại giữ thành một turn riêng; không gộp lời của các nhân vật.
- Thêm một đoạn Nhìn lại và hai câu hỏi mở cho từng truyện, không thêm claim nghiên cứu hoặc kết luận lựa chọn đúng/sai. Không thay contract, schema, app hoặc story cũ.
- Authoring 96 và Release 54 dựng thành công, có schema gate đầy đủ. Release có 20 story / 383 quote; đúng ba story và ba excerpt mới, mỗi story một quote liên kết. Tất cả descriptor story Release cũ giữ nguyên; mọi checksum manifest đã đối chiếu.
- 94 tests đạt; git diff --check đạt. Reader public local đã mở cả ba bài, xác minh phần kết nguyên văn nối tiếp trước Nhìn lại và hai câu hỏi. Catalog và Review Matrix đã rebuild.
- Đang commit/push và kiểm chứng endpoint public; chưa coi local package là đã online.

Bước tiếp theo: xác minh Release 54 trên endpoint public sau deploy.

## Xác nhận public — 2026-10-28

Đã push commit `3d35412` lên main. Endpoint public trả Release 54; tải đủ ba payload mới và đối chiếu SHA-256 khớp manifest, mỗi bài có Nhìn lại và hai prompt. Hoàn tất yêu cầu phát hành.

Bước tiếp theo: owner đọc ba bài trên Góc nhìn public.
