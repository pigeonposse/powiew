/**
 * ImageToChart - Turns a picture of a chart/table/diagram into Powiew-ready data
 * using a vision model. Provider-agnostic: pass `provider` (any async function)
 * or use the built-in Anthropic adapter.
 */

const MAX_EDGE = 1568
const SUPPORTED_MEDIA = ["image/png", "image/jpeg", "image/gif", "image/webp"]

export const EXTRACTION_PROMPT = `You are a data-extraction engine. Look at the image and recover the data behind the chart, table or diagram.
Reply with ONE JSON object and nothing else, using this schema:
{
  "kind": "chart" | "table" | "diagram" | "unknown",
  "type": "bar" | "line" | "pie" | "doughnut" | "radar" | "scatter" | "bubble" | "polarArea" | "tree" | "force" | "treemap" | "pack",
  "title": string | null,
  "labels": string[],                       // category / x-axis labels
  "datasets": [{ "label": string, "data": number[] }],  // chart.js style; scatter/bubble use {x,y,r?} objects
  "hierarchy": { "name": string, "value"?: number, "children"?: [...] },  // tree/treemap/pack only
  "nodes": [{ "id": string, "group"?: number }], "links": [{ "source": string, "target": string, "value"?: number }],  // force only
  "axes": { "x": string | null, "y": string | null, "unit": string | null },
  "estimated": boolean,                     // true if any value was read off by eye instead of a printed label
  "confidence": number,                     // 0..1 overall
  "notes": string[]                         // ambiguities, illegible parts, assumptions
}
Rules: never invent data that is not visible; use null/[] for what is absent; numbers must be plain numbers (no units or thousands separators); keep series order and colours-to-legend mapping exactly as drawn.`

/**
 * Normalise any supported image source into { mediaType, data (base64) }.
 * @param {string|Blob|ArrayBuffer|Uint8Array|HTMLImageElement|HTMLCanvasElement} source
 * @param {{maxEdge?: number}} [opts]
 */
export async function loadImage(source, opts = {}) {
  const maxEdge = opts.maxEdge || MAX_EDGE

  if (typeof source === "string") {
    const dataUrl = /^data:/.test(source) ? source : await fetchAsDataUrl(source)
    return finish(await downscale(dataUrl, maxEdge))
  }
  if (typeof Blob !== "undefined" && source instanceof Blob) {
    return finish(await downscale(await blobToDataUrl(source), maxEdge))
  }
  if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
    const bytes = source instanceof ArrayBuffer ? new Uint8Array(source) : new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
    const mediaType = sniffMediaType(bytes)
    return { mediaType, data: bytesToBase64(bytes) }
  }
  if (typeof HTMLCanvasElement !== "undefined" && source instanceof HTMLCanvasElement) {
    return finish(await downscale(source.toDataURL("image/png"), maxEdge))
  }
  if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) {
    return finish(await downscale(source.src, maxEdge))
  }
  throw new Error("Powiew: unsupported image source")
}

function finish(dataUrl) {
  const m = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl)
  if (!m) throw new Error("Powiew: could not read image")
  if (!SUPPORTED_MEDIA.includes(m[1])) throw new Error(`Powiew: unsupported image type "${m[1]}"`)
  return { mediaType: m[1], data: m[2] }
}

