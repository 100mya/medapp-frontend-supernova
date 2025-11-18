import React, { useEffect, useState } from "react"
import Post from "./Post"
import "./PostList.css"

const PostList = () => {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
  try {
    const response = await fetch("/api/fetch-all-posts")

    if (!response.ok) {
      const txt = await response.text().catch(() => null)
      throw new Error(`fetch-all-posts failed: ${response.status} ${response.statusText} ${txt || ""}`)
    }

    let data = await response.json()

    // If backend returns a JSON string, parse it
    if (typeof data === "string") {
      try {
        data = JSON.parse(data)
      } catch (e) {
        console.error("Failed to parse posts JSON string:", e, data)
        setPosts([])
        return
      }
    }

    if (!Array.isArray(data)) {
      console.warn("fetch-all-posts returned non-array data:", data)
      setPosts([])
      return
    }

    setPosts([...data].reverse())
  } catch (error) {
    console.error("Error fetching posts:", error)
  }
}


  useEffect(() => {
    fetchPosts()
    const intervalId = setInterval(fetchPosts, 100000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post._id?.$oid || post._id || Math.random()} post={post} />
      ))}
    </div>
  )
}

export default PostList
