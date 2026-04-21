import LoginForm from "./LoginForm"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const cookieStore = await cookies()
  if (cookieStore.get("user")) {
    redirect("/dashboard")
  }

  return (
    <div className="page-wrapper">
      <div className="page">
        <div className="cat-deco">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
        </div>
        <h1 className="page-title">LOG IN</h1>
        <p className="page-subtitle">Welcome back! Enter your details.</p>
        <div className="pixel-divider"></div>

        <LoginForm />

        <div className="pixel-divider"></div>
        <p className="auth-link-text">
          No account yet?{" "}
          <Link href="/signup">Sign up here →</Link>
        </p>
      </div>
    </div>
  )
}
