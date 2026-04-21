"use server" // This ensures code runs on server only

import { connectDB } from "../lib/db"
import User from "../models/User"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// ---------------- SIGNUP ----------------
export async function signup(prevState, formData) {
  // Get form values
  const email = formData.get("email")
  const password = formData.get("password")

  // Basic validation
  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  // Connect to database
  await connectDB()

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return { error: "An account with this email already exists." }
  }

  // Hash password before saving (important for security)
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user in database
  await User.create({
    email,
    password: hashedPassword,
  })

  // Redirect to login page after signup
  redirect("/login")
}

// ---------------- LOGIN ----------------
export async function login(prevState, formData) {
  // Get form values
  const email = formData.get("email")
  const password = formData.get("password")

  // Basic validation
  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  // Connect to database
  await connectDB()

  // Find user by email
  const user = await User.findOne({ email })

  // If user not found, return error
  if (!user) {
    return { error: "No account found with this email." }
  }

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password)

  // If password does not match
  if (!isMatch) {
    return { error: "Incorrect password. Please try again." }
  }

  // Store user email in cookies (simple session)
  const cookieStore = await cookies()
  cookieStore.set("user", user.email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  })

  // Redirect to dashboard
  redirect("/dashboard")
}

// ---------------- LOGOUT ----------------
export async function logout() {
  // Remove user cookie
  const cookieStore = await cookies()
  cookieStore.delete("user")

  // Redirect to login page
  redirect("/login")
}
