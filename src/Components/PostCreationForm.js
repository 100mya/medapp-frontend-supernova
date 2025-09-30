// src/components/PostCreationForm.js
import React, { useState } from 'react';
import './PostCreationForm.css';

const PostCreationForm = () => {
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState(null);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const storedData = localStorage.getItem('rx_chatbot_credentials');
    const { email } = storedData ? JSON.parse(storedData) : { email: '' };

    if (!email) {
      console.error('Email not found in local storage');
      return;
    }

    // Extract hashtags using regex
    const hashtags = postText.match(/#[\w]+/g) || [];

    const formData = new FormData();
    formData.append('email', email);
    formData.append('text', postText);
    formData.append('title', ''); // Title is empty as per requirements
    formData.append('topics', JSON.stringify(hashtags));
    if (media) {
      formData.append('media', media);
    }

    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Post created successfully');
        setPostText('');
        setMedia(null);
      } else {
        console.error('Error creating post:', result.error);
        alert('Error creating post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Error submitting post');
    }
  };

  return (
    <div className="post-creation-form">
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
        ></textarea>
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files[0])}
          accept="image/*,video/*"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostCreationForm;
