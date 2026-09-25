# Chunk Lab — English Practice

A no-build static website made from the English practice sessions of September 22–24, 2026.

## Publish

Copy this entire `english` folder into the repository's `apps/` directory and push it to GitHub Pages. The page will be available at:

`https://dungvo.github.io/apps/english/`

It can also be opened locally by double-clicking `index.html`. No server, package installation, or build command is needed.

## Add learned chunks later

Open `data/chunks.js` and append an object to `window.CHUNKS`. Copy an existing entry and keep its `id` unique. The practice modes, scoring, and review system use the new entry automatically.

Progress is stored only in the browser with `localStorage`. The reset button in the top-right clears it.
