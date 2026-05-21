// primitives.js — SVG primitive library

(function () {
  'use strict';

  function pCircle({ cx, cy, r, fill, stroke, strokeWidth }) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"/>`;
  }

  function pEllipse({ cx, cy, rx, ry, fill, stroke, strokeWidth, rotation }) {
    const transform = rotation ? ` transform="rotate(${rotation} ${cx} ${cy})"` : '';
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"${transform}/>`;
  }

  function pRect({ x, y, w, h, rx, fill, stroke, strokeWidth }) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"/>`;
  }

  function pPolygon({ points, fill, stroke, strokeWidth }) {
    return `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"/>`;
  }

  function pNgon({ cx, cy, r, sides, rotate = 0, fill, stroke, strokeWidth }) {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI - Math.PI / 2 + (rotate * Math.PI / 180);
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pPolygon({ points, fill, stroke, strokeWidth });
  }

  function pStar({ cx, cy, rOuter, rInner, points = 5, fill, stroke, strokeWidth }) {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? rOuter : rInner;
      const angle = (i / (points * 2)) * 2 * Math.PI - Math.PI / 2;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pPolygon({ points: pts, fill, stroke, strokeWidth });
  }

  function pPath({ d, fill, stroke, strokeWidth }) {
    return `<path d="${d}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function pMountain({ baseX, baseY, w, h, fill, stroke, strokeWidth }) {
    const peak = [baseX + w / 2, baseY - h];
    const left = [baseX, baseY];
    const right = [baseX + w, baseY];
    return pPolygon({ points: [left, peak, right], fill, stroke, strokeWidth });
  }

  function pTree({ baseX, baseY, h, fill, stroke, strokeWidth }) {
    const trunkW = h * 0.1;
    const trunk = pRect({ x: baseX - trunkW / 2, y: baseY - h * 0.3, w: trunkW, h: h * 0.3, fill: stroke || fill });
    const crown = pPolygon({
      points: [[baseX - h * 0.4, baseY - h * 0.3], [baseX, baseY - h], [baseX + h * 0.4, baseY - h * 0.3]],
      fill, stroke, strokeWidth,
    });
    return trunk + crown;
  }

  function pSun({ cx, cy, r, rays = 8, fill, stroke, strokeWidth }) {
    let s = pCircle({ cx, cy, r, fill, stroke, strokeWidth });
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * 2 * Math.PI;
      const x1 = cx + (r + 4) * Math.cos(a);
      const y1 = cy + (r + 4) * Math.sin(a);
      const x2 = cx + (r + r * 0.6) * Math.cos(a);
      const y2 = cy + (r + r * 0.6) * Math.sin(a);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke || fill}" stroke-width="${strokeWidth || 2}" stroke-linecap="round"/>`;
    }
    return s;
  }

  function pMoon({ cx, cy, r, fill, stroke, strokeWidth }) {
    const offset = r * 0.4;
    return `<path d="M ${cx + offset} ${cy - r} A ${r} ${r} 0 1 0 ${cx + offset} ${cy + r} A ${r * 0.7} ${r * 0.7} 0 1 1 ${cx + offset} ${cy - r}" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"/>`;
  }

  function pCloud({ cx, cy, w, fill, stroke, strokeWidth }) {
    const h = w * 0.5;
    const sw = strokeWidth || 0;
    return `
      <ellipse cx="${cx - w * 0.2}" cy="${cy}" rx="${w * 0.25}" ry="${h * 0.4}" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${sw}"/>
      <ellipse cx="${cx}" cy="${cy - h * 0.1}" rx="${w * 0.3}" ry="${h * 0.5}" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${sw}"/>
      <ellipse cx="${cx + w * 0.25}" cy="${cy}" rx="${w * 0.25}" ry="${h * 0.4}" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${sw}"/>
      <rect x="${cx - w * 0.4}" y="${cy}" width="${w * 0.8}" height="${h * 0.3}" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${sw}"/>
    `;
  }

  function pDrop({ cx, cy, h, fill, stroke, strokeWidth }) {
    const w = h * 0.7;
    return `<path d="M ${cx} ${cy - h / 2} Q ${cx + w / 2} ${cy} ${cx + w / 2 * 0.4} ${cy + h / 2 * 0.4} A ${w / 2} ${w / 2} 0 1 1 ${cx - w / 2 * 0.4} ${cy + h / 2 * 0.4} Q ${cx - w / 2} ${cy} ${cx} ${cy - h / 2} Z" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"/>`;
  }

  function pArrow({ x1, y1, x2, y2, head = 12, fill, stroke, strokeWidth }) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const hx1 = x2 - head * Math.cos(angle - Math.PI / 6);
    const hy1 = y2 - head * Math.sin(angle - Math.PI / 6);
    const hx2 = x2 - head * Math.cos(angle + Math.PI / 6);
    const hy2 = y2 - head * Math.sin(angle + Math.PI / 6);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke || fill}" stroke-width="${strokeWidth || 2}" stroke-linecap="round"/>` +
           `<polygon points="${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}" fill="${stroke || fill}"/>`;
  }

  function pLock({ cx, cy, w, fill, stroke, strokeWidth }) {
    const h = w * 1.2;
    const arcRadius = w * 0.35;
    const sw = strokeWidth || 2;
    return `
      <path d="M ${cx - arcRadius} ${cy - h * 0.1} v ${-arcRadius} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${cy - h * 0.1 - arcRadius}" fill="none" stroke="${stroke || fill}" stroke-width="${sw}" stroke-linecap="round"/>
      <rect x="${cx - w / 2}" y="${cy - h * 0.1}" width="${w}" height="${h * 0.6}" rx="6" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${sw}"/>
    `;
  }

  function pKey({ cx, cy, w, fill, stroke, strokeWidth }) {
    const sw = strokeWidth || 2;
    const headR = w * 0.18;
    return `
      <circle cx="${cx - w * 0.3}" cy="${cy}" r="${headR}" fill="none" stroke="${stroke || fill}" stroke-width="${sw}"/>
      <line x1="${cx - w * 0.3 + headR}" y1="${cy}" x2="${cx + w / 2}" y2="${cy}" stroke="${stroke || fill}" stroke-width="${sw}" stroke-linecap="round"/>
      <line x1="${cx + w / 2 * 0.7}" y1="${cy}" x2="${cx + w / 2 * 0.7}" y2="${cy + w * 0.15}" stroke="${stroke || fill}" stroke-width="${sw}" stroke-linecap="round"/>
      <line x1="${cx + w / 2 * 0.85}" y1="${cy}" x2="${cx + w / 2 * 0.85}" y2="${cy + w * 0.1}" stroke="${stroke || fill}" stroke-width="${sw}" stroke-linecap="round"/>
    `;
  }

  function pLeaf({ cx, cy, w, rotation = 0, fill, stroke, strokeWidth }) {
    const transform = ` transform="rotate(${rotation} ${cx} ${cy})"`;
    return `<path d="M ${cx} ${cy + w / 2} Q ${cx + w / 2} ${cy} ${cx} ${cy - w / 2} Q ${cx - w / 2} ${cy} ${cx} ${cy + w / 2} Z" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="${strokeWidth || 0}"${transform}/>`;
  }

  function pWave({ x, y, w, amplitude, frequency = 2, stroke, strokeWidth }) {
    const segments = 60;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const px = x + t * w;
      const py = y + Math.sin(t * Math.PI * frequency * 2) * amplitude;
      points.push(`${px} ${py}`);
    }
    return `<polyline points="${points.join(' ')}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth || 2}" stroke-linecap="round"/>`;
  }

  function pMountainRange({ baseX, baseY, w, h, peaks = 3, fill, stroke, strokeWidth }) {
    const points = [[baseX, baseY]];
    for (let i = 0; i < peaks; i++) {
      const pX = baseX + (i + 0.5) * (w / peaks);
      const pY = baseY - h * (0.6 + Math.sin(i) * 0.4);
      points.push([pX - w / peaks * 0.4, baseY - h * 0.2]);
      points.push([pX, pY]);
      points.push([pX + w / peaks * 0.4, baseY - h * 0.2]);
    }
    points.push([baseX + w, baseY]);
    return pPolygon({ points, fill, stroke, strokeWidth });
  }

  window.GlyphPrimitives = {
    pCircle, pEllipse, pRect, pPolygon, pNgon, pStar, pPath,
    pMountain, pTree, pSun, pMoon, pCloud, pDrop, pArrow,
    pLock, pKey, pLeaf, pWave, pMountainRange,
  };
})();
