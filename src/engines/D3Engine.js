/**
 * D3Engine - Handles D3.js visualizations
 */
import * as d3 from "d3"
import { CHART_TYPES } from "../constants"

class D3Engine {
  /**
   * Create a new D3Engine instance
   * @param {ThemeManager} themeManager - Theme manager instance
   */
  constructor(themeManager) {
    this.themeManager = themeManager

    // Verify D3.js is available
    if (typeof d3 === "undefined") {
      console.warn("Powiew: D3.js is not loaded. D3 visualization functionality will be unavailable.")
      return
    }

    // Store active visualizations
    this.activeVisualizations = new Map()
  }

  /**
   * Create a D3 visualization
   * @param {string} container - CSS selector for the container
   * @param {string} type - Visualization type
   * @param {Object|Array} data - Visualization data
   * @param {Object} options - Visualization options
   * @returns {Object} Visualization instance
   */
  createVisualization(container, type, data, options = {}) {
    // Validate visualization type
    if (!this._isValidType(type)) {
      throw new Error(`Powiew: Invalid D3 visualization type "${type}"`)
    }

    // Get container element
    const containerElement = document.querySelector(container)
    if (!containerElement) {
      throw new Error(`Powiew: Container "${container}" not found`)
    }

    // Clear container
    containerElement.innerHTML = ""

    // Apply theme to options
    const themedOptions = this.themeManager.applyTheme(options, type)

    // Create SVG element
    const width = themedOptions.width || containerElement.clientWidth
    const height = themedOptions.height || containerElement.clientHeight || 400

    const svg = d3
      .select(containerElement)
      .append("svg")
      .attr("width", width)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")

    // Create visualization based on type
    let visualization

    switch (type) {
      case CHART_TYPES.TREE:
        visualization = this._createTreeChart(svg, data, width, height, themedOptions)
        break
      case CHART_TYPES.FORCE:
        visualization = this._createForceDirectedGraph(svg, data, width, height, themedOptions)
        break
      case CHART_TYPES.SANKEY:
        visualization = this._createSankeyDiagram(svg, data, width, height, themedOptions)
        break
      case CHART_TYPES.TREEMAP:
        visualization = this._createTreemap(svg, data, width, height, themedOptions)
        break
      case CHART_TYPES.CHORD:
        visualization = this._createChordDiagram(svg, data, width, height, themedOptions)
        break
      case CHART_TYPES.PACK:
        visualization = this._createCirclePacking(svg, data, width, height, themedOptions)
        break
      default:
        throw new Error(`Powiew: D3 visualization type "${type}" not implemented`)
    }

    // Store visualization
    const visId = this._generateId()
    this.activeVisualizations.set(visId, {
      type,
      svg,
      data,
      options: themedOptions,
      container,
      width,
      height,
    })

    // Return visualization object
    return {
      id: visId,
      svg,
      type,
      update: (newData, newOptions) => this.updateVisualization({ id: visId }, newData, newOptions),
    }
  }

