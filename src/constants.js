/**
 * Constants used throughout the Powiew library
 */

// Chart types
export const CHART_TYPES = {
  // Chart.js types
  BAR: "bar",
  LINE: "line",
  PIE: "pie",
  DOUGHNUT: "doughnut",
  RADAR: "radar",
  POLAR_AREA: "polarArea",
  BUBBLE: "bubble",
  SCATTER: "scatter",

  // D3 specific types
  TREE: "tree",
  FORCE: "force",
  SANKEY: "sankey",
  TREEMAP: "treemap",
  CHORD: "chord",
  PACK: "pack",

  // 3D specific types
  BAR_3D: "bar3d",
  SCATTER_3D: "scatter3d",
  SURFACE: "surface",
  GLOBE: "globe",
}

// Rendering modes
export const RENDER_MODES = {
  TWO_D: "2d",
  THREE_D: "3d",
}

// Events
export const EVENTS = {
  CHART_CREATED: "chartCreated",
  D3_CREATED: "d3Created",
  THREE_CREATED: "threeCreated",
  VISUALIZATION_UPDATED: "visualizationUpdated",
  VISUALIZATION_DESTROYED: "visualizationDestroyed",
  THEME_CHANGED: "themeChanged",
  ERROR: "error",
}

// Default themes
export const DEFAULT_THEMES = {
  LIGHT: {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    gridColor: "#dddddd",
    colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6", "#7B61FF", "#1E88E5"],
  },
  DARK: {
    backgroundColor: "#222222",
    textColor: "#ffffff",
    gridColor: "#444444",
    colors: ["#8AB4F8", "#F28B82", "#FDD663", "#81C995", "#FCAD70", "#78D9EC", "#C58FFF", "#64B5F6"],
  },
}

// Animation presets
export const ANIMATION_PRESETS = {
  FADE_IN: {
    duration: 1000,
    easing: "easeOutQuad",
  },
  SLIDE_IN: {
    duration: 800,
    easing: "easeOutCubic",
  },
  BOUNCE: {
    duration: 1200,
    easing: "easeOutBounce",
  },
}
