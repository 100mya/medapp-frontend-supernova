"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Post.css"
import { FaRegComment, FaRegHeart, FaHeart, FaTrash } from "react-icons/fa"
import defaultImg from "./default.jpeg"

const UserPost = ({ post }) => {
  let mediaUrl = null

  if (post.media) {
    if (post.media_type === "mp4") {
      mediaUrl = `data:video/${post.media_type};base64,${post.media}`
    } else {
      mediaUrl = `data:image/${post.media_type};base64,${post.media}`
    }
  }

  const [likes, setLikes] = useState(post.likes)
  const [replies, setReplies] = useState(post.replies)
  const [replyText, setReplyText] = useState("")
  const [showReplies, setShowReplies] = useState(false)
  const [likedByUser, setLikedByUser] = useState(false)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userProfilePic, setUserProfilePic] = useState(defaultImg)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
  const fetchCurrentUserEmail = async () => {
    const storedId = localStorage.getItem("id")
    if (!storedId) {
      console.error("No user id found in localStorage")
      return
    }

    try {
      const response = await fetch("/api/get-user-by-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: storedId }),
      })

      if (!response.ok) {
        console.error("Failed to fetch current user")
        return
      }

      let userData = await response.json()

      if (typeof userData === "string") {
        try {
          userData = JSON.parse(userData)
        } catch (e) {
          console.error("Failed to parse userData string:", e)
          return
        }
      }

      if (userData && typeof userData === "object" && "payload" in userData) {
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
        console.error("Email not found on current user:", userData)
        return
      }

      setUserId(email)       // in this file, treat userId prop as email
      setUserEmail(email)
      setLikedByUser(Array.isArray(post.likes) ? post.likes.includes(email) : false)
    } catch (error) {
      console.error("Error fetching current user data:", error)
    }
  }

  const fetchAuthorData = async () => {
    const authorEmail = post.email
    if (!authorEmail) {
      console.warn("No author email on post object")
      return
    }

    try {
      const response = await fetch("/api/get-user-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: authorEmail }),
      })

      if (!response.ok) {
        console.error("Failed to fetch post author")
        return
      }

      let data = await response.json()

      if (typeof data === "string") {
        try {
          data = JSON.parse(data)
        } catch (e) {
          console.error("Failed to parse author data string:", e)
          return
        }
      }

      if (data && typeof data === "object" && "payload" in data) {
        const payload = data.payload
        if (typeof payload === "string") {
          try {
            data = JSON.parse(payload)
          } catch (e) {
            console.error("Failed to parse author payload string:", e)
            return
          }
        } else if (payload && typeof payload === "object") {
          data = payload
        }
      }

      setUserName(data.name || "")
      if (data.profilePic) {
        setUserProfilePic(`data:image/jpeg;base64,${data.profilePic}`)
      }
    } catch (error) {
      console.error("Error fetching author data:", error)
    }
  }

  fetchCurrentUserEmail()
  fetchAuthorData()
}, [post.email, post.likes])

  const handleToggleLikePost = async () => {
    try {
      const response = await fetch("/api/toggle-like-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: post._id.$oid, email: userEmail }),
      })
      const data = await response.json()
      if (data.message === "Post liked successfully" || data.message === "Post unliked successfully") {
        setLikes((prevLikes) =>
          prevLikes.includes(userEmail)
            ? prevLikes.filter((like) => like !== userEmail)
            : [...prevLikes, userEmail],
        )
        setLikedByUser(!likedByUser)
      }
    } catch (error) {
      console.error("Error toggling like on post:", error)
    }
  }

  const handleDeletePost = async () => {
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post._id.$oid }),
      })
      const data = await response.json()
      if (data.message === "Post deleted successfully") {
        alert("Post deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Error deleting post")
    }
  }

  const handleCreateReply = async (replyToId = null) => {
    try {
      const response = await fetch("/api/create-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post._id.$oid,
          reply_to_id: replyToId,
          email: email,
          text: replyText,
        }),
      })
      const data = await response.json()
      if (data.message === "Reply added successfully") {
        const newReply = {
          _id: data.id,
          email: userEmail,
          text: replyText,
          created_at: new Date().toISOString(),
          likes: [],
          replies: [],
        }
        setReplies((prevReplies) => {
          if (replyToId === null) {
            return [...prevReplies, newReply]
          }
          const addNewReply = (replies) => {
            return replies.map((reply) => {
              if (reply._id === replyToId) {
                return {
                  ...reply,
                  replies: [...reply.replies, newReply],
                }
              }
              return {
                ...reply,
                replies: addNewReply(reply.replies),
              }
            })
          }
          return addNewReply(prevReplies)
        })
        setReplyText("")
      }
    } catch (error) {
      console.error("Error adding reply:", error)
    }
  }

  return (
    <div className="post">
      <div className="post-header">
        <img src={userProfilePic || "/placeholder.svg"} alt="User" className="user-img" />
        <Link to={`/community/profile?id=${post.email}`} className="user-link">
          <h3>{userName}</h3>
        </Link>
        <button onClick={handleDeletePost} className="delete-post-button">
          <FaTrash />
        </button>
      </div>
      <div className="post-content">
        <p>
          {post.text.split(" ").map((word, index) =>
            word.startsWith("#") ? (
              <span key={index} className="hashtag">
                {word}{" "}
              </span>
            ) : (
              word + " "
            ),
          )}
        </p>
        {mediaUrl && (
          <div className="post-media">
            {mediaUrl.startsWith("data:image/") ? (
              <img src={mediaUrl || "/placeholder.svg"} alt="Post media" />
            ) : mediaUrl.startsWith("data:video/") ? (
              <video controls>
                <source src={mediaUrl} type={`video/${post.media_type}`} />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}
      </div>
      <div className="post-stats">
        <button onClick={handleToggleLikePost}>
          {likedByUser ? <FaHeart color="red" /> : <FaRegHeart />} ({likes.length})
        </button>
        <button onClick={() => setShowReplies(!showReplies)}>
          <FaRegComment /> ({replies.length})
        </button>
      </div>
      {showReplies && (
        <div className="post-replies">
          {replies.map((reply) => (
            <Reply key={reply._id} reply={reply} postId={post._id.$oid} setReplies={setReplies} userId={userId} />
          ))}
          <div className="post-reply-form">
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." />
            <button onClick={() => handleCreateReply()}>Reply</button>
          </div>
        </div>
      )}
    </div>
  )
}

const Reply = ({ reply, postId, setReplies, userId }) => {
  const [likedByUser, setLikedByUser] = useState(reply.likes.includes(userId))
  const [replyText, setReplyText] = useState("")
  const [showNestedReplies, setShowNestedReplies] = useState(false)
  const [replyUserName, setReplyUserName] = useState("")
  const [replyUserProfilePic, setReplyUserProfilePic] = useState(defaultImg)

  useEffect(() => {
  const fetchUserData = async (email) => {
    if (!email) {
      console.warn("No email on reply object")
      return
    }

    try {
      const response = await fetch("/api/get-user-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      let data = await response.json()

      if (typeof data === "string") {
        try {
          data = JSON.parse(data)
        } catch (e) {
          console.error("Failed to parse reply user data string:", e)
          return
        }
      }

      if (data && typeof data === "object" && "payload" in data) {
        const payload = data.payload
        if (typeof payload === "string") {
          try {
            data = JSON.parse(payload)
          } catch (e) {
            console.error("Failed to parse reply payload string:", e)
            return
          }
        } else if (payload && typeof payload === "object") {
          data = payload
        }
      }

      setReplyUserName(data.name || "")
      if (data.profilePic) {
        setReplyUserProfilePic(`data:image/jpeg;base64,${data.profilePic}`)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const replyEmail = reply.email || reply.user_id
  fetchUserData(replyEmail)
}, [reply.email, reply.user_id])

  const handleToggleLikeReply = async () => {
    try {
      let replyId = reply._id

      if (typeof replyId === "object" && replyId.$oid) {
        replyId = replyId.$oid
      }

      const response = await fetch("/api/toggle-like-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId, reply_id: replyId, email: userId }),
      })

      const data = await response.json()
      if (data.message === "Reply liked successfully") {
        setReplies((prevReplies) => {
          const toggleLike = (replies) => {
            return replies.map((r) => {
              if (r._id === reply._id) {
                return {
                  ...r,
                  likes: r.likes.includes(userId) ? r.likes.filter((like) => like !== userId) : [...r.likes, userId],
                }
              }
              return {
                ...r,
                replies: toggleLike(r.replies),
              }
            })
          }
          return toggleLike(prevReplies)
        })
        setLikedByUser(!likedByUser)
      }
    } catch (error) {
      console.error("Error liking reply:", error)
    }
  }

  const handleCreateNestedReply = async (replyToId) => {
    try {
      let nestedReplyToId = replyToId

      if (typeof nestedReplyToId === "object" && nestedReplyToId.$oid) {
        nestedReplyToId = nestedReplyToId.$oid
      }

      const response = await fetch("/api/create-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          reply_to_id: nestedReplyToId,
          email: userId,
          text: replyText,
        }),
      })

      const data = await response.json()
      if (data.message === "Reply added successfully") {
        const newReply = {
          _id: data.id,
          email: userId,
          text: replyText,
          created_at: new Date().toISOString(),
          likes: [],
          replies: [],
        }
        setReplies((prevReplies) => {
          const addNewReply = (replies) => {
            return replies.map((r) => {
              if (r._id === replyToId) {
                return {
                  ...r,
                  replies: [...r.replies, newReply],
                }
              }
              return {
                ...r,
                replies: addNewReply(r.replies),
              }
            })
          }
          return addNewReply(prevReplies)
        })
        setReplyText("")
      }
    } catch (error) {
      console.error("Error adding nested reply:", error)
    }
  }

  const handleDeleteReply = async () => {
    try {
      let replyId = reply._id

      if (typeof replyId === "object" && replyId.$oid) {
        replyId = replyId.$oid
      }

      const response = await fetch("/api/delete-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId, reply_id: replyId }),
      })

      const data = await response.json()
      if (data.message === "Reply deleted successfully") {
        setReplies((prevReplies) => {
          const deleteReply = (replies) => {
            return replies
              .filter((r) => r._id !== reply._id)
              .map((r) => ({
                ...r,
                replies: deleteReply(r.replies),
              }))
          }
          return deleteReply(prevReplies)
        })
        alert("Reply deleted successfully")
      } else {
        alert("Failed to delete reply")
      }
    } catch (error) {
      console.error("Error deleting reply:", error)
      alert("Error deleting reply")
    }
  }

  return (
    <div className="reply">
      <div className="reply-header">
        <img src={replyUserProfilePic || "/placeholder.svg"} alt="User" className="user-img" />
        <Link to={`/community/profile?id=${reply.email}`} className="user-link">
          <h4>{replyUserName}</h4>
        </Link>
        <button onClick={handleDeleteReply} className="delete-reply-button">
          <FaTrash />
        </button>
      </div>
      <div className="reply-content">
        <p>{reply.text}</p>
      </div>
      <div className="reply-stats">
        <button onClick={handleToggleLikeReply}>
          {likedByUser ? <FaHeart color="red" /> : <FaRegHeart />} ({reply.likes.length})
        </button>
        <button onClick={() => setShowNestedReplies(!showNestedReplies)}>
          <FaRegComment /> ({reply.replies.length})
        </button>
      </div>
      {showNestedReplies && (
        <div className="reply-replies">
          {reply.replies.map((nestedReply) => (
            <Reply key={nestedReply._id} reply={nestedReply} postId={postId} setReplies={setReplies} userId={userId} />
          ))}
          <div className="reply-reply-form">
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." />
            <button onClick={() => handleCreateNestedReply(reply._id)}>Reply</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPost
