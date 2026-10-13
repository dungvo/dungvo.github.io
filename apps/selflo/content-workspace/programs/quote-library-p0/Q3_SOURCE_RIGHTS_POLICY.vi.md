# PM-QUOTE-P0 — Chính sách làm việc Q3 về nguồn và quyền

**Trạng thái:** Đang thực hiện
**Mục đích:** Không đổi `rights.status` hàng loạt chỉ vì tác giả cổ hoặc URL trông đáng tin.

## Phân biệt bắt buộc

Một quote có thể có nhiều lớp quyền khác nhau:

1. tác phẩm gốc;
2. edition/transcription;
3. bản dịch trung gian;
4. bản Việt Selflo;
5. dữ liệu/annotation của website cung cấp nguồn;
6. thương hiệu hoặc điều khoản tái phân phối của website.

Tác phẩm cổ thuộc phạm vi công cộng không tự động làm bản dịch hiện đại thuộc phạm vi công cộng.

## Bằng chứng chính thức đã kiểm tra

### Project Gutenberg

- Chính sách nói phần lớn ebook không bị giới hạn bởi copyright Hoa Kỳ, nhưng phải kiểm tra header của từng ebook.
- Ngoài Hoa Kỳ, người sử dụng phải tự kiểm tra luật nơi sử dụng.
- Nếu dùng nội dung gắn với tên/thương hiệu Project Gutenberg, còn có điều khoản trademark/license.

Nguồn:

- https://www.gutenberg.org/policy/permission
- https://www.gutenberg.org/policy/license

**Quyết định PM:** `candidate_public_domain`; chỉ nâng rights sau khi kiểm tra từng ebook/translator/edition và ghi bản Việt là Selflo dịch/diễn đạt trực tiếp, không sao chép bản Việt hiện đại.

### Wikisource

- Nội dung website nhìn chung theo CC BY-SA 4.0/GFDL, nhưng từng tác phẩm/trang có thể có trạng thái riêng.

Nguồn:

- https://zh.wikisource.org/zh-hant/Wikisource:Copyright

**Quyết định PM:** `item_license_check`; cần đọc copyright template/trang tác phẩm và lưu attribution/license nếu tái sử dụng text của site. Nếu Selflo chỉ đối chiếu văn bản cổ và tự biên soạn bản Việt, vẫn phải ghi provenance rõ.

### Chinese Text Project

- Text Wiki có nội dung thuộc copyright của dự án hoặc CC BY-SA tùy item; reproduction có thể không được phép nếu không có permission ngoài phạm vi copyright law.

Nguồn:

- https://ctext.org/instructions/textwiki/ens

**Quyết định PM:** `needs_item_specific_check_or_alternate_source`; không nâng hàng loạt các quote dựa trên ctext.org.

### Perseus Digital Library

- Perseus nói material có trạng thái khác nhau và cấm commercial use/publication không được phép; một số public-domain text có download/license riêng.

Nguồn:

- https://www.perseus.tufts.edu/hopper/help/copyright.jsp

**Quyết định PM:** `needs_specific_object_license_or_alternate_public_domain_edition`; URL Perseus chung không đủ để đánh dấu public domain.

## Tình trạng Authoring hiện tại

- 1.526 quote chưa Release.
- 1.491 quote có rights `unverified`.
- 34 quote `selflo_owned`.
- 1 quote `public_domain`.
- Có 485 nhóm author/work/source khác nhau.

Các host lớn trong nhóm unverified:

| Host | Quote |
|---|---:|
| zh.wikisource.org | 282 |
| gutenberg.org | 273 |
| thiếu URL | 141 |
| ctext.org | 98 |
| pubmed.ncbi.nlm.nih.gov | 81 |
| vi.wikisource.org | 67 |
| perseus.tufts.edu | 59 |
| la.wikisource.org | 48 |

## Quy tắc xử lý tiếp

1. Gom theo tác phẩm + edition/translator + host, không chỉ theo tác giả.
2. Xác minh quyền một lần cho nhóm chỉ khi mọi quote dùng đúng cùng object/source.
3. Nguồn nghiên cứu hiện đại không được biến thành “quote tác giả” nếu content thực chất là Selflo tổng hợp finding.
4. Không dùng `selflo_owned` để che việc bản Việt sao chép bản dịch có bản quyền.
5. Paulo Coelho / *Nhà giả kim* tiếp tục bị chặn cho đến khi edition, translator, locator và quyền được giải quyết.
6. Mọi verdict phải có URL bằng chứng, ngày kiểm tra, phạm vi áp dụng và điều không được suy rộng.

## Đầu ra đang dùng

- `reports/q3-source-rights-queue.json`: các row đang bị chặn nguồn/quyền.
- `reports/q3-authoring-source-groups.json`: 485 nhóm Authoring theo author/work/source.
