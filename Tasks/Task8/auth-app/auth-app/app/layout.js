import "./globals.css"
import Navbar from "./Navbar"
import { cookies } from "next/headers"

export const metadata = {
  title: "PurrAuth",
  description: "Pixel-cute authentication system",
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")
  const isLoggedIn = !!userCookie

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ===== NAVBAR ===== */}
        <Navbar isLoggedIn={isLoggedIn} />

        {/* ===== PAGE CONTENT ===== */}
        {children}

        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">
              <img src="/logo.jpg" alt="PurrAuth Logo" />
              <span className="footer-logo-text">PurrAuth</span>
            </div>
            
            <p className="footer-copy">
              © 2026 PurrAuth — Zara Tahir. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
