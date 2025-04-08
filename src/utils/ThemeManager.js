/**
 * ThemeManager - Manages themes for visualizations
 */
import { DEFAULT_THEMES } from "../constants"

class ThemeManager {
  /**
   * Create a new ThemeManager instance
   * @param {Object} [theme] - Initial theme
   */
  constructor(theme) {
    // Set default themes
    this.themes = {
      light: DEFAULT_THEMES.LIGHT,
      dark: DEFAULT_THEMES.DARK,
    }

    // Set current theme
    this.currentTheme = theme || this.themes.light
  }

  /**
   * Set the current theme
   * @param {Object|string} theme - Theme object or name
   */
  setTheme(theme) {
    if (typeof theme === "string") {
      if (this.themes[theme]) {
        this.currentTheme = this.themes[theme]
      } else {
        throw new Error(`Powiew: Theme "${theme}" not found`)
      }
    } else if (typeof theme === "object") {
      this.currentTheme = theme
    } else {
      throw new Error("Powiew: Invalid theme")
    }
  }

  /**
   * Register a new theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme configuration
   */
  registerTheme(name, theme) {
    if (!name || typeof name !== "string") {
      throw new Error("Powiew: Theme name is required")
    }

    if (!theme || typeof theme !== "object") {
      throw new Error("Powiew: Theme configuration is required")
    }

    this.themes[name] = theme
  }

  /**
   * Apply theme to options
   * @param {Object} options - Visualization options
   * @param {string} type - Visualization type
   * @param {Object} [theme] - Theme to apply (uses current theme if not provided)
   * @returns {Object} Themed options
   */
  applyTheme(options, type, theme) {
    const themeToApply = theme || this.currentTheme
    const themedOptions = { ...options }

    // Apply general theme properties
    if (themeToApply.backgroundColor && !themedOptions.backgroundColor) {
      themedOptions.backgroundColor = themeToApply.backgroundColor
    }

    if (themeToApply.textColor && !themedOptions.textColor) {
      themedOptions.textColor = themeToApply.textColor
    }

    if (themeToApply.gridColor && !themedOptions.gridColor) {
      themedOptions.gridColor = themeToApply.gridColor
    }

    if (themeToApply.colors && !themedOptions.colors) {
      themedOptions.colors = themeToApply.colors
    }

    // Apply Chart.js specific theme
    if (this._isChartJsType(type)) {
      themedOptions.plugins = themedOptions.plugins || {}

      // Legend
      if (!themedOptions.plugins.legend) {
        themedOptions.plugins.legend = {
          labels: {
            color: themeToApply.textColor,
          },
        }
      } else if (!themedOptions.plugins.legend.labels) {
        themedOptions.plugins.legend.labels = {
          color: themeToApply.textColor,
        }
      } else if (!themedOptions.plugins.legend.labels.color) {
        themedOptions.plugins.legend.labels.color = themeToApply.textColor
      }

      // Tooltip
      if (!themedOptions.plugins.tooltip) {
        themedOptions.plugins.tooltip = {
          backgroundColor: this._adjustColor(themeToApply.backgroundColor, -20),
          titleColor: themeToApply.textColor,
          bodyColor: themeToApply.textColor,
          borderColor: themeToApply.gridColor,
        }
      }

      // Scales
      if (!themedOptions.scales) {
        themedOptions.scales = {
          x: {
            grid: {
              color: themeToApply.gridColor,
            },
            ticks: {
              color: themeToApply.textColor,
            },
          },
          y: {
            grid: {
              color: themeToApply.gridColor,
            },
            ticks: {
              color: themeToApply.textColor,
            },
          },
        }
      }
    }

    return themedOptions
  }

  /**
   * Get a specific theme
   * @param {string} name - Theme name
   * @returns {Object} Theme configuration
   */
  getTheme(name) {
    if (!this.themes[name]) {
      throw new Error(`Powiew: Theme "${name}" not found`)
    }

    return this.themes[name]
  }

  /**
   * Get current theme
   * @returns {Object} Current theme configuration
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * Get all available themes
   * @returns {Object} All themes
   */
  getAllThemes() {
    return this.themes
  }

  /**
   * Check if type is a Chart.js chart type
   * @private
   * @param {string} type - Visualization type
   * @returns {boolean} Is Chart.js type
   */
  _isChartJsType(type) {
    const chartJsTypes = ["bar", "line", "pie", "doughnut", "radar", "polarArea", "bubble", "scatter"]

    return chartJsTypes.includes(type)
  }

  /**
   * Adjust color brightness
   * @private
   * @param {string} color - Color in hex format
   * @param {number} amount - Amount to adjust (-255 to 255)
   * @returns {string} Adjusted color
   */
  _adjustColor(color, amount) {
    // Return if not a hex color
    if (!color || color[0] !== "#") return color

    let hex = color.slice(1)

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    // Convert to RGB
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)

    // Adjust and clamp values
    const adjustR = Math.max(0, Math.min(255, r + amount))
    const adjustG = Math.max(0, Math.min(255, g + amount))
    const adjustB = Math.max(0, Math.min(255, b + amount))

    // Convert back to hex
    return "#" + ((1 << 24) + (adjustR << 16) + (adjustG << 8) + adjustB).toString(16).slice(1)
  }
}

export default ThemeManager
