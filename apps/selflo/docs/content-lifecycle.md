# Content lifecycle

```text
raw → clean → curated → canonical source → Authoring → owner review → Release
```

- `raw`: bản gốc, append-only, giữ provenance.
- `clean`: bản chuyển sang định dạng mở/dễ đọc; chưa phải nội dung sản phẩm.
- `curated`: đã chọn và chuẩn hóa để cân nhắc đưa vào Selflo.
- `canonical source`: JSON đúng contract, nguồn sửa duy nhất của app content.
- `Authoring`: preview/review; không public.
- `Release`: đã qua source, rights, content và owner gates.

API/catalog luôn được generate từ canonical hoặc Release. Không sửa projection để thay nội dung.
