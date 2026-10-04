# Perspective Library agent instructions

Trước mọi thay đổi trong `apps/selflo/perspective-library/` hoặc publisher liên quan:

1. Đọc [`../shared/contracts/README.md`](../shared/contracts/README.md).
2. Mở entry tương ứng trong `../shared/contracts/registry.json`.
3. Đọc đầy đủ canonical `CONTRACT.vi.md` của capability đang sửa.
4. Lần theo executable artifacts được registry liệt kê; không tạo schema/contract cạnh tranh ở repo khác.
5. Phân loại thay đổi là content-compatible, app-impacting hoặc synchronized cutover trước khi sửa source.
6. Với app-impacting change, cập nhật proposal/contract và app conformance trước; không publish content đòi capability app chưa phát hành.
7. Authoring/Release là generated output. Không sửa tay hoặc publish nếu owner chưa yêu cầu rõ.

Nếu contract, schema, fixture, validator và implementation khác nhau, dừng publish. Canonical contract hub quyết định ownership; executable schema/fixture quyết định wire acceptance; discrepancy phải được resolve bằng decision có review, không fallback ngầm.
