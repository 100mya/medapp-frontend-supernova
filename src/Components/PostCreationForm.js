"use client"

import { useState } from "react"
import "./PostCreationForm.css"

const PostCreationForm = () => {
  const [postText, setPostText] = useState("")
  const [media, setMedia] = useState(null)

  const handlePostSubmit = async (e) => {
  e.preventDefault()

  const idFromStorage = localStorage.getItem("id")

  if (!idFromStorage) {
    console.error("User ID not found in local storage")
    return
  }

  try {
    // 1) Translate local id -> email using your existing API
        const userResp = await fetch("/api/get-user-by-userid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: idFromStorage }),
    })

    if (!userResp.ok) {
      const txt = await userResp.text().catch(() => null)
      throw new Error(
        `get-user-by-userid failed: ${userResp.status} ${userResp.statusText} ${txt || ""}`
      )
    }

    let userData = await userResp.json()
    if (!userData || userData.error) {
      throw new Error(
        "get-user-by-userid returned no user or an error: " + (userData?.error || "unknown")
      )
    }

    // 🔧 Handle cases where backend returns JSON string or payload wrapper
    if (typeof userData === "string") {
      try {
        userData = JSON.parse(userData)
      } catch (e) {
        console.error("Failed to parse userData string:", e)
        throw new Error("Failed to parse user data from get-user-by-userid")
      }
    }

    if (userData && typeof userData === "object" && "payload" in userData) {
      const payload = userData.payload
      if (typeof payload === "string") {
        try {
          userData = JSON.parse(payload)
        } catch (e) {
          console.error("Failed to parse userData.payload string:", e)
          throw new Error("Failed to parse payload from get-user-by-userid")
        }
      } else if (payload && typeof payload === "object") {
        userData = payload
      }
    }

    const userEmail =
      userData && typeof userData === "object" && "email" in userData
        ? userData.email
        : undefined

    if (!userEmail) {
      console.error("Email not found in userData:", userData)
      throw new Error("Email not found in user data returned from get-user-by-userid")
    }

    // 2) Build form data where user_id is the user's email (as required by other APIs)
    const hashtags = postText.match(/#[\w]+/g) || []
    const formData = new FormData()
    formData.append("email", userEmail) // <-- send email as user_id
    formData.append("text", postText)
    formData.append("title", "")
    formData.append("topics", JSON.stringify(hashtags))
    if (media) formData.append("media", media)

    console.log("Creating post for user (email):", userEmail)

    // 3) Create post
    const response = await fetch("/api/create-post", {
      method: "POST",
      body: formData,
    })

    const result = await response.json().catch(() => null)

    if (response.ok) {
      alert("Post created successfully")
      setPostText("")
      setMedia(null)
    } else {
      console.error("Error creating post:", result?.error || result)
      alert("Error creating post")
    }
  } catch (error) {
    console.error("Error submitting post:", error)
    alert("Error submitting post")
  }
}

  return (
    <div className="post-creation-form">
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
        ></textarea>
        <input type="file" onChange={(e) => setMedia(e.target.files[0])} accept="image/*,video/*" />
        <button type="submit">Post</button>
      </form>
    </div>
  )
}

export default PostCreationForm
