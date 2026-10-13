# Selflo Content Tooling Pin

- Compatible Spec Kit baseline: `1.1.3`
- Compatible Idea Assessment baseline: `1.0.1`
- Profile: minimal content overlay

This subtree intentionally does not duplicate the app repo's full upstream scaffold. `apps/selflo/AGENTS.md`, `docs/agentic-content-workflow.md`, templates, and `.agents/skills/selflo-content-*` make the content workflow standalone. Shared contract, source, validator, owner, and promotion rules remain authoritative.

Upgrade content skills only after the app sandbox diff confirms workflow compatibility. No initializer may overwrite content overlay files.
