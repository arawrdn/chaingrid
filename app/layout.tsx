import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://chaingrid.vercel.app"

const miniappConfig = {
  version: "1",
  imageUrl: `${baseUrl}/chaingrid-frame-preview.jpg`,
  button: {
    title: "🎮 Play ChainGrid",
    action: {
      type: "launch_frame",
      name: "ChainGrid",
      url: baseUrl,
      splashImageUrl: `${baseUrl}/chaingrid-logo.jpg`,
      splashBackgroundColor: "#000000",
    },
  },
}

export const metadata: Metadata = {
  title: "ChainGrid - Crypto Word Search",
  description: "Daily crypto-themed word search game with wallet integration",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  openGraph: {
    title: "ChainGrid - Daily Crypto Word Search",
    description: "Find hidden crypto words in 2 minutes. Connect your wallet and compete on the leaderboard!",
    images: [
      {
        url: `${baseUrl}/chaingrid-frame-preview.jpg`,
        width: 900,
        height: 600,
        alt: "ChainGrid Game",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content={JSON.stringify(miniappConfig)} />
        <meta name="fc:frame" content={JSON.stringify(miniappConfig)} />
        <meta property="og:image" content={`${baseUrl}/chaingrid-frame-preview.jpg`} />
        <meta property="og:image:width" content="900" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content={`${baseUrl}/chaingrid-frame-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
