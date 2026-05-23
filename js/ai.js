// ai.js — AI composition (returns SVG-friendly spec)

(function () {
  'use strict';

  const DEFAULT_ENDPOINT = 'https://token-plan-sgp.xiaomimimo.com';

  function getSettings() {
    return {
      key: localStorage.getItem('glyph:mimoKey') || '',
      endpoint: localStorage.getItem('glyph:mimoEndpoint') || DEFAULT_ENDPOINT,
      enabled: localStorage.getItem('glyph:mimoEnabled') === 'true',
    };
  }

  function saveSettings(s) {
    localStorage.setItem('glyph:mimoKey', s.key || '');
    localStorage.setItem('glyph:mimoEndpoint', s.endpoint || DEFAULT_ENDPOINT);
    localStorage.setItem('glyph:mimoEnabled', s.enabled ? 'true' : 'false');
  }

  async function composeViaMiMo(prompt, options) {
    const settings = getSettings();
    if (!settings.enabled || !settings.key) return null;

    const palette = options.palette;
    const aiPrompt = `You compose SVG icons from a primitive library. Output JSON only:

{"primitives": [{"type": "<one of: mountain, mountainRange, tree, sun, moon, cloud, drop, arrow, lock, key, leaf, wave, star, circle, triangle, rect, hexagon, diamond>", "layer": <1-5>, "primary": <bool>}], "narrative": "<one sentence>"}

User prompt: "${prompt}"
Palette: ${palette}

Output JSON only, no commentary, no markdown fence.`;

    try {
      const res = await fetch(`${settings.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.key}`,
        },
        body: JSON.stringify({
          model: 'ai-v2.5-pro',
          messages: [
            { role: 'system', content: 'You compose SVG icons from a primitive library. Output JSON only.' },
            { role: 'user', content: aiPrompt },
          ],
          temperature: 0.5,
          max_tokens: 600,
        }),
      });
      if (!res.ok) throw new Error('ai failed: ' + res.status);
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      console.warn('[ai] failed:', e);
    }
    return null;
  }

  window.GlyphAI = { getSettings, saveSettings, composeViaMiMo };
})();
