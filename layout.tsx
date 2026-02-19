import './globals.css'

export const metadata = {
  title: 'Visitor Gate Access',
  description: 'Easy access for apartment visitors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
