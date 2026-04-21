"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar({ isLoggedIn }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false) // scrolling down past 60px
      } else {
        setIsVisible(true) // scrolling up
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <nav className={`navbar ${isVisible ? "" : "navbar-hidden"}`}>
      <div className="navbar-left">
        <Link href="/" className="navbar-brand">
          <img src="/logo.jpg" alt="PurrAuth Logo" className="navbar-logo" />
          <span className="navbar-title">PurrAuth</span>
        </Link>
      </div>
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link href="/signup" className="nav-link">Signup</Link>
            <Link href="/login" className="nav-link">Login</Link>
          </>
        ) : (
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        )}
      </div>
    </nav>
  )
}
