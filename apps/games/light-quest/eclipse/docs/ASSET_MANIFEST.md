# Asset manifest

Production preview assets are original generated artwork prepared for this project with OpenAI image generation on 2026-11-15. User-supplied mockups guided the style and composition. Images in the game were generated as separate background and sprite assets, cropped, cleaned, packed and encoded to WebP. The game uses Godot's built-in font and does not import the formerly optional Kenney and Moss Knight assets. Their prototype install scripts remain in history and are no longer called by CI.

| File under `assets/eclipse` | Content and in-game use |
|---|---|
| `moon-tower.webp` | Distant moon, castle, waterfall and valley plate |
| `crystal-tower.webp` | Backlit Gothic gallery for the mirror circuit |
| `guardian-hall.webp` | Violet Moon Tower boss chamber |
| `keeper.webp` | Lantern keeper NPC in the first room |
| `an-combo.webp` | Three An attack anticipation poses and three matching strikes, 256×168 cells |
| `monster-actions.webp` | Wolf and Guardian tell, strike and recovery art, 256×192 cells |
| `heroes.webp` | An/Kha idle, jump and attack poses; 192×168 cells |
| `hero-run.webp` | Four running poses each for An and Kha; 192×168 cells |
| `hero-states.webp` | Fall, dash, hurt and death poses; 192×168 cells |
| `creatures.webp` | Wolf, golem, caster, bat and guardian; 192×192 cells |
| `ruins.webp` | Mossy platform, door, stone bridge, crystals, mirror and light pedestal |
| `ruin-details.webp` | Ruined pier, open arch, foreground flowers and Moonstone chest |

Source atlas dimensions and gameplay crop regions are recorded in `scripts/eclipse_art.gd`. Use the Git blob SHA for file-level provenance. There are no third-party sprite licenses to redistribute for these atlases.

Eight original, synthesized 22.05 kHz mono WAV cues ship under `assets/eclipse/sound/`. They cover slashes, casting, contact, taking a hit, activating light, dashing, the Guardian phase change and victory.


## V4 original ascent background atlas

`assets/eclipse/ascent-atlas.webp` is an original three-panel background atlas generated for this project with the built-in image-generation tool, using `moon-tower.webp` only as a style reference. The generated PNG was preserved in the workspace and converted to WebP for the game. The original sprites and earlier backgrounds were not overwritten.

Prompt: “Production background atlas for an original Godot 2D fantasy action adventure; exactly three equal-width tall panels in a 1536×1024 image: ancient bell tower, hanging cloud garden, eclipse summit. Keep the existing rich hand-painted sapphire fantasy aesthetic, luminous architecture and moss. Each portrait scene transitions from darker depths to a bright summit. Keep central gameplay space atmospheric; no characters, enemies, UI, labels or text; no recognizable game settings or characters.”

The three AtlasTexture regions are selected by the Godot sky campaign, and the large portrait background scrolls with altitude. Gameplay platforms, anchors and interactables remain actual Godot nodes layered over the art.
