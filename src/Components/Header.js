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

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const storedUserId = localStorage.getItem("id")

        if (!storedUserId) {
          setIsLoggedIn(false)
          setIsSubscribed(false)
          return
        }

        setIsLoggedIn(true)

        // Fetch user details to get subscription status
        try {
          const userDetailsResponse = await fetch("/api/get-user-by-userid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: storedUserId }),
          })

          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json()
            const parsed = JSON.parse(userDetails || "{}")

            const status = parsed?.subscription_status
            const plan = parsed?.plan

            const isSubscribedStatus = status === "active"
            const isPremium = plan === "PREMIUM"

            localStorage.setItem("isSubscribed", JSON.stringify(isSubscribedStatus))
            localStorage.setItem("isPremiumPlan", JSON.stringify(isPremium))

            setIsSubscribed(isSubscribedStatus)
          } else {
            setIsLoggedIn(false)
            localStorage.removeItem("id")
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

  useEffect(() => {
    if (!bootstrapped) return
    const onDashboard = location.pathname.startsWith("/dashboard")
    if (onDashboard && !isLoggedIn) {
      setShowLoginModal(true)
    }
  }, [bootstrapped, isLoggedIn, location.pathname])

  const handleDashboardClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setIsSubscribed(localStorage.getItem("isSubscribed") === "true")
    setShowLoginModal(false)
    setIsNavOpen(false)

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
      console.error("Logout API error:", e)
    } finally {
      localStorage.removeItem("id")
      localStorage.removeItem("follower_id")
      localStorage.removeItem("subscriptionID")
      localStorage.removeItem("invitation_code")
      localStorage.removeItem("isPremiumPlan")
      localStorage.removeItem("isSubscribed")
      localStorage.removeItem("isLoggedIn")
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
            {/* 
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
            )}*/}
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

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />}
    </>
  )
}

export default Header
