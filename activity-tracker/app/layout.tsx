import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

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
    <html lang="fr" className={GeistSans.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
