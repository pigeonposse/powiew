import { Chart } from "@/components/ui/chart"
// Simplified Powiew library for demo purposes
;((global) => {
  // Check if d3 and THREE are available globally
  const d3 = typeof window !== "undefined" ? window.d3 : undefined
  const THREE = typeof window !== "undefined" ? window.THREE : undefined

  // Main Powiew class
  class Powiew {
    constructor(options = {}) {
      this.version = "2.0.0"
      this.name = "Powiew"
      this.container = options.container || "body"
      this.mode = options.mode || "2d"
      this.debug = options.debug || false
      this.responsive = options.responsive !== undefined ? options.responsive : true

      // Initialize engines
      this.engines = {
        chart: null,
        d3: null,
        three: null,
      }

      // Initialize
      this._initEngines()

      if (this.debug) {
        console.log(`${this.name} v${this.version} initialized with mode: ${this.mode}`)
      }
    }

    _initEngines() {
      // Initialize Chart.js engine
      if (typeof Chart !== "undefined") {
        this.engines.chart = {
          createChart: (container, type, data, options) => {
            const containerElement = document.querySelector(container)
            if (!containerElement) {
              throw new Error(`Container "${container}" not found`)
            }

            let canvas = containerElement.querySelector("canvas")
            if (!canvas) {
              canvas = document.createElement("canvas")
              containerElement.appendChild(canvas)
            }

            const ctx = canvas.getContext("2d")
            return new Chart(ctx, {
              type: type,
              data: data,
              options: {
                responsive: this.responsive,
                maintainAspectRatio: false,
                ...options,
              },
            })
          },
          updateChart: (chart, data, options = {}) => {
            if (data) {
              chart.data = data
            }
            if (Object.keys(options).length > 0) {
              chart.options = { ...chart.options, ...options }
            }
            chart.update()
            return chart
          },
        }
      }

      // Initialize D3 engine
      if (typeof d3 !== "undefined") {
        this.engines.d3 = {
          createVisualization: (container, type, data, options = {}) => {
            const containerElement = document.querySelector(container)
            if (!containerElement) {
              throw new Error(`Container "${container}" not found`)
            }

            // Clear container
            containerElement.innerHTML = ""

            // Create SVG
            const width = options.width || containerElement.clientWidth
            const height = options.height || containerElement.clientHeight || 400

            const svg = d3
              .select(containerElement)
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", `0 0 ${width} ${height}`)
              .attr("preserveAspectRatio", "xMidYMid meet")

            // Create force-directed graph
            if (type === "force") {
              return this._createForceGraph(svg, data, width, height, options)
            }

            return { svg, type }
          },
        }
      }

      // Initialize Three.js engine
      if (typeof THREE !== "undefined") {
        this.engines.three = {
          // Simplified Three.js implementation
        }
      }
    }

    _createForceGraph(svg, data, width, height, options) {
      const color = d3.scaleOrdinal(d3.schemeCategory10)

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
            .attr("cx", (d) => (d.x = Math.max(5, Math.min(width - 5, d.x))))
            .attr("cy", (d) => (d.y = Math.max(5, Math.min(height - 5, d.y))))

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
            .attr("cx", (d) => (d.x = Math.max(5, Math.min(width - 5, d.x))))
            .attr("cy", (d) => (d.y = Math.max(5, Math.min(height - 5, d.y))))
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

    // Public API methods
    createChart(container, type, data, options = {}) {
      if (!this.engines.chart) {
        throw new Error(`${this.name}: Chart.js is not loaded`)
      }

      try {
        return this.engines.chart.createChart(container, type, data, options)
      } catch (error) {
        console.error(`${this.name} Error: ${error.message}`)
        throw error
      }
    }

    createD3Visualization(container, type, data, options = {}) {
      if (!this.engines.d3) {
        throw new Error(`${this.name}: D3.js is not loaded`)
      }

      try {
        return this.engines.d3.createVisualization(container, type, data, options)
      } catch (error) {
        console.error(`${this.name} Error: ${error.message}`)
        throw error
      }
    }

    updateVisualization(visualization, data, options = {}) {
      if (!visualization) {
        throw new Error(`${this.name}: Visualization is required`)
      }

      // Handle Chart.js visualizations
      if (visualization.update && typeof visualization.update === "function") {
        return this.engines.chart.updateChart(visualization, data, options)
      }

      // Handle other visualization types
      console.warn(`${this.name}: Update not implemented for this visualization type`)
      return visualization
    }

    setTheme(theme) {
      console.log(`${this.name}: Setting theme to ${theme}`)
      // Theme implementation would go here
    }
  }

  // Expose to global scope
  global.Powiew = Powiew
})(typeof window !== "undefined" ? window : this)
