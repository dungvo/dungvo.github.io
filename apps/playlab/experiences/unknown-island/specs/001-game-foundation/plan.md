# Plan: Game foundation documentation

**Status**: Complete  
**Implementation authorized**: Documentation only

## Approach

Reuse the existing repository's Vietnamese-first, read-order, constitution, owner-gate and handoff conventions. Use GitHub Spec Kit-compatible artifact names without copying application-specific Selflo rules. Add thin Codex/Claude entry points that converge on the same docs.

## Verification

- Confirm target name does not conflict under `apps/`.
- Inspect tree and references for broken relative links.
- Confirm prohibited implementation/deployment files are absent.
- Confirm Git status changes are limited to the new app folder and preserve existing unrelated changes.

