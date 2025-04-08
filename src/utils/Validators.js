/**
 * Validators - Validation functions for Powiew
 */

/**
 * Validate options object
 * @param {Object} options - Options to validate
 * @returns {Object} Validated options
 */
export function validateOptions(options) {
  if (!options || typeof options !== "object") {
    return {}
  }

  const validatedOptions = { ...options }

  // Validate container
  if (validatedOptions.container && typeof validatedOptions.container !== "string") {
    console.warn("Powiew: Container must be a string CSS selector. Using default.")
    delete validatedOptions.container
  }

  // Validate mode
  if (validatedOptions.mode && !["2d", "3d"].includes(validatedOptions.mode)) {
    console.warn('Powiew: Mode must be "2d" or "3d". Using default "2d".')
    validatedOptions.mode = "2d"
  }

  // Validate theme
  if (
    validatedOptions.theme &&
    typeof validatedOptions.theme !== "object" &&
    typeof validatedOptions.theme !== "string"
  ) {
    console.warn("Powiew: Theme must be an object or string. Using default theme.")
    delete validatedOptions.theme
  }

  // Validate responsive
  if (validatedOptions.responsive !== undefined && typeof validatedOptions.responsive !== "boolean") {
    console.warn("Powiew: Responsive must be a boolean. Using default true.")
    validatedOptions.responsive = true
  }

  // Validate debug
  if (validatedOptions.debug !== undefined && typeof validatedOptions.debug !== "boolean") {
    console.warn("Powiew: Debug must be a boolean. Using default false.")
    validatedOptions.debug = false
  }

  return validatedOptions
}

/**
 * Validate chart data
 * @param {Object} data - Chart data to validate
 * @returns {boolean} Is valid
 * @throws {Error} If data is invalid
 */
export function validateChartData(data) {
  if (!data) {
    throw new Error("Powiew: Chart data is required")
  }

  // Check if data is in Chart.js format
  if (data.datasets) {
    if (!Array.isArray(data.datasets)) {
      throw new Error("Powiew: datasets must be an array")
    }

    if (data.datasets.length === 0) {
      throw new Error("Powiew: datasets array cannot be empty")
    }

    data.datasets.forEach((dataset, index) => {
      if (!dataset.data) {
        throw new Error(`Powiew: dataset at index ${index} is missing data property`)
      }

      if (!Array.isArray(dataset.data)) {
        throw new Error(`Powiew: dataset.data at index ${index} must be an array`)
      }
    })

    // Labels are optional but must be an array if present
    if (data.labels && !Array.isArray(data.labels)) {
      throw new Error("Powiew: labels must be an array")
    }

    return true
  }

  // Check if data is an array
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error("Powiew: Data array cannot be empty")
    }

    return true
  }

  // Check if data is an object (for pie charts, etc.)
  if (typeof data === "object" && Object.keys(data).length > 0) {
    return true
  }

  throw new Error("Powiew: Invalid chart data format")
}

/**
 * Validate 3D data
 * @param {Object|Array} data - 3D data to validate
 * @param {string} type - 3D visualization type
 * @returns {boolean} Is valid
 * @throws {Error} If data is invalid
 */
export function validate3DData(data, type) {
  if (!data) {
    throw new Error("Powiew: 3D data is required")
  }

  switch (type) {
    case "bar3d":
      return validateChartData(data)

    case "scatter3d":
      if (!Array.isArray(data)) {
        throw new Error("Powiew: Scatter3D data must be an array")
      }

      if (data.length === 0) {
        throw new Error("Powiew: Scatter3D data array cannot be empty")
      }

      // Check if points have x, y, z coordinates
      data.forEach((point, index) => {
        if (typeof point !== "object") {
          throw new Error(`Powiew: Point at index ${index} must be an object`)
        }

        if (point.x === undefined || point.y === undefined) {
          throw new Error(`Powiew: Point at index ${index} must have x and y coordinates`)
        }
      })

      return true

    case "surface":
      if (!Array.isArray(data)) {
        throw new Error("Powiew: Surface data must be an array")
      }

      if (data.length === 0) {
        throw new Error("Powiew: Surface data array cannot be empty")
      }

      // Check if data is a 2D array
      data.forEach((row, index) => {
        if (!Array.isArray(row)) {
          throw new Error(`Powiew: Row at index ${index} must be an array`)
        }

        if (row.length === 0) {
          throw new Error(`Powiew: Row at index ${index} cannot be empty`)
        }

        // Check if all rows have the same length
        if (index > 0 && row.length !== data[0].length) {
          throw new Error(`Powiew: All rows must have the same length`)
        }
      })

      return true

    default:
      return true
  }
}

/**
 * Validate D3 data
 * @param {Object|Array} data - D3 data to validate
 * @param {string} type - D3 visualization type
 * @returns {boolean} Is valid
 * @throws {Error} If data is invalid
 */
export function validateD3Data(data, type) {
  if (!data) {
    throw new Error("Powiew: D3 data is required")
  }

  switch (type) {
    case "tree":
    case "treemap":
    case "pack":
      // Check if data is hierarchical
      if (!data.name) {
        throw new Error("Powiew: Hierarchical data must have a name property")
      }

      if (!data.children && !data.value) {
        throw new Error("Powiew: Hierarchical data must have children or value property")
      }

      return true

    case "force":
      // Check if data has nodes and links
      if (!data.nodes) {
        throw new Error("Powiew: Force-directed graph data must have nodes property")
      }

      if (!data.links) {
        throw new Error("Powiew: Force-directed graph data must have links property")
      }

      if (!Array.isArray(data.nodes)) {
        throw new Error("Powiew: Nodes must be an array")
      }

      if (!Array.isArray(data.links)) {
        throw new Error("Powiew: Links must be an array")
      }

      // Check if links reference valid nodes
      const nodeIds = new Set(data.nodes.map((node) => node.id))

      data.links.forEach((link, index) => {
        if (!link.source) {
          throw new Error(`Powiew: Link at index ${index} is missing source property`)
        }

        if (!link.target) {
          throw new Error(`Powiew: Link at index ${index} is missing target property`)
        }

        // Skip node existence check if source/target are objects instead of IDs
        if (typeof link.source === "string" && !nodeIds.has(link.source)) {
          throw new Error(`Powiew: Link at index ${index} references non-existent source node "${link.source}"`)
        }

        if (typeof link.target === "string" && !nodeIds.has(link.target)) {
          throw new Error(`Powiew: Link at index ${index} references non-existent target node "${link.target}"`)
        }
      })

      return true

    default:
      return true
  }
}
