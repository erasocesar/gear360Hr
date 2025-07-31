import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Gear360Hr - Conectamos talento con propósito",
  description:
    "Firma de consultoría y gestión humana especializada en atracción de talento estratégico potenciado con IA",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${poppins.variable} font-poppins antialiased`}>{children}</body>
    </html>
  )
}
