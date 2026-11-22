# Food Assistant · Chạy thử hoặc triển khai

Giải nén gói, mở Terminal trong thư mục `food-assistant`. Cần Node.js 22.13 trở lên. Có thể dùng Node.js 24 trên Mac.

## Demo trên máy · 1 lệnh

```sh
npm run demo
```

Mở [http://127.0.0.1:8787/#ket-noi](http://127.0.0.1:8787/#ket-noi), dùng mã quán hiện trong Terminal. Thử **Nhập lệnh** với “Bàn 5 hai phở bò, một tái một chín. Tô chín không hành. Hai trà đá, à một thôi.” Sau khi bấm Lưu câu gọi, màn bếp có ba món, mỗi món ×1. Demo dùng bộ nhớ và xoá dữ liệu khi dừng.

## Một quán dùng chung Wi-Fi · Tôi chọn cách này để chạy thử

Cài `mkcert` và `ffmpeg` trên Mac nếu máy chưa có. Với Homebrew: `brew install mkcert ffmpeg`.

```sh
npm run setup:lan
npm run start:lan
```

`setup:lan` hỏi IP nếu có nhiều lựa chọn, hỏi kín khóa Groq nếu muốn bật AI, tạo HTTPS và mã quán. Cài chứng chỉ công khai **`.food-lan/ca/rootCA.pem`** vào các thiết bị thử do anh quản lý và bật tin cậy TLS. Chỉ chuyển tệp `rootCA.pem` sang iPhone hoặc máy bếp. Khóa riêng nằm trên Mac. Mở hai link HTTPS do lệnh in ra, nhập cùng mã quán. Dữ liệu đơn lưu ở SQLite trên Mac. Khi IP Wi-Fi đổi, chạy lại `setup:lan` và dùng địa chỉ mới. [Hướng dẫn tin cậy chứng chỉ trên iPhone](https://support.apple.com/en-us/102390)

## Chạy online · AWS

Cài AWS CLI v2, đăng nhập bằng profile AWS có quyền tạo CloudFormation, Lambda, S3, DynamoDB và CloudFront. Chuẩn bị khóa Groq trong tệp `.env.aws` trên máy triển khai, nếu muốn bật hiểu câu khó.

```sh
cp .env.aws.example .env.aws
# Điền GROQ_API_KEY vào .env.aws nếu dùng AI
bash aws/deploy.sh food-assistant ap-southeast-1
```

Lệnh tự đóng gói Lambda, tạo mã quán khi tạo stack lần đầu và in link web lẫn địa chỉ API. Mở link web, vào **Cài đặt → Kết nối thiết bị**, nhập địa chỉ API và `FOOD_TOKEN` từ `.env.aws`. Mở cùng link trên màn bếp để thấy đơn của máy gọi món. **Micro trình duyệt** và nhập câu dùng được với bản AWS. Muốn bật nút **Thu âm qua máy chủ**, cấu hình `FOOD_FFMPEG_LAYER_ARN` bằng Lambda Layer Linux x86_64 tin cậy có `/opt/bin/ffmpeg`, rồi chạy lại lệnh deploy. Không cần API Gateway hoặc EC2.

- **Frontend** nằm trong S3 riêng, CloudFront cấp HTTPS và đọc S3 bằng OAC.
- **API** dùng Lambda Function URL. Link mạng công khai, dữ liệu và thao tác đơn yêu cầu mã quán. Phiên bản này dành cho một quán. Cần phân quyền nhân viên và chặn lạm dụng ở tầng mạng nếu thương mại hóa.
- **DynamoDB** lưu bản trạng thái nén theo revision và sổ hạn mức AI. Dành cho thử nghiệm. Một bản trạng thái giới hạn 370 KiB sau nén và 4 MiB trước nén. Theo dõi hiệu năng khi lịch sử lớn. Stack giữ S3 và DynamoDB khi xóa để giữ dữ liệu. Các tài nguyên giữ lại có thể tiếp tục phát sinh phí, hãy quản lý sau khi đã sao lưu.
- Muốn chỉ đóng gói, chạy `bash aws/package.sh`. Kết quả trong `aws/build/lambda` và `aws/build/site`. Chúng không chứa tệp cấu hình khóa. Chương trình dùng AWS SDK có sẵn ở Lambda Node.js.

## Phần nào có thể nằm trong mức miễn phí?

| Thành phần | Cách tính cho bản thử |
| --- | --- |
| MacBook và Wi-Fi sẵn có | Không thuê hạ tầng cloud. Dùng Groq Free trong giới hạn tài khoản nếu bật AI. |
| AWS Lambda và DynamoDB | AWS công bố mức miễn phí Lambda 1 triệu lượt và 400.000 GB-giây/tháng. DynamoDB có 25 GB, 25 RCU và 25 WCU cấp phát. Template dùng cấp phát, không dùng on-demand. Xét cả tài nguyên AWS khác của tài khoản. |
| CloudFront và S3 | Template dùng CloudFront theo mức sử dụng. S3, lượt truy cập vào origin, tệp build và CloudWatch cần theo dõi riêng. Tài khoản AWS mới có thể có tín dụng theo điều kiện. Đặt cảnh báo AWS Budgets trước khi mở demo online. |

Với 2 thiết bị mở 8 giờ/ngày, 30 ngày, nhịp đồng bộ AWS khoảng 6 giây tạo khoảng **288.000 lượt API/tháng** chỉ để đọc trạng thái. Đóng màn hình khi hết ca giúp giữ mức dùng thấp. Lambda URL công khai vẫn có thể có lượt gọi khi mã quán sai, nên cảnh báo ngân sách là cần thiết.

[AWS Free Tier cho serverless](https://aws.amazon.com/free/serverless/) · [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/) · [Groq rate limits](https://console.groq.com/docs/rate-limits)
