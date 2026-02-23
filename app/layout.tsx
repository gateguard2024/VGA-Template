import './globals.css'
import { SITE_CONFIG } from './config'
import type { Metadata } from 'next'

// This automatically sets the Browser Tab Title and Phone App Icon Name!
export const metadata: Metadata = {
  title: `${SITE_CONFIG.propertyName} | ${SITE_CONFIG.brandName}`,
  description: SITE_CONFIG.footerText,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
