import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Activity Tracker - Professional Project Management',
  description: 'Track your daily tasks and manage projects efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
