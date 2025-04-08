import { Chart } from "@/components/ui/chart"
// Define a global initialization function instead of using ES modules
;((global) => {
  // Function to initialize Powiew
  function initializePowiew() {
    // Check if required libraries are loaded
    if (typeof d3 === "undefined" || typeof Chart === "undefined" || typeof THREE === "undefined") {
      console.error("Required libraries (d3, Chart.js, Three.js) are not loaded")
      return
    }

    // Try to load Powiew
    let Powiew
    try {
      // Try to get Powiew from global scope
      Powiew = global.Powiew

      if (!Powiew) {
        console.error("Powiew library not found in global scope")
        return
      }
    } catch (err) {
      console.error("Error loading Powiew:", err)
      return
    }

    // Initialize Powiew with debug mode
    const vis = new Powiew({
      debug: true,
      responsive: true,
    })

    // Data for the bar chart
    const barData = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Revenue 2025",
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }

    // Data for the line chart
    const lineData = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Sales 2024",
          data: [12, 19, 3, 5, 2, 3],
          fill: false,
          borderColor: "rgba(54, 162, 235, 1)",
          tension: 0.4,
        },
        {
          label: "Sales 2025",
          data: [8, 15, 7, 12, 9, 14],
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.4,
        },
      ],
    }

    // Data for the pie chart
    const pieData = {
      labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
      datasets: [
        {
          data: [30, 20, 25, 15, 10],
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }

    // Data for the force-directed graph
    const forceData = {
      nodes: [
        { id: "A", group: 1 },
        { id: "B", group: 1 },
        { id: "C", group: 2 },
        { id: "D", group: 2 },
        { id: "E", group: 3 },
        { id: "F", group: 3 },
        { id: "G", group: 4 },
        { id: "H", group: 4 },
      ],
      links: [
        { source: "A", target: "B", value: 1 },
        { source: "A", target: "C", value: 1 },
        { source: "B", target: "D", value: 1 },
        { source: "C", target: "E", value: 1 },
        { source: "D", target: "F", value: 1 },
        { source: "E", target: "F", value: 1 },
        { source: "F", target: "G", value: 1 },
        { source: "G", target: "H", value: 1 },
      ],
    }

    try {
      // Create charts
      const barChart = vis.createChart("#bar-chart", "bar", barData, {
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Monthly Revenue",
          },
        },
      })

      const lineChart = vis.createChart("#line-chart", "line", lineData, {
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Sales Comparison",
          },
        },
      })

      const pieChart = vis.createChart("#pie-chart", "pie", pieData, {
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Product Distribution",
          },
        },
      })

      // Create D3 force-directed graph
      const forceGraph = vis.createD3Visualization("#force-graph", "force", forceData, {
        linkDistance: 80,
        chargeStrength: -200,
        labels: true,
        tooltips: true,
      })

      // Update data button
      const updateButton = document.getElementById("update-data")
      if (updateButton) {
        updateButton.addEventListener("click", () => {
          // Generate new random data
          const newBarData = {
            ...barData,
            datasets: [
              {
                ...barData.datasets[0],
                data: barData.labels.map(() => Math.floor(Math.random() * 100)),
              },
            ],
          }

          const newLineData = {
            ...lineData,
            datasets: lineData.datasets.map((dataset) => ({
              ...dataset,
              data: lineData.labels.map(() => Math.floor(Math.random() * 20)),
            })),
          }

          const newPieData = {
            ...pieData,
            datasets: [
              {
                ...pieData.datasets[0],
                data: pieData.labels.map(() => Math.floor(Math.random() * 50) + 10),
              },
            ],
          }

          // Update charts
          vis.updateVisualization(barChart, newBarData)
          vis.updateVisualization(lineChart, newLineData)
          vis.updateVisualization(pieChart, newPieData)
        })
      }

      // Theme selector
      const themeSelector = document.getElementById("theme-selector")
      if (themeSelector) {
        themeSelector.addEventListener("change", (e) => {
          vis.setTheme(e.target.value)
        })
      }

      // Log initialization
      console.log("Powiew initialized:", vis)
    } catch (err) {
      console.error("Error initializing charts:", err)
    }
  }

  // Expose the initialization function to the global scope
  global.initializePowiew = initializePowiew

  // Auto-initialize if document is ready
  if (global.document && (document.readyState === "complete" || document.readyState === "interactive")) {
    setTimeout(initializePowiew, 100)
  } else if (global.document) {
    document.addEventListener("DOMContentLoaded", initializePowiew)
  }
})(typeof window !== "undefined" ? window : this)
