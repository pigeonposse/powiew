// Load Powiew into global scope
;(() => {
  // Import Powiew module
  const script = document.createElement("script")
  script.src = "/dist/powiew.min.js"
  script.async = true
  script.onload = () => {
    console.log("Powiew library loaded")
    // Initialize if the example script has already loaded
    if (typeof window.initializePowiew === "function") {
      window.initializePowiew()
    }
  }
  script.onerror = () => {
    console.error("Failed to load Powiew library")
  }
  document.head.appendChild(script)
})()
