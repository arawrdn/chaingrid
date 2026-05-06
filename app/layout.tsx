import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "./providers"

// Inisialisasi Font
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://chaingrid-kohl.vercel.app"

// Konfigurasi Frame / Mini App
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

// 1. Export Viewport terpisah (Wajib di Next.js 15)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
}

// 2. Metadata (Tanpa viewport)
export const metadata: Metadata = {
  title: "ChainGrid - Crypto Word Search",
  description: "Daily crypto-themed word search game with wallet integration",
  generator: "v0.app",
  openGraph: {
    title: "ChainGrid - Daily Crypto Word Search",
    description: "Find hidden crypto words in 2 minutes. Connect your wallet and compete on the leaderboard!",
    url: baseUrl,
    siteName: "ChainGrid",
    images: [
      {
        url: `${baseUrl}/chaingrid-frame-preview.jpg`,
        width: 900,
        height: 600,
        alt: "ChainGrid Game",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainGrid - Daily Crypto Word Search",
    description: "Find hidden crypto words in 2 minutes.",
    images: [`${baseUrl}/chaingrid-frame-preview.jpg`],
  },
  // Tag tambahan seperti Farcaster & Talent App dimasukkan ke 'other' agar lebih bersih
  other: {
    "fc:miniapp": JSON.stringify(miniappConfig),
    "fc:frame": JSON.stringify(miniappConfig),
    "talentapp:project_verification": "164306cecdfbed9f1cc7a58d56bd55ecb5491aa9ce19a5a761e240df650e1809baf36d4364ba0ffecfda7f1cd28376173b025d5baec688e0d680fb0d213d0842",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-black text-white">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