  /**
   * Update an existing D3 visualization
   * @param {Object} visualization - Visualization instance
   * @param {Object|Array} data - New data
   * @param {Object} options - Update options
   * @returns {Object} Updated visualization instance
   */
  updateVisualization(visualization, data, options = {}) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid D3 visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: D3 visualization with ID "${visualization.id}" not found`)
    }

    // Merge options
    const updatedOptions = this._deepMerge(visInfo.options, options)

    // Apply theme
    const themedOptions = this.themeManager.applyTheme(updatedOptions, visInfo.type)

    // Clear SVG
    visInfo.svg.selectAll("*").remove()

    // Recreate visualization with new data and options
    let updatedVis

    switch (visInfo.type) {
      case CHART_TYPES.TREE:
        updatedVis = this._createTreeChart(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
      case CHART_TYPES.FORCE:
        updatedVis = this._createForceDirectedGraph(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
      case CHART_TYPES.SANKEY:
        updatedVis = this._createSankeyDiagram(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
      case CHART_TYPES.TREEMAP:
        updatedVis = this._createTreemap(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
      case CHART_TYPES.CHORD:
        updatedVis = this._createChordDiagram(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
      case CHART_TYPES.PACK:
        updatedVis = this._createCirclePacking(
          visInfo.svg,
          data || visInfo.data,
          visInfo.width,
          visInfo.height,
          themedOptions,
        )
        break
    }

    // Update stored info
    this.activeVisualizations.set(visualization.id, {
      ...visInfo,
      data: data || visInfo.data,
      options: themedOptions,
    })

    // Return updated visualization
    return {
      id: visualization.id,
      svg: visInfo.svg,
      type: visInfo.type,
      update: (newData, newOptions) => this.updateVisualization({ id: visualization.id }, newData, newOptions),
    }
  }

  /**
   * Destroy a D3 visualization
   * @param {Object} visualization - Visualization instance
   * @returns {boolean} Success status
   */
  destroyVisualization(visualization) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid D3 visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: D3 visualization with ID "${visualization.id}" not found`)
    }

    // Remove SVG
    visInfo.svg.remove()

    // Remove from active visualizations
    this.activeVisualizations.delete(visualization.id)

    return true
  }

  /**
   * Apply a theme to an existing D3 visualization
   * @param {Object} visualization - Visualization instance
   * @param {Object} theme - Theme configuration
   * @returns {Object} Updated visualization instance
   */
  applyTheme(visualization, theme) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid D3 visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: D3 visualization with ID "${visualization.id}" not found`)
    }

    // Apply theme to options
    const themedOptions = this.themeManager.applyTheme(visInfo.options, visInfo.type, theme)

    // Update visualization with new theme
    return this.updateVisualization(visualization, null, themedOptions)
  }

  /**
   * Export D3 visualization as an image
   * @param {Object} visualization - Visualization instance
   * @param {string} format - Export format (png, jpeg, svg)
   * @param {Object} options - Export options
   * @returns {string} Data URL of the exported image
   */
  exportAsImage(visualization, format = "svg", options = {}) {
    if (!visualization || !visualization.id) {
      throw new Error("Powiew: Invalid D3 visualization instance")
    }

    // Get visualization info
    const visInfo = this.activeVisualizations.get(visualization.id)
    if (!visInfo) {
      throw new Error(`Powiew: D3 visualization with ID "${visualization.id}" not found`)
    }

    if (format === "svg") {
      // Export as SVG
      const svgString = new XMLSerializer().serializeToString(visInfo.svg.node())
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString)
    } else {
      // Export as PNG or JPEG
      const svgString = new XMLSerializer().serializeToString(visInfo.svg.node())
      const canvas = document.createElement("canvas")
      canvas.width = visInfo.width
      canvas.height = visInfo.height

      const ctx = canvas.getContext("2d")
      ctx.fillStyle = visInfo.options.backgroundColor || "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = new Image()
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString)

      return new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"
          const quality = format === "jpeg" ? options.quality || 0.95 : undefined
          resolve(canvas.toDataURL(mimeType, quality))
        }
        img.onerror = reject
      })
    }
  }

  /**
   * Create a tree chart
   * @private
   */
  _createTreeChart(svg, data, width, height, options) {
    const margin = options.margin || { top: 20, right: 90, bottom: 30, left: 90 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create root hierarchy
    const root = d3.hierarchy(data)
    root.x0 = innerHeight / 2
    root.y0 = 0

    // Define tree layout
    const treeLayout = d3.tree().size([innerHeight, innerWidth])

    // Create group with margin
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Update tree
    const update = (source) => {
      // Compute the new tree layout
      treeLayout(root)

      // Define nodes and links
      const nodes = root.descendants()
      const links = root.links()

      // Normalize for fixed-depth
      nodes.forEach((d) => {
        d.y = d.depth * 180
      })

      // Update nodes
      const node = g.selectAll(".node").data(nodes, (d) => d.id || (d.id = ++this._nodeId))

      // Enter new nodes
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          // Toggle children on click
          if (d.children) {
            d._children = d.children
            d.children = null
          } else {
            d.children = d._children
            d._children = null
          }
          update(d)
        })

      // Add circles for nodes
      nodeEnter
        .append("circle")
        .attr("r", 10)
        .style("fill", (d) => (d._children ? options.colors[0] : "#fff"))
        .style("stroke", options.colors[0])

      // Add labels for nodes
      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", (d) => (d.children || d._children ? -13 : 13))
        .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
        .text((d) => d.data.name)
        .style("fill", options.textColor || "#333")

      // Update position of nodes
      const nodeUpdate = nodeEnter
        .merge(node)
        .transition()
        .duration(options.duration || 750)
        .attr("transform", (d) => `translate(${d.y},${d.x})`)

      // Update node attributes
      nodeUpdate
        .select("circle")
        .attr("r", 10)
        .style("fill", (d) => (d._children ? options.colors[0] : "#fff"))

      // Remove exiting nodes
      const nodeExit = node
        .exit()
        .transition()
        .duration(options.duration || 750)
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .remove()

      nodeExit.select("circle").attr("r", 1e-6)

      nodeExit.select("text").style("fill-opacity", 1e-6)

      // Update links
      const link = g.selectAll(".link").data(links, (d) => d.target.id)

      // Enter new links
      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 }
          return this._diagonal({ source: o, target: o })
        })
        .style("fill", "none")
        .style("stroke", options.gridColor || "#ccc")
        .style("stroke-width", "2px")

      // Update position of links
      const linkUpdate = linkEnter
        .merge(link)
        .transition()
        .duration(options.duration || 750)
        .attr("d", this._diagonal)

      // Remove exiting links
      const linkExit = link
        .exit()
        .transition()
        .duration(options.duration || 750)
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y }
          return this._diagonal({ source: o, target: o })
        })
        .remove()

      // Store old positions for transition
      nodes.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }

    // Initialize counter for node IDs
    this._nodeId = 0

    // Initial update
    update(root)

    return { root, update }
  }

  /**
   * Create a force-directed graph
   * @private
   */
  _createForceDirectedGraph(svg, data, width, height, options) {
    const color = d3.scaleOrdinal(options.colors || d3.schemeCategory10)

    // Create simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(options.linkDistance || 100),
      )
      .force("charge", d3.forceManyBody().strength(options.chargeStrength || -300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    // Create links
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => d.value || 1)
      .attr("stroke", options.linkColor || "#999")
      .attr("stroke-opacity", 0.6)

    // Create nodes
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.size || 5)
      .attr("fill", (d) => color(d.group))
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add tooltips if enabled
    if (options.tooltips) {
      node.append("title").text((d) => d.name || d.id)
    }

    // Add labels if enabled
    if (options.labels) {
      const labels = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text((d) => d.name || d.id)
        .style("fill", options.textColor || "#333")
        .style("font-size", options.fontSize || "10px")

      // Update label positions on tick
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)

        node
          .attr("cx", (d) => (d.x = Math.max(d.size || 5, Math.min(width - (d.size || 5), d.x))))
          .attr("cy", (d) => (d.y = Math.max(d.size || 5, Math.min(height - (d.size || 5), d.y))))

        labels.attr("x", (d) => d.x).attr("y", (d) => d.y)
      })
    } else {
      // Update node and link positions on tick
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)

        node
          .attr("cx", (d) => (d.x = Math.max(d.size || 5, Math.min(width - (d.size || 5), d.x))))
          .attr("cy", (d) => (d.y = Math.max(d.size || 5, Math.min(height - (d.size || 5), d.y))))
      })
    }

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      if (!options.fixedNodes) {
        d.fx = null
        d.fy = null
      }
    }

    return { simulation, nodes: node, links: link }
  }

  /**
   * Create a Sankey diagram
   * @private
   */
  _createSankeyDiagram(svg, data, width, height, options) {
    // Implementation for Sankey diagram
    // This is a placeholder - actual implementation would require d3-sankey
    console.warn("Powiew: Sankey diagram implementation is a placeholder")

    return { type: "sankey" }
  }

  /**
   * Create a treemap
   * @private
   */
  _createTreemap(svg, data, width, height, options) {
    // Implementation for treemap
    const color = d3.scaleOrdinal(options.colors || d3.schemeCategory10)

    // Create hierarchy
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)

    // Create treemap layout
    const treemap = d3
      .treemap()
      .size([width, height])
      .padding(options.padding || 2)
      .round(true)

    // Apply layout
    treemap(root)

    // Create cells
    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)

    // Add rectangles
    cell
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color(d.parent.data.name))
      .attr("stroke", options.gridColor || "#fff")

    // Add text labels
    cell
      .append("text")
      .attr("x", (d) => (d.x1 - d.x0) / 2)
      .attr("y", (d) => (d.y1 - d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.data.name)
      .style("font-size", options.fontSize || "10px")
      .style("fill", options.textColor || "#fff")
      .style("pointer-events", "none")

    return { root, cells: cell }
  }

  /**
   * Create a chord diagram
   * @private
   */
  _createChordDiagram(svg, data, width, height, options) {
    // Implementation for chord diagram
    // This is a placeholder - actual implementation would be more complex
    console.warn("Powiew: Chord diagram implementation is a placeholder")

    return { type: "chord" }
  }

  /**
   * Create circle packing visualization
   * @private
   */
  _createCirclePacking(svg, data, width, height, options) {
    // Implementation for circle packing
    const color = d3.scaleOrdinal(options.colors || d3.schemeCategory10)

    // Create hierarchy
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)

    // Create pack layout
    const pack = d3
      .pack()
      .size([width, height])
      .padding(options.padding || 3)

    // Apply layout
    pack(root)

    // Create circles
    const node = svg
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)

    // Add circles
    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => (d.children ? "transparent" : color(d.data.name)))
      .attr("stroke", (d) => (d.children ? options.gridColor || "#ccc" : "none"))
      .attr("stroke-width", 1)

    // Add text labels for leaf nodes
    node
      .filter((d) => !d.children)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.data.name.substring(0, d.r / 3))
      .style("font-size", (d) => Math.min((2 * d.r) / 3, 12) + "px")
      .style("fill", options.textColor || "#333")
      .style("pointer-events", "none")

    return { root, nodes: node }
  }

  /**
   * Generate a diagonal path for tree links
   * @private
   */
  _diagonal(d) {
    return `M ${d.source.y} ${d.source.x}
            C ${(d.source.y + d.target.y) / 2} ${d.source.x},
              ${(d.source.y + d.target.y) / 2} ${d.target.x},
              ${d.target.y} ${d.target.x}`
  }

  /**
   * Check if visualization type is valid
   * @private
   * @param {string} type - Visualization type
   * @returns {boolean} Is valid type
   */
  _isValidType(type) {
    const validTypes = [
      CHART_TYPES.TREE,
      CHART_TYPES.FORCE,
      CHART_TYPES.SANKEY,
      CHART_TYPES.TREEMAP,
      CHART_TYPES.CHORD,
      CHART_TYPES.PACK,
    ]

    return validTypes.includes(type)
  }

  /**
   * Generate a unique ID
   * @private
   * @returns {string} Unique ID
   */
  _generateId() {
    return "d3_" + Math.random().toString(36).substr(2, 9)
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

export default D3Engine
