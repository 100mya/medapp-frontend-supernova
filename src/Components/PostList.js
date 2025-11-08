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

      // response.json() already returns a JS object/array — do not JSON.parse it.
      const data = await response.json()

      // Defensive: ensure data is an array
      if (!Array.isArray(data)) {
        console.warn("fetch-all-posts returned non-array data:", data)
        setPosts([])
        return
      }

      // reverse a copy to avoid mutating original
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
