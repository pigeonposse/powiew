import test from "node:test"
import assert from "node:assert/strict"
import { extractFromImage, parseJsonReply, validateSpec } from "../src/multimodal/ImageToChart.js"

// 1x1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64")
const reply = (o) => "Here you go:\n```json\n" + JSON.stringify(o) + "\n```"

test("bar chart image -> chart.js spec, no network", async () => {
  let seen
  const provider = async (req) => ((seen = req), reply({
    kind: "chart", type: "bar", title: "Revenue", labels: ["Q1", "Q2"],
    datasets: [{ label: "2025", data: ["1,200", 1500] }],
    axes: { x: "Quarter", y: "Revenue", unit: "USD" }, estimated: false, confidence: 0.9, notes: [],
  }))
  const r = await extractFromImage(PNG, { provider })
  assert.equal(seen.image.mediaType, "image/png")
  assert.deepEqual(r.render.data.datasets[0].data, [1200, 1500])
  assert.equal(r.render.options.scales.y.title.text, "Revenue (USD)")
  assert.equal(r.warnings.length, 0)
})

test("flags estimated, low-confidence and mismatched data", () => {
  const { warnings } = validateSpec({ type: "line", labels: ["a", "b", "c"], datasets: [{ data: [1, 2] }], estimated: true, confidence: 0.4 })
  assert.equal(warnings.length, 3)
})

test("rejects unsupported types and missing data", () => {
  assert.throws(() => validateSpec({ type: "photo" }), /supported/)
  assert.throws(() => validateSpec({ type: "bar", datasets: [] }), /no data/)
})

test("parseJsonReply handles braces inside strings", () => {
  assert.deepEqual(parseJsonReply('x {"a":"}{","b":1} y'), { a: "}{", b: 1 })
})

test("requires a provider", async () => {
  await assert.rejects(extractFromImage(PNG), /provider/)
})
