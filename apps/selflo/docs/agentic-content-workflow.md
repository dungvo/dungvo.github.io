# Selflo Agentic Content Workflow

**Trạng thái:** Accepted  
**Phiên bản:** 1.0  
**Profile:** Minimal content overlay; compatible with app Spec Kit baseline `1.1.3`

## Mục đích

Cho phép AI hỗ trợ từ idea, research, content design, authoring, review tới promotion mà người đọc vẫn hiểu được trạng thái không cần AI. Workflow không thay lifecycle/scripts hiện có và không tự cấp quyền Release.

## Artifact model

- Portfolio/WIP: `content-workspace/REPO_WORK_IN_PROGRESS.vi.md` và inventory liên quan.
- Work package: folder dưới `content-workspace/<capability-or-batch>/` với README/status/next step.
- Research/provenance: `research/` hoặc raw/curated workspace theo current guide.
- Shared proposal/contract: `shared/contracts/proposals/` hoặc versioned contract hub.
- Canonical authoring: `perspective-library/source/vi/`.
- Generated Authoring/Release/API: output, không phải nơi sửa.

Một artifact chỉ có một canonical owner. App repo link sang stable repository path/contract ID; không copy semantics.

## Skills

- `selflo-content-intake-research`: normalize content idea, evidence/source/rights questions và verdict.
- `selflo-content-design-review`: outline/semantics/components/contract impact và role findings.
- `selflo-content-promote`: chuẩn bị/chạy authorized Candidate→Authoring→Release commands với gates.
- `selflo-content-handoff`: cập nhật WIP/inventory/status và one next step.

## Gates

1. Need/audience/channel rõ.
2. Source/provenance/rights đủ cho stage mục tiêu.
3. Claims khớp evidence; uncertainty và evidence against được giữ.
4. Contract impact được phân loại compatible, app-impacting hoặc synchronized cutover.
5. AI review findings được disposition.
6. Owner editorial acceptance trước Release.
7. App capability đã sẵn sàng trước app-impacting Release.

Skill không được tự xác nhận quyền, knowledge check, owner approval, `--push` hoặc Release. Missing gate là blocker bình thường, không phải lý do tạo default.

## Standalone operation

Repo content không cần app checkout để research/authoring compatible content. Khi cần app-impacting contract, record stable link tới `dungvo/selflo` workspace/conformance; local sibling path chỉ là convenience và không được commit làm identity.

## Continuity

Session mới bắt đầu bằng:

```text
Đọc apps/selflo/AGENTS.md và REPO_WORK_IN_PROGRESS.vi.md, tiếp tục đúng một next step.
```

WIP record phải nói artifact nào canonical, stage/channel, decisions, evidence/commands, blocker và next step.