async function fetchAsDataUrl(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Powiew: could not fetch image (${res.status})`)
  return blobToDataUrl(await res.blob())
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error("Powiew: could not read image"))
    r.readAsDataURL(blob)
  })
}

// Shrinks oversized images in the browser; passes through elsewhere.
async function downscale(dataUrl, maxEdge) {
  if (typeof document === "undefined") return dataUrl
  const img = await new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error("Powiew: could not decode image"))
    i.src = dataUrl
  })
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight))
  const needsReencode = !SUPPORTED_MEDIA.some((t) => dataUrl.startsWith(`data:${t}`))
  if (scale === 1 && !needsReencode) return dataUrl
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/png")
}

function sniffMediaType(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return "image/png"
  if (b[0] === 0xff && b[1] === 0xd8) return "image/jpeg"
  if (b[0] === 0x47 && b[1] === 0x49) return "image/gif"
  if (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57) return "image/webp"
  throw new Error("Powiew: unrecognised image format")
}

function bytesToBase64(bytes) {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64")
  let s = ""
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

/**
 * Built-in Anthropic provider. In browsers prefer `endpoint` pointing at your
 * own proxy so the API key never ships to clients.
 */
export function anthropicProvider({ apiKey, model = "claude-sonnet-5-5", endpoint = "https://api.anthropic.com/v1/messages", maxTokens = 4096 } = {}) {
  return async ({ image, prompt }) => {
    const headers = { "content-type": "application/json", "anthropic-version": "2023-06-01" }
    if (apiKey) {
      headers["x-api-key"] = apiKey
      if (typeof window !== "undefined") headers["anthropic-dangerous-direct-browser-access"] = "true"
    }
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    })
    if (!res.ok) throw new Error(`Powiew: vision request failed (${res.status}) ${await res.text()}`)
    const json = await res.json()
    return (json.content || []).filter((b) => b.type === "text").map((b) => b.text).join("")
  }
}

/** Pull the first balanced JSON object out of a model reply. */
export function parseJsonReply(text) {
  const start = text.indexOf("{")
  if (start < 0) throw new Error("Powiew: model reply contained no JSON")
  let depth = 0
  let inStr = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inStr) {
      if (c === "\\") i++
      else if (c === '"') inStr = false
    } else if (c === '"') inStr = true
    else if (c === "{") depth++
    else if (c === "}" && --depth === 0) return JSON.parse(text.slice(start, i + 1))
  }
  throw new Error("Powiew: model reply had unbalanced JSON")
}

const CHARTJS_TYPES = ["bar", "line", "pie", "doughnut", "radar", "scatter", "bubble", "polarArea"]
const HIERARCHY_TYPES = ["tree", "treemap", "pack"]

/**
 * Validate/clean the model's spec and report problems instead of trusting it.
 * @returns {{spec: object, warnings: string[]}}
 */
export function validateSpec(raw) {
  const warnings = []
  const spec = { ...raw, notes: Array.isArray(raw.notes) ? [...raw.notes] : [] }

  if (!CHARTJS_TYPES.includes(spec.type) && !HIERARCHY_TYPES.includes(spec.type) && spec.type !== "force") {
    throw new Error(`Powiew: image does not map to a supported visualization (type "${spec.type}")`)
  }

  if (CHARTJS_TYPES.includes(spec.type)) {
    if (!Array.isArray(spec.datasets) || !spec.datasets.length) throw new Error("Powiew: no data series found in image")
    const labels = Array.isArray(spec.labels) ? spec.labels : []
    spec.labels = labels
    spec.datasets = spec.datasets.map((d, i) => {
      const data = (d.data || []).map((v) => (typeof v === "string" ? Number(v.replace(/[, ]/g, "")) : v))
      if (data.some((v) => v === null || (typeof v === "number" && Number.isNaN(v)))) warnings.push(`series ${i + 1} has unreadable values`)
      if (labels.length && !["scatter", "bubble"].includes(spec.type) && data.length !== labels.length) {
        warnings.push(`series ${i + 1} has ${data.length} values for ${labels.length} labels`)
      }
      return { label: d.label || `Series ${i + 1}`, data }
    })
  } else if (HIERARCHY_TYPES.includes(spec.type)) {
    if (!spec.hierarchy || !spec.hierarchy.name) throw new Error("Powiew: no hierarchy found in image")
  } else if (!Array.isArray(spec.nodes) || !spec.nodes.length) {
    throw new Error("Powiew: no graph nodes found in image")
  }

  if (typeof spec.confidence !== "number") spec.confidence = 0
  if (spec.estimated) warnings.push("values were estimated by eye, not read from printed labels")
  if (spec.confidence < 0.6) warnings.push(`low confidence (${spec.confidence})`)
  return { spec, warnings }
}

/** Map a validated spec to the arguments of Powiew's create* methods. */
export function specToVisualization(spec) {
  const options = {}
  if (spec.title) options.plugins = { title: { display: true, text: spec.title } }

  if (CHARTJS_TYPES.includes(spec.type)) {
    const scales = {}
    if (spec.axes?.x) scales.x = { title: { display: true, text: spec.axes.x } }
    if (spec.axes?.y) scales.y = { title: { display: true, text: spec.axes.unit ? `${spec.axes.y} (${spec.axes.unit})` : spec.axes.y } }
    if (Object.keys(scales).length && !["pie", "doughnut", "radar", "polarArea"].includes(spec.type)) options.scales = scales
    return { engine: "chart", type: spec.type, data: { labels: spec.labels, datasets: spec.datasets }, options }
  }
  if (HIERARCHY_TYPES.includes(spec.type)) return { engine: "d3", type: spec.type, data: spec.hierarchy, options: { title: spec.title } }
  return { engine: "d3", type: "force", data: { nodes: spec.nodes, links: spec.links || [] }, options: { title: spec.title } }
}

/**
 * Extract a chart spec from an image.
 * @param {*} source - see loadImage
 * @param {{provider: Function, prompt?: string, maxEdge?: number}} opts
 */
export async function extractFromImage(source, opts = {}) {
  if (typeof opts.provider !== "function") {
    throw new Error("Powiew: an image provider is required, e.g. anthropicProvider({ apiKey })")
  }
  const image = await loadImage(source, opts)
  const reply = await opts.provider({ image, prompt: opts.prompt || EXTRACTION_PROMPT })
  const { spec, warnings } = validateSpec(parseJsonReply(reply))
  return { spec, warnings, render: specToVisualization(spec), image }
}
