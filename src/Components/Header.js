"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "./Header.css"
import "./LoginModal.css"
import { FaBars } from "react-icons/fa"
import LoginModal from "./LoginModal"

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [bootstrapped, setBootstrapped] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // --- Bootstrap: try auto-login using stored credentials and mirror App.js behavior
  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const storedCredentials = localStorage.getItem("rx_chatbot_credentials")
        if (!storedCredentials) {
          setIsLoggedIn(false)
          setIsSubscribed(localStorage.getItem("isSubscribed") === "true")
          return
        }

        const { email, password } = JSON.parse(storedCredentials || "{}")
        if (!email || !password) {
          setIsLoggedIn(false)
          return
        }

        // Login with stored credentials
        const loginResp = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!loginResp.ok) {
          setIsLoggedIn(false)
          return
        }

        // Mark logged-in
        localStorage.setItem("isLoggedIn", "true")
        setIsLoggedIn(true)

        // Fetch user details to compute subscription flags (mirrors App.js)
        try {
          const userDetailsResponse = await fetch("/api/fetch-user-by-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email_id: email }),
          })

          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json()
            const parsed = JSON.parse(userDetails || "{}")

            const status = parsed?.subscription_status
            const plan = parsed?.plan
            const invitation_code = parsed?.invitation_code

            const isSubscribedStatus = status === "active"
            const isPremium = plan === "PREMIUM"

            localStorage.setItem("isSubscribed", JSON.stringify(isSubscribedStatus))
            localStorage.setItem("isPremiumPlan", JSON.stringify(isPremium))
            if (invitation_code) localStorage.setItem("invitation_code", invitation_code)

            setIsSubscribed(isSubscribedStatus)
          } else {
            // Fallback to whatever was already in storage
            setIsSubscribed(localStorage.getItem("isSubscribed") === "true")
          }
        } catch (err) {
          console.error("Failed to fetch user details:", err)
          setIsSubscribed(localStorage.getItem("isSubscribed") === "true")
        }
      } catch (e) {
        console.error("Auto-login error:", e)
      } finally {
        setBootstrapped(true)
      }
    }

    attemptAutoLogin()
  }, [])

  // If user is on /dashboard and not logged in, auto-open login modal after bootstrap
  useEffect(() => {
    if (!bootstrapped) return
    const onDashboard = location.pathname.startsWith("/dashboard")
    if (onDashboard && !isLoggedIn) {
      setShowLoginModal(true)
    }
  }, [bootstrapped, isLoggedIn, location.pathname])

  const handleDashboardClick = (e) => {
    const subscriptionStatus = localStorage.getItem("isSubscribed") === "true"
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
    } else if (!subscriptionStatus) {
      e.preventDefault()
      navigate("/pricing")
    }
  }

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev)
  }

  const handleLoginSuccess = () => {
    // Read the latest values that LoginModal just wrote
    setIsLoggedIn(true)
    setIsSubscribed(localStorage.getItem("isSubscribed") === "true")
    setShowLoginModal(false)
    setIsNavOpen(false)

    // If user opened dashboard directly, keep them there; otherwise navigate to default dashboard page
    if (location.pathname.startsWith("/dashboard")) {
      // stay put
    } else {
      navigate("/dashboard/upload-papers")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
    } catch (e) {
      // Even if logout API fails, proceed to clear on client
      console.error("Logout API error:", e)
    } finally {
      // Clear everything we set anywhere
      localStorage.removeItem("rx_chatbot_credentials")
      localStorage.removeItem("follower_id")
      localStorage.removeItem("subscriptionID")
      localStorage.removeItem("invitation_code")
      localStorage.removeItem("isPremiumPlan")
      localStorage.removeItem("isSubscribed")
      localStorage.removeItem("isLoggedIn")
      // Full refresh to reset app state cleanly
      window.location.reload()
    }
  }

  return (
    <>
      <header className="supernova-header-new">
        <div className="supernova-header-container">
          <div className="supernova-logo-new">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SUPERNOVA%20LOGO%20SAMPLE%20%285%29-rSryNigPZe0crjuSxCcQS4JMPKD9yO.png"
              alt="Supernova Logo"
            />
          </div>
          <button className="supernova-mobile-nav-toggle-new" onClick={toggleNav}>
            <FaBars />
          </button>
          <nav className={`supernova-nav-new ${isNavOpen ? "open" : ""}`}>
            <Link to="/dashboard/upload-papers" className="supernova-nav-link" onClick={handleDashboardClick}>
              Dashboard
            </Link>
            <Link to="/case-studies" className="supernova-nav-link">
              Case Studies
            </Link>
            <Link to="/community" className="supernova-nav-link">
              Community
            </Link>
            {!isLoggedIn ? (
              <button
                className="supernova-nav-link supernova-login-button-header supernova-login-mobile-item"
                onClick={() => {
                  setShowLoginModal(true)
                  setIsNavOpen(false)
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="supernova-nav-link supernova-logout-button-header supernova-login-mobile-item"
                onClick={() => {
                  handleLogout()
                  setIsNavOpen(false)
                }}
              >
                Logout
              </button>
            )}
          </nav>
          <div className="supernova-header-auth-buttons">
            {!isLoggedIn ? (
              <button className="supernova-login-button-header" onClick={() => setShowLoginModal(true)}>
                Login
              </button>
            ) : (
              <button className="supernova-logout-button-header" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default Header
