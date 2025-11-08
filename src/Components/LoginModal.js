"use client"

import { useState } from "react"
import "./LoginModal.css"
import { FaTimes } from "react-icons/fa"

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const normalizeJson = (data) => {
    try {
      if (typeof data === "string") return JSON.parse(data)
      return data
    } catch (e) {
      console.error("Failed to normalize JSON:", e, data)
      return data
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1) Attempt login
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data?.message || "Invalid email or password")
        setLoading(false)
        return
      }

      const loginData = await response.json()

      // store whatever id the server gave; we'll canonicalize after fetching user details
      const initialUserId = loginData.user_id || loginData.id || loginData._id || loginData.partner_user_id
      if (initialUserId) {
        localStorage.setItem("id", String(initialUserId))
        localStorage.setItem("isLoggedIn", "true")
      }

      // 2) Fetch user details to set subscription flags (safe parse)
      try {
        const userDetailsResponse = await fetch("/api/get-user-by-userid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: initialUserId }),
        })

        if (userDetailsResponse.ok) {
          const userDetailsRaw = await userDetailsResponse.json()
          const parsed = normalizeJson(userDetailsRaw || "{}")

          const status = parsed?.subscription_status
          const plan = parsed?.plan
          const invitation_code = parsed?.invitation_code

          const isSubscribedStatus = status === "active" || status === true
          const isPremium = plan === "PREMIUM"

          localStorage.setItem("isSubscribed", JSON.stringify(isSubscribedStatus))
          localStorage.setItem("isPremiumPlan", JSON.stringify(isPremium))
          if (invitation_code) localStorage.setItem("invitation_code", invitation_code)

          // canonicalize id into localStorage.id if backend returned different field
          const canonicalId = parsed?.id || parsed?._id || parsed?.user_id || parsed?.partner_user_id || initialUserId
          if (canonicalId && canonicalId !== localStorage.getItem("id")) {
            localStorage.setItem("id", canonicalId)
          }
        }
      } catch (err) {
        console.error("Failed to fetch user details after login:", err)
      }

      // 3) Notify parent component
      if (typeof onLoginSuccess === "function") onLoginSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-modal-overlay-wrapper">
      <div className="login-modal-content-wrapper">
        <button className="login-modal-close-button-wrapper" onClick={onClose} aria-label="Close login modal">
          <FaTimes />
        </button>

        <div className="login-modal-header-wrapper">
          <h2 className="login-modal-title-wrapper">Login</h2>
          <p className="login-modal-subtitle-wrapper">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form-wrapper">
          <div className="login-modal-form-group-wrapper">
            <label htmlFor="email" className="login-modal-label-wrapper">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="login-modal-input-wrapper"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-modal-form-group-wrapper">
            <label htmlFor="password" className="login-modal-label-wrapper">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="login-modal-input-wrapper"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="login-modal-error-wrapper">{error}</div>}

          <button type="submit" className="login-modal-submit-button-wrapper" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
