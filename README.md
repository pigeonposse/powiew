{\rtf1\ansi\ansicpg1252\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww15820\viewh15900\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Powiew by _PIGEONPOSSE_\
\
(docs/banner.png)\
\
[![Web](https://img.shields.io/badge/Web-grey?style=flat-square)](https://pigeonposse.com/)\
[![About us](https://img.shields.io/badge/About%20us-grey?style=flat-square)](https://pigeonposse.com/?popup=about)\
[![Github](https://img.shields.io/badge/Github-grey?style=flat-square)](https://github.com/pigeon-posse)\
[![Donate](https://img.shields.io/badge/Donate-pink?style=flat-square)](https://pigeonposse.com/?popup=donate)\
![Version 2.0.0](https://img.shields.io/badge/version-2.0.0-blue.svg) ![License MIT](https://img.shields.io/badge/license-MIT-green.svg) ![Chart.js](https://img.shields.io/badge/Chart.js-4.x-blue.svg) ![D3.js](https://img.shields.io/badge/D3.js-7.x-orange.svg) ![Three.js](https://img.shields.io/badge/Three.js-r128-yellow.svg)\
\
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f1 \cf0 \uc0\u55357 \u56523 
\f0  Overview\
-----------\
\
**Powiew** is a revolutionary data visualization library that elegantly unifies the capabilities of *Chart.js, D3.js,* and *Three.js* under a single intuitive API. Designed to simplify the complexity of modern data visualization, Powiew enables developers to effortlessly create everything from traditional statistical charts to complex 3D data visualizations, all through a consistent interface. \
\
With a robust built-in theming system, intelligent data processing, and advanced event management, Powiew eliminates the need to master multiple libraries while retaining the full power of the underlying tools. Whether for interactive business dashboards, intricate scientific visualizations, or real-time data representations, Powiew democratizes advanced data visualization without compromising flexibility or performance.\
\

\f1 \uc0\u10024 
\f0  Key Features\
--------------\
\
*   **
\f1 \uc0\u55357 \u56580 
\f0  Unified API** - Work with multiple visualization libraries through a single interface\
*   **
\f1 \uc0\u55357 \u56561 
\f0  Responsive Design** - Visualizations automatically adapt to different screen sizes\
*   **
\f1 \uc0\u55356 \u57256 
\f0  Theme Support** - Built-in light and dark themes with easy customization\
*   **
\f1 \uc0\u55357 \u56622 
\f0  Data Processing** - Utilities for data transformation, normalization, and aggregation\
*   **
\f1 \uc0\u10024 
\f0  Animation** - Smooth, customizable animations for all visualization types\
*   **
\f1 \uc0\u55357 \u56510 
\f0  Export Capabilities** - Export visualizations as PNG, JPEG, or SVG\
*   **
\f1 \uc0\u55356 \u57263 
\f0  Event System** - Comprehensive event system for interaction\
\
(docs/banner2.png)\
\

\f1 \uc0\u55357 \u56960 
\f0  Installation\
---------------\
\
### Using npm\
\
    npm install powiew\
\
### Using yarn\
\
    yarn add powiew\
\
### Using CDN\
\
    <script src="https://cdn.jsdelivr.net/npm/powiew@2.0.0/dist/powiew.min.js"></script>\
\
### Dependencies\
\
Powiew requires the following libraries:\
\
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>\
    <script src="https://d3js.org/d3.v7.min.js"></script>\
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\
\

\f1 \uc0\u55357 \u56522 
\f0  Basic Usage\
--------------\
\
### Initialize Powiew\
\
    // Create a new Powiew instance\
    const vis = new Powiew(\{\
      debug: true,\
      responsive: true\
    \});\
\
### Create a Chart\
\
    // Create a bar chart\
    const barChart = vis.createChart('#bar-chart', 'bar', \{\
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],\
      datasets: [\{\
        label: 'Revenue 2025',\
        data: [65, 59, 80, 81, 56, 55],\
        backgroundColor: 'rgba(54, 162, 235, 0.5)',\
        borderColor: 'rgba(54, 162, 235, 1)',\
        borderWidth: 1\
      \}]\
    \});\
\
### Create a D3 Visualization\
\
    // Create a force-directed graph\
    const forceGraph = vis.createD3Visualization('#force-graph', 'force', \{\
      nodes: [\
        \{ id: 'A', group: 1 \},\
        \{ id: 'B', group: 1 \},\
        \{ id: 'C', group: 2 \}\
      ],\
      links: [\
        \{ source: 'A', target: 'B', value: 1 \},\
        \{ source: 'A', target: 'C', value: 1 \}\
      ]\
    \});\
\
### Apply a Theme\
\
    // Switch to dark theme\
    vis.setTheme('dark');\
\

\f1 \uc0\u55357 \u56520 
\f0  Supported Visualization Types\
--------------------------------\
\
### Chart.js Visualizations\
\
*   Bar\
*   Line\
*   Pie\
*   Doughnut\
*   Radar\
*   Polar Area\
*   Bubble\
*   Scatter\
\
### D3.js Visualizations\
\
*   Tree\
*   Force\
*   Sankey\
*   Treemap\
*   Chord\
*   Pack\
\
### Three.js Visualizations\
\
*   Bar3D\
*   Scatter3D\
*   Surface\
*   Globe\
\

\f1 \uc0\u55357 \u56534 
\f0  API Reference\
----------------\
\
Main methods available in Powiew:\
\
*   `createChart(container, type, data, options)` - Creates a Chart.js visualization\
*   `createD3Visualization(container, type, data, options)` - Creates a D3.js visualization\
*   `create3DVisualization(container, type, data, options)` - Creates a Three.js visualization\
*   `updateVisualization(visualization, data, options)` - Updates an existing visualization\
*   `destroyVisualization(visualization)` - Destroys a visualization\
*   `setTheme(theme)` - Sets a theme for all visualizations\
*   `exportAsImage(visualization, format, options)` - Exports a visualization as an image\
\

\f1 \uc0\u55356 \u57104 
\f0  Browser Compatibility\
------------------------\
\
*   
\f1 \uc0\u9989 
\f0  Chrome 60+ \
*   
\f1 \uc0\u9989 
\f0  Firefox 60+\
*   
\f1 \uc0\u9989 
\f0  Safari 12+\
*   
\f1 \uc0\u9989 
\f0  Edge 79+\
*   
\f1 \uc0\u9989 
\f0  Opera 47+\
\
## 
\f1 \uc0\u9749 
\f0  Donate\
\
Help us to develop more interesting things.\
\
[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)\
\
## 
\f1 \uc0\u55357 \u56540 
\f0  License\
\
This software is licensed with **[GPL-3.0](/LICENSE)**.\
\
[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)\
\
## 
\f1 \uc0\u55357 \u56358 
\f0  About us\
\
_PigeonPosse_ is a 
\f1 \uc0\u10024 
\f0  **code development collective** 
\f1 \uc0\u10024 
\f0  focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.\
\
[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)\
\
## 
\f1 \uc0\u55357 \u56540 
\f0  License\
\
This software is licensed with **[GPL-3.0](/LICENSE)**.\
\
[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)\
\
## 
\f1 \uc0\u55357 \u56358 
\f0  About us\
\
_PigeonPosse_ is a 
\f1 \uc0\u10024 
\f0  **code development collective** 
\f1 \uc0\u10024 
\f0  focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.\
\
[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)\
\
### Collaborators\
\
|                                                                                    | Name        | Role         | GitHub                                         |\
| ---------------------------------------------------------------------------------- | ----------- | ------------ | ---------------------------------------------- |\
| ![Alejo](https://github.com/alejomalia.png?size=72) | Alejo |   Author & Development   | [@alejomalia](https://github.com/alejomalia) |\
| ![Pigeonposse](https://github.com/pigeonposse.png?size=72) | PigeonPosse | Collective | [@PigeonPosse](https://github.com/pigeonposse) |\
\
[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)\
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)\
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)\
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)\
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)\
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)\
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)}