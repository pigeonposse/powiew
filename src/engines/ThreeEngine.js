/**
 * ThreeEngine - Handles Three.js 3D visualizations
 */
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CHART_TYPES } from "../constants"

class ThreeEngine {
  /**
   * Create a new ThreeEngine instance
   * @param {ThemeManager} themeManager - Theme manager instance
   */
  constructor(themeManager) {
    this.themeManager = themeManager

    // Verify Three.js is available
    if (typeof THREE === "undefined") {
      console.warn("Powiew: Three.js is not loaded. 3D visualization functionality will be unavailable.")
      return
    }

    // Store active visualizations
    this.activeVisualizations = new Map()
  }

  /**
   * Create a 3D visualization
   * @param {string} container - CSS selector for the container
   * @param {string} type - Visualization type
   * @param {Object|Array} data - Visualization data
   * @param {Object} options - Visualization options
   * @returns {Object} Visualization instance
   */
  createVisualization(container, type, data, options = {}) {
    // Validate visualization type
    if (!this._isValidType(type)) {
      throw new Error(`Powiew: Invalid 3D visualization type "${type}"`)
    }

    // Get container element
    const containerElement = document.querySelector(container)
    if (!containerElement) {
      throw new Error(`Powiew: Container "${container}" not found`)
    }

    // Apply theme to options
    const themedOptions = this.themeManager.applyTheme(options, type)

    // Get dimensions
    const width = containerElement.clientWidth
    const height = containerElement.clientHeight || 400

    // Create scene
    const scene = new THREE.Scene()
    if (themedOptions.backgroundColor) {
      scene.background = new THREE.Color(themedOptions.backgroundColor)
    }

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = themedOptions.cameraZ || 5

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Clear container and add renderer
    containerElement.innerHTML = ""
    containerElement.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Create visualization based on type
    let visualization

    switch (type) {
      case CHART_TYPES.BAR_3D:
        visualization = this._createBar3D(scene, data, themedOptions)
        break
      case CHART_TYPES.SCATTER_3D:
        visualization = this._createScatter3D(scene, data, themedOptions)
        break
      case CHART_TYPES.SURFACE:
        visualization = this._createSurface(scene, data, themedOptions)
        break
      case CHART_TYPES.GLOBE:
        visualization = this._createGlobe(scene, data, themedOptions)
        break
      default:
        throw new Error(`Powiew: 3D visualization type "${type}" not implemented`)
    }

    // Add controls if enabled
    let controls = null
    if (themedOptions.controls !== false) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controls.screenSpacePanning = false
      controls.maxPolarAngle = Math.PI
      controls.update()
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (controls) controls.update()

      // Call custom animation function if provided
      if (visualization && visualization.animate) {
        visualization.animate()
      }

      renderer.render(scene, camera)
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerElement.clientWidth
      const newHeight = containerElement.clientHeight || 400

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Store visualization info
    const visId = this._generateId()
    this.activeVisualizations.set(visId, {
      type,
      scene,
      camera,
      renderer,
      controls,
      data,
      options: themedOptions,
      container,
      visualization,
      handleResize,
      width,
      height,
    })

    // Return visualization object
    return {
      id: visId,
      scene,
      camera,
      renderer,
      update: (newData, newOptions) => this.updateVisualization({ id: visId }, newData, newOptions),
    }
  }

