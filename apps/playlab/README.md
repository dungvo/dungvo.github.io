# Playlab

Workspace spec-driven cho nhiều game và trải nghiệm tương tác. `playlab` không đại diện cho một thể loại game cụ thể; mỗi experience có vision, mechanics, narrative, learning goals và backlog riêng.

## Experiences

- [Unknown Island — Hòn đảo không có bản đồ](experiences/unknown-island/README.md): trải nghiệm khám phá–giải đố đầu tiên; hiện chỉ có spec và tài liệu.

## Cấu trúc

```text
playlab/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .specify/                 # workflow và template dùng chung
├── .agents/                  # Codex/OpenAI Spec Kit skills
├── .claude/                  # Claude/Anthropic entry points
├── docs/                     # vision, quyết định và handoff cấp Playlab
├── specs/                    # feature dùng chung cho nền tảng (khi có)
└── experiences/
    └── unknown-island/       # tài liệu/spec riêng của game
```

## Quy tắc phân tầng

- Cấp `playlab`: workflow, nguyên tắc dùng chung, tooling và quyết định ảnh hưởng nhiều experience.
- Cấp `experiences/<slug>`: product promise, thế giới, gameplay, learning design và feature spec riêng.
- Không nâng một cơ chế riêng của một game thành quy tắc chung nếu chưa có ít nhất một nhu cầu liên-experience rõ ràng.
- Hiện tại chỉ làm tài liệu/spec; chưa code, deploy, commit hay push.

