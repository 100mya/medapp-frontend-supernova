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

  useEffect(() => {
    const checkAuthAndFetchDetails = async () => {
      try {
        const storedUserId = localStorage.getItem("id")

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
          const parsed = JSON.parse(userDetails)

          setUserEmail(parsed?.email)

          const status = parsed?.subscription_status
          const plan = parsed?.plan
          const invitation_code = parsed?.invitation_code

          const isSubscribedStatus = status === "active"
          const isPremium = plan === "PREMIUM"

          setIsPremiumPlan(isPremium)
          setIsSubscribed(isSubscribedStatus)

          if (!isSubscribedStatus) {
            if (subscribedEmails.includes(parsed?.email?.toLowerCase())) {
              setIsSubscribed(true)
              setIsPremiumPlan(true)
            } else if (invitation_code) {
              const isValid = await validateInvitationCode(invitation_code, storedUserId)
              if (isValid) {
                setIsSubscribed(true)
              }
            }
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
  }, [])

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      setMessage("You are already logged in!")
    } else {
      setShowModal(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("id")
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
          {/*<Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />*/}
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
          {/*<Route path="/exam" element={<Exam isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />
          <Route path="/pricing" element={<Pricing isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />} />*/}
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
