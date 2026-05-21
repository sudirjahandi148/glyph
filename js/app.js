// app.js — entry: bind generate button, run pipeline

(function () {
  'use strict';

  let currentSVG = '';

  async function generate() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) return;

    const palette = document.getElementById('palette-select').value;
    const strokeWidth = parseInt(document.getElementById('stroke-width').value);
    const fillShapes = document.getElementById('fill-shapes').checked;

    let result;
    const aiSpec = await GlyphAI.composeViaMiMo(prompt, { palette });
    if (aiSpec && aiSpec.primitives) {
      const aiResult = GlyphCompose.compose(prompt + ' ' + aiSpec.primitives.map(p => p.type).join(' '), {
        palette, strokeWidth, fillShapes,
      });
      result = aiResult;
    } else {
      result = GlyphCompose.compose(prompt, { palette, strokeWidth, fillShapes });
    }

    currentSVG = result.svg;
    GlyphRender.renderResult(result);
  }

  function bindControls() {
    document.getElementById('btn-generate').addEventListener('click', generate);

    document.getElementById('prompt-input').addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
    });

    const strokeRange = document.getElementById('stroke-width');
    const strokeReadout = document.getElementById('stroke-readout');
    strokeRange.addEventListener('input', () => {
      strokeReadout.textContent = strokeRange.value + ' px';
    });

    document.getElementById('btn-copy').addEventListener('click', async () => {
      await GlyphExport.copyToClipboard(currentSVG);
      const btn = document.getElementById('btn-copy');
      const originalText = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = originalText; }, 1200);
    });

    document.getElementById('btn-download-svg').addEventListener('click', () => {
      GlyphExport.downloadSVG(currentSVG);
    });

    document.getElementById('btn-download-png').addEventListener('click', () => {
      GlyphExport.downloadPNG(currentSVG);
    });
  }

  function bindSettings() {
    const modal = document.getElementById('settings-modal');
    const open = document.getElementById('btn-settings');
    const save = document.getElementById('settings-save');

    open.addEventListener('click', () => {
      const s = GlyphAI.getSettings();
      document.getElementById('mimo-key').value = s.key;
      document.getElementById('mimo-endpoint').value = s.endpoint;
      document.getElementById('mimo-enabled').checked = s.enabled;
      modal.removeAttribute('hidden');
    });

    modal.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => modal.setAttribute('hidden', ''));
    });

    save.addEventListener('click', () => {
      GlyphAI.saveSettings({
        key: document.getElementById('mimo-key').value.trim(),
        endpoint: document.getElementById('mimo-endpoint').value.trim(),
        enabled: document.getElementById('mimo-enabled').checked,
      });
      modal.setAttribute('hidden', '');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindControls();
    bindSettings();
  });
})();
