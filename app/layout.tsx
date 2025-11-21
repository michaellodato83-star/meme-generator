import type { Metadata } from 'next'
import './globals.css'
import Provider from '@/components/InstantDBProvider'

export const metadata: Metadata = {
  title: 'Meme Generator & Feed',
  description: 'Create and share memes with upvoting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}

