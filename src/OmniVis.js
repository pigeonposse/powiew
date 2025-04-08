import { Chart } from "@/components/ui/chart"
class OmniVis {
  constructor(options = {}) {
    this.version = "1.0.0"
    this.container = options.container || "body"
    this.mode = options.mode || "2d"

    this.engines = {
      d3: null,
      chart: null,
      three: null,
    }

    this.init()
  }

  init() {
    if (typeof d3 !== "undefined") this.engines.d3 = d3
    if (typeof Chart !== "undefined") this.engines.chart = Chart
    if (typeof THREE !== "undefined") this.engines.three = THREE
  }

  createChart(container, type, data) {
    if (!this.engines.chart) {
      throw new Error("Chart.js is not loaded")
    }

    const ctx = document.querySelector(container).querySelector("canvas").getContext("2d")
    return new this.engines.chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = OmniVis
} else if (typeof define === "function" && define.amd) {
  define([], () => OmniVis)
} else {
  window.OmniVis = OmniVis
}
