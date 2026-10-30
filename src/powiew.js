/**
 * Powiew - one API over Chart.js, D3.js and Three.js, plus image-to-chart.
 */
import ChartEngine from "./engines/ChartEngine"
import D3Engine from "./engines/D3Engine"
import ThreeEngine from "./engines/ThreeEngine"
import ThemeManager from "./utils/ThemeManager"
import { EVENTS } from "./constants"
import { extractFromImage, anthropicProvider } from "./multimodal/ImageToChart"

class Powiew {
  constructor(options = {}) {
    this.version = "2.1.0"
    this.debug = !!options.debug
    this.responsive = options.responsive !== false
    this.provider = options.provider || null
    this.listeners = {}
    this.themeManager = new ThemeManager()
    if (options.theme) this.themeManager.setTheme(options.theme)

    this.chartEngine = new ChartEngine(this.themeManager)
    this.d3Engine = new D3Engine(this.themeManager)
    this.threeEngine = new ThreeEngine(this.themeManager)
  }

  on(event, fn) {
    ;(this.listeners[event] ||= []).push(fn)
    return () => this.off(event, fn)
  }

  off(event, fn) {
    this.listeners[event] = (this.listeners[event] || []).filter((f) => f !== fn)
  }

  emit(event, payload) {
    ;(this.listeners[event] || []).forEach((fn) => fn(payload))
  }

  createChart(container, type, data, options = {}) {
    const chart = this.chartEngine.createChart(container, type, data, { responsive: this.responsive, ...options })
    this.emit(EVENTS.CHART_CREATED, chart)
    return chart
  }

  createD3Visualization(container, type, data, options = {}) {
    const viz = this.d3Engine.createVisualization(container, type, data, options)
    this.emit(EVENTS.D3_CREATED, viz)
    return viz
  }

  create3DVisualization(container, type, data, options = {}) {
    const viz = this.threeEngine.createVisualization(container, type, data, options)
    this.emit(EVENTS.THREE_CREATED, viz)
    return viz
  }

  /**
   * Extract data from an image of a chart without rendering it.
   * @returns {Promise<{spec, warnings, render, image}>}
   */
  async extractFromImage(source, options = {}) {
    return extractFromImage(source, { provider: this.provider, ...options })
  }

  /**
   * Image -> live visualization. Resolves with the rendered visualization,
   * the extracted spec and any warnings the caller should show the user.
   */
  async fromImage(container, source, options = {}) {
    const { spec, warnings, render } = await this.extractFromImage(source, options)
    const merged = { ...render.options, ...(options.chartOptions || {}) }
    const visualization =
      render.engine === "chart"
        ? this.createChart(container, render.type, render.data, merged)
        : this.createD3Visualization(container, render.type, render.data, merged)
    return { visualization, spec, warnings }
  }

  updateVisualization(viz, data, options = {}) {
    const engine = this._engineFor(viz)
    const out = engine === this.chartEngine ? engine.updateChart(viz, data, options) : engine.updateVisualization(viz, data, options)
    this.emit(EVENTS.VISUALIZATION_UPDATED, out)
    return out
  }

  destroyVisualization(viz) {
    const engine = this._engineFor(viz)
    const out = engine === this.chartEngine ? engine.destroyChart(viz) : engine.destroyVisualization(viz)
    this.emit(EVENTS.VISUALIZATION_DESTROYED, viz)
    return out
  }

  exportAsImage(viz, format, options) {
    return this._engineFor(viz).exportAsImage(viz, format, options)
  }

  setTheme(theme) {
    this.themeManager.setTheme(theme)
    this.emit(EVENTS.THEME_CHANGED, theme)
  }

  _engineFor(viz) {
    if (viz && typeof viz.update === "function" && viz.config) return this.chartEngine
    if (viz && viz.renderer) return this.threeEngine
    return this.d3Engine
  }
}

export { Powiew, anthropicProvider, extractFromImage }
export default Powiew
