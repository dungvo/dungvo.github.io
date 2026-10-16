# Specification — Studio parity, Website Lab và Knowledge Reader

## 1. Vấn đề

Studio hiện là tập hợp các công cụ và một Website Preview riêng. Owner không thể vào một entrypoint duy nhất để:

- nhìn website như người dùng public;
- bật thử feature đang phát triển;
- chuyển sang công cụ Developer mà không rời ngữ cảnh;
- đọc một bài Knowledge/Analysis bằng reader hoàn chỉnh;
- biết feature/content đang ở Studio-only, public candidate hay Release.

Nếu Studio và public tiếp tục có HTML/CSS/component riêng, chúng sẽ lệch nhau và việc “copy qua public” dễ trở thành hai codebase song song.

## 2. Product promise

`/studio/` là staging site của website Selflo. Nó hiển thị cùng cấu trúc, giao diện và hành vi với public site, gồm `Trang chủ`, `Góc nhìn`, `Hỗ trợ`, `Quyền riêng tư`; chỉ bổ sung mục `Developer` và các feature đang thử. Feature thử nghiệm không xuất hiện public cho tới khi owner quyết định Release.

Ví dụ từng dùng để giải thích mô hình: public `Góc nhìn` giữ UI hiện tại; Studio `Góc nhìn` có thêm một tab Phân tích thử nghiệm. Đây chỉ là ví dụ về cách Studio nghiệm thu feature trước public, không phải information architecture đã chốt. Vị trí của `Phân tích` phải được thảo luận riêng trước khi viết UI hoặc code.

## 3. User stories

### US-01 — Xem website trong Studio

Là owner, tôi mở `/studio/` và nhìn thấy website Selflo với hệ thống điều hướng, typography và content presentation gần public để đánh giá trải nghiệm thật.

**Acceptance**

- Có cùng bốn mục `Trang chủ`, `Góc nhìn`, `Hỗ trợ`, `Quyền riêng tư` như public.
- Có thêm mục `Developer` trong Studio navigation; public không có mục này.
- Trang dùng shared shell/component, cùng implementation source hoặc bản copy/build được sinh có kiểm soát từ cùng phiên bản; không chỉnh hai bản độc lập.
- Có nhãn rõ đây là Studio/noindex.
- Có thể xem mobile và desktop mà không che nội dung bởi developer chrome.

### US-02 — Mở khu Developer

Là owner/developer, tôi chuyển sang `Developer` để vào các công cụ nội bộ hiện có.

**Acceptance**

- Giữ được các entrypoint: Review Library, Content Catalog, Review Matrix, Story Seed, Reader Lab, Knowledge Maze.
- Tool được nhóm theo mục đích thay vì một dãy link phẳng.
- Developer không xuất hiện trong navigation public.
- Từ mỗi tool có đường quay lại Studio rõ ràng.

### US-03 — Thử feature website trước khi Release

Là owner, tôi xem feature mới ngay trong route tương ứng của staging website với dữ liệu preview và biết trạng thái của nó.

**Acceptance**

- Tối thiểu có trạng thái `studio_only`, `public_candidate`, `released`.
- Feature Studio-only không lọt sang public do chỉ đổi HTML bằng tay.
- Có thể so sánh preview bật/tắt feature.
- Mỗi feature có spec, owner decision và acceptance evidence trước khi Release.

### US-04 — Release feature đã đạt

Là owner, khi chấp nhận một feature, tôi có thể đưa implementation đã thử sang public mà không thiết kế hoặc phát triển lại lần hai.

**Acceptance**

- Shared implementation hoặc quy trình copy/build một chiều từ cùng source version là nguồn duy nhất cho phần UI chung.
- Public activation tách khỏi Studio preview activation.
- Có kiểm tra public route, accessibility, responsive, data channel và rollback.
- Release cần owner acceptance; workspace này không tự publish.

### US-05 — Đọc Knowledge/Analysis

Là người review nội dung, tôi mở một bài Knowledge/Analysis trong Studio bằng reader tuyến tính, dễ đọc và phản ánh gần trải nghiệm public tương lai.

**Acceptance**

- Có route/detail ổn định theo content ID.
- Có title, summary/dek, body có cấu trúc, source/evidence notes khi phù hợp, related content và trạng thái channel.
- Reader phân biệt nội dung public-facing với editorial/research metadata nội bộ.
- Có empty/error/loading state và deep link.
- Không buộc người đọc đi qua Knowledge Maze.

## 4. Functional scope v1

- Studio staging shell với bốn mục public và thêm `Developer`.
- Các route Trang chủ/Góc nhìn/Hỗ trợ/Quyền riêng tư dùng cùng source/component hoặc cùng generated version với public.
- Studio `Góc nhìn` có thể bật tab/feature thử nghiệm mà public chưa bật.
- Developer dashboard tổ chức lại tool hiện có.
- Feature registry thay `studio_preview/public_candidate` boolean rời rạc bằng lifecycle rõ.
- Knowledge Reader Studio cho ít nhất một fixture/bài Analysis hiện có.
- Promotion design và gate; chưa cần nút publish tự động trong v1.

## 5. Không nằm trong v1

- Không redesign toàn bộ public home.
- Không public Series/Analysis/Knowledge chỉ vì Studio render được.
- Không xây CMS đa người dùng, authentication hoặc server backend.
- Không thay app native.
- Không gộp Knowledge Maze vào Knowledge Reader.
- Không tự tạo lịch nội dung hoặc publish.

## 6. Non-functional requirements

- `noindex,nofollow` cho Studio.
- Không làm lộ review ledger, local state hoặc metadata nhạy cảm qua public bundle.
- Responsive từ mobile đến desktop.
- Keyboard navigation, focus visible, semantic landmarks, reduced motion.
- Không fetch Authoring/internal data từ route public.
- Public vẫn hoạt động nếu toàn bộ Studio feature bị tắt.
- Shared asset/module phải có ranh giới import rõ; tránh đường dẫn relative mong manh giữa route.

## 7. Definition of Done

1. `/studio/` mở vào staging home có parity đo được với public home.
2. Studio có cùng bốn mục public và thêm Developer; Developer không xuất hiện public.
3. Website preview cũ được migrate hoặc redirect có chủ đích; không còn implementation cạnh tranh.
4. Ít nhất một feature do owner chọn chạy qua lifecycle Studio-only → owner acceptance → public candidate; không mặc định đó là tab Phân tích trong `Góc nhìn` và không bắt buộc Release trong phase đầu.
5. Knowledge Reader mở được một bài/fixture bằng deep link và có visual/accessibility test.
6. Contract/data impact được phân loại; mọi thay đổi app-impacting đi qua proposal.
7. Có screenshot/baseline, test, worklog và rollback note.
