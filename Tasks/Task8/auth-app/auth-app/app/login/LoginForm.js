"use client"

import { useActionState } from "react"
import { login } from "../actions/auth"
import LoginButton from "./LoginButton"

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null)

  return (
    <form action={formAction}>
      {/* Error message */}
      {state?.error && (
        <div className="error-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {state.error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          EMAIL ADDRESS
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="cat@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          PASSWORD
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="your password"
          required
        />
      </div>

      <LoginButton />
    </form>
  )
}
