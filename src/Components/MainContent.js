// src/components/MainContent.js
import React from 'react';
import PostCreationForm from './PostCreationForm';
import PostList from './PostList';
import './MainContent.css';

const MainContent = () => {
  return (
    <div className="main-contents">
      <PostCreationForm />
      <PostList />
    </div>
  );
};

export default MainContent;
