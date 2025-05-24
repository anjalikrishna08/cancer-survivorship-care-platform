import { Inter } from "next/font/google"
import "./globals.css"
import { FloatingChat } from "@/components/floating-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cancer Survivorship Care",
  description: "AI-Powered Cancer Survivorship Care Platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <FloatingChat />
      </body>
    </html>
  )
}
