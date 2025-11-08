"use client"

import { useState, useEffect } from "react"
import "./SearchPage.css"
import CommunityHeader from "./Header"
import LeftSidebar from "./LeftSidebar"
import RightSidebar from "./RightSidebar"
import defaultImg from "./default.jpeg"
import Post from "./Post"
import { useNavigate } from "react-router-dom"
import { FaStream, FaUser, FaSearch, FaBell } from "react-icons/fa"

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [postSearchResults, setPostSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [userProfiles, setUserProfiles] = useState([])
  const [activeTab, setActiveTab] = useState("")
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
  }, [activeTab, navigate])

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await fetch("/api/fetch-all-user-ids")
        if (!response.ok) {
          throw new Error("Failed to fetch user IDs")
        }
        const userIds = await response.json()

        const profilesPromises = userIds.map(async (userId) => {
          try {
            const userResponse = await fetch("/api/get-user-by-userid", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_id: userId }),
            })

            if (!userResponse.ok) {
              throw new Error(`Failed to fetch user profile for ${userId}`)
            }

            const userProfile = await userResponse.json()
            return userProfile
          } catch (error) {
            console.error(`Error fetching user profile for ${userId}:`, error)
            return null
          }
        })

        const profiles = await Promise.all(profilesPromises)
        setUserProfiles(profiles.filter((profile) => profile !== null))
      } catch (error) {
        console.error("Error fetching user profiles:", error)
      }
    }

    fetchUserProfiles()
  }, [])

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      setPostLoading(true)

      const searchLower = searchQuery ? searchQuery.toLowerCase() : ""
      const isHashtagSearch = searchLower.startsWith("#")
      let topics = []
      let user = null

      if (isHashtagSearch) {
        topics = [searchLower]
      } else {
        user = userProfiles.find((user) => {
          if (!user) return false
          const fullName = `${user.name}`.toLowerCase()
          return fullName.includes(searchLower) || user.email.includes(searchLower)
        })

        setSearchResults(user)
      }

      if (isHashtagSearch || user) {
        const userId = user ? user._id : null

        const response = await fetch("/api/fetch-posts-by-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, topics }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const posts = await response.json()
        const parsedPosts = JSON.parse(posts)

        const formattedPosts = parsedPosts.map((post) => ({
          ...post,
          topics: Array.isArray(post.topics) ? post.topics : [],
        }))
        setPostSearchResults(formattedPosts.reverse())
      } else {
        setPostSearchResults([])
      }
    } catch (error) {
      console.error("Error searching posts:", error)
    } finally {
      setIsLoading(false)
      setPostLoading(false)
    }
  }

  const mediaUrl = (mediaType, mediaData) => {
    return mediaData ? `data:image/${mediaType};base64,${mediaData}` : null
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const navigateToUserProfile = (userId) => {
    navigate(`/community/profile?id=${userId}`)
  }

  return (
    <div className="search-page-header">
      <div className="search-page-container">
        <CommunityHeader />

        <div className="search-main-content">
          <LeftSidebar />

          <div className="search-results-container">
            <h1></h1>
            <div className="search-bar-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter name, email, or #topic"
                className="search-bar"
              />
              <button onClick={handleSearch} className="search-button" disabled={isLoading || postLoading}>
                {isLoading || postLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {(isLoading || postLoading) && <p>Loading...</p>}

            {searchResults && <h3 className="search-title">Users</h3>}

            {!isLoading && searchResults && !searchQuery.startsWith("#") && (
              <div className="search-results">
                <div className="search-result" onClick={() => navigateToUserProfile(searchResults._id)}>
                  <div className="search-profile-info">
                    <img src={searchResults.profilePic || defaultImg} alt="Profile" className="profile-pic" />
                    <h2>{searchResults.name}</h2>
                    <p>{searchResults.email}</p>
                  </div>
                </div>
              </div>
            )}

            {postSearchResults.length > 0 && <h3 className="search-title">Posts</h3>}

            {!postLoading && postSearchResults.length > 0 && (
              <div className="post-results">
                {postSearchResults.map((post) => (
                  <Post key={post._id.$oid} post={post} />
                ))}
              </div>
            )}

            {!postLoading && postSearchResults.length === 0 && searchResults && (
              <p>No posts found for user "{searchResults.name}"</p>
            )}
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
          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
