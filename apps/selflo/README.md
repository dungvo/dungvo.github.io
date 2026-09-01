# Selflo website

Public root: <https://dungvo.github.io/apps/selflo/>

## Pages

- `/apps/selflo/`: public-facing app home plus entry points to editorial tools.
- `/apps/selflo/preview/`: bulk quote/story review workspace. It renders 12 items per page by default, pairs linked quote/story side by side, shows the complete story in a bounded reader, reports word count/reading time/section count and stores independent quote/story decisions.
- `/apps/selflo/preview/?view=detail`: focused in-app quote/story reader preview.
- `/apps/selflo/preview/?view=matrix`: diversity dashboard backed by `quote-research/diversity-matrix.json` and the live Authoring manifest.
- `/apps/selflo/story-seed/`: local prompt builder for generating Authoring-ready story/quote draft files.
- `/apps/selflo/privacy/`: stable privacy-policy URL for the website and future App Store metadata.

## Review ledger

The Review workspace stores decisions in the current browser and supports JSON import/export. This ledger is editorial memory only: it does not mutate canonical source, approve rights, change lifecycle fields or publish Release content.

## Content boundaries

- Canonical authoring source: `perspective-library/source/vi/`.
- Generated public review package: `perspective-library/authoring/vi/`.
- Release: separate fail-closed channel; this website does not modify it.
- Canonical quote source is split into numbered fragments of at most 12 quote under `source/vi/quotes/<theme>/` so future batches do not make one theme file grow indefinitely.
