/**
 * DataProcessor - Processes and transforms data for visualizations
 */
class DataProcessor {
  /**
   * Create a new DataProcessor instance
   */
  constructor() {
    // Initialize any required properties
  }

  /**
   * Process data for visualization
   * @param {Object|Array} data - Raw data
   * @param {string} type - Visualization type
   * @param {Object} [options] - Processing options
   * @returns {Object|Array} Processed data
   */
  process(data, type, options = {}) {
    // Return data as-is if no processing needed
    if (!data || !type) return data

    // Apply type-specific processing
    switch (type) {
      case "bar":
      case "line":
      case "radar":
        return this._processChartData(data, type, options)
      case "pie":
      case "doughnut":
      case "polarArea":
        return this._processPieData(data, options)
      case "scatter":
      case "bubble":
        return this._processScatterData(data, options)
      case "tree":
      case "treemap":
      case "pack":
        return this._processHierarchicalData(data, options)
      case "force":
        return this._processNetworkData(data, options)
      case "bar3d":
      case "scatter3d":
      case "surface":
        return this._process3DData(data, type, options)
      default:
        return data
    }
  }

  /**
   * Process data for standard charts (bar, line, etc.)
   * @private
   * @param {Object} data - Chart data
   * @param {string} type - Chart type
   * @param {Object} options - Processing options
   * @returns {Object} Processed chart data
   */
  _processChartData(data, type, options) {
    // Return data as-is if already in correct format
    if (data.datasets && data.labels) return data

    // Convert array data to chart.js format
    if (Array.isArray(data)) {
      return {
        labels: data.map((item, index) => item.label || `Item ${index + 1}`),
        datasets: [
          {
            label: options.label || "Dataset",
            data: data.map((item) => (typeof item === "object" ? item.value : item)),
            backgroundColor: options.backgroundColor || "rgba(75, 192, 192, 0.2)",
            borderColor: options.borderColor || "rgba(75, 192, 192, 1)",
            borderWidth: options.borderWidth || 1,
          },
        ],
      }
    }

    // Handle object data
    if (typeof data === "object" && !Array.isArray(data)) {
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: options.label || "Dataset",
            data: Object.values(data),
            backgroundColor: options.backgroundColor || "rgba(75, 192, 192, 0.2)",
            borderColor: options.borderColor || "rgba(75, 192, 192, 1)",
            borderWidth: options.borderWidth || 1,
          },
        ],
      }
    }

    return data
  }

  /**
   * Process data for pie/doughnut charts
   * @private
   * @param {Object} data - Chart data
   * @param {Object} options - Processing options
   * @returns {Object} Processed pie data
   */
  _processPieData(data, options) {
    // Similar to _processChartData but with pie-specific formatting
    return this._processChartData(data, "pie", options)
  }

  /**
   * Process data for scatter/bubble charts
   * @private
   * @param {Object} data - Chart data
   * @param {Object} options - Processing options
   * @returns {Object} Processed scatter data
   */
  _processScatterData(data, options) {
    // Return data as-is if already in correct format
    if (data.datasets) return data

    // Convert array of points to scatter format
    if (Array.isArray(data)) {
      return {
        datasets: [
          {
            label: options.label || "Dataset",
            data: data.map((point) => {
              if (typeof point === "object" && "x" in point && "y" in point) {
                return point
              } else if (Array.isArray(point) && point.length >= 2) {
                return { x: point[0], y: point[1] }
              }
              return point
            }),
            backgroundColor: options.backgroundColor || "rgba(75, 192, 192, 0.5)",
          },
        ],
      }
    }

    return data
  }

  /**
   * Process hierarchical data (tree, treemap, etc.)
   * @private
   * @param {Object} data - Hierarchical data
   * @param {Object} options - Processing options
   * @returns {Object} Processed hierarchical data
   */
  _processHierarchicalData(data, options) {
    // Return data as-is if already in correct format
    if (data.name && ("children" in data || "value" in data)) return data

    // Convert flat array to hierarchical format
    if (Array.isArray(data) && data.every((item) => item.id && item.parentId !== undefined)) {
      return this._arrayToHierarchy(data)
    }

    return data
  }

  /**
   * Process network data (force-directed graphs)
   * @private
   * @param {Object} data - Network data
   * @param {Object} options - Processing options
   * @returns {Object} Processed network data
   */
  _processNetworkData(data, options) {
    // Return data as-is if already in correct format
    if (data.nodes && data.links) return data

    // Convert edge list to nodes and links
    if (Array.isArray(data) && data.every((item) => item.source && item.target)) {
      const nodes = new Set()

      // Extract unique nodes
      data.forEach((link) => {
        nodes.add(link.source)
        nodes.add(link.target)
      })

      return {
        nodes: Array.from(nodes).map((id) => ({ id })),
        links: data,
      }
    }

    return data
  }

  /**
   * Process data for 3D visualizations
   * @private
   * @param {Object} data - 3D data
   * @param {string} type - 3D visualization type
   * @param {Object} options - Processing options
   * @returns {Object} Processed 3D data
   */
  _process3DData(data, type, options) {
    // Process based on 3D visualization type
    switch (type) {
      case "bar3d":
        return this._processChartData(data, "bar", options)
      case "scatter3d":
        // Ensure z values are present
        if (Array.isArray(data)) {
          return data.map((point) => {
            if (typeof point === "object" && "x" in point && "y" in point) {
              return { ...point, z: point.z || 0 }
            } else if (Array.isArray(point)) {
              return {
                x: point[0],
                y: point[1],
                z: point.length > 2 ? point[2] : 0,
              }
            }
            return point
          })
        }
        return data
      case "surface":
        // Surface data should be a 2D array of height values
        return data
      default:
        return data
    }
  }

  /**
   * Convert flat array with parent-child relationships to hierarchy
   * @private
   * @param {Array} items - Flat array of items with id and parentId
   * @returns {Object} Hierarchical data
   */
  _arrayToHierarchy(items) {
    const rootItems = items.filter((item) => !item.parentId)
    const lookup = {}

    // Create lookup table
    items.forEach((item) => {
      lookup[item.id] = { ...item, children: [] }
    })

    // Build tree
    items.forEach((item) => {
      if (item.parentId && lookup[item.parentId]) {
        lookup[item.parentId].children.push(lookup[item.id])
      }
    })

    // Return root if single root
    if (rootItems.length === 1) {
      return lookup[rootItems[0].id]
    }

    // Return multiple roots under a common parent
    return {
      name: "root",
      children: rootItems.map((item) => lookup[item.id]),
    }
  }

  /**
   * Normalize data to a specific range
   * @param {Array} data - Array of numbers
   * @param {number} min - Target minimum value
   * @param {number} max - Target maximum value
   * @returns {Array} Normalized data
   */
  normalize(data, min = 0, max = 1) {
    const dataMin = Math.min(...data)
    const dataMax = Math.max(...data)
    const range = dataMax - dataMin

    if (range === 0) return data.map(() => min)

    return data.map((value) => {
      return min + ((value - dataMin) / range) * (max - min)
    })
  }

  /**
   * Aggregate data by a specific field
   * @param {Array} data - Array of objects
   * @param {string} groupField - Field to group by
   * @param {string} valueField - Field to aggregate
   * @param {string} [aggregation='sum'] - Aggregation method (sum, avg, min, max, count)
   * @returns {Object} Aggregated data
   */
  aggregate(data, groupField, valueField, aggregation = "sum") {
    const result = {}

    data.forEach((item) => {
      const group = item[groupField]
      const value = item[valueField]

      if (!result[group]) {
        result[group] = {
          values: [],
          count: 0,
          sum: 0,
          min: Number.POSITIVE_INFINITY,
          max: Number.NEGATIVE_INFINITY,
        }
      }

      result[group].values.push(value)
      result[group].count++
      result[group].sum += value
      result[group].min = Math.min(result[group].min, value)
      result[group].max = Math.max(result[group].max, value)
    })

    // Apply aggregation
    const aggregated = {}

    Object.keys(result).forEach((group) => {
      switch (aggregation) {
        case "sum":
          aggregated[group] = result[group].sum
          break
        case "avg":
          aggregated[group] = result[group].sum / result[group].count
          break
        case "min":
          aggregated[group] = result[group].min
          break
        case "max":
          aggregated[group] = result[group].max
          break
        case "count":
          aggregated[group] = result[group].count
          break
        default:
          aggregated[group] = result[group].sum
      }
    })

    return aggregated
  }
}

export default DataProcessor
