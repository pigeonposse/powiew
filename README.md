# Powiew by _PIGEONPOSSE_

![HEADER](https://github.com/pigeonposse/powiew/blob/main/docs/banner.png)

[![Web](https://img.shields.io/badge/Web-grey?style=flat-square)](https://pigeonposse.com/)
[![About us](https://img.shields.io/badge/About%20us-grey?style=flat-square)](https://pigeonposse.com/?popup=about)
[![Github](https://img.shields.io/badge/Github-grey?style=flat-square)](https://github.com/pigeon-posse)
[![Donate](https://img.shields.io/badge/Donate-pink?style=flat-square)](https://pigeonposse.com/?popup=donate)
![Version 2.0.0](https://img.shields.io/badge/version-2.0.0-blue.svg) ![License MIT](https://img.shields.io/badge/license-MIT-green.svg) ![Chart.js](https://img.shields.io/badge/Chart.js-4.x-blue.svg) ![D3.js](https://img.shields.io/badge/D3.js-7.x-orange.svg) ![Three.js](https://img.shields.io/badge/Three.js-r128-yellow.svg)

📋 Overview
-----------

**Powiew** is a revolutionary data visualization library that elegantly unifies the capabilities of *Chart.js, D3.js,* and *Three.js* under a single intuitive API. Designed to simplify the complexity of modern data visualization, Powiew enables developers to effortlessly create everything from traditional statistical charts to complex 3D data visualizations, all through a consistent interface. 

With a robust built-in theming system, intelligent data processing, and advanced event management, Powiew eliminates the need to master multiple libraries while retaining the full power of the underlying tools. Whether for interactive business dashboards, intricate scientific visualizations, or real-time data representations, Powiew democratizes advanced data visualization without compromising flexibility or performance.

✨ Key Features
--------------

*   **🔄 Unified API** - Work with multiple visualization libraries through a single interface
*   **📱 Responsive Design** - Visualizations automatically adapt to different screen sizes
*   **🎨 Theme Support** - Built-in light and dark themes with easy customization
*   **🔮 Data Processing** - Utilities for data transformation, normalization, and aggregation
*   **✨ Animation** - Smooth, customizable animations for all visualization types
*   **💾 Export Capabilities** - Export visualizations as PNG, JPEG, or SVG
*   **🎯 Event System** - Comprehensive event system for interaction

![HEADER](https://github.com/pigeonposse/powiew/blob/main/docs/banner2.png)

🚀 Installation
---------------

### Using npm

    npm install powiew

### Using yarn

    yarn add powiew

### Using CDN

    <script src="https://cdn.jsdelivr.net/npm/powiew@2.0.0/dist/powiew.min.js"></script>

### Dependencies

Powiew requires the following libraries:

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

📊 Basic Usage
--------------

### Initialize Powiew

    // Create a new Powiew instance
    const vis = new Powiew({
      debug: true,
      responsive: true
    });

### Create a Chart

    // Create a bar chart
    const barChart = vis.createChart('#bar-chart', 'bar', {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'Revenue 2025',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    });

### Create a D3 Visualization

    // Create a force-directed graph
    const forceGraph = vis.createD3Visualization('#force-graph', 'force', {
      nodes: [
        { id: 'A', group: 1 },
        { id: 'B', group: 1 },
        { id: 'C', group: 2 }
      ],
      links: [
        { source: 'A', target: 'B', value: 1 },
        { source: 'A', target: 'C', value: 1 }
      ]
    });

### Apply a Theme

    // Switch to dark theme
    vis.setTheme('dark');

📈 Supported Visualization Types
--------------------------------

### Chart.js Visualizations

*   Bar
*   Line
*   Pie
*   Doughnut
*   Radar
*   Polar Area
*   Bubble
*   Scatter

### D3.js Visualizations

*   Tree
*   Force
*   Sankey
*   Treemap
*   Chord
*   Pack

### Three.js Visualizations

*   Bar3D
*   Scatter3D
*   Surface
*   Globe

📖 API Reference
----------------

Main methods available in Powiew:

*   `createChart(container, type, data, options)` - Creates a Chart.js visualization
*   `createD3Visualization(container, type, data, options)` - Creates a D3.js visualization
*   `create3DVisualization(container, type, data, options)` - Creates a Three.js visualization
*   `updateVisualization(visualization, data, options)` - Updates an existing visualization
*   `destroyVisualization(visualization)` - Destroys a visualization
*   `setTheme(theme)` - Sets a theme for all visualizations
*   `exportAsImage(visualization, format, options)` - Exports a visualization as an image

🌐 Browser Compatibility
------------------------

*   ✅ Chrome 60+ 
*   ✅ Firefox 60+
*   ✅ Safari 12+
*   ✅ Edge 79+
*   ✅ Opera 47+

## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)

## 📜 License

This software is licensed with **[GPL-3.0](/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)

## 🐦 About us

_PigeonPosse_ is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)

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
