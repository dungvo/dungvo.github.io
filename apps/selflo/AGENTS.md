# Hướng dẫn AI agent cho Selflo content

File này áp dụng cho toàn bộ `apps/selflo/`. Website repo ngoài subtree này không thuộc scope nếu task không nói rõ.

## Thứ tự đọc

1. Đọc `content-workspace/REPO_WORK_IN_PROGRESS.vi.md` để biết việc đang làm, parked và next step.
2. Đọc `README.md` để chọn đúng khu vực và content lifecycle.
3. Đọc `docs/agentic-content-workflow.md`.
4. Nếu thay format/semantics/app integration, đọc `shared/README.md` rồi `shared/contracts/README.md`.
5. Nếu sửa Perspective source/publisher, đọc `perspective-library/AGENTS.md` và tài liệu lifecycle liên quan.
6. Chỉ đọc research/workspace/source của item đang làm; không scan toàn repo hoặc dùng generated Release/API làm authoring source.

## Authority và ownership

- Canonical shared wire format, taxonomy và content semantics: `shared/contracts/`.
- Canonical Perspective authoring source: `perspective-library/source/vi/`.
- Candidate/WIP/research: `content-workspace/` và `research/`; không phải Release.
- Generated Authoring/Release/API không sửa tay.
- App behavior/UI/native conformance thuộc app repo `dungvo/selflo`; link sang app workspace/contract thay vì copy.

`selflo-content-*` skills là workflow overlay. `.specify/VENDOR.md` chỉ pin provenance; repo này dùng minimal content profile và không có quyền bypass source, rights, knowledge, owner hoặc Release gates.

## Hard gates

Dừng hỏi owner hoặc quay về proposal khi thiếu quyết định làm đổi product promise, editorial voice nhạy cảm, rights/source acceptance, diagnostic/clinical claim, shared contract/cutover, privacy/data use hoặc Release. Không tự truyền cờ xác nhận rights/knowledge, không tự dùng `--push`, không promote Release nếu owner chưa accept.

## Quy trình

```text
Read
→ inspect WIP/source/contracts
→ intake/research + evidence against
→ content design/contract impact
→ AI editorial/source/rights/knowledge review
→ owner decision khi cần
→ edit canonical source
→ validators/build preview
→ Authoring review
→ owner Release acceptance
→ promotion command được authorize
→ update WIP/handoff
```

Giữ nguyên dirty worktree của người khác. Không xóa/move/reformat content ngoài scope. Báo cáo file, validator/command thực sự đã chạy, channel/contract impact, blocker và đúng một next step.
