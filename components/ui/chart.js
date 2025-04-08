/**
 * Chart component wrapper for Chart.js
 * This file provides the Chart class from Chart.js
 */

// Check if we're in a browser environment
let Chart

if (typeof window !== "undefined") {
  // Use the global Chart.js if available
  Chart = window.Chart || (typeof require !== "undefined" ? require("chart.js").Chart : null)
} else if (typeof require !== "undefined") {
  // Try to require Chart.js in Node.js environment
  try {
    Chart = require("chart.js").Chart
  } catch (e) {
    // Create a placeholder if Chart.js is not available
    Chart = class ChartPlaceholder {
      constructor() {
        console.warn("Chart.js is not available. Charts will not render correctly.")
      }
    }
  }
} else {
  // Create a placeholder if Chart.js is not available
  Chart = class ChartPlaceholder {
    constructor() {
      console.warn("Chart.js is not available. Charts will not render correctly.")
    }
  }
}

export { Chart }