  /**
   * Update an existing 3D visualization
   * @param {Object} visualization - Visualization instance
   * @param {Object|Array} data - New data
   * @param {Object} options - Update options
   * @returns {Object} Updated visualization instance
   */
  updateVisualization(visualization, data, options = {}) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid 3D visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: 3D visualization with ID "${visualization.id}" not found`)
    }

    // Merge options
    const updatedOptions = this._deepMerge(visInfo.options, options)

    // Apply theme
    const themedOptions = this.themeManager.applyTheme(updatedOptions, visInfo.type)

    // Clear scene of visualization objects
    while (visInfo.scene.children.length > 0) {
      const object = visInfo.scene.children[0]
      if (object.type === "AmbientLight" || object.type === "DirectionalLight") {
        visInfo.scene.children.shift()
      } else {
        visInfo.scene.remove(object)
      }
    }

    // Create new visualization with updated data and options
    let updatedVis

    switch (visInfo.type) {
      case CHART_TYPES.BAR_3D:
        updatedVis = this._createBar3D(visInfo.scene, data || visInfo.data, themedOptions)
        break
      case CHART_TYPES.SCATTER_3D:
        updatedVis = this._createScatter3D(visInfo.scene, data || visInfo.data, themedOptions)
        break
      case CHART_TYPES.SURFACE:
        updatedVis = this._createSurface(visInfo.scene, data || visInfo.data, themedOptions)
        break
      case CHART_TYPES.GLOBE:
        updatedVis = this._createGlobe(visInfo.scene, data || visInfo.data, themedOptions)
        break
    }

    // Update stored info
    this.activeVisualizations.set(visualization.id, {
      ...visInfo,
      data: data || visInfo.data,
      options: themedOptions,
      visualization: updatedVis,
    })

    // Return updated visualization
    return {
      id: visualization.id,
      scene: visInfo.scene,
      camera: visInfo.camera,
      renderer: visInfo.renderer,
      update: (newData, newOptions) => this.updateVisualization({ id: visualization.id }, newData, newOptions),
    }
  }

  /**
   * Destroy a 3D visualization
   * @param {Object} visualization - Visualization instance
   * @returns {boolean} Success status
   */
  destroyVisualization(visualization) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid 3D visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: 3D visualization with ID "${visualization.id}" not found`)
    }

    // Remove event listener
    window.removeEventListener("resize", visInfo.handleResize)

    // Dispose of Three.js objects
    if (visInfo.visualization && visInfo.visualization.dispose) {
      visInfo.visualization.dispose()
    }

    // Dispose of renderer
    visInfo.renderer.dispose()

    // Remove from DOM
    visInfo.renderer.domElement.remove()

    // Remove from active visualizations
    this.activeVisualizations.delete(visualization.id)

    return true
  }

  /**
   * Apply a theme to an existing 3D visualization
   * @param {Object} visualization - Visualization instance
   * @param {Object} theme - Theme configuration
   * @returns {Object} Updated visualization instance
   */
  applyTheme(visualization, theme) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid 3D visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: 3D visualization with ID "${visualization.id}" not found`)
    }

    // Apply theme to options
    const themedOptions = this.themeManager.applyTheme(visInfo.options, visInfo.type, theme)

    // Update visualization with new theme
    return this.updateVisualization(visualization, null, themedOptions)
  }

  /**
   * Export 3D visualization as an image
   * @param {Object} visualization - Visualization instance
   * @param {string} format - Export format (png, jpeg)
   * @param {Object} options - Export options
   * @returns {string} Data URL of the exported image
   */
  exportAsImage(visualization, format = "png", options = {}) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid 3D visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: 3D visualization with ID "${visualization.id}" not found`)
    }

    // Render scene
    visInfo.renderer.render(visInfo.scene, visInfo.camera)

    // Get data URL
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"
    const quality = format === "jpeg" ? options.quality || 0.95 : undefined

    return visInfo.renderer.domElement.toDataURL(mimeType, quality)
  }

  /**
   * Create a 3D bar chart
   * @private
   */
  _createBar3D(scene, data, options) {
    const bars = []
    const maxValue = Math.max(...data.datasets[0].data)
    const barWidth = options.barWidth || 0.5
    const barDepth = options.barDepth || 0.5
    const spacing = options.spacing || 0.2
    const maxHeight = options.maxHeight || 5

    // Create bars
    data.datasets[0].data.forEach((value, index) => {
      const height = (value / maxValue) * maxHeight
      const color = options.colors[index % options.colors.length]

      const geometry = new THREE.BoxGeometry(barWidth, height, barDepth)
      const material = new THREE.MeshLambertMaterial({ color })
      const bar = new THREE.Mesh(geometry, material)

      // Position bar
      const x = index * (barWidth + spacing) - ((data.datasets[0].data.length - 1) * (barWidth + spacing)) / 2
      bar.position.set(x, height / 2, 0)

      scene.add(bar)
      bars.push(bar)
    })

    // Create axes if enabled
    if (options.axes !== false) {
      // X-axis
      const xAxisGeometry = new THREE.BoxGeometry(data.datasets[0].data.length * (barWidth + spacing), 0.05, 0.05)
      const xAxisMaterial = new THREE.MeshBasicMaterial({ color: options.axisColor || 0x888888 })
      const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial)
      xAxis.position.set(0, 0, 0)
      scene.add(xAxis)

      // Y-axis
      const yAxisGeometry = new THREE.BoxGeometry(0.05, maxHeight, 0.05)
      const yAxisMaterial = new THREE.MeshBasicMaterial({ color: options.axisColor || 0x888888 })
      const yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial)
      yAxis.position.set(-(data.datasets[0].data.length * (barWidth + spacing)) / 2 - 0.1, maxHeight / 2, 0)
      scene.add(yAxis)
    }

    // Add animation if enabled
    let animate
    if (options.animation !== false) {
      // Store original heights
      const originalHeights = data.datasets[0].data.map((value) => (value / maxValue) * maxHeight)

      // Set initial height to 0
      bars.forEach((bar) => {
        bar.scale.y = 0.01
        bar.position.y = 0.01
      })

      // Animation function
      animate = () => {
        bars.forEach((bar, index) => {
          const targetHeight = originalHeights[index]
          if (bar.scale.y < 1) {
            bar.scale.y += 0.05
            bar.position.y = (bar.scale.y * targetHeight) / 2
          }
        })
      }
    }

    return { bars, animate, dispose: () => bars.forEach((bar) => bar.geometry.dispose()) }
  }

  /**
   * Create a 3D scatter plot
   * @private
   */
  _createScatter3D(scene, data, options) {
    const points = []
    const pointSize = options.pointSize || 0.1

    // Create points
    data.forEach((point, index) => {
      const geometry = new THREE.SphereGeometry(pointSize, 16, 16)
      const color = options.colors[index % options.colors.length]
      const material = new THREE.MeshLambertMaterial({ color })
      const sphere = new THREE.Mesh(geometry, material)

      // Position point
      sphere.position.set(point.x, point.y, point.z)

      scene.add(sphere)
      points.push(sphere)
    })

    // Create axes if enabled
    if (options.axes !== false) {
      const axisLength = options.axisLength || 5
      const axisColor = options.axisColor || 0x888888

      // X-axis
      const xAxisGeometry = new THREE.BoxGeometry(axisLength, 0.05, 0.05)
      const xAxisMaterial = new THREE.MeshBasicMaterial({ color: axisColor })
      const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial)
      xAxis.position.set(axisLength / 2, 0, 0)
      scene.add(xAxis)

      // Y-axis
      const yAxisGeometry = new THREE.BoxGeometry(0.05, axisLength, 0.05)
      const yAxisMaterial = new THREE.MeshBasicMaterial({ color: axisColor })
      const yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial)
      yAxis.position.set(0, axisLength / 2, 0)
      scene.add(yAxis)

      // Z-axis
      const zAxisGeometry = new THREE.BoxGeometry(0.05, 0.05, axisLength)
      const zAxisMaterial = new THREE.MeshBasicMaterial({ color: axisColor })
      const zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial)
      zAxis.position.set(0, 0, axisLength / 2)
      scene.add(zAxis)
    }

    return { points, dispose: () => points.forEach((point) => point.geometry.dispose()) }
  }

  /**
   * Create a 3D surface plot
   * @private
   */
  _createSurface(scene, data, options) {
    // Implementation for surface plot
    // This is a placeholder - actual implementation would be more complex
    console.warn("Powiew: Surface plot implementation is a placeholder")

    return { type: "surface" }
  }

  /**
   * Create a 3D globe visualization
   * @private
   */
  _createGlobe(scene, data, options) {
    // Implementation for globe visualization
    // This is a placeholder - actual implementation would be more complex
    console.warn("Powiew: Globe visualization implementation is a placeholder")

    return { type: "globe" }
  }

  /**
   * Check if visualization type is valid
   * @private
   * @param {string} type - Visualization type
   * @returns {boolean} Is valid type
   */
  _isValidType(type) {
    const validTypes = [CHART_TYPES.BAR_3D, CHART_TYPES.SCATTER_3D, CHART_TYPES.SURFACE, CHART_TYPES.GLOBE]

    return validTypes.includes(type)
  }

  /**
   * Generate a unique ID
   * @private
   * @returns {string} Unique ID
   */
  _generateId() {
    return "three_" + Math.random().toString(36).substr(2, 9)
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

export default ThreeEngine
