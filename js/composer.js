// composer.js — rule-based prompt → SVG composition

(function () {
  'use strict';

  const PALETTES = {
    'minimalist': { fg: '#FFFFFF', accent: '#A0A0A0', bg: 'transparent' },
    'warm-sunset': { fg: '#F97316', accent: '#FBBF24', bg: '#1F1410' },
    'cool-ocean': { fg: '#0EA5E9', accent: '#67E8F9', bg: '#0A1320' },
    'neon': { fg: '#EC4899', accent: '#22D3EE', bg: '#0A0A1F' },
    'nature': { fg: '#7AC74F', accent: '#D4AF37', bg: '#0F1A0A' },
  };

  const KEYWORD_RULES = [
    { match: /mountain.range|mountains/, primitives: ['mountainRange'] },
    { match: /mountain/, primitives: ['mountain'] },
    { match: /tree|forest/, primitives: ['tree'] },
    { match: /sun|sunshine|sunny/, primitives: ['sun'] },
    { match: /moon|crescent|night/, primitives: ['moon'] },
    { match: /cloud/, primitives: ['cloud'] },
    { match: /water.drop|drop|raindrop/, primitives: ['drop'] },
    { match: /arrow|pointer/, primitives: ['arrow'] },
    { match: /lock|secure|padlock/, primitives: ['lock'] },
    { match: /key/, primitives: ['key'] },
    { match: /leaf|leaves/, primitives: ['leaf'] },
    { match: /wave|ocean|sea/, primitives: ['wave'] },
    { match: /star/, primitives: ['star'] },
    { match: /circle|round|ball/, primitives: ['circle'] },
    { match: /triangle/, primitives: ['triangle'] },
    { match: /square|box|rect/, primitives: ['rect'] },
    { match: /hexagon|honeycomb/, primitives: ['hexagon'] },
    { match: /diamond/, primitives: ['diamond'] },
    { match: /sky|landscape/, primitives: ['sun', 'mountain', 'cloud'] },
    { match: /forest landscape|nature scene/, primitives: ['mountain', 'tree', 'sun'] },
    { match: /night sky/, primitives: ['moon', 'star'] },
    { match: /rainy|rain/, primitives: ['cloud', 'drop'] },
    { match: /security/, primitives: ['lock', 'key'] },
  ];

  function compose(prompt, options) {
    const palette = PALETTES[options.palette] || PALETTES.minimalist;
    const strokeWidth = options.strokeWidth || 2;
    const fillMode = options.fillShapes;
    const seed = GlyphUtil.hashCode(prompt) || 1;
    const rand = GlyphUtil.rng(seed);

    const lower = prompt.toLowerCase();
    const matchedPrimitives = [];
    KEYWORD_RULES.forEach(rule => {
      if (rule.match.test(lower)) {
        rule.primitives.forEach(p => {
          if (!matchedPrimitives.includes(p)) matchedPrimitives.push(p);
        });
      }
    });

    if (matchedPrimitives.length === 0) {
      // Fallback: random geometric composition
      const choices = ['circle', 'triangle', 'rect', 'hexagon', 'star'];
      const count = Math.floor(rand() * 3) + 2;
      for (let i = 0; i < count; i++) {
        matchedPrimitives.push(choices[Math.floor(rand() * choices.length)]);
      }
    }

    const items = [];
    matchedPrimitives.forEach((type, idx) => {
      const item = renderPrimitive(type, idx, matchedPrimitives.length, rand, palette, strokeWidth, fillMode);
      if (item) items.push({ type, svg: item });
    });

    return {
      svg: assembleSVG(items, palette),
      breakdown: items.map(i => ({ type: humanType(i.type) })),
      palette: options.palette,
    };
  }

  function renderPrimitive(type, idx, total, rand, palette, sw, fill) {
    const P = GlyphPrimitives;
    const fillColor = fill ? (idx % 2 === 0 ? palette.fg : palette.accent) : 'none';
    const strokeColor = palette.fg;

    switch (type) {
      case 'mountain':
        return P.pMountain({ baseX: 60, baseY: 180, w: 180, h: 120, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'mountainRange':
        return P.pMountainRange({ baseX: 30, baseY: 180, w: 240, h: 120, peaks: 3, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'tree':
        return P.pTree({ baseX: 100 + idx * 50, baseY: 200, h: 100, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'sun':
        return P.pSun({ cx: 220, cy: 70, r: 28, rays: 8, fill: palette.accent, stroke: palette.accent, strokeWidth: sw });
      case 'moon':
        return P.pMoon({ cx: 220, cy: 70, r: 28, fill: palette.accent, stroke: 'none', strokeWidth: 0 });
      case 'cloud':
        return P.pCloud({ cx: 90 + idx * 40, cy: 70, w: 80, fill: palette.accent, stroke: strokeColor, strokeWidth: sw * 0.6 });
      case 'drop':
        return P.pDrop({ cx: 100 + idx * 30, cy: 110, h: 50, fill: palette.accent, stroke: 'none', strokeWidth: 0 });
      case 'arrow':
        return P.pArrow({ x1: 60, y1: 150, x2: 240, y2: 90, head: 14, fill: fillColor, stroke: strokeColor, strokeWidth: sw + 1 });
      case 'lock':
        return P.pLock({ cx: 150, cy: 130, w: 70, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'key':
        return P.pKey({ cx: 150, cy: 150, w: 140, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'leaf':
        return P.pLeaf({ cx: 150 + (idx - total / 2) * 40, cy: 130, w: 60, rotation: idx * 30, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'wave':
        return P.pWave({ x: 30, y: 140 + idx * 20, w: 240, amplitude: 14, frequency: 2, stroke: strokeColor, strokeWidth: sw });
      case 'star':
        return P.pStar({ cx: 150 + (idx - total / 2) * 40, cy: 80, rOuter: 24, rInner: 12, points: 5, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'circle':
        return P.pCircle({ cx: 80 + idx * 50, cy: 130, r: 30, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'triangle':
        return P.pNgon({ cx: 100 + idx * 50, cy: 130, r: 36, sides: 3, rotate: 0, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'rect':
        return P.pRect({ x: 80 + idx * 50, y: 100, w: 60, h: 60, rx: 6, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'hexagon':
        return P.pNgon({ cx: 100 + idx * 50, cy: 130, r: 32, sides: 6, rotate: 30, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      case 'diamond':
        return P.pNgon({ cx: 100 + idx * 50, cy: 130, r: 32, sides: 4, rotate: 0, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
      default:
        return P.pCircle({ cx: 100, cy: 130, r: 30, fill: fillColor, stroke: strokeColor, strokeWidth: sw });
    }
  }

  function assembleSVG(items, palette) {
    const inner = items.map(i => i.svg).join('\n  ');
    const bg = palette.bg !== 'transparent' ? `<rect width="300" height="240" fill="${palette.bg}"/>\n  ` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
  ${bg}${inner}
</svg>`;
  }

  function humanType(t) {
    const map = {
      mountain: 'Mountain', mountainRange: 'Mountain Range', tree: 'Tree',
      sun: 'Sun', moon: 'Moon', cloud: 'Cloud', drop: 'Water drop',
      arrow: 'Arrow', lock: 'Lock', key: 'Key', leaf: 'Leaf', wave: 'Wave',
      star: 'Star', circle: 'Circle', triangle: 'Triangle', rect: 'Rectangle',
      hexagon: 'Hexagon', diamond: 'Diamond',
    };
    return map[t] || t;
  }

  window.GlyphCompose = { compose, PALETTES };
})();
