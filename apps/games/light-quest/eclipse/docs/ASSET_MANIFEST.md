# Asset manifest

Production preview assets are original generated artwork prepared for this project with OpenAI image generation on 2026-11-15. User-supplied mockups guided the style and composition. Images in the game were generated as separate background and sprite assets, cropped, cleaned, packed and encoded to WebP. The game uses Godot's built-in font and does not import the formerly optional Kenney and Moss Knight assets. Their prototype install scripts remain in history and are no longer called by CI.

| File under `assets/eclipse` | Content and in-game use |
|---|---|
| `moon-tower.webp` | Distant moon, castle, waterfall and valley plate |
| `crystal-tower.webp` | Backlit Gothic gallery for the mirror circuit |
| `guardian-hall.webp` | Violet Moon Tower boss chamber |
| `keeper.webp` | Lantern keeper NPC in the first room |
| `heroes.webp` | An/Kha idle, jump and attack poses; 192×168 cells |
| `hero-run.webp` | Four running poses each for An and Kha; 192×168 cells |
| `hero-states.webp` | Fall, dash, hurt and death poses; 192×168 cells |
| `creatures.webp` | Wolf, golem, caster, bat and guardian; 192×192 cells |
| `ruins.webp` | Mossy platform, door, stone bridge, crystals, mirror and light pedestal |
| `ruin-details.webp` | Ruined pier, open arch, foreground flowers and Moonstone chest |

Source atlas dimensions and gameplay crop regions are recorded in `scripts/eclipse_art.gd`. Use the Git blob SHA for file-level provenance. There are no third-party sprite licenses to redistribute for these atlases.
