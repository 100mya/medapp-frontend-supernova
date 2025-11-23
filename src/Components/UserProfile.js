"use client"

import { useEffect, useState } from "react"
import "./UserProfile.css"
import defaultImg from "./default.jpeg"
import { FaEdit, FaTrash, FaStream, FaUser, FaSearch, FaBell } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import CommunityHeader from "./Header"
import LeftSidebar from "./LeftSidebar"
import RightSidebar from "./RightSidebar"
import Post from "./UserPost"

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    cellNumber: "",
    collegeName: "",
    country: "",
    bio: "",
    profilePic: "",
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [userEmail, setUserEmail] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (activeTab === "profile") {
      navigate("/community/user-profile")
    } else if (activeTab === "search") {
      navigate("/community/search")
    } else if (activeTab === "notifications") {
      navigate("/community/notifications")
    } else if (activeTab === "feed") {
      navigate("/community")
    }
  }, [activeTab])

  useEffect(() => {
    const id = localStorage.getItem("id")
    if (id) {
      setUserId(id)
    } else {
      setError("No user ID found in localStorage.")
    }
  }, [])

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const id = localStorage.getItem("id")
      const response = await fetch("/api/get-user-by-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      let profileData = await response.json()

      // Case 1 — backend returns a JSON string (your sample case)
      if (typeof profileData === "string") {
        try {
          profileData = JSON.parse(profileData)
        } catch (e) {
          console.error("Failed to parse profileData string:", e)
          return
        }
      }

      // Case 2 — backend wraps data as { payload: "..." } or { payload: {...} }
      if (
        profileData &&
        typeof profileData === "object" &&
        "payload" in profileData
      ) {
        const payload = profileData.payload

        if (typeof payload === "string") {
          try {
            profileData = JSON.parse(payload)
          } catch (e) {
            console.error("Failed to parse profileData.payload string:", e)
            return
          }
        } else if (payload && typeof payload === "object") {
          profileData = payload
        }
      }

      setUserProfile(profileData)
      setEditFormData({
        name: profileData.name || "",
        cellNumber: profileData.cellNumber || "",
        collegeName: profileData.collegeName || "",
        country: profileData.country || "",
        bio: profileData.bio || "",
        profilePic: profileData.profilePic || "",
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setError("Failed to fetch user profile. Please try again later.")
    }
  }

  if (userId) {
    fetchUserProfile()
  }
}, [userId])

  useEffect(() => {
  const checkAuthAndFetchUser = async () => {
    const userId = localStorage.getItem("id")
    if (!userId) {
      console.error("No user id found in localStorage")
      return
    }

    try {
      const response = await fetch("/api/get-user-by-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (!response.ok) {
        console.error("Failed to fetch user")
        return
      }

      let userData = await response.json()

      // Case 1 — backend returns a JSON string
      if (typeof userData === "string") {
        try {
          userData = JSON.parse(userData)
        } catch (e) {
          console.error("Failed to parse userData string:", e)
          return
        }
      }

      // Case 2 — backend wraps data as { payload: "..." } or { payload: {...} }
      if (
        userData &&
        typeof userData === "object" &&
        "payload" in userData
      ) {
        const payload = userData.payload

        if (typeof payload === "string") {
          try {
            userData = JSON.parse(payload)
          } catch (e) {
            console.error("Failed to parse userData.payload string:", e)
            return
          }
        } else if (payload && typeof payload === "object") {
          userData = payload
        }
      }

      const email =
        userData &&
        typeof userData === "object" &&
        "email" in userData
          ? userData.email
          : undefined

      if (!email) {
        console.error("Email not found on userData:", userData)
        return
      }

      setUserEmail(email)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  checkAuthAndFetchUser()
}, [])

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch("/api/fetch-posts-by-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user posts")
        }

        const postsData = await response.json()
        setUserPosts(JSON.parse(postsData).reverse())
      } catch (error) {
        console.error("Error fetching user posts:", error)
        setError("Failed to fetch user posts. Please try again later.")
      }
    }

    if (userEmail) {
      fetchUserPosts()
    }
  }, [userEmail])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (e) => {
  e.preventDefault()
  try {
    if (!userEmail) {
      console.error("No email available for update-profile request")
      setError("Unable to update profile: missing email.")
      return
    }

    const formData = new FormData()
    // 👇 backend now expects email instead of user_id
    formData.append("email", userEmail)
    formData.append("name", editFormData.name)
    formData.append("cellNumber", editFormData.cellNumber)
    formData.append("collegeName", editFormData.collegeName)
    formData.append("country", editFormData.country)
    formData.append("bio", editFormData.bio)

    if (editFormData.profilePic instanceof File) {
      formData.append("profilePic", editFormData.profilePic, "profile_pic.jpg")
    }

    const response = await fetch("/api/update-profile", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to update user info")
    }

    const result = await response.json()
    alert(result.message)
    setIsEditing(false)

    setUserProfile((prevState) => ({
      ...prevState,
      name: editFormData.name,
      cellNumber: editFormData.cellNumber,
      collegeName: editFormData.collegeName,
      country: editFormData.country,
      bio: editFormData.bio,
      profilePic: editFormData.profilePic,
    }))
  } catch (error) {
    console.error("Error updating user info:", error)
    setError("Failed to update user info. Please try again later.")
  }
}

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      const result = await response.json()
      alert(result.message)
      setUserPosts((prevState) => prevState.filter((post) => post._id === postId))
    } catch (error) {
      console.error("Error deleting post:", error)
      setError("Failed to delete post. Please try again later.")
    }
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    setEditFormData((prevState) => ({
      ...prevState,
      profilePic: file,
    }))
  }

  const mediaUrl = (mediaType, mediaData) => {
    return mediaData ? `data:image/${mediaType};base64,${mediaData}` : null
  }

  return (
    <div className="userProfileContainer">
      <CommunityHeader />
      <div className="user-page-content">
        <LeftSidebar />
        {userProfile && (
          <div className="profileInfo">
            <div className="profilePicture">
              <img
                src={mediaUrl("jpeg", editFormData.profilePic) || userProfile.profilePic || defaultImg}
                alt="Profile"
              />
            </div>
            <div className="userDetails">
              <h2>{userProfile.name}</h2>
              <p>{userProfile.bio}</p>
              <p>College Name: {userProfile.collegeName}</p>
              <p>Country: {userProfile.country}</p>
              <p className="followers-p" style={{ fontSize: "1.2rem" }}>
                Followers: {userProfile.followers ? userProfile.followers.length : 0} &nbsp;|&nbsp; Following:{" "}
                {userProfile.following ? userProfile.following.length : 0}
              </p>
              <button className="edit-b" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        )}
        {isEditing && (
          <div className="editPopup">
            <form onSubmit={handleEditSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} />
              </label>
              <label>
                Cell Number:
                <input type="text" name="cellNumber" value={editFormData.cellNumber} onChange={handleEditChange} />
              </label>
              <label>
                College Name:
                <input type="text" name="collegeName" value={editFormData.collegeName} onChange={handleEditChange} />
              </label>
              <label>
                Country:
                <input type="text" name="country" value={editFormData.country} onChange={handleEditChange} />
              </label>
              <label>
                Bio:
                <textarea name="bio" value={editFormData.bio} onChange={handleEditChange}></textarea>
                <br />
                <br />
              </label>
              <label>
                Profile Picture:
                <br />
                <input type="file" accept="image/*" onChange={handleProfilePicChange} />
              </label>
              <div className="edit-button-container">
                <button className="update-b" type="submit">
                  <FaEdit /> Update
                </button>
                <button className="cancel-b" type="button" onClick={() => setIsEditing(false)}>
                  <FaTrash /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="userPosts">
          {userPosts.map((post) => (
            <Post key={post._id} post={post} onDelete={() => handleDeletePost(post._id)} />
          ))}
        </div>
        <RightSidebar />
      </div>
      <div className="bottom-bar">
        <button className={activeTab === "feed" ? "active" : ""} onClick={() => setActiveTab("feed")}>
          <FaStream />
        </button>
        <button className={activeTab === "search" ? "active" : ""} onClick={() => setActiveTab("search")}>
          <FaSearch />
        </button>
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          <FaUser />
        </button>
        <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>
          <FaBell />
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default UserProfile
