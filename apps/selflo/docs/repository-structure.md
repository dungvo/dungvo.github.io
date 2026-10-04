# Cấu trúc repository

```text
apps/selflo/
├── shared/                 contract và quyết định chung app–content
├── research/               tài liệu nghiên cứu theo topic
├── content-workspace/      raw/clean/curated cho intake chưa canonical
├── perspective-library/    canonical source, Authoring, Release, tooling
├── api/                    projection sinh tự động
├── studio/                 review, catalog, matrix, reader lab và authoring tools
├── assets/                 asset website dùng chung
├── docs/                   hướng dẫn và mockup
├── index.html              website public
├── perspectives/           thư viện public chỉ đọc Release
├── about/ support/ privacy/
└── scripts/
```

Không gộp toàn bộ quote vào một file. Quote canonical chia theo theme và fragment nhỏ để diff/review ổn định khi corpus vượt 5.000 item. Mỗi story/Knowledge là một folder riêng vì có thể có source note, artwork và revision riêng.
