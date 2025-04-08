import { Chart } from "@/components/ui/chart"
/**
 * ChartEngine - Handles Chart.js visualizations
 */
import { CHART_TYPES } from "../constants"

class ChartEngine {
  /**
   * Create a new ChartEngine instance
   * @param {ThemeManager} themeManager - Theme manager instance
   */
  constructor(themeManager) {
    this.themeManager = themeManager

    // Verify Chart.js is available
    if (typeof Chart === "undefined") {
      console.warn("Powiew: Chart.js is not loaded. Chart functionality will be unavailable.")
      return
    }

    // Register custom Chart.js plugins if needed
    this._registerPlugins()
  }

  /**
   * Create a chart using Chart.js
   * @param {string} container - CSS selector for the chart container
   * @param {string} type - Chart type
   * @param {Object} data - Chart data
   * @param {Object} options - Chart options
   * @returns {Object} Chart instance
   */
  createChart(container, type, data, options = {}) {
    // Verify Chart.js is available
    if (typeof Chart === "undefined") {
      throw new Error("Powiew: Chart.js is not loaded. Chart functionality will be unavailable.")
    }

    // Validate chart type
    if (!Object.values(CHART_TYPES).includes(type)) {
      throw new Error(`Powiew: Invalid chart type "${type}"`)
    }

    // Get container element
    const containerElement = document.querySelector(container)
    if (!containerElement) {
      throw new Error(`Powiew: Container "${container}" not found`)
    }

    // Get canvas element
    let canvas = containerElement.querySelector("canvas")
    if (!canvas) {
      canvas = document.createElement("canvas")
      containerElement.appendChild(canvas)
    }

    // Get 2D context
    const ctx = canvas.getContext("2d")

    // Merge options with defaults and theme
    const mergedOptions = this._mergeOptions(options, type)

    // Create and return the chart
    return new Chart(ctx, {
      type: type,
      data: data,
      options: mergedOptions,
    })
  }

  /**
   * Update an existing chart with new data
   * @param {Object} chart - Chart instance
   * @param {Object} data - New data
   * @param {Object} options - Update options
   * @returns {Object} Updated chart instance
   */
  updateChart(chart, data, options = {}) {
    if (!chart || typeof chart.update !== "function") {
      throw new Error("Powiew: Invalid chart instance")
    }

    // Update data
    if (data) {
      chart.data = data
    }

    // Update options if provided
    if (Object.keys(options).length > 0) {
      const mergedOptions = this._mergeOptions(options, chart.config.type)
      chart.options = mergedOptions
    }

    // Apply updates
    chart.update(options.animation !== false)

    return chart
  }

  /**
   * Destroy a chart instance
   * @param {Object} chart - Chart instance
   * @returns {boolean} Success status
   */
  destroyChart(chart) {
    if (!chart || typeof chart.destroy !== "function") {
      throw new Error("Powiew: Invalid chart instance")
    }

    chart.destroy()
    return true
  }

  /**
   * Apply a theme to an existing chart
   * @param {Object} chart - Chart instance
   * @param {Object} theme - Theme configuration
   * @returns {Object} Updated chart instance
   */
  applyTheme(chart, theme) {
    if (!chart || typeof chart.update !== "function") {
      throw new Error("Powiew: Invalid chart instance")
    }

    // Apply theme to chart options
    const themedOptions = this.themeManager.applyTheme(chart.options, chart.config.type, theme)
    chart.options = themedOptions

    // Update chart
    chart.update()

    return chart
  }

  /**
   * Export chart as an image
   * @param {Object} chart - Chart instance
   * @param {string} format - Export format (png, jpeg)
   * @param {Object} options - Export options
   * @returns {string} Data URL of the exported image
   */
  exportAsImage(chart, format = "png", options = {}) {
    if (!chart || !chart.canvas) {
      throw new Error("Powiew: Invalid chart instance")
    }

    // Set format
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"

    // Set quality for JPEG
    const quality = format === "jpeg" ? options.quality || 0.95 : undefined

    // Get data URL
    return chart.canvas.toDataURL(mimeType, quality)
  }

  /**
   * Register custom Chart.js plugins
   * @private
   */
  _registerPlugins() {
    // Example of registering a custom plugin
    /*
    Chart.register({
      id: 'powiewResponsive',
      beforeInit: (chart) => {
        // Custom initialization logic
      }
    });
    */
  }

  /**
   * Merge options with defaults and theme
   * @private
   * @param {Object} options - User options
   * @param {string} type - Chart type
   * @returns {Object} Merged options
   */
  _mergeOptions(options, type) {
    // Default options
    const defaults = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuad",
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    }

    // Add type-specific defaults
    switch (type) {
      case CHART_TYPES.BAR:
        defaults.scales = {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
          },
        }
        break
      case CHART_TYPES.LINE:
        defaults.elements = {
          line: {
            tension: 0.4,
          },
        }
        break
      // Add more type-specific defaults as needed
    }

    // Apply theme
    const themedOptions = this.themeManager.applyTheme(defaults, type)

    // Merge with user options
    return this._deepMerge(themedOptions, options)
  }

  /**
   * Deep merge two objects
   * @private
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  _deepMerge(target, source) {
    const output = Object.assign({}, target)

    if (this._isObject(target) && this._isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this._isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            output[key] = this._deepMerge(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }

    return output
  }

  /**
   * Check if value is an object
   * @private
   * @param {*} item - Value to check
   * @returns {boolean} Is object
   */
  _isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item)
  }
}

export default ChartEngine
