"use client"

import { useEffect, useState } from "react"
import "./LeftSidebar.css"
import defaultProfilePic from "./default.jpeg"

const LeftSidebar = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserId = localStorage.getItem("id")
        setUserId(storedUserId)
        if (!userId) {
          console.error("User ID not found in local storage")
          return
        }

        const response = await fetch("/api/get-user-by-userid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: storedUserId }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user information")
        }

        const userData = await response.json()

        if (userData && !userData.error) {
          const user = {
            name: userData.name || "",
            email: userData.email || "",
            cellNumber: userData.cellNumber || "",
            collegeName: userData.collegeName || "",
            country: userData.country || "",
            bio: userData.bio || "",
            profilePic: getProfilePicUrl(userData.profilePic, userData.profilePicType),
            followersCount: Array.isArray(userData.followers) ? userData.followers.length : 0,
            followingCount: Array.isArray(userData.following) ? userData.following.length : 0,
          }

          setUserInfo(user)
        } else {
          throw new Error(userData.error || "User data format is incorrect")
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }

    fetchUserInfo()
  }, [])

  const getProfilePicUrl = (profilePic, profilePicType) => {
    if (profilePic) {
      return `data:image/jpeg;base64,${profilePic}`
    } else {
      return defaultProfilePic
    }
  }

  return (
    <div className="left-sidebar">
      {userInfo && (
        <div className="profiles-info">
          <div className="profiles-header">
            <img src={userInfo.profilePic || "/placeholder.svg"} alt="Profile" className="profile-pic" />
            <h3>{userInfo.name}</h3>
            <p className="profiles-email">{userInfo.email}</p>
          </div>
          <div className="profiles-bio">
            <p>{userInfo.bio}</p>
          </div>
          <div className="profiles-details">
            <p className="profiles-info-item">Cell Number: {userInfo.cellNumber}</p>
            <p className="profilse-info-item">College: {userInfo.collegeName}</p>
            <p className="profiles-info-item">Country: {userInfo.country}</p>
          </div>
          <div className="profiles-counts">
            <p>Followers: {userInfo.followersCount}</p>
            <p>Following: {userInfo.followingCount}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeftSidebar
