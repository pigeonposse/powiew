import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Powiew - Advanced Data Visualization Library",
  description: "A powerful data visualization library that unifies Chart.js, D3.js, and Three.js",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 py-4">{children}</main>
      </body>
    </html>
  )
}


import './globals.css'