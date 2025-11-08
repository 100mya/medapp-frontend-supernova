"use client"

import { useState, useEffect } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Modal from "./Components/Modal"
import ForgotPassword from "./Components/ForgotPassword"
import About from "./Components/About"
import Contact from "./Components/Contact"
import PrivacyPolicy from "./Components/PrivacyPolicy"
import TermsOfService from "./Components/TermsOfService"
import CommunityPage from "./Components/CommunityPage"
import Profile from "./Components/Profile"
import UserProfile from "./Components/UserProfile"
import Search from "./Components/SearchPage"
import Notifications from "./Components/Notifications"
import Exam from "./Components/ExamPage"
import Pricing from "./Components/PricingPage"
import SimulatorPage from "./Components/SimulatorPage"
import CaseStudyPage from "./Components/CaseStudyPage"

import subscribedEmails from "./Components/subscribedEmails.json"

function App() {
  const [showModal, setShowModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isPremiumPlan, setIsPremiumPlan] = useState(false)
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState(null)

  // helper: normalize response.json() which might sometimes return a string
  const normalizeJson = (data) => {
    try {
      if (typeof data === "string") return JSON.parse(data)
      return data
    } catch (e) {
      console.error("Failed to normalize JSON:", e, data)
      return data
    }
  }

  // robust getter for stored id (check multiple possible keys)
  const getStoredUserId = () => {
    return (
      localStorage.getItem("id") ||
      localStorage.getItem("_id") ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("partner_user_id") ||
      null
    )
  }

  useEffect(() => {
    const checkAuthAndFetchDetails = async () => {
      try {
        const storedUserId = getStoredUserId()

        if (!storedUserId) {
          setIsLoggedIn(false)
          return
        }

        setIsLoggedIn(true)

        const userDetailsResponse = await fetch("/api/get-user-by-userid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: storedUserId }),
        })

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json()
          const parsed = normalizeJson(userDetails)

          // canonicalize id into localStorage.id
          const canonicalId = parsed?.id || parsed?._id || parsed?.user_id || parsed?.partner_user_id || storedUserId
          if (canonicalId && canonicalId !== localStorage.getItem("id")) {
            localStorage.setItem("id", canonicalId)
          }

          setUserEmail(parsed?.email)

          const status = parsed?.subscription_status
          const plan = parsed?.plan
          const invitation_code = parsed?.invitation_code

          const isSubscribedStatus = status === "active"
          const isPremium = plan === "PREMIUM"

          setIsPremiumPlan(isPremium)
          setIsSubscribed(isSubscribedStatus)

          // fallbacks: static whitelist or invitation code
          if (!isSubscribedStatus) {
            if (subscribedEmails.includes(parsed?.email?.toLowerCase())) {
              setIsSubscribed(true)
              setIsPremiumPlan(true)
              localStorage.setItem("isSubscribed", "true")
              localStorage.setItem("isPremiumPlan", "true")
            } else if (invitation_code) {
              const isValid = await validateInvitationCode(invitation_code, canonicalId)
              if (isValid) {
                setIsSubscribed(true)
                localStorage.setItem("isSubscribed", "true")
              }
            }
          } else {
            localStorage.setItem("isSubscribed", "true")
            localStorage.setItem("isPremiumPlan", JSON.stringify(isPremium))
          }
        } else {
          setIsLoggedIn(false)
          localStorage.removeItem("id")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsLoggedIn(false)
      }
    }

    const validateInvitationCode = async (code, user_id) => {
      try {
        const response = await fetch("/api/validate-invitation-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, user_id }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setIsSubscribed(true)
          return true
        }
        return false
      } catch (error) {
        console.error("Error validating invitation code:", error)
        return false
      }
    }

    checkAuthAndFetchDetails()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      setMessage("You are already logged in!")
    } else {
      setShowModal(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("id")
    localStorage.removeItem("_id")
    localStorage.removeItem("follower_id")
    localStorage.removeItem("subscriptionID")
    localStorage.removeItem("invitation_code")
    localStorage.removeItem("isPremiumPlan")
    localStorage.removeItem("isSubscribed")
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    window.location.href = "/"
    console.log("Logged out successfully")
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Dashboard isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} handleLogout={handleLogout} />}
          />
          <Route
            path="/dashboard/*"
            element={<Dashboard isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} handleLogout={handleLogout} />}
          />
          <Route
            path="/community"
            element={<CommunityPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} handleLogout={handleLogout} />}
          />
          <Route
            path="/community/user-profile"
            element={<UserProfile isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />}
          />
          <Route path="/community/profile" element={<Profile isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/community/search" element={<Search isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route
            path="/community/notifications"
            element={<Notifications isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />}
          />
          <Route path="/simulator" element={<SimulatorPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/case-studies" element={<CaseStudyPage isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
        </Routes>
        {showModal && (
          <Modal toggleModal={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
        )}
        {message && <div className="logged-in-message">{message}</div>}
      </div>
    </Router>
  )
}

export default App
