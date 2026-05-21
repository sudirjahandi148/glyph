# GLYPH

Natural-language to SVG icon generator. Compose SVG from a primitive library using rule-based keyword matching, with optional MiMo augmentation for richer prompts.

- Vanilla HTML/CSS/JS, no backend
- 18 SVG primitive functions (circle, polygon, star, mountain, tree, cloud, drop, arrow, lock, key, leaf, wave, etc.)
- 5 color palettes (minimalist, warm-sunset, cool-ocean, neon, nature)
- Export SVG (clipboard, file) and PNG (rendered via canvas)
- MiMo composition spec for prompt-driven structural composition
- MIT licensed

## Live demo

https://sudirjahandi148.github.io/glyph/

## Disclaimer

Composes structural SVG from primitives. AI mode uses MiMo to map prompts; without AI, rule-based keyword matching. No raster generation, no diffusion model.
