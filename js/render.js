// render.js — populate output panel

(function () {
  'use strict';

  function renderResult(result) {
    const container = document.getElementById('svg-container');
    container.innerHTML = result.svg;
    document.getElementById('export-bar').removeAttribute('hidden');

    const code = document.getElementById('svg-code');
    code.innerHTML = `<code>${GlyphUtil.escapeHtml(result.svg)}</code>`;

    const list = document.getElementById('primitives-list');
    if (result.breakdown.length === 0) {
      list.innerHTML = '<li class="primitives-list__empty">No primitives matched</li>';
    } else {
      list.innerHTML = result.breakdown.map((b, i) =>
        `<li><span class="primitives-list__type">${GlyphUtil.escapeHtml(b.type)}</span><span>layer ${i + 1}</span></li>`
      ).join('');
    }

    // Animate SVG draw-in
    const svgEl = container.querySelector('svg');
    if (svgEl) {
      svgEl.querySelectorAll('path, polygon, polyline, line').forEach(el => {
        try {
          const len = el.getTotalLength?.();
          if (len > 0) {
            el.style.strokeDasharray = len;
            el.style.strokeDashoffset = len;
            el.style.transition = 'stroke-dashoffset 1s ease-out';
            requestAnimationFrame(() => {
              el.style.strokeDashoffset = 0;
            });
          }
        } catch (e) {}
      });
    }
  }

  function renderEmpty() {
    const container = document.getElementById('svg-container');
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">◆</div>
        <div class="empty-state__text">Type a prompt and hit Generate</div>
      </div>
    `;
    document.getElementById('export-bar').setAttribute('hidden', '');
  }

  window.GlyphRender = { renderResult, renderEmpty };
})();
