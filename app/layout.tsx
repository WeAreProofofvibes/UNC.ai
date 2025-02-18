import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UNC.AI - Ultimate Nexus Catalyst',
  description: 'Explore the future with Black Crypto, Unc AI, and Web3 AI. Your ultimate guide through Faith, Finances, Fitness, and Family. Join the revolution with AI Agents and Token Pump Fun.',
  openGraph: {
    title: 'UNC.AI - Ultimate Nexus Catalyst',
    description: 'Explore the future with Black Crypto, Unc AI, and Web3 AI. Your ultimate guide through Faith, Finances, Fitness, and Family. Join the revolution with AI Agents and Token Pump Fun.',
    images: '/meta.png',
    url: 'https://unc.fun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@uncdotfun',
    title: 'UNC.AI - Ultimate Nexus Catalyst',
    description: 'Explore the future with Black Crypto, Unc AI, and Web3 AI. Your ultimate guide through Faith, Finances, Fitness, and Family. Join the revolution with AI Agents and Token Pump Fun.',
    images: '/meta.png',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="og:title" content="UNC.AI - Ultimate Nexus Catalyst" />
        <meta property="og:description" content="Explore the future with Black Crypto, Unc AI, and Web3 AI. Your ultimate guide through Faith, Finances, Fitness, and Family. Join the revolution with AI Agents and Token Pump Fun." />
        <meta property="og:image" content="/meta.png" />
        <meta property="og:url" content="https://unc.fun" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@uncdotfun" />
        <meta name="twitter:title" content="UNC.AI - Ultimate Nexus Catalyst" />
        <meta name="twitter:description" content="Explore the future with Black Crypto, Unc AI, and Web3 AI. Your ultimate guide through Faith, Finances, Fitness, and Family. Join the revolution with AI Agents and Token Pump Fun." />
        <meta name="twitter:image" content="/meta.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}

