# Selflo shared app–content contracts

**Vai trò:** điểm vào canonical duy nhất cho mọi contract trao đổi giữa Selflo app và Selflo content  
**Owner:** Selflo app + Selflo content  
**Cập nhật:** 2026-09-30

Mọi thay đổi có thể ảnh hưởng cách app decode, validate, activate hoặc trình bày content phải bắt đầu tại thư mục này. Không tạo một bản contract format/taxonomy/semantics thứ hai trong app repo, tài liệu feature hoặc prompt authoring.

## Contract registry

| Contract ID | Canonical document | Executable contract | App conformance | Trạng thái |
|---|---|---|---|---|
| `selflo.content-tags.v1` | [`content-tags/v1/CONTRACT.vi.md`](content-tags/v1/CONTRACT.vi.md) | catalog/quote/manifest schemas, publisher gate và Release coverage | `Selflo/Docs/authoring/perspectives/APP_FILTER_METADATA_CONTRACT.md` | Active, Release 34+ |
| `selflo.story-reader.editorial-v3` | [`story-reader/v3/CONTRACT.vi.md`](story-reader/v3/CONTRACT.vi.md) | Versioned Story Reader rules, modern V2 defaults, optional V2.5 semantics, V3 fixtures, [component catalog](story-reader/v3/COMPONENT_CATALOG.vi.md), [visual reference](story-reader/v3/visual-reference/VISUAL_REFERENCE.vi.md) và [support matrix](story-reader/v3/component-support.json) | `Selflo/Docs/features/perspective-content-system/STORY_READER_COMPONENT_CONFORMANCE.md` | Production: V3 Core, extended text và figure đã Release; V2/V2.5 tiếp tục tương thích |
| `selflo.content-index.v1` | [`content-index/v1/CONTRACT.vi.md`](content-index/v1/CONTRACT.vi.md) | Schema, generator, full bundle và shard manifest | `Selflo/Docs/features/perspective-content-system/CONTENT_INDEX_CONFORMANCE.md` | Active; local-first search projection |
| `selflo.content-analysis.v1` | [`content-analysis/v1/CONTRACT.vi.md`](content-analysis/v1/CONTRACT.vi.md) | Schema, canonical companion source và Authoring API | Chưa có; consumer hiện tại chỉ là Studio | Active, Authoring-only |

Machine-readable index nằm tại [`registry.json`](registry.json). Registry chỉ định vị contract và executable artifacts; semantics normative nằm trong `CONTRACT.vi.md` và schema/fixture được contract dẫn tới.

## Cấu trúc bắt buộc

```text
contracts/
├── README.md
├── registry.json
├── <contract-family>/
│   └── <major-version>/
│       └── CONTRACT.vi.md
└── proposals/
    └── <proposal-id>/
        └── PROPOSAL.vi.md
```

- Contract đã active hoặc đã freeze schema phải có stable `contract_id` và thư mục major version.
- Proposal chưa được duyệt nằm trong `contracts/proposals/`, không thêm field production trước khi promote thành contract versioned.
- Schema, fixture, validator và publisher vẫn ở feature home kỹ thuật (`tooling/`, `scripts/`, `source/`) nhưng phải được canonical contract và registry dẫn tới.
- Không copy executable schema sang app repo. App chỉ giữ consumer conformance note, supported-capability matrix và fixture snapshot có provenance khi test native cần nó.
- Không dùng file trong Authoring/Release output làm nguồn sửa contract.

## Phân loại thay đổi

### Content-compatible

Không cần app release khi thay đổi nằm trong capability/version app đã công bố hỗ trợ, ví dụ thêm content hợp lệ, sửa label/order hoặc metadata mà wire semantics không đổi.

Quy trình:

```text
canonical contract check
→ source/content edit
→ schema + semantic validator
→ coverage/reference validation
→ Authoring review
→ Release gate
```

### App-impacting

Bắt buộc app làm trước khi content Release dùng khi thay schema version, required field, capability, matching/selection semantics, presentation semantic hoặc activation/quarantine behavior.

Quy trình:

```text
proposal/decision trong contract hub
→ mockup nếu có presentation change
→ executable schema + fixtures
→ app decode/validate/render/test
→ app release tương thích
→ content source/publisher
→ Authoring acceptance
→ Release
```

### Synchronized cutover

Dùng khi app và content phải đổi cùng một mốc. Contract phải ghi minimum app capability/version, rollback behavior, package activation rule và Release gate. Không dựa vào “hai bên deploy gần nhau”.

## Checklist trước khi merge hoặc publish

1. Contract ID/schema version/capability có đổi không?
2. App đang phát hành có decode và giữ đúng semantics không?
3. Package thiếu capability sẽ bị reject hay item sẽ bị quarantine ở boundary nào?
4. Schema, fixture và semantic validator có cùng diễn giải không?
5. App conformance note có trỏ đúng canonical path, không chép lại taxonomy/format không?
6. Publisher fail closed và coverage report đã chạy chưa?
7. Mockup/source/screenshot đã được lưu nếu presentation thay đổi chưa?
8. Authoring/Release có bị thay ngoài gate được owner duyệt không?
9. Mọi component content sử dụng có `release_status = allowed` trong support matrix không?

## Quy tắc đường dẫn

- Link trong content repo dùng relative path từ file hiện tại.
- App docs dùng canonical repository path `apps/selflo/shared/contracts/...`; local absolute path chỉ là convenience, không phải identity.
- Khi chuyển contract, phải cập nhật `registry.json`, hai repo entry points, scripts/docs references và chạy `rg` để không còn canonical path cũ.

## Entry points ở hai repo

- Content repo: `apps/selflo/perspective-library/AGENTS.md` bắt buộc đọc hub này trước thay đổi contract/source/publisher.
- App repo: root `AGENTS.md`, `Docs/README.md` và `Docs/features/perspective-content-system/SHARED_CONTRACTS.md` cùng trỏ tới hub này.
