"use client"

import { useEffect, useRef } from "react"
import Head from "next/head"

export default function SyntheticV0PageForDeployment() {
  const chartsInitialized = useRef(false)

  useEffect(() => {
    // Function to load an external script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => resolve(true)
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.head.appendChild(script)
      })
    }

    // Function to initialize charts
    const initializeCharts = () => {
      if (chartsInitialized.current) return

      console.log("Initializing charts...")

      try {
        // Verify Chart is defined
        if (typeof window.Chart === "undefined") {
          console.error("Chart.js is not available")
          return
        }

        // Create bar chart
        const barCtx = document.getElementById("bar-chart")
        if (barCtx) {
          console.log("Initializing bar chart...")
          new window.Chart(barCtx, {
            type: "bar",
            data: {
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
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Monthly Revenue",
                },
              },
            },
          })
        }

        // Create line chart
        const lineCtx = document.getElementById("line-chart")
        if (lineCtx) {
          console.log("Initializing line chart...")
          new window.Chart(lineCtx, {
            type: "line",
            data: {
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  label: "Sales 2024",
                  data: [12, 19, 3, 5, 2, 3],
                  borderColor: "rgba(54, 162, 235, 1)",
                  tension: 0.4,
                  fill: false,
                },
                {
                  label: "Sales 2025",
                  data: [8, 15, 7, 12, 9, 14],
                  borderColor: "rgba(255, 99, 132, 1)",
                  tension: 0.4,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Sales Comparison",
                },
              },
            },
          })
        }

        // Create pie chart
        const pieCtx = document.getElementById("pie-chart")
        if (pieCtx) {
          console.log("Initializing pie chart...")
          new window.Chart(pieCtx, {
            type: "pie",
            data: {
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
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "right",
                },
                title: {
                  display: true,
                  text: "Product Distribution",
                },
              },
            },
          })
        }

        // Create D3 force-directed graph
        const forceGraph = document.getElementById("force-graph")
        if (forceGraph && window.d3) {
          console.log("Initializing force-directed graph...")

          const width = forceGraph.clientWidth
          const height = forceGraph.clientHeight || 280

          // Data for the graph
          const data = {
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

          // Create SVG
          const svg = window.d3
            .select(forceGraph)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])

          // Create simulation
          const simulation = window.d3
            .forceSimulation(data.nodes)
            .force(
              "link",
              window.d3
                .forceLink(data.links)
                .id((d) => d.id)
                .distance(80),
            )
            .force("charge", window.d3.forceManyBody().strength(-200))
            .force("center", window.d3.forceCenter(width / 2, height / 2))

          // Add links
          const link = svg
            .append("g")
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d) => Math.sqrt(d.value))

          // Add nodes
          const node = svg
            .append("g")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", (d) => ["#4285F4", "#EA4335", "#FBBC05", "#34A853"][d.group - 1])
            .call(window.d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

          // Add labels
          const labels = svg
            .append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text((d) => d.id)
            .style("font-size", "10px")

          // Update positions on each tick
          simulation.on("tick", () => {
            link
              .attr("x1", (d) => d.source.x)
              .attr("y1", (d) => d.source.y)
              .attr("x2", (d) => d.target.x)
              .attr("y2", (d) => d.target.y)

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

            labels.attr("x", (d) => d.x).attr("y", (d) => d.y)
          })

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
            d.fx = null
            d.fy = null
          }
        }

        chartsInitialized.current = true
        console.log("Charts successfully initialized")
      } catch (error) {
        console.error("Error initializing charts:", error)
      }
    }

    // Load required libraries and then initialize charts
    const loadLibrariesAndInitialize = async () => {
      try {
        console.log("Loading libraries...")

        // Load Chart.js
        await loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js")
        console.log("Chart.js loaded successfully")

        // Load D3.js
        await loadScript("https://d3js.org/d3.v7.min.js")
        console.log("D3.js loaded successfully")

        // Wait a moment to ensure libraries are available
        setTimeout(() => {
          initializeCharts()
        }, 500)
      } catch (error) {
        console.error("Error loading libraries:", error)
      }
    }

    // Start loading process
    loadLibrariesAndInitialize()

    // Cleanup on unmount
    return () => {
      // Clean up resources if needed
    }
  }, []) // Only run once when component mounts

  return (
    <>
      <Head>
        <title>Powiew - Data Visualization Library</title>
      </Head>

      <div className="container mx-auto p-4">
        <header>
          <h1 className="text-3xl font-bold mb-2">Powiew Demo</h1>
          <p className="text-gray-600 mb-6">
            A powerful data visualization library that unifies Chart.js, D3.js, and Three.js
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 h-[350px]">
            <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
            <div className="h-[280px] relative">
              <canvas id="bar-chart"></canvas>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-[350px]">
            <h3 className="text-lg font-medium mb-4">Line Chart</h3>
            <div className="h-[280px] relative">
              <canvas id="line-chart"></canvas>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-[350px]">
            <h3 className="text-lg font-medium mb-4">Pie Chart</h3>
            <div className="h-[280px] relative">
              <canvas id="pie-chart"></canvas>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-[350px]">
            <h3 className="text-lg font-medium mb-4">Force-Directed Graph</h3>
            <div id="force-graph" className="h-[280px]"></div>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">Made with ♥ by PigeonPosse</footer>
      </div>
    </>
  )
}
