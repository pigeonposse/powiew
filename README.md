# Powiew by _PIGEONPOSSE_

[![HEADER](https://github.com/pigeonposse/powiew/blob/main/docs/banner.png?raw=true)](https://github.com/pigeonposse/powiew)

[![Web](https://img.shields.io/badge/Web-grey?style=flat-square)](https://pigeonposse.com/)
[![Github](https://img.shields.io/badge/Github-grey?style=flat-square)](https://github.com/pigeon-posse)
![Version](https://img.shields.io/badge/version-2.1.0-blue.svg) ![License GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-green.svg) ![Chart.js](https://img.shields.io/badge/Chart.js-4.x-blue.svg) ![D3.js](https://img.shields.io/badge/D3.js-7.x-orange.svg) ![Three.js](https://img.shields.io/badge/Three.js-r170-yellow.svg)

**Chart.js + D3.js + Three.js in one API. And now it can read charts from images.**

Powiew gives you one consistent interface for 2D charts, D3 diagrams and 3D scenes, with themes, events, export, and — new in 2.1 — **image → chart**: hand it a screenshot or photo of a chart and it recovers the data with a vision model and redraws it as a live, editable, themeable visualization.

✨ What's new in 2.1
-------------------

*   **🖼️ Image → Chart (multimodal)** — `vis.fromImage('#chart', photo)` extracts the data behind a chart image and renders it.
*   **🛡️ Never silently wrong** — every extraction is validated and returns `warnings` (values estimated by eye, unreadable values, label/series mismatches, low confidence).
*   **🔌 Any vision model** — built-in Anthropic adapter, or plug in your own function.
*   **🧱 Working build** — ESM, CJS and a single-file browser bundle (esbuild); no more broken webpack setup.
*   **🧪 Tests** — unit tests for the extraction pipeline and browser smoke tests for Chart.js, D3 and Three.js.

[![HEADER](https://github.com/pigeonposse/powiew/blob/main/docs/banner2.png?raw=true)](https://github.com/pigeonposse)

🚀 Installation
---------------

### npm

    npm install powiew d3 three

Chart.js is a peer dependency loaded as a global (`window.Chart`) before you create charts:

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

### Browser (single file, d3 and three included)

    <script src="https://cdn.jsdelivr.net/npm/powiew@2.1.0/dist/powiew.min.js"></script>

🖼️ Image → Chart
----------------

    import { Powiew, anthropicProvider } from 'powiew';

    const vis = new Powiew({
      // Point at your own proxy so the API key never reaches the browser
      provider: anthropicProvider({ endpoint: '/api/vision' })
    });

    const { visualization, spec, warnings } =
      await vis.fromImage('#chart', fileInput.files[0]);

    if (warnings.length) showToUser(warnings);
    // e.g. ["values were estimated by eye, not read from printed labels"]

*   **Input:** `File`/`Blob`, URL, data URL, `<img>`, `<canvas>`, or raw bytes. Large images are downscaled in the browser first.
*   **Output:** a live Chart.js or D3 visualization you can `update`, `setTheme`, `exportAsImage`, `destroy`.
*   **Data only:** `await vis.extractFromImage(src)` returns `{ spec, warnings, render }` without drawing anything.
*   **Reads:** bar, line, pie, doughnut, radar, scatter, bubble, polar area, tree, treemap, pack and force graphs.
*   **Your model:** `new Powiew({ provider: async ({ image, prompt }) => jsonText })`. The default Anthropic model is `claude-sonnet-5-5`; override with `anthropicProvider({ model })`.
*   **Validated:** replies that are not a supported visualization are rejected; thousands separators are cleaned; mismatched series are flagged.

> Extraction quality depends on the model and the image. Always surface `warnings` to users when decisions depend on the numbers.

📊 Basic Usage
--------------

    const vis = new Powiew({ theme: 'dark', responsive: true });

    // Chart.js
    vis.createChart('#bar', 'bar', {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ label: 'Revenue', data: [65, 59, 80] }]
    });

    // D3
    vis.createD3Visualization('#tree', 'tree', {
      name: 'root', children: [{ name: 'a', value: 1 }, { name: 'b', value: 2 }]
    });

    // Three.js
    vis.create3DVisualization('#bars3d', 'bar3d', {
      labels: ['A', 'B'], datasets: [{ label: 'S', data: [3, 5] }]
    });

    // Events and themes
    vis.on('chartCreated', chart => console.log(chart));
    vis.setTheme('light');

📈 Supported Visualizations
---------------------------

| Engine | Status | Types |
| --- | --- | --- |
| Chart.js | ✅ Working | bar, line, pie, doughnut, radar, polarArea, bubble, scatter |
| D3.js | ✅ Working | tree, force, treemap, pack |
| D3.js | 🚧 Planned | sankey, chord (placeholders today) |
| Three.js | ✅ Working | bar3d, scatter3d |
| Three.js | 🚧 Planned | surface, globe (placeholders today) |

📖 API Reference
----------------

*   `new Powiew({ theme, responsive, debug, provider })`
*   `createChart(container, type, data, options)` — Chart.js
*   `createD3Visualization(container, type, data, options)` — D3
*   `create3DVisualization(container, type, data, options)` — Three.js
*   `fromImage(container, source, { provider, chartOptions })` → `{ visualization, spec, warnings }`
*   `extractFromImage(source, { provider, prompt, maxEdge })` → `{ spec, warnings, render, image }`
*   `updateVisualization(viz, data, options)` / `destroyVisualization(viz)`
*   `exportAsImage(viz, format, options)`
*   `setTheme(theme)` / `on(event, fn)` / `off(event, fn)`

Also exported: `anthropicProvider`, `extractFromImage`.

🛠️ Development
---------------

    npm run build:lib   # dist/powiew.esm.js, powiew.cjs, powiew.min.js
    npm test            # unit tests (no network, no API cost)

Browser smoke tests live in `tests/browser.html` and `tests/browser3d.html`; serve the repo root (for example `python3 -m http.server`) and open them.

🌐 Browser Compatibility
------------------------

Any modern browser with WebGL (for 3D): Chrome, Firefox, Safari and Edge current versions.

## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)

## 📜 License

This software is licensed with **[GPL-3.0](/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)

## 🐦 About us

_PigeonPosse_ is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)

### Collaborators

|                                                                                    | Name        | Role         | GitHub                                         |
| ---------------------------------------------------------------------------------- | ----------- | ------------ | ---------------------------------------------- |
| ![Alejo](https://github.com/alejomalia.png?size=72) | Alejo |   Author & Development   | [@alejomalia](https://github.com/alejomalia) |
| ![Pigeonposse](https://github.com/pigeonposse.png?size=72) | PigeonPosse | Collective | [@PigeonPosse](https://github.com/pigeonposse) |

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)
