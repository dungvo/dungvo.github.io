# Kiến trúc kỹ thuật định hướng

Tài liệu này ghi **constraints và đề xuất**, chưa cấp quyền implementation.

## Đã chốt cho giai đoạn đầu

- Hosting mục tiêu: static GitHub Pages.
- Offline-first, không yêu cầu login/mạng sau lần tải phù hợp.
- Save trên thiết bị; chưa Firebase/cloud sync/backend (`DEC-004`).
- Game 2D đơn giản; gameplay systems quan trọng hơn độ phức tạp đồ họa.

## Đề xuất stack, cần spike trước khi chốt dependency

- TypeScript + Phaser 3; tilemap 2D.
- IndexedDB cho save có version; localStorage chỉ phù hợp preference nhỏ.
- Service worker/app shell nếu mục tiêu offline sau lần tải đầu được chốt chi tiết.
- Static asset/data files cho world, rules, dialogue; logic hệ thống tách khỏi scene/UI.

## Ranh giới hệ thống đề xuất

1. Input/accessibility
2. World navigation and collision
3. Deterministic interaction/rule engine
4. Inventory, tools and capabilities
5. World-state and consequence graph
6. Progression/narrative
7. Save/load/migration
8. Hint and learning-observation layer (local only unless data policy changes)

## Save principles

- Versioned schema, atomic checkpoints, explicit corruption fallback/export option to discuss.
- Save world state, discovered areas, inventory/capabilities, completed outcomes and playtime if needed.
- Do not infer or store child identity, grade, behavior profile or analytics without a separate privacy decision.
- Browser storage may be cleared and does not sync across browsers/devices; UI must not promise otherwise.

## Deferred architecture

Firebase Authentication, Firestore, anonymous accounts, cloud conflict resolution and cross-device sync remain future options—not current requirements.

