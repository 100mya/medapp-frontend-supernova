import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Post.css';
import { FaRegComment, FaRegHeart, FaHeart } from 'react-icons/fa';
import defaultImg from './default.jpeg';

const Post = ({ post }) => {
  let mediaUrl = null;

  if (post.media) {
    if (post.media_type === 'mp4') {
      mediaUrl = `data:video/${post.media_type};base64,${post.media}`;
    } else {
      mediaUrl = `data:image/${post.media_type};base64,${post.media}`;
    }
  }

  const [likes, setLikes] = useState(post.likes);
  const [replies, setReplies] = useState(post.replies);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [likedByUser, setLikedByUser] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState(defaultImg);

  useEffect(() => {
    const fetchUserData = async (emailId) => {
      try {
        const response = await fetch('/api/fetch-user-by-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_id: emailId }),
        });
        const data = await response.json();
        const user = JSON.parse(data);
        setUserName(user.name);
        if (user.profilePic) {
          setUserProfilePic(`data:image/jpeg;base64,${user.profilePic}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const credentials = localStorage.getItem('rx_chatbot_credentials');
    if (credentials) {
      const { email } = JSON.parse(credentials);
      setEmail(email);
      setLikedByUser(post.likes.includes(email));
      fetchUserData(post.email);
    }
  }, [post.email, post.likes]);

  const handleToggleLikePost = async () => {
    try {
      const response = await fetch('/api/toggle-like-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: post._id.$oid, email }),
      });
      const data = await response.json();
      if (data.message === 'Post liked successfully' || data.message === 'Post unliked successfully') {
        setLikes((prevLikes) =>
          prevLikes.includes(email) ? prevLikes.filter((like) => like !== email) : [...prevLikes, email]
        );
        setLikedByUser(!likedByUser);
      }
    } catch (error) {
      console.error('Error toggling like on post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch('/api/delete-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post._id.$oid }),
      });
      const data = await response.json();
      if (data.message === 'Post deleted successfully') {
        alert('Post deleted successfully');
        // Optionally, you can add logic to remove the post from the UI
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleCreateReply = async (replyToId = null) => {
    try {
      const response = await fetch('/api/create-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post._id.$oid,
          reply_to_id: replyToId,
          email,
          text: replyText,
        }),
      });
      const data = await response.json();
      if (data.message === 'Reply added successfully') {
        const newReply = {
          _id: data.id,
          email,
          text: replyText,
          created_at: new Date().toISOString(),
          likes: [],
          replies: [],
        };
        setReplies((prevReplies) => {
          if (replyToId === null) {
            return [...prevReplies, newReply];
          }
          const addNewReply = (replies) => {
            return replies.map((reply) => {
              if (reply._id === replyToId) {
                return {
                  ...reply,
                  replies: [...reply.replies, newReply],
                };
              }
              return {
                ...reply,
                replies: addNewReply(reply.replies),
              };
            });
          };
          return addNewReply(prevReplies);
        });
        setReplyText('');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={userProfilePic} alt="User" className="user-img" />
        <Link to={`/community/profile?email=${post.email}`} className="user-link">
          <h3>{userName}</h3>
        </Link>
        <p>{post.email}</p>

      </div>
      <div className="post-content">
        <p>{post.text.split(' ').map((word, index) => 
          word.startsWith('#') ? <span key={index} className="hashtag">{word} </span> : word + ' '
        )}</p>
        {mediaUrl && (
          <div className="post-media">
            {mediaUrl.startsWith('data:image/') ? (
              <img src={mediaUrl} alt="Post media" />
            ) : mediaUrl.startsWith('data:video/') ? (
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
            <Reply
              key={reply._id}
              reply={reply}
              postId={post._id.$oid}
              setReplies={setReplies}
              email={email}
            />
          ))}
          <div className="post-reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={() => handleCreateReply()}>Reply</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Reply = ({ reply, postId, setReplies, email }) => {
  const [likedByUser, setLikedByUser] = useState(reply.likes.includes(email));
  const [replyText, setReplyText] = useState('');
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [replyUserName, setReplyUserName] = useState('');
  const [replyUserProfilePic, setReplyUserProfilePic] = useState(defaultImg);

  useEffect(() => {
    const fetchUserData = async (emailId) => {
      try {
        const response = await fetch('/api/fetch-user-by-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_id: emailId }),
        });
        const data = await response.json();
        const user = JSON.parse(data);
        setReplyUserName(user.name);
        if (user.profilePic) {
          setReplyUserProfilePic(`data:image/jpeg;base64,${user.profilePic}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData(reply.email);
  }, [reply.email]);

  const handleToggleLikeReply = async () => {
    try {
      let replyId = reply._id;
      
      if (typeof replyId === 'object' && replyId.$oid) {
        // Extract ObjectId if it's in { $oid: '...' } format
        replyId = replyId.$oid;
      }
  
      const response = await fetch('/api/toggle-like-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, reply_id: replyId }),
      });
  
      const data = await response.json();
      if (data.message === 'Reply liked successfully') {
        setReplies((prevReplies) => {
          const toggleLike = (replies) => {
            return replies.map((r) => {
              if (r._id === reply._id) {
                return {
                  ...r,
                  likes: r.likes.includes(email)
                    ? r.likes.filter((like) => like !== email)
                    : [...r.likes, email],
                };
              }
              return {
                ...r,
                replies: toggleLike(r.replies),
              };
            });
          };
          return toggleLike(prevReplies);
        });
        setLikedByUser(!likedByUser);
      }
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };
  

  const handleCreateNestedReply = async (replyToId) => {
    try {
      let nestedReplyToId = replyToId;
  
      if (typeof nestedReplyToId === 'object' && nestedReplyToId.$oid) {
        // Extract ObjectId if it's in { $oid: '...' } format
        nestedReplyToId = nestedReplyToId.$oid;
      }
  
      const response = await fetch('/api/create-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          reply_to_id: nestedReplyToId,
          email,
          text: replyText,
        }),
      });
  
      const data = await response.json();
      if (data.message === 'Reply added successfully') {
        const newReply = {
          _id: data.id,
          email,
          text: replyText,
          created_at: new Date().toISOString(),
          likes: [],
          replies: [],
        };
        setReplies((prevReplies) => {
          const addNewReply = (replies) => {
            return replies.map((r) => {
              if (r._id === replyToId) {
                return {
                  ...r,
                  replies: [...r.replies, newReply],
                };
              }
              return {
                ...r,
                replies: addNewReply(r.replies),
              };
            });
          };
          return addNewReply(prevReplies);
        });
        setReplyText('');
      }
    } catch (error) {
      console.error('Error adding nested reply:', error);
    }
  };
  

  const handleDeleteReply = async () => {
    try {
      let replyId = reply._id;
      
      if (typeof replyId === 'object' && replyId.$oid) {
        // Extract ObjectId if it's in { $oid: '...' } format
        replyId = replyId.$oid;
      }
  
      const response = await fetch('/api/delete-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, reply_id: replyId }),
      });
  
      const data = await response.json();
      if (data.message === 'Reply deleted successfully') {
        setReplies((prevReplies) => {
          const deleteReply = (replies) => {
            return replies.filter((r) => r._id !== reply._id).map((r) => ({
              ...r,
              replies: deleteReply(r.replies),
            }));
          };
          return deleteReply(prevReplies);
        });
        alert('Reply deleted successfully');
      } else {
        alert('Failed to delete reply');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Error deleting reply');
    }
  };
  

  return (
    <div className="reply">
      <div className="reply-header">
        <img src={replyUserProfilePic} alt="User" className="user-img" />
        <Link to={`/community/profile?email=${reply.email}`} className="user-link">
          <h4>{replyUserName}</h4>
        </Link>
        <p>{reply.email}</p>

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
            <Reply
              key={nestedReply._id}
              reply={nestedReply}
              postId={postId}
              setReplies={setReplies}
              email={email}
            />
          ))}
          <div className="reply-reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={() => handleCreateNestedReply(reply._id)}>Reply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
