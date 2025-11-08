"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiFillHeart, AiOutlineComment, AiOutlineUserAdd } from "react-icons/ai"
import { RiSearchLine, RiCompass3Line, RiUser3Line } from "react-icons/ri"
import "./RightSidebar.css"

const RightSidebar = () => {
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("id")

        if (!userId) {
          setError("User not logged in")
          return
        }

        const response = await fetch("/api/get-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        })
        const result = await response.json()
        if (response.ok) {
          const parsedNotifications = JSON.parse(result)
          setNotifications(parsedNotifications.reverse())
        } else {
          setError(result.error || "Failed to fetch notifications")
        }
      } catch (error) {
        setError(error.message)
      }
    }

    fetchNotifications()
  }, [])

  const deleteNotification = async (notificationId) => {
    try {
      const userId = localStorage.getItem("id")

      if (!userId) {
        setError("User not logged in")
        return
      }

      const response = await fetch("/api/delete-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [notificationId] }),
      })
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id.$oid !== notificationId),
        )
      } else {
        const result = await response.json()
        setError(result.error || "Failed to delete notification")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const deleteAllNotifications = async () => {
    try {
      const notificationIds = notifications.map((notification) => notification._id.$oid)

      const response = await fetch("/api/delete-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: notificationIds }),
      })
      if (response.ok) {
        setNotifications([])
      } else {
        const result = await response.json()
        setError(result.error || "Failed to delete notifications")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <AiFillHeart className="notification-icon like" style={{ color: "#ff6b6b" }} />
      case "reply":
        return <AiOutlineComment className="notification-icon reply" style={{ color: "#6b7cff" }} />
      case "follow":
        return <AiOutlineUserAdd className="notification-icon follow" style={{ color: "#57cc99" }} />
      default:
        return null
    }
  }

  const getMessageText = (notification, userName) => {
    switch (notification.type) {
      case "like":
        return `${userName} liked your post`
      case "reply":
        return `You have a reply from ${userName}`
      case "follow":
        return `${userName} followed you`
      default:
        return "Unknown notification"
    }
  }

  const NotificationItem = ({ notification }) => {
    const [userName, setUserName] = useState("")

    useEffect(() => {
      const fetchUserName = async () => {
        try {
          const response = await fetch("/api/get-user-by-userid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: notification.from_user_id }),
          })
          if (response.ok) {
            const userData = await response.json()
            const name = userData.name || "Unknown User"
            setUserName(name)
          } else {
            throw new Error("Failed to fetch user data")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUserName("Unknown User")
        }
      }

      fetchUserName()
    }, [notification.from_user_id])

    return (
      <div className="notification-card">
        <div className="icon-container">{getIcon(notification.type)}</div>
        <div className="message">
          <p>{getMessageText(notification, userName)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="right-sidebar">
      <div className="nav-links">
        <Link to="/community/search">
          <RiSearchLine className="nav-icon" /> Search
        </Link>
        <Link to="/community">
          <RiCompass3Line className="nav-icon" /> Explore
        </Link>
        <Link to="/community/user-profile">
          <RiUser3Line className="nav-icon" /> Profile
        </Link>
      </div>
      <div className="notifications-container">
        <h2 className="right-sidebar-title">Notifications</h2>
        {error && <p className="error-message">{error}</p>}
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div key={notification._id.$oid} className="notification-item">
                <NotificationItem notification={notification} />
                <button className="delete-notification-btn" onClick={() => deleteNotification(notification._id.$oid)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RightSidebar
