import React, { useEffect, useState } from 'react';
import Post from './Post';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/fetch-all-posts');
      const data = await response.json();
      const parsedData = JSON.parse(data);
      setPosts(parsedData.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 100000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="post-list">
      {posts.map(post => (
        <Post key={post._id.$oid} post={post} />
      ))}
    </div>
  );
};

export default PostList;
