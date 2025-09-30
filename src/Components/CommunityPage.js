import React, { useState, useEffect } from 'react';
import CommunityHeader from './CommunityHeader';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import { useNavigate } from 'react-router-dom';
import './CommunityPage.css';
import { FaStream, FaUser, FaSearch, FaBell } from 'react-icons/fa';

const CommunityPage = ( {handleLogout} ) => {
  const [activeTab, setActiveTab] = useState('feed');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'profile') {
      navigate("/community/user-profile");
    } else if (activeTab === 'search') {
      navigate("/community/search");
    } else if (activeTab === 'notifications') {
      navigate("/community/notifications");
  }
  }, [activeTab]);

  return (
    <div className="community-page-unique">
      <CommunityHeader handleLogout={handleLogout} />
      <div className="community-page-content-unique">
        <LeftSidebar />
        <MainContent />
        <RightSidebar />
      </div>
      <div className="community-page-mobile-unique">
        {activeTab === 'feed' && <MainContent />}
        <div className="tab-container-unique">
          <div className="tab-unique" onClick={() => setActiveTab('feed')}>
            <FaStream size={20} />
          </div>
          <div className="tab-unique" onClick={() => setActiveTab('search')}>
            <FaSearch size={20} />
          </div>
          <div className="tab-unique" onClick={() => setActiveTab('profile')}>
            <FaUser size={20} />
          </div>
          <div className="tab-unique" onClick={() => setActiveTab('notifications')}>
            <FaBell size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
