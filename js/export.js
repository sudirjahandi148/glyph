// export.js — copy/download SVG, render to PNG via canvas

(function () {
  'use strict';

  function copyToClipboard(svgString) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(svgString);
    }
    const textarea = document.createElement('textarea');
    textarea.value = svgString;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function downloadSVG(svgString, filename = 'glyph.svg') {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadPNG(svgString, filename = 'glyph.png', size = 512) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('canvas blob failed'));
          const dlUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = dlUrl;
          a.download = filename;
          a.click();
          setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
          resolve();
        }, 'image/png');
      };
      img.onerror = e => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  window.GlyphExport = { copyToClipboard, downloadSVG, downloadPNG };
})();
